const internals = {
	tables: {
		banners: {
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
    initBannersTable()
})
document.querySelector('#nuevoBannerBtn').addEventListener('click', () => {
	handleModalBanner()
})

async function initBannersTable() {
	await $.when(internals.tables.banners.datatable = $('#bannersTable').DataTable({
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
			{ data: 'nombre' },
            { data: 'eliminar'}
		]
	}))

	// loadDataToBannersTable()
	// })
}

const handleModalBanner = () => {

	const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

	modalSelector.title.innerHTML=`
		Nueva carga de banner
	`

	modalSelector.body.innerHTML=`
		<input type="file" id="photoFile" accept=".jpg"/>
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

	const fileSelector = document.getElementById('photoFile');
	fileSelector.addEventListener('change', (event) => {
		const fileList = event.target.files;
		//console.log(fileList);
		apiTes(fileList)
	});

}
