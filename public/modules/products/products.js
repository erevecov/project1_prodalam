document.querySelector('#text-product').addEventListener('onload', () => {
    functionPrint()
})

function functionPrint() {
    let text = document.getElementById("text-product")
    let trunc = text.substr(0, 10)
    console.log(trunc);
}

document.querySelectorAll('.btn-custom').addEventListener('click', () => {
	handleModal()
})

const handleModal = () => {
   
	const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

	modalSelector.title.innerHTML=`
		Producto
	`

	modalSelector.body.innerHTML=`


	`
	modalSelector.footer.innerHTML=`
	
	`

    $('#modal').modal('show')
}
