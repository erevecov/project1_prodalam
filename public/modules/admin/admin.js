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

	$('#productsTable tbody').on('click', 'tr', function () {
		internals.tables.products.rowSelected = internals.tables.products.datatable.row($(this).closest('tr'))

		if (internals.tables.products.rowSelected.data()) {
			let selectedProductData = internals.tables.products.rowSelected.data()

			handleProduct(selectedProductData)
		}
	})
}

async function handleProduct(product) {
	try {
		loadingHandler('start')
    }catch{
        
    }
}