const User = require('../../models/userModel');

module.exports = [
    {
        method: 'GET',
        path: '/api/testo',
        options: {
            //auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await User.find({});
                    console.log("reso", result);

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