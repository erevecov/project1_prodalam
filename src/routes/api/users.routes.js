const User = require('../../models/userModel');
const Joi = require('joi')

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
                    console.log("payload", request.payload);


                    let query = {
                        $or: [
                            {
                                rut: request.payload.rut
                            }
                        ]
                    }

                    let userExist = await User.find(query)

                    if (userExist[0]) {
                        return h.response({
                            error: 'El usuario ya existe.'
                        }).code(409)
                    }

                    let user = await User(request.payload);

                    let userSaved = await user.save();

                    userSaved.password = '';

                    return userSaved

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al crear el usuario, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }

            },
            validate: {
                payload: Joi.object().keys({
                    rut: Joi.string().required(),
                    name: Joi.string().required(),
                    lastname: Joi.string().required(),
                    password: Joi.string().required(),
                    scope: Joi.string().required(),
                    phone: Joi.string().required(),
                    email: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/modUser',
        options: {
            handler: async (request, h) => {
                try {
                    let updateUser = await User.findOneAndUpdate(request.payload.rut, request.payload, {
                        new: true
                      });
        
                    console.log("updat", updateUser); 
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al eliminar el usuario, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
                
            },
            validate: {
                payload: Joi.object().keys({
                    rut: Joi.string().required(),
                    name: Joi.string().required(),
                    lastname: Joi.string().required(),
                    password: Joi.string().required(),
                    scope: Joi.string().required(),
                    phone: Joi.string().required(),
                    email: Joi.string().required()
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
                    let result = await User.find({}).lean();

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