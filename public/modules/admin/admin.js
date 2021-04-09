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
	// ,
	// mainModal: new bootstrap.Modal(document.getElementById('modal'), {
	// 	keyboard: false
	// })
}

ready(async () => {
	initProductsTable()
})

document.querySelector('#nuevaCargaBtn').addEventListener('click', () => {
	handleModal()
})


async function initProductsTable() {
	await $.when(internals.tables.products.datatable = $('#productsTable').DataTable({
		// dom: 'Bfrtip',
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
			{ data: 'category'},
            { data: 'categoryFather'},
            { data: 'destacado'},
            { data: 'modificar'},
            { data: 'eliminar'}
		]

	}))

	loadDataToProductsTable()

	// $('#productsTable tbody').on('click', 'tr', function () {
	// 	internals.tables.products.rowSelected = internals.tables.products.datatable.row($(this).closest('tr'))

	// 	if (internals.tables.products.rowSelected.data()) {
	// 		let selectedProductData = internals.tables.products.rowSelected.data()

	// 		handleProduct(selectedProductData)
	// 	}
	// })
}

async function loadDataToProductsTable () {
    try {
        let result = await axios.get('api/products')
		

		let productsData = result.data

		productsData.map(el => {
			if (!el.destacado) el.destacado = '-'
			if (!el.modificar) el.modificar = '-'
			if (!el.eliminar) el.eliminar = '-'

			console.log("log titulo", el);
			
		})
		console.log("res",productsData);

        internals.tables.products.datatable.clear().draw()

		//aaaaaaaaaaaaaaaaaaaaaaaa
        internals.tables.products.datatable.rows.add(productsData).draw()
    } catch (error) {
        console.log(error)

        internals.tables.products.datatable.clear().draw()
    }

}

const handleModal = () => {
   
	const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

	modalSelector.title.innerHTML=`
		Nueva carga de productos
	`
	modalSelector.body.innerHTML=`
		<input type="file" id="input" />
	`
	modalSelector.footer.innerHTML=`
	
	`

    $('#modal').modal('show')
}


// <div class="alert alert-dismissible alert-danger">
//   <button type="button" class="close" data-dismiss="alert">&times;</button>
//   <strong>Oh!</strong> <a href="#" class="alert-link">Algo salio mal</a> intentalo nuevamente.
// </div>

// <div class="alert alert-dismissible alert-success">
//   <button type="button" class="close" data-dismiss="alert">&times;</button>
//   <strong>Carga exitosa!</strong> <a href="#" class="alert-link"> La carga de datos se realizo con exito</a>.
// </div>

// const handleModal = () => {
// 	const modalSelector = {
//         title: document.querySelector('#modal_title'),
//         body: document.querySelector('#modal_body'),
//         footer: document.querySelector('#modal_footer'),
//     }
//     modalSelector.title.innerHTML = 'Subir nueva carga de productos'

//     modalSelector.body.innerHTML = `
//         <div class="row">
// 			<div class="col-md-12">
// 				<input type="file" id="input" />
// 			</div>
// 		</div>
    
//     `

//     modalSelector.footer.innerHTML = `
// 		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
//         <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Subir</button>
//     `

// 	$('#modal').modal('show')
// }