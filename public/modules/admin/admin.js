// import readXlsxFile from 'read-excel-file'

// const input = document.getElementById('input')

// input.addEventListener('change', () => {
//   readXlsxFile(input.files[0]).then((rows) => {
//     // `rows` is an array of rows
//     // each row being an array of cells.
//   })
// })

const internals = {
    tables: {
        products: {
            datatable: null,
            rowSelected: null
        }
    }
}

ready(async () => {
    initProductsTable()
})

document.querySelector('#nuevaCargaBtn').addEventListener('click', () => {
    handleModal()
})

async function initProductsTable() {
    await $.when(internals.tables.products.datatable = $('#productsTable').DataTable({
        language: {
            url: spanishDataTableLang
        },

        // rowCallback: function( row, data ) {
        //     $(row).find('td:eq(1)').html(capitalizeAll(data.name))
        // },
        order: [[1, 'desc']],
        ordering: true,
        searchHighlight: true,
        responsive: false,
        columns: [
            { data: 'sku' },
            { data: 'title' },
            { data: 'category' },
            { data: 'subCategory' },
            { data: 'destacado' },
            { data: 'modificar' },
            { data: 'eliminar' }
        ],

        rowCallback: function (row, data, index) {
            //if(data.estadoPago == true) {
            $(row).find('td:eq(4)').html('<center> <button type="button" class="btn btn-secondary btn-sm featureProduct"><i class="far fa-star"></i></button> </center> ')
            $(row).find('td:eq(5)').html('<center> <button type="button" class="btn btn-secondary btn-sm modProduct"><i class="fas fa-edit"></i></button> </center> ')
            $(row).find('td:eq(6)').html('<center> <button type="button" class="btn btn-secondary btn-sm delProduct"><i class="fas fa-trash"></i></button> </center> ')
            // } else  {
            // 	$(row).find('td:eq(0)').html('<center> <i style="color: red" class="fas fa-times-circle"></i> </center> ')
            // }
        },

    }))

    loadDataToProductsTable()

    $('#productsTable tbody').on('click', '.featureProduct', function () {
        if (this.innerHTML.includes("fas")) {
            this.innerHTML = "<i class=\"far fa-star\"></i>"
        } else {
            this.innerHTML = "<i class=\"fas fa-star\"></i>"
        }
    });

    $('#productsTable tbody').on('click', '.delProduct', function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();
        alert("Borrar: " + data.sku);

        internals.tables.products.datatable
            .row(data)
            .remove()
            .draw()
    });

    $('#productsTable tbody').on('click', '.modProduct', function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();
        alert("Modificar: " + data.sku);
    });

    // $('#productsTable tbody').on('click', 'tr', function () {
    // 	internals.tables.products.rowSelected = internals.tables.products.datatable.row($(this).closest('tr'))

    // 	if (internals.tables.products.rowSelected.data()) {
    // 		let selectedProductData = internals.tables.products.rowSelected.data()

    // 		handleProduct(selectedProductData)
    // 	}
    // })
}


async function loadDataToProductsTable() {
loadingHandler('start')
    try {
        
        let result = await axios.get('api/products')

        let productsData = result.data

        productsData.map(el => {
            if (!el.subCategory) el.subCategory = '-'
            if (!el.destacado) el.destacado = '-'
            if (!el.modificar) el.modificar = '-'
            if (!el.eliminar) el.eliminar = '-'
        })

        internals.tables.products.datatable.clear().draw()
        internals.tables.products.datatable.rows.add(productsData).draw()
    } catch (error) {
        console.log(error)
        loadingHandler('stop')
        internals.tables.products.datatable.clear().draw()
    }

}

const handleModal = () => {
    const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

    modalSelector.title.innerHTML = `
		Nueva carga de productos
	`
    modalSelector.body.innerHTML = `
		<input type="file" id="excelFile" accept=".xlsx"/>
	`
    modalSelector.footer.innerHTML = `
    <button class="btn btn-dark" data-dismiss="modal">
    <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
    </button>

    <button class="btn btn-dark" id="saveUser">
    <i style="color:#3498db;" class="fas fa-check"></i> Guardar
    </button>
	`

    $('#modal').modal('show')

    const fileSelector = document.getElementById('excelFile');
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        //console.log(fileList);
        apiTes(fileList)
    });

}

// async function apiTes(excelFile) {
//     // read from a file
//     // var workbook = new Excel.Workbook();
//     workbook.xlsx.readFile(excelFile)
//         .then(async function () {
//             console.log("rows", workbook._worksheets[1]._rows[1]._cells[3]._value.model.value)
//             let arraydata = []


//             let data = workbook._worksheets[1]._rows

//             // data.forEach((ed, i) => {
//             //     if (i !== 0) {
//             //         let objData = {}
//             //         ed._cells.forEach((el, p) => {

//             //             if (p == 1) objData.id = el._value.model.value
//             //             if (p == 2) objData.productId = el._value.model.value
//             //             if (p == 3) objData.sku = el._value.model.value
//             //             if (p == 4) objData.attributeId = el._value.model.value
//             //             if (p == 5) objData.attributeLabel = el._value.model.value
//             //             if (p == 10) objData.data = el._value.model.value
//             //             //if (p==11) objData.position = el._value.model.value
//             //             if (p == 12) objData.createdAt = el._value.model.value
//             //             if (p == 13) {
//             //                 objData.updatedAt = el._value.model.value
//             //                 arraydata.push(objData)
//             //             }
//             //         })
//             //     }
//             // });

//             //     // //separar datos
//             //     var indices = [];
//             //     let skuList = []

//             //     arraydata.forEach((el) => {
//             //         if (!skuList.includes(el.sku)) {
//             //             skuList.push(el.sku)
//             //         }
//             //     })

//             //     skuList.forEach((ed) => {
//             //         let aux = []
//             //         arraydata.forEach((el, i) => {
//             //             if (el.sku == ed) {
//             //                 aux.push(el)
//             //             }
//             //             if (i == arraydata.length - 1) {
//             //                 let aux2 = {}

//             //                 aux2.sku = aux[0].sku
//             //                 aux2.productId = aux[0].productId
//             //                 //aux2._id = moment.tz('America/Santiago').format('YYYY-MM-DDTHH:mm:ss.SSSSS');
//             //                 aux2.info = []

//             //                 aux.forEach((ep) => {
//             //                     let aux3 = {}
//             //                     aux3.id = ep.id
//             //                     //aux3.productId = ep.productId
//             //                     aux3.attributeId = ep.attributeId
//             //                     aux3.attributeLabel = ep.attributeLabel
//             //                     aux3.data = ep.data

//             //                     aux2.info.push(aux3)
//             //                 })

//             //                 indices.push(aux2)
//             //             }
//             //         })
//             //     })

//             //     // try {
//             //     //     let res = await Product.insertMany(indices)
//             //     //     console.log("indi", res)
//             //     // } catch (error) {
//             //     //     console.log("err", error)
//             //     // }

//         });

// }


// <div class="alert alert-dismissible alert-danger">
//   <button type="button" class="close" data-dismiss="alert">&times;</button>
//   <strong>Oh!</strong> <a href="#" class="alert-link">Algo salio mal</a> intentalo nuevamente.
// </div>

// <div class="alert alert-dismissible alert-success">
//   <button type="button" class="close" data-dismiss="alert">&times;</button>
//   <strong>Carga exitosa!</strong> <a href="#" class="alert-link"> La carga de datos se realizo con exito</a>.
// </div>
