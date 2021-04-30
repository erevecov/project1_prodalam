const internals = {
	tables: {
		banners: {
			datatable: null,
			rowSelected: null
		}
	}
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
		rowCallback: function( row, data ) {
		    $(row).find('td:eq(1)').html('<center> <button type="button" class="btn btn-secondary btn-sm delBanner"><i class="fas fa-trash"></i></button> </center> ')
		},
		order: [[1, 'desc']],
		ordering: true,
		searchHighlight: true,
		responsive: false,
		columns: [
			{ data: 'nameFile' },
			{ data: 'fileUrl'},
			{ data: 'modificar' },
			{ data: 'eliminar' }
		],
		rowCallback: function (row, data, index) {
            $(row).find('td:eq(2)').html('<center> <button type="button" class="btn btn-secondary btn-sm modBanner"><i class="fas fa-edit"></i></button> </center> ')
			$(row).find('td:eq(3)').html('<center> <button type="button" class="btn btn-secondary btn-sm delBanner"><i class="fas fa-trash"></i></button> </center> ')
        },
	}))

	loadDataToBannersTable()

	$('#bannersTable tbody').on('click', '.delBanner', async function () {
		var data = internals.tables.banners.datatable.row($(this).parents('tr')).data();
		dataImg = {
			filename: data.nameFile
		}
		await axios.post('/api/deleteBanner', dataImg)
		// console.log("dataDelete", deleteImage);

		internals.tables.banners.datatable
			.row($(this).parents('tr'))
			.remove()
			.draw()
			toastr.success('imagen Eliminada correctamente')
	});

	$('#bannersTable tbody').on('click', '.modBanner', function () {
        var data = internals.tables.banners.datatable.row($(this).parents('tr')).data();
        // alert("Modificar: " + data.sku);
        initMod(data)
    });

	async function initMod(product) {
        let categoriesList = await axios.get('api/categories')

        const modalMod = {
            title: document.querySelector('#modal_title'),
            body: document.querySelector('#modal_body'),
            footer: document.querySelector('#modal_footer'),
        }

        // $(document).ready(function () {
        //     $('.js-example-basic-single').select2({
        //         width: 'resolve',
        //         data: categoriesList.data[0].cats
        //     });
        // });

        modalMod.title.innerHTML = `
            Agregar banner mobile
        `
        modalMod.body.innerHTML = `
		<input type="file" id="photoFileM" accept=".jpg"/>
            `
        modalMod.footer.innerHTML = `
        <button class="btn btn-dark" data-dismiss="modal">
		<i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
		</button>

		<button class="btn btn-dark" id="uploadPhoto">
		<i style="color:#3498db;" class="fas fa-check"></i> Guardar
		</button>
        `
        console.log("catefasd",product.category);
        // $("#selectCategory").val().find(product.category)

        $('#modal').modal('show')
    }
}

const handleModalBanner = () => {

	const modalSelector = {
		title: document.querySelector('#modal_title'),
		body: document.querySelector('#modal_body'),
		footer: document.querySelector('#modal_footer'),
	}

	modalSelector.title.innerHTML = `
		Nueva carga de banner
	`

	modalSelector.body.innerHTML = `
		<input type="file" id="photoFile" accept=".jpg"/>
		<!--<img id="imgPreview" src="" alt="Preview">-->
	`

	modalSelector.footer.innerHTML = `
    <button class="btn btn-dark" data-dismiss="modal">
    <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
    </button>

    <button class="btn btn-dark" id="uploadPhoto">
    <i style="color:#3498db;" class="fas fa-check"></i> Guardar
    </button>
	`

	$('#modal').modal('show')
	let b64img = ''
	let nameBan = ''

	const fileSelectorM = document.getElementById('photoFileM');
	fileSelectorM.addEventListener('change', function () {
		const readerM = new FileReader();
		nameBan = this.files[0].name

		if (this.files[0].size/1024 > 10000) {
			toastr.warning('Imagen supera tamaño máximo de 10Mb')
		} else {
			readerM.addEventListener("load", () => {
				localStorage.setItem("recent-image", readerM.result)
			})
	
			reader.readAsDataURL(this.files[0])
			// const recentImageDataUrl = localStorage.getItem("recent-image");
	
			// if (recentImageDataUrl) {
			// 	document.querySelector("#imgPreview").setAttribute("src", recentImageDataUrl)
			// }
	
			reader.onload = function (event) {
				b64img = event.target.result
			};
		}
	});

	const fileSelector = document.getElementById('photoFile');
	fileSelector.addEventListener('change', function () {
		const reader = new FileReader();
		nameBan = this.files[0].name

		if (this.files[0].size/1024 > 10000) {
			toastr.warning('Imagen supera tamaño máximo de 10Mb')
		} else {
			reader.addEventListener("load", () => {
				localStorage.setItem("recent-image", reader.result)
			})
	
			reader.readAsDataURL(this.files[0])
			// const recentImageDataUrl = localStorage.getItem("recent-image");
	
			// if (recentImageDataUrl) {
			// 	document.querySelector("#imgPreview").setAttribute("src", recentImageDataUrl)
			// }
	
			reader.onload = function (event) {
				b64img = event.target.result
			};
		}
	});

	$('#uploadPhoto').on('click', async function () {
		if (!b64img || b64img == '') {
			toastr.warning('Debe seleccionar una imagen')
		} else {
			let dataImg =
			{
				img: b64img,
				filename: nameBan
			}
			let saveImage = await axios.post('/api/uploadImg', dataImg)
			console.log("compa new ima", saveImage);
			if (saveImage.data.ok) {
				let newBanData = saveImage.data.ok

				newBanData.eliminar = '-'

				let newBannerAdded = internals.tables.banners.datatable
                    .row.add(newBanData)
                    .draw()
                    .node();
    
                $(newBannerAdded).css('color', '#1abc9c');
                setTimeout(() => {
                    $(newBannerAdded).css('color', '#484848');
                }, 5000);

				toastr.success('imagen subida correctamente')
				$('#modal').modal('hide')
			} else {
				toastr.warning(saveImage.data.err)
			}
		}
	});
}

async function loadDataToBannersTable() {
    let res = await axios.get('api/bannerNames')
    // let cate = await axios.get('api/categories')
    // console.log("categorias", cate.data);
        if (res.err) {
            toastr.warning(res.err)
        } else if(res.data) {

			res.data.map(el => {
				if (!el.fileUrl) el.fileUrl = '-'
				if (!el.modificar) el.modificar = '-'
				if (!el.eliminar) el.eliminar = '-'
			})

            internals.tables.banners.datatable.rows.add(res.data).draw()
        }
}