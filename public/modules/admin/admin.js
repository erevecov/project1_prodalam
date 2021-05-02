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
        columnDefs: [
            { "width": "100px", "targets": 0 },
            { "width": "1150px", "targets": 1 }
        ],
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

    $('#productsTable tbody').on('click', '.delProduct', async function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();

        dataProd = {
            sku: data.sku
        }

        await axios.post('/api/deleteProduct', dataProd)

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-danger',
              cancelButton: 'btn btn-success'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Estas seguro?',
            text: "No se podra revertir la eliminación de un producto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                

                internals.tables.products.datatable
                .row($(this).parents('tr'))
                .remove()
                .draw()
                toastr.success('Producto Eliminado correctamente')
                
                swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Your imaginary file is safe :)',
                'error'
              )
            }
          })
        
        
    });

    $('#productsTable tbody').on('click', '.modProduct', function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();
        // alert("Modificar: " + data.sku);
        initMod(data)
    });

    $('#filterStar').on('change', function () {
        if (this.checked) {
            loadDataToProductsTable(this.checked)
        } else {
            loadDataToProductsTable()
        }
    })

    async function initMod(product) {
        let categoriesList = await axios.get('api/categories')

        const modalMod = {
            title: document.querySelector('#modal_title'),
            body: document.querySelector('#modal_body'),
            footer: document.querySelector('#modal_footer'),
        }

        $(document).ready(function () {
            $('.js-example-basic-single').select2({
                width: 'resolve',
                data: categoriesList.data[0].cats
            });
        });

        modalMod.title.innerHTML = `
            Modificar producto SKU: ${product.sku}
        `
        modalMod.body.innerHTML = `
        <div class="row">
            <div class="col-md-6" style="margin-top:10px;">
            Título</div>
            <div class="col-md-6" style="margin-top:10px;">
            Descripción</div>
            

            <div class="col-md-6" style="margin-top:10px;">
                <input id="modTitulo" type="text" value="${product.title}" class="form-control border-input">
            </div>
            
            <div class="col-md-6" style="margin-top:10px;">
                <input id="modDesc" type="text" value="${product.description}" class="form-control border-input">
            </div>

            <div class="col-md-12" style="margin-top:10px;">
            Categoría</div>
            <div class="col-md-12" style="margin-top:10px;">
                <select class="js-example-basic-single" id="selectCategory" name="state">
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
        console.log("catefasd",product.category);
        // $("#selectCategory").val().find(product.category)

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


        if (Array.isArray(productsData)) {
            productsData.map(el => {
                if (!el.modificar) el.modificar = '-'
                if (!el.eliminar) el.eliminar = '-'
            })
        } else {
            productsData.modificar = '-'
            productsData.eliminar = '-'
            productsData = [productsData]
        }
        

        internals.tables.products.datatable.clear().draw()
        internals.tables.products.datatable.rows.add(productsData).draw()

    } catch (error) {
        console.log(error)
        console.log("error? wat");
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
        <br><br><br><br>
        <div class="alert alert-dismissible alert-warning">
            <h4 class="alert-heading">Los campos excel requeridos son:</h4>
            <p class="mb-0">
            <br>SKU
            <br>ID producto (product_id)
            <br>Titulo
            <br>Categoría (padre)
            <br>Descripción
            <br>Info_status = COMPLETADO
            </p>
        </div>
    <br>
    `
    modalSelector.footer.innerHTML = `
    <button class="btn btn-dark" data-dismiss="modal">
    <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
    </button>

    <button  class="btn btn-dark" id="saveExcel">
    <i style="color:#3498db;" class="fas fa-check"></i> Guardar
    </button>
	`

    $('#modal').modal('show')
    let arrayBuffer
    const fileSelector = document.getElementById('excelFile');
    fileSelector.addEventListener('change', (event) => {

        const file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async function (event) {
            arrayBuffer = reader.result;
        };

    });

    $('#saveExcel').on('click', async function () {
        if (!arrayBuffer || arrayBuffer == '') {
            toastr.warning('Debe seleccionar un excel')
        } else {

            await selectSave()
        }
    });

}

async function selectSave() {
        const  swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: '¿Estas seguro?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Subir',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {

                saveExcel(arrayBuffer)
                swalWithBootstrapButtons.fire(
                'El archivo fue subido correctamente',
                'success'
                )

            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'error'
              )
            }
        })
}

async function saveExcel(arrayBuffer) {

    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(arrayBuffer).then(async function (workbook) {
        // console.log("rows", workbook._worksheets[1]._rows[1]._cells[13]._value.model.value)
        let arraydata = []
        // if cells > 12 = atributos

        let data = workbook._worksheets[1]._rows

        let final = []
        let keyobj = []
        let keyobjRaw = []
        data.forEach((ed, i) => {
            if (i == 1) {
                ed._cells.forEach((el) => {
                    keyobj.push(
                        (removeAccents2(removeSpecials2((el._value.model.value).trim()))).toLowerCase()
                    )
                    keyobjRaw.push(
                        el._value.model.value
                    )
                })
            }
        });

        data.forEach((ed, i) => {
            if (i !== 0 && i !== 1) {
                let rowProd = {}
                ed._cells.forEach((cell, o) => {
                    if (cell._value.model.value !== '') {
                        if (typeof cell._value.model.value == 'undefined' && cell._value.model.text !== '') {
                            rowProd[keyobj[o]] = cell._value.model.text
                        } else {
                            rowProd[keyobj[o]] = cell._value.model.value
                        }
                    }
                    if (o === ed._cells.length - 1) {
                        final.push(rowProd)
                    }
                })
            }
        })

        final.forEach((el, i) => {
            let a = {}
            //let xEl = workbook._worksheets[1]._rows[1]._cells[i]._value.model.value
            if (el.infostatus == 'COMPLETADO' && el.sku && el.productid && el.descripcion && el.titulo && 
            el.categoriapadrecategorianodefinidaensap && 
            el.categoriacategoriapadresap && el.subcategoriacategoriasap) {
                let copyEl = el
                a.sku = el.sku
                a.productId = el.productid
                a.title = el.titulo
                a.star = 'no'
                a.status = 'enabled'
                a.category = el.categoriapadrecategorianodefinidaensap
                a.subCategory = el.categoriacategoriapadresap
                a.subCategory2 = el.subcategoriacategoriasap
                a.description = el.descripcion
                a.use = el.uso
                a.benefits = el.beneficio
                // if ((el.descripcion) ? a.description = el.descripcion : a.description = '')
                // if ((el.uso) ? a.use = el.uso : a.use = '')
                // if ((el.beneficio) ? a.benefits = el.beneficio : a.benefits = '')

                delete copyEl.sku
                delete copyEl.productid
                delete copyEl.infostatus
                delete copyEl.titulo
                delete copyEl.caracteristicas
                delete copyEl.categoriapadrecategorianodefinidaensap
                delete copyEl.categoriacategoriapadresap
                delete copyEl.subcategoriacategoriasap
                delete copyEl.descripcion
                delete copyEl.uso
                delete copyEl.beneficio


                let infoFin = []
                Object.keys(copyEl).forEach(e => {
                    let dataNam = {}
                    keyobjRaw.forEach(ell => {
                        let clare = (removeAccents2(removeSpecials2((ell).trim()))).toLowerCase()
                        if (e == clare) {
                            dataNam.name = ell
                            dataNam.data = copyEl[e]
                            infoFin.push(dataNam)
                        }
                    });

                });

                // a.info = copyEl
                a.info = infoFin
                arraydata.push(a)
            }
        })
        // console.log("aaaa", arraydata[0]);
        try {
            if (arraydata.length === 0) {
                toastr.warning('No se ha encontrado ningun producto valido para ser ingresado')
            } else {
                
                let res = await axios.post('/api/products', arraydata)

                if (res.data.ok) {

                    loadDataToProductsTable()

                    loadingHandler('stop')
                    toastr.success('Producto(s) subido(s) correctamente')
                    $('#modal').modal('hide')
                } else {
                    toastr.warning('Ha ocurrido un error al ingresar productos en la base de datos')
                }
            }
        } catch (error) {
            console.log("err", error)
        }
    });

}


function removeSpecials2(data) {
    data = data.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    data = data.replace(/\s/g, '')
    data = data.replace(/-/g, '')
    return data
}
function removeAccents2(data) {
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return data
}
