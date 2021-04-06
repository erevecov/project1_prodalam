import readXlsxFile from 'read-excel-file'

const input = document.getElementById('input')

input.addEventListener('change', () => {
  readXlsxFile(input.files[0]).then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.
  })
})

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
		dom: 'Bfrtip',
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
			{ data: 'titulo' },
            { data: 'categoriaPadre'},
            { data: 'desatacado'},
            { data: 'modificar'},
            { data: 'eliminar'}
		]

	}))

	// $('#productsTable tbody').on('click', 'tr', function () {
	// 	internals.tables.products.rowSelected = internals.tables.products.datatable.row($(this).closest('tr'))

	// 	if (internals.tables.products.rowSelected.data()) {
	// 		let selectedProductData = internals.tables.products.rowSelected.data()

	// 		handleProduct(selectedProductData)
	// 	}
	// })
}

const handleModal = () => {
    const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }
    
    modalSelector.title.innerHTML = 'Subir nueva carga de productos'

    modalSelector.body.innerHTML = `
    <div class="container-fluid">
        <div class="row">
			<div class="col-md-12">
				<input type="file" id="input" />
			</div>
		</div>
    </div>
    `

    modalSelector.footer.innerHTML = `
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Subir</button>
    `

    $('#modal').modal('show')
}