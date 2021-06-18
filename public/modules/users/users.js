let datatableUsers
let datatableDisabledUsers
let userRowSelected
let userRowSelectedData

$(document).ready(function(){
    chargeUsersTable()
})

function chargeUsersTable() {
    datatableUsers = $('#tableUsers')
    .DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'excel'
        ],
        ordering: true,
        iDisplayLength: 50,
        language: {
            url: spanishDataTableLang
        },
        responsive: false,
        columns: [
            { data: 'rut' },
            { data: 'name' },
            { data: 'lastname' },
            { data: 'email' },
            { data: 'phone' },
            { data: 'scope' },
        ],
        initComplete: function (settings, json) {
            getUsersEnabled()
        },
        rowCallback: function( row, data ) {
            if (data.scope == "sadmin") $(row).find('td:eq(5)').html("Super Administrador")
            if (data.scope == "admin") $(row).find('td:eq(5)').html("Administrador")
        }
    })


    $('#tableUsers tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')
            $('#optionModUser').prop('disabled', true)
            $('#optionDeleteUser').prop('disabled', true)
        } else {
            datatableUsers.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#optionModUser').prop('disabled', false)
            $('#optionDeleteUser').prop('disabled', false)
            userRowSelectedData = cleanData(datatableUsers.row($(this)).data())
            userRowSelected = datatableUsers.row($(this))
        }
    })
}

function cleanData(data){
    data.rut = ktoK(cleanRut(data.rut))

    return data
}

async function getUsersEnabled() {
    let res = await axios.get('api/users')

    // let cate = await axios.get('api/categories')
    // console.log("categorias", cate.data);
        if (res.err) {
            toastr.warning(res.err)
            $('#loadingUsers').empty()
        } else if(res.data) {

            let formatRes = res.data.map(el=>{

                let rut = validateRut(el.rut)
                if (rut.isValid ) {
                    el.rut = rut.getNiceRut();
                }

                return el
            })

            datatableUsers.rows.add(formatRes).draw()
            $('#loadingUsers').empty()
        }
}

$('#optionCreateUser').on('click', function() { // CREAR CLIENTE

    $('#usersModal').modal('show');
    $('#modal_title').html(`Nuevo usuario`)

    modNewUser()

    $('#saveUser').on('click', async function(){
        saveUser()
    })

});

$('#optionDeleteUser').on('click', function() {
    deleteUser(userRowSelectedData._id, userRowSelectedData.name, userRowSelectedData.scope)

})

async function deleteUser(_id, name, rol) {
    console.log("rol", rol);
    if (rol !== "sadmin") {
        let result = await Swal.fire({
            title: `Eliminar usuario ${name}`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary'
            }
        });
    
        if (result.value) {
            //let delUser = await axios.delete(`api/users/${_id}`);
    
            if (delUser.data.ok) {
                $('#optionModUser').prop('disabled', true)
                $('#optionDeleteUser').prop('disabled', true)
                toastr.success(`Usuario "${name}" eliminado correctamente`);
                datatableUsers
                .row( userRowSelected )
                .remove()
                .draw()
    
            } else {
                toastr.warning(`Ha ocurrido un error al intentar eliminar`);
            }
        }
    }
    toastr.warning(`Usuario "${name}" no puede ser eliminado`);

}




$('#optionModUser').on('click', function() {
    $('#usersModal').modal('show');
    $('#modal_title').html(`Modificar usuario: ${capitalizeAll(userRowSelectedData.name)} ${capitalizeAll(userRowSelectedData.lastname)}`)
    modNewUser(userRowSelectedData)

    let mod = 'yes'
    $('#saveUser').on('click', async function(){
        saveUser(mod)
    })
})

const rutFunc = (rut) => {
    return $.formatRut(rut)
}

function modNewUser(modUserData) {   //NEW AND MOD USER
    $.when($('#modal_body').html(`
    <div class="row">
        <div class="col-md-4" style="margin-top:10px;">
        Rut del usuario
            <input id="newUserRut" type="text" placeholder="Rut del usuario" class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Nombre del usuario
            <input id="newUserName" type="text" placeholder="Nombre del usuario " class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Apellido del usuario
            <input id="newUserLastname" type="text" placeholder="Apellido del usuario" class="form-control border-input">
        </div>

        <div class="col-md-3" style="margin-top:10px;">
        Contraseña del usuario
            <input id="newUserPassword" type="password" placeholder="Contraseña del usuario" class="form-control border-input">
        </div>

        <div class="col-md-1" style="margin-top:14px; font-size: 16px;">
        <i class="fas fa-eye"></i>
        <input type="checkbox" onclick="showPass()">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Rol del usuario
            <!--<select id="newUserRole" class="custom-select">
                <option value="admin">Administrador</option>
                <option value="sadmin">Super Administrador</option>
            </select>-->
            <input id="newUserRole" type="text" value="Administrador" class="form-control border-input" readOnly>
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Teléfono del usuario
            <input id="newUserPhone" type="text" placeholder="Teléfono del usuario " class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Email
            <input id="newUserEmail" type="text" placeholder="Email" class="form-control border-input">
        </div>

        <div class="col-md-12" id="newUserErrorMessage"></div>

    </div>
`)).then(function () {

    $('#newUserRut').on('keyup', function() {
        let rut = validateRut(this.value)
        if (rut.isValid ) {
            $('#newUserRut').val(rut.getNiceRut())
        }
    })

    $('#newUserName').on('keyup', function() {
        $('#newUserName').val(removeSpecials(this.value))
    })
    $('#newUserLastname').on('keyup', function() {
        $('#newUserLastname').val(removeSpecials(this.value))
    })

    if (!modUserData) {
        setTimeout(() => {
            $('#newUserRut').focus()
        }, 500)
    } else {
        let ruto = validateRut(modUserData.rut)
        let rutVal
        if (ruto.isValid ) {
            rutVal = ruto.getNiceRut()
        } else {
            rutVal = modUserData.rut
        }
        $('#newUserRut').val(rutVal);
        $('#newUserRut').attr('readOnly', true);
        $('#newUserName').val(modUserData.name);
        $('#newUserLastname').val(modUserData.lastname);

        if (modUserData.scope == 'admin' || modUserData.scope == 'Administrador') {
            // $('#newUserRole').val('admin').trigger("change");
            $('#newUserRole').val('Administrador');
        } else if (modUserData.scope == 'sadmin' || modUserData.scope == 'Super Administrador') {
            $('#newUserRole').val('Super Administrador');
        }

        $('#newUserPhone').val(modUserData.phone);
        $('#newUserEmail').val(modUserData.email);

    }
    
//-------------------------------------------------------------


    });

    $('#modal_footer').html(`
        <button class="btn btn-dark" data-dismiss="modal">
            <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
        </button>

        <button class="btn btn-dark" id="saveUser">
            <i style="color:#3498db;" class="fas fa-check"></i> Guardar
        </button>
    `)

}

function showPass() {
    var x = document.getElementById("newUserPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

async function saveUser(mod) {

    let userData = {
        rut: cleanRut($('#newUserRut').val()),
        name: removeExtraSpaces($('#newUserName').val()),
        lastname: $('#newUserLastname').val(),
        password: $('#newUserPassword').val(),
        scope: $('#newUserRole').val(),
        phone: $('#newUserPhone').val(),
        email: $('#newUserEmail').val(),
        mod: 'no'
    }
    if (mod) userData.mod = mod

    let validUser = await validateUserData(userData)
    if (validUser.ok) {
        let saveUserRes = await axios.post('/api/users', userData)
        if(!saveUserRes.data.error) {
            if (mod) {
                toastr.success('El usuario se ha modificado correctamente')

                let rut = validateRut(saveUserRes.data.rut)
                if (rut.isValid ) {
                    saveUserRes.data.rut = rut.getNiceRut()
                }

                if (saveUserRes.data.scope == 'admin') saveUserRes.data.scope = "Administrador"
                if (saveUserRes.data.scope == 'sadmin') saveUserRes.data.scope = "Super Administrador"

                $('#optionModUser').prop('disabled', true)
                $('#optionDeleteUser').prop('disabled', true)

                datatableUsers
                .row( userRowSelected )
                .remove()
                .draw()

                let modUserAdded = datatableUsers
                .row.add(saveUserRes.data)
                .draw()
                .node();

                //datatableUsers.search('').draw();

                $(modUserAdded).css( 'color', '#1abc9c' )
                setTimeout(() => {
                    $(modUserAdded).css( 'color', '#484848' )
                }, 5000);

                $('#usersModal').modal('hide')

            } else {
                toastr.success('El usuario se ha creado correctamente')

                let rut = validateRut(saveUserRes.data.rut)
                if (rut.isValid ) {
                    saveUserRes.data.rut = rut.getNiceRut()
                }

                if (saveUserRes.data.scope == 'admin') saveUserRes.data.scope = "Administrador"
                if (saveUserRes.data.scope == 'sadmin') saveUserRes.data.scope = "Super Administrador"

                $('#optionModUser').prop('disabled', true)
                $('#optionDeleteUser').prop('disabled', true)

                let newUserAdded = datatableUsers
                    .row.add(saveUserRes.data)
                    .draw()
                    .node();
    
                $(newUserAdded).css('color', '#1abc9c');
                setTimeout(() => {
                    $(newUserAdded).css('color', '#484848');
                }, 5000);
    
                $('#usersModal').modal('hide')
            }
        } else {
            toastr.warning(saveUserRes.data.error)
        }

    } else {
        toastr.warning('Ha ocurrido un error al crear el usuario, por favor intentelo nuevamente')
    }

}

async function validateUserData(userData) {
    console.log(userData)
    let validationCounter = 0
    let errorMessage = ''

    // return new Promise(resolve=>{
        // 5 puntos

        if(userData.rut.length >= 6 && isRut(userData.rut)) { // 1
            validationCounter++
            $('#newUserRut').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar el rut del usuario`
            $('#newUserRut').css('border', '1px solid #e74c3c')
        }

        if(userData.name.length > 1) { // 2
            validationCounter++
            $('#newUserName').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar el nombre del usuario</b>`
            $('#newUserName').css('border', '1px solid #e74c3c')
        }

        if(userData.lastname.length > 1) { // 3
            validationCounter++
            $('#newUserLastname').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar el apellido del usuario`
            $('#newUserLastname').css('border', '1px solid #e74c3c')
        }


        // if(userData.phone.length > 1) { // 5
        //     validationCounter++
        //     $('#newUserPhone').css('border', '1px solid #3498db')
        // } else {
        //     errorMessage += `<br>Debe ingresar el teléfono del usuario`
        //     $('#newUserPhone').css('border', '1px solid #e74c3c')
        // }

        if(isEmail(userData.email)) { // 6
            validationCounter++
            $('#newUserEmail').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar el correo del usuario`
            $('#newUserEmail').css('border', '1px solid #e74c3c')
        }

        if (userData.mod == 'yes') {

            if(userData.changePassword) {
                if(userData.password.length > 1) { // 4
                    validationCounter++
                    $('#modUserPassword').css('border', '1px solid #3498db')
                } else {
                    errorMessage += `<br>Debe ingresar una contraseña`
                    $('#modUserPassword').css('border', '1px solid #e74c3c')
                }
            } else {
                validationCounter++
            }

        } else {
            if(userData.password.length > 5) { // 4
                validationCounter++
                $('#newUserPassword').css('border', '1px solid #3498db')
            } else {
                errorMessage += `<br>Debe ingresar una contraseña valida de mas de 5 caracteres`
                $('#newUserPassword').css('border', '1px solid #e74c3c')
            }

        }

        console.log('validation', validationCounter)
        if(validationCounter == 5) {
            $('#newUserErrorMessage').empty()
            return {ok: userData}
        } else {
            $('#newUserErrorMessage').html(`
            <div class="alert alert-dismissible alert-warning">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <h4 class="alert-heading">Debe solucionar los siguientes errores</h4>
                <p class="mb-0">${errorMessage}</p>
            </div>
            `)

            return {err: userData}
        }
    // })
}