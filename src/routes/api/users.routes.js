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
                    let user = await User(request.payload);
                    //let userSaved = await user.save();

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
                    role: Joi.string().required(),
                    phone: Joi.string().required(),
                    email: Joi.string().required()
                })
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