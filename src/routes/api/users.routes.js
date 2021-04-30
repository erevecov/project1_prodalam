const User = require('../../models/userModel');
const Joi = require('joi')
import { hashPassword } from '../../utils/passwordHandler'
import { validatePassword } from '../../utils/passwordHandler'

module.exports = [
    {
        method: 'POST',
        path: '/api/users',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let query = {
                        $or: [
                            {
                                rut: request.payload.rut
                            }
                        ]
                    }

                    let userExist = await User.find(query)

                    if (request.payload.scope == 'Super Administrador'){
                        request.payload.scope = "sadmin"
                    } else if (request.payload.scope == 'Administrador'){
                        request.payload.scope = "admin"
                    }

                    if (userExist[0]) {
                        if (request.payload.mod == 'yes') {

                            if (request.payload.password == '') {
                                request.payload.password = userExist[0].password
                            }

                            if (!validatePassword(userExist[0].password, request.payload.password)) {
                                request.payload.password = hashPassword(request.payload.password)
                            }

                            delete request.payload.mod
                            let user = await User(request.payload);
                            user._id = userExist[0]._id
                            let userSaved = await User.findByIdAndUpdate(userExist[0]._id, user)

                            userSaved.password = '';

                            return userSaved

                        } else {
                            console.log("error1");
                            return {
                                error: 'El usuario ya existe.'
                            }
                        }
                    }

                    // let userPassword = generatePassword()

                    //     let newUser = new User({
                    //         cod: payload.cod,
                    //         status: payload.status,
                    //         scope: payload.scope,
                    //         password: hashPassword(userPassword)
                    //     })
                    request.payload.password = hashPassword(request.payload.password)

                    delete request.payload.mod
                    let user = await User(request.payload);

                    let userSaved = await user.save();

                    userSaved.password = '';

                    return userSaved

                } catch (error) {
                    console.log(error);
                    return {
                        error: 'Ha ocurrido un error al crear el usuario, por favor recargue la página e intentelo nuevamente.'
                    }
                }

            },
            validate: {
                payload: Joi.object().keys({
                    rut: Joi.string().required(),
                    name: Joi.string().required(),
                    lastname: Joi.string().required(),
                    password: Joi.string().allow(null, ''),
                    scope: Joi.string().required(),
                    phone: Joi.string().allow(null, ''),
                    email: Joi.string().required(),
                    mod: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/users/{_id}',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let params = request.params;
                    let deleteUser = await User.deleteOne( { _id: params._id } )
                    if (deleteUser.ok) {
                        return {
                            ok: true
                        };
                    }

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/api/users',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let query = {
                        $or: [
                            {
                                scope: { $not: { $eq: 'dev'} }
                            }
                        ]
                    }

                    let result = await User.find(query).lean();

                    return result.map(el => {
                        delete el.password;
                        return el;
                    });
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar usuarios, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    }
]