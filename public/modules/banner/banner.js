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
			{ data: 'nameFileM' },
			{ data: 'urlBanner'},
			{ data: 'modificar' },
			{ data: 'eliminar' }
		],
		rowCallback: function (row, data, index) {
            $(row).find('td:eq(3)').html('<center> <button type="button" class="btn btn-secondary btn-sm modBanner"><i class="fas fa-edit"></i></button> </center> ')
			$(row).find('td:eq(4)').html('<center> <button type="button" class="btn btn-secondary btn-sm delBanner"><i class="fas fa-trash"></i></button> </center> ')
        },
	}))

	loadDataToBannersTable()

	$('#bannersTable tbody').on('click', '.delBanner', async function () {
		var data = internals.tables.banners.datatable.row($(this).parents('tr')).data();

		dataImg = {
			filename: data.nameFile
		}

		await axios.post('/api/deleteBanner', dataImg)

		const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-danger',
              cancelButton: 'btn btn-success'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: '¿Estas seguro?',
            text: "No se podra revertir la eliminación de un archivo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                
				internals.tables.banners.datatable
				.row($(this).parents('tr'))
				.remove()
				.draw()
				toastr.success('imagen Eliminada correctamente')

				swalWithBootstrapButtons.fire(
				'Eliminado',
				'',
				'success'
				)
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
				swalWithBootstrapButtons.fire(
				'Cancelado',
				'',
				'error'
				)
            }
        })

	});

	$('#bannersTable tbody').on('click', '.modBanner', function () {
        var data = internals.tables.banners.datatable.row($(this).parents('tr')).data();
        // alert("Modificar: " + data.sku);
        initMod(data)
		// console.log("aaaaaaaadaa",data);

		// $('#saveBanner').on('click', async function(){
		// 	saveBanner(data)
		// })
    });
}

// async function saveBanner(data) {
// 	let saveUserRes = await axios.post('/api/users', userData)
// 	console.log("modUrl", $('#modUrl').val() );
// }

async function initMod(ban) {

	const modalMod = {
		title: document.querySelector('#modal_title'),
		body: document.querySelector('#modal_body'),
		footer: document.querySelector('#modal_footer'),
	}

	modalMod.title.innerHTML = `
		Modificar Banner: ${ban.nameFile}
	`
	modalMod.body.innerHTML = `
	<div class="row">
		<div class="col-md-12" style="margin-top:10px;">
			Direccion Url
			<input id="modUrl" type="text" value="${ban.urlBanner}" placeholder="Ingrese la url a la cual redireccionará el banner" class="form-control border-input">
		</div>
		
		<div class="col-md-12" style="margin-top:10px;"><br></div>

		<div class="col-md-12" style="margin-top:10px;">
			Agregar banner mobile</div>
			<div class="col-md-12" style="margin-top:10px;">
			<input type="file" id="photoFile" accept=".jpg"/>
		</div>

		

	</div>
		`
	modalMod.footer.innerHTML = `
	<button class="btn btn-dark" data-dismiss="modal">
		<i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
	</button>

	<button class="btn btn-dark" id="uploadPhoto">
    	<i style="color:#3498db;" class="fas fa-check"></i> Guardar
    </button>
	`
	$('#modal').modal('show')
	
	uploadBanner(ban)
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
	uploadBanner()
}

async function selectSave() {
	const  swalWithBootstrapButtons = Swal.mixin({
		customClass: {
		  confirmButton: 'btn btn-success',
		  cancelButton: 'btn btn-danger'
		},
		buttonsStyling: false
	})

	let save = await swalWithBootstrapButtons.fire({
		title: '¿Estas seguro?',
		text: "",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Subir',
		cancelButtonText: 'Cancelar',
		reverseButtons: true
	})

	if (save.isConfirmed) {
		return true

		// swalWithBootstrapButtons.fire(
		// 	'El archivo fue subido correctamente',
		// 	'success'
		// )

	} else {
		return false
	}
}


async function loadDataToBannersTable() {
    let res = await axios.get('api/bannerNames')
        if (res.err) {
            toastr.warning(res.err)
        } else if(res.data) {

			res.data.map(el => {
				// if (!el.urlBanner) el.urlBanner = '-'
				if (!el.modificar) el.modificar = '-'
				if (!el.eliminar) el.eliminar = '-'
			})

			internals.tables.banners.datatable.clear().draw()
            internals.tables.banners.datatable.rows.add(res.data).draw()
        }
}

async function uploadBanner(ban) {
	let b64img = ''
	let nameBan = ''

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
	
			reader.onload = function (event) {
				b64img = event.target.result
			};
		}
	});

	$('#uploadPhoto').on('click', async function () {
		let confirm = await selectSave()

		if (internals.tables.banners.datatable.rows().data().length < 6 || ban) {
			if (confirm) {
				let varUlr
				if (!$('#modUrl').val()) { //se envia url
					varUlr = ''
				} else {
					varUlr = $('#modUrl').val()
				}
				if (!b64img) { //se envia imagen
					b64img = ''
					nameBan = ''
				}
	
				if (b64img == '' && ban == undefined ) {
					toastr.warning('Debe seleccionar una imagen')
				} else {
	
					let dataImg =
					{
						img: b64img,
						filename: nameBan,
						urlBanner: varUlr,
						mod: ban
					}
	
					let saveImage = await axios.post('/api/uploadImg', dataImg)
	
					console.log("save imagee", saveImage);
	
					if (saveImage.data.ok) {
						let newBanData = saveImage.data.ok
	
						newBanData.modificar = '-'
						newBanData.eliminar = '-'
	
						loadDataToBannersTable()
						// if (newBanData.nameFileM == '') {
						// 	let newBannerAdded = internals.tables.banners.datatable
						// 	.row.add(newBanData)
						// 	.draw()
						// 	.node();
			
						// 	$(newBannerAdded).css('color', '#1abc9c');
						// 	setTimeout(() => {
						// 		$(newBannerAdded).css('color', '#484848');
						// 	}, 5000);
						// } else {
						// 	// internals.tables.banners.datatable
						// 	// .row(newBanData)
						// 	// .remove()
						// 	// .draw();
	
						// 	let newBannerAdded = internals.tables.banners.datatable
						// 	.row.add(newBanData)
						// 	.draw()
						// 	.node();
			
						// 	$(newBannerAdded).css('color', '#1abc9c');
						// 	setTimeout(() => {
						// 		$(newBannerAdded).css('color', '#484848');
						// 	}, 5000);
						// }
						toastr.success('Datos cargados correctamente')
						$('#modal').modal('hide')
					} else {
						toastr.warning(saveImage.data.err)
					}
				}
			}
		} else {
			toastr.warning('No es posible ingresar mas de 6 banners, por favor elimine alguno')
		}

		
	});
}
