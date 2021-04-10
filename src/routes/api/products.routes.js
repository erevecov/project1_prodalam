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