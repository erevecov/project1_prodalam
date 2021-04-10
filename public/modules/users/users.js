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
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        ordering: true,
        iDisplayLength: 50,
        oLanguage: {
            sSearch: 'buscar: '
        },
        responsive: false,
        columns: [
            { data: 'rut' },
            { data: 'name' },
            //{ data: 'lastname' },
            { data: 'email' },
            { data: 'phone' },
            { data: 'scope' },  
        ],
        initComplete: function (settings, json) {
            getUsersEnabled()
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
        if (res.err) {
            toastr.warning(res.err)
            $('#loadingUsers').empty()
        } else if(res.data) {
            // let formatRes = res.data.map(el=>{
            //     if (isRut(el._id)) {
            //         el.rut = `${rutFunc(el._id)}`;
            //     } else {
            //         el.rut = el._id;
            //     }

            //     return el
            // })

            datatableUsers.rows.add(res.data).draw()
            $('#loadingUsers').empty()
        } 
}

$('#optionCreateUser').on('click', function() { // CREAR CLIENTE

    $('#usersModal').modal('show');
    $('#modal_title').html(`Nuevo usuario`)
    $('#modal_body').html(`   
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

            <div class="col-md-4" style="margin-top:10px;">
            Contraseña del usuario
                <input id="newUserPassword" type="password" placeholder="Contraseña del usuario" class="form-control border-input">
            </div>
            
            <div class="col-md-4" style="margin-top:10px;">
            Rol del usuario 
                <select id="newUserRole" class="custom-select">
                    <option value="user">Usuario  </option>
                    <option value="sa">Administrador  </option>
                </select>
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
    `)

    $('#modal_footer').html(`
        <button class="btn btn-dark" data-dismiss="modal">
            <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
        </button>

        <button class="btn btn-dark" id="saveUser">
            <i style="color:#3498db;" class="fas fa-check"></i> Guardar
        </button>
    `)

    $('#newUserRut').on('keyup', function() {
        let rut = $('#newUserRut').val();
        if (isRut(rut) && rut.length >= 7) {
            $('#newUserRut').val(rutFunc($('#newUserRut').val()))
        }
    })

    setTimeout(() => {
        $('#newUserRut').focus()    
    }, 500)
    
    $('#saveUser').on('click', function(){
        let userData = {
            rut: removeExtraSpaces($('#newUserRut').val()),
            name: $('#newUserName').val(),
            lastname: $('#newUserLastname').val(),
            password: $('#newUserPassword').val(),
            role: $('#newUserRole').val(),
            charge: $('#newUserCharge').val(),
            phone: $('#newUserPhone').val(),
            email: removeExtraSpaces($('#newUserEmail').val()),
            emailPassword: $('#newUserEmailPassword').val()
        }
        
        validateUserData(userData).then(res=>{
            if(res.ok) {
                ajax({
                    url: 'api/user',
                    type: 'POST',
                    data: {
                        rut:userData.rut,
                        name:userData.name,
                        lastname:userData.lastname,
                        password:userData.password,
                        role:userData.role,
                        charge:userData.charge,
                        phone:userData.phone,
                        email:userData.email,
                        emailPassword: userData.emailPassword
                    }
                }).then(res=>{
                    if(res.err) {
                        toastr.warning(res.err)
                    } else if(res.ok) {
                        toastr.success('El usuario se ha creado correctamente')
                        
                        if (isRut(res.ok._id)) {
                            res.ok.rut = `${rutFunc(res.ok._id)}`
                        } else {
                            res.ok.rut = res.ok._id
                        }

                        let newUserAdded = datatableUsers
                        .row.add(res.ok)
                        .draw()
                        .node();
                        
                        $(newUserAdded).css( 'color', '#1abc9c' );
                        setTimeout(() => {
                            $(newUserAdded).css( 'color', '#484848' );
                        }, 5000);

                        $('#usersModal').modal('hide')
                    }
                })
            }
            
        });
        
    });
    
});

$('#optionDeleteUser').on('click', function() {
    swal.fire({
        title: 'Eliminar usuario',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.value) {
            ajax({
                url: 'api/user',
                type: 'DELETE',
                data: {
                    _id: userRowSelectedData._id
                }
            }).then(res=>{
                if(res.err) {
                    toastr.warning(res.err)
                } else if(res.ok) {
                    $('#optionModUser').prop('disabled', true)
                    $('#optionDeleteUser').prop('disabled', true)
                    
                    toastr.success('Se ha eliminado correctamente')

                    datatableUsers
                    .row( userRowSelected )
                    .remove()
                    .draw()

                    console.log(res.ok)
                }
            })
        }
    })
})

$('#optionModUser').on('click', function() {
    console.log(userRowSelectedData)
    
    $('#usersModal').modal('show');
    $('#modal_title').html(`{{ lang.modUser.modalTitle }} ${capitalizeAll(userRowSelectedData.name)} ${capitalizeAll(userRowSelectedData.lastname)}`)
    $('#modal_body').html(`   
        <div class="row">
            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.dniTitle }}
                <input disabled value="${rutFunc(userRowSelectedData._id)}" id="modUserRut" type="text" placeholder="{{ lang.modUser.dniTitle }}" class="form-control border-input">
            </div>
            
            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.nameTitle }}
                <input value="${userRowSelectedData.name}" id="modUserName" type="text" placeholder="{{ lang.modUser.nameTitle }}" class="form-control border-input">
            </div>

            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.lastnameTitle }}
                <input value="${userRowSelectedData.lastname}" id="modUserLastname" type="text" placeholder="{{ lang.modUser.lastnameTitle }}" class="form-control border-input">
            </div>
            

            <div class="col-md-4" style="margin-top:10px;">
                <div class="form-group">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="changePassword" >
                        <label class="custom-control-label" for="changePassword">{{ lang.modUser.systemPasswordTitle }}</label>
                    </div>
                </div>

                <input disabled id="modUserPassword" type="password" placeholder="{{ lang.modUser.systemPasswordTitle }}" class="form-control border-input">
            </div>
            
            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.roleTitle }}
                <select id="modUserRole" class="custom-select">
                    <option value="commercial">{{ lang.modUser.roles.commercial }} </option>
                    <option value="production">{{ lang.modUser.roles.production }} </option>
                    <option value="sa">{{ lang.modUser.roles.sa }} </option>
                </select>
            </div>

            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.chargeTitle }}
                <input value="${userRowSelectedData.position}" id="modUserCharge" type="text" placeholder="{{ lang.modUser.chargeTitle }}" class="form-control border-input">
            </div>

            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.phone }}
                <input value="${userRowSelectedData.phone}" id="modUserPhone" type="text" placeholder="{{ lang.modUser.phone }}" class="form-control border-input">
            </div>

            <div class="col-md-4" style="margin-top:10px;">
                {{ lang.modUser.email }}
                <input value="${userRowSelectedData.email}" id="modUserEmail" type="text" placeholder="{{ lang.modUser.email }}" class="form-control border-input">
            </div>

            <div class="col-md-4" style="margin-top:10px;">
                <div class="form-group">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="changeEmailPassword" >
                        <label class="custom-control-label" for="changeEmailPassword">{{ lang.modUser.emailPasswordTitle }}</label>
                    </div>
                </div>
                <input disabled id="modUserEmailPassword" type="password" placeholder="{{ lang.modUser.emailPasswordTitle }}" class="form-control border-input">
            </div>
            
            <div class="col-md-12" id="newUserErrorMessage"></div>

            <div class="alert alert-dismissible alert-primary">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                {{{ lang.modUser.alertMessage }}}
            </div>
        </div>   
    `)

    $('#modal_footer').html(`
        <button class="btn btn-dark" data-dismiss="modal">
            <i style="color:#e74c3c;" class="fas fa-times"></i> {{ lang.modUser.cancelButton }}
        </button>

        <button class="btn btn-dark" id="saveUser">
            <i style="color:#3498db;" class="fas fa-check"></i> {{ lang.modUser.saveButton }}
        </button>
    `)

    $('#modUserRole').val(userRowSelectedData.role)
    
    $('#changePassword').on('change', function(){
        if($(this).is(':checked')) {
            $('#modUserPassword').attr('disabled', false)
        } else {
            $('#modUserPassword').val('')
            $('#modUserPassword').attr('disabled', true)
        }
    })

    $('#changeEmailPassword').on('change', function(){
        if($(this).is(':checked')) {
            $('#modUserEmailPassword').attr('disabled', false)
        } else {
            $('#modUserEmailPassword').val('')
            $('#modUserEmailPassword').attr('disabled', true)
        }
    })

    $('#saveUser').on('click', function(){
        let userData = {
            status: 'mod',
            rut: removeExtraSpaces($('#modUserRut').val()),
            name: $('#modUserName').val(),
            lastname: $('#modUserLastname').val(),
            changePassword: $('#changePassword').is(':checked'),
            password: $('#modUserPassword').val(),
            role: $('#modUserRole').val(),
            charge: $('#modUserCharge').val(),
            phone: $('#modUserPhone').val(),
            email: removeExtraSpaces($('#modUserEmail').val()),
            changeEmailPassword: $('#changeEmailPassword').is(':checked'),
            emailPassword: $('#modUserEmailPassword').val(),
        }

        validateUserData(userData).then(res=>{
            if(res.ok) {
                
                let changePassword = ''
                let changeEmailPassword = ''

                if($('#changePassword').is(':checked')) {
                    changePassword = 'yes'
                } else {
                    changePassword = 'no'
                }

                if($('#changeEmailPassword').is(':checked')) {
                    changeEmailPassword = 'yes'
                } else {
                    changeEmailPassword = 'no'
                }

                ajax({
                    url: 'api/modUser',
                    type: 'POST',
                    data: {
                        rut:userData.rut,
                        name:userData.name,
                        lastname:userData.lastname,
                        changePassword: changePassword,
                        changeEmailPassword: changeEmailPassword,
                        password:userData.password,
                        emailPassword:userData.emailPassword,
                        role:userData.role,
                        charge:userData.charge,
                        phone:userData.phone,
                        email:userData.email
                    }
                }).then(res=>{
                    if(res.err) {
                        toastr.warning(res.err)
                    } else if(res.ok) {
                        toastr.success('{{ lang.modUser.saveUserToastrOK }}')
                        
                        if (isRut(res.ok._id)) {
                            res.ok.rut = `${rutFunc(res.ok._id)}`
                        } else {
                            res.ok.rut = res.ok._id
                        }
                        
                        $('#optionModUser').prop('disabled', true)
                        $('#optionDeleteUser').prop('disabled', true)

                        datatableUsers
                        .row( userRowSelected )
                        .remove()
                        .draw()
                        
                        let modUserAdded = datatableUsers
                        .row.add(res.ok)
                        .draw()
                        .node();
                        
                        //datatableUsers.search('').draw();

                        $(modUserAdded).css( 'color', '#1abc9c' )
                        setTimeout(() => {
                            $(modUserAdded).css( 'color', '#484848' )
                        }, 5000);

                        $('#usersModal').modal('hide')
                    }
                })
            }
        })
    })
})

function validateUserData(userData) { // VOY AQUI EN LA TRADUCCIÓN
    console.log(userData)
    let validationCounter = 0
    let errorMessage = ''

    return new Promise(resolve=>{
        // 7 puntos

        if(userData.rut.length >= 6/*isRut(userData.rut)*/) { // 1
            validationCounter++
            $('#newUserRut').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>{{{ lang.validateUserData.dni }}}`
            $('#newUserRut').css('border', '1px solid #e74c3c')
        }

        if(userData.name.length > 1) { // 2
            validationCounter++
            $('#newUserName').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>{{{ lang.validateUserData.name }}}</b>`
            $('#newUserName').css('border', '1px solid #e74c3c')
        }

        if(userData.lastname.length > 1) { // 3
            validationCounter++
            $('#newUserLastname').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>{{{ lang.validateUserData.lastname }}}`
            $('#newUserLastname').css('border', '1px solid #e74c3c')
        }
        

        if(userData.charge.length > 1) { // 5
            validationCounter++
            $('#newUserCharge').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>{{{ lang.validateUserData.charge }}}`
            $('#newUserCharge').css('border', '1px solid #e74c3c')
        }

        if(userData.phone.length > 1) { // 6
            validationCounter++
            $('#newUserPhone').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>{{{ lang.validateUserData.phone }}}`
            $('#newUserPhone').css('border', '1px solid #e74c3c')
        }

        if(isEmail(userData.email)) { // 7
            validationCounter++
            $('#newUserEmail').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>{{{ lang.validateUserData.email }}}`
            $('#newUserEmail').css('border', '1px solid #e74c3c')
        }
        
        if (userData.status == 'mod') {
            
            if(userData.changePassword) {
                if(userData.password.length > 1) { // 4
                    validationCounter++
                    $('#modUserPassword').css('border', '1px solid #3498db')
                } else {
                    errorMessage += `<br>{{{ lang.validateUserData.systemPassword }}}`
                    $('#modUserPassword').css('border', '1px solid #e74c3c')
                }
            } else {
                validationCounter++
            }

            if(userData.changeEmailPassword) {
                if(userData.emailPassword.length > 1) { // 9
                    validationCounter++
                    $('#modUserEmailPassword').css('border', '1px solid #3498db')
                } else {
                    errorMessage += `<br>{{{ lang.validateUserData.modEmailPassword }}}`
                    $('#modUserEmailPassword').css('border', '1px solid #e74c3c')
                }
            } else {
                validationCounter++
            }

        } else {
            if(userData.password.length > 1) { // 4
                validationCounter++
                $('#newUserPassword').css('border', '1px solid #3498db')
            } else {
                errorMessage += `<br>{{{ lang.validateUserData.systemPassword }}}`
                $('#newUserPassword').css('border', '1px solid #e74c3c')
            }

            if(userData.emailPassword) { // 8
                validationCounter++
                $('#newUserEmailPassword').css('border', '1px solid #3498db')
            } else {
                errorMessage += `<br>{{{ lang.validateUserData.createEmailPassword }}}`
                $('#newUserEmailPassword').css('border', '1px solid #e74c3c')
            }
        }
        
        console.log('validation', validationCounter)
        if(validationCounter == 8) {
            $('#newUserErrorMessage').empty()
            resolve({ok: userData})
        } else {
            $('#newUserErrorMessage').html(`
            <div class="alert alert-dismissible alert-warning">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <h4 class="alert-heading">{{{ lang.validateUserData.messageTitle }}}</h4>
                <p class="mb-0">${errorMessage}</p>
            </div>
            `)
            
            resolve({err: userData})
        }
    })
}
