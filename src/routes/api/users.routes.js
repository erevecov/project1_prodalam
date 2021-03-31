const User = require('../../models/userModel');

module.exports = [
    {
        method: 'POST',
        path: '/api/users',
        options: {
            //auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    console.log("req",request.payload);
                    let user = await User(request.payload);
                    let userSaved = await user.save();
                    console.log("reso", userSaved);
                    return userSaved
                    // return userSaved.map(el => {
                    //     delete el.password;
                    //     return el;
                    // });
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al crear el usuario, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/api/users',
        options: {
            //auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await User.find({}).lean();
                    console.log("user", result);
    
                    return result.map(el=> {
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