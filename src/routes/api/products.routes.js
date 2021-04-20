const Product = require('../../models/productModel');

module.exports = [
    {
        method: 'POST',
        path: '/api/products',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let product = await Product(request.payload);
                    let productSaved = await product.save();

                    return productSaved

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al crear el producto, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/api/productsPaginate',
        options: {
            auth: false,
            description: 'get products paginate',
            notes: 'get products paginate',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let queryParams = request.query

                    let query = {}

                    if (queryParams.search) {
                        query = {
                            $or: [
                                {
                                    sku: {
                                        $regex: new RegExp(queryParams.search, 'i')
                                    }
                                },
                                {
                                    title: {
                                        $regex: new RegExp(queryParams.search, 'i')
                                    }
                                }
                            ]
                        }
                    }

                    const options = {
                        page: queryParams.page || 1,
                        limit: queryParams.limit || 6,
                        collation: {
                            locale: 'en',
                        },
                    }

                    let result = await Product.paginate(query, options)

                    return result
                } catch (error) {
                    console.log(error)

                    return Boom.badImplementation(error)
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/products',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await Product.find({}).lean();

                    return result;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar Productos, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/uploadProducts',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {

                    let result = "hola";
                    return result;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar Productos, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    }
]






// import Boom from '@hapi/boom'
// import User from '../../models/User'

// module.exports = [
// {
//     method: 'GET',
//     path: '/api/usersPaginate',
//     options: {
//         description: 'get users paginate',
//         notes: 'get users paginate',
//         tags: ['api'],
//         handler: async (request, h) => {
//             try {
//                 let queryParams = request.query

//                 const options = {
//                     page: queryParams.page || 1,
//                     limit: queryParams.limit || 10,
//                     collation: {
//                         locale: 'en',
//                     },
//                 }

//                 let result = await User.paginate({}, options)

//                 return result
//             } catch (error) {
//                 console.log(error)

//                 return Boom.badImplementation(error)
//             }
//         }
//     }
// }
// ]


