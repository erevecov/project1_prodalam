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
    loadingHandler('start')
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
            { data: 'star' },
            { data: 'modificar' },
            { data: 'eliminar' }
        ],

        rowCallback: function (row, data, index) {
            //if(data.estadoPago == true) {
            if (data.star == 'yes') {
                $(row).find('td:eq(4)').html('<center> <button type="button" class="btn btn-secondary btn-sm featureProduct"><i class="fas fa-star"></i></button> </center> ')
            } else {
                $(row).find('td:eq(4)').html('<center> <button type="button" class="btn btn-secondary btn-sm featureProduct"><i class="far fa-star"></i></button> </center> ')

            }
            $(row).find('td:eq(5)').html('<center> <button type="button" class="btn btn-secondary btn-sm modProduct"><i class="fas fa-edit"></i></button> </center> ')
            $(row).find('td:eq(6)').html('<center> <button type="button" class="btn btn-secondary btn-sm delProduct"><i class="fas fa-trash"></i></button> </center> ')
            // } else  {
            // 	$(row).find('td:eq(0)').html('<center> <i style="color: red" class="fas fa-times-circle"></i> </center> ')
            // }
        },

    }))

    loadDataToProductsTable()

    $('#productsTable tbody').on('click', '.featureProduct', async function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();

        if (this.innerHTML.includes("fas")) {
            data.star = 'no'
            await axios.post('/api/productsStar', data)
            this.innerHTML = "<i class=\"far fa-star\"></i>"
        } else {
            data.star = 'yes'
            await axios.post('/api/productsStar', data)
            this.innerHTML = "<i class=\"fas fa-star\"></i>"
        }
    });

    $('#productsTable tbody').on('click', '.delProduct', function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();
        // alert("Borrar: " + data.sku);

        internals.tables.products.datatable
            .row($(this).parents('tr'))
            .remove()
            .draw()
    });

    $('#productsTable tbody').on('click', '.modProduct', function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();
        // alert("Modificar: " + data.sku);
        initMod()
    });

    $('#filterStar').on('change', function () {
        if (this.checked) {
            loadDataToProductsTable(this.checked)
        } else {
            loadDataToProductsTable()
        }
    })

    const initMod = () => {
        const modalMod = {
            title: document.querySelector('#modal_title'),
            body: document.querySelector('#modal_body'),
            footer: document.querySelector('#modal_footer'),
        }

        $(document).ready(function() {
            $('.js-example-basic-single').select2({
                width: 'resolve'
            });
        });

        modalMod.title.innerHTML = `
            Modificar producto SKU:
        `
        modalMod.body.innerHTML = `
        <div class="row">
            <div class="col-md-6" style="margin-top:10px;">
            Título</div>
            <div class="col-md-6" style="margin-top:10px;">
            Descripción</div>
            

            <div class="col-md-6" style="margin-top:10px;">
                <input id="modTitulo" type="text" placeholder="Producto 1" class="form-control border-input">
            </div>
            
            <div class="col-md-6" style="margin-top:10px;">
                <input id="modDesc" type="text" placeholder="Descripción" class="form-control border-input">
            </div>

            <div class="col-md-12" style="margin-top:10px;">
            Categoría</div>
            <div class="col-md-12" style="margin-top:10px;">
                <select class="js-example-basic-single" name="state">
                    <option value="admin">Accesorios Agrícolas</option>
                    
                    <option value="sadmin">Aceros y Metalurgia</option>
                    
                    <option value="sadmin">Alambres Cercos y Mallas</option>
                   
                    <option value="sadmin">Cabos y Cadenas</option>
                   
                    <option value="sadmin">Clavos y Fijaciones</option>
                    
                    <option value="sadmin">Construcción y Terminaciones</option>
                    
                    <option value="sadmin">Contención y Fortificación</option>
                    
                    <option value="sadmin">Hidráulica y Accesorios</option>
                    
                    <option value="sadmin">Seguridad Electrónica y Automatización</option>
                </select>
            </div>
            <div class="col-md-12" style="margin-top:10px;"><br><br><br><br></div>

        </div>
            `
        modalMod.footer.innerHTML = `
        <button class="btn btn-dark" data-dismiss="modal">
        <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
        </button>
    
        <button class="btn btn-dark" id="saveUser">
        <i style="color:#3498db;" class="fas fa-check"></i> Guardar
        </button>
        `

        $('#modal').modal('show')
    }
    // $('#productsTable tbody').on('click', 'tr', function () {
    // 	internals.tables.products.rowSelected = internals.tables.products.datatable.row($(this).closest('tr'))

    // 	if (internals.tables.products.rowSelected.data()) {
    // 		let selectedProductData = internals.tables.products.rowSelected.data()

    // 		handleProduct(selectedProductData)
    // 	}
    // })
    loadingHandler('stop')
}


async function loadDataToProductsTable(filter) {
    loadingHandler('start')
    try {
        let result
        if (filter || $('#filterStar')[0].checked) {
            result = await axios.get('api/productsStar')
        } else {
            result = await axios.get('api/products')
        }

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

        internals.tables.products.datatable.clear().draw()
    }
    loadingHandler('stop')
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
    <br>
    <br>
    	<input type="file" id="excelFile" accept=".xlsx"/>
    <br>
    <br><br>
    <br>
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
