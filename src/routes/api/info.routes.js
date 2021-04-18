const Info = require('../../models/infoModel');

module.exports = [
    {
        method: 'GET',
        path: '/api/infos',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await Info.find({}).lean();

                    return result;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar Productos, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    },{
        method: 'GET',
        path: '/api/infoPaginate',
        options: {
            auth: false,
            description: 'get info paginate',
            notes: 'get info paginate',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let queryParams = request.query

                    const options = {
                        page: queryParams.page || 1,
                        limit: queryParams.limit || 4,
                        collation: {
                            locale: 'en',
                        },
                    }

                    let result = await Info.paginate({}, options)

                    return result
                } catch (error) {
                    console.log(error)

                    return Boom.badImplementation(error)
                }
            }
        }
    }
]