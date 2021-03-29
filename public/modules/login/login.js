const rutSelector = document.querySelector('#user')

rutSelector.addEventListener('keyup', function () {
    validateRut(this.value)
})

function validateRut(userRut) {
    let rut = new Rut(userRut)

    if ( rut.isValid ) {
        rutSelector.value = rut.getNiceRut()
    }
}