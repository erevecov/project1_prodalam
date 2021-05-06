const Product = require('../../models/productModel');
const Joi = require('joi')

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
                    let arrayProducts = request.payload

                    const bulkOps = arrayProducts.map(doc => ({
                        updateOne: {
                            filter: { sku: doc.sku },
                            update: doc,
                            upsert: true
                        }
                    }))

                    await Product.bulkWrite(bulkOps)
                    // let res = await Product.insertMany(arrayProducts)

                    return { ok: 'Productos ingresados correctamente' }

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al ingresar los productos, por favor recargue la página e intentelo nuevamente.'
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

                    if (queryParams.search && !queryParams.category) {
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
                    if (queryParams.category && !queryParams.search) {
                        query = { category: queryParams.category }
                    }
                    if (queryParams.search && queryParams.category) {
                        query = {
                            category: queryParams.category,
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

                    if (queryParams.subCategory) {
                        query = { subCategory: queryParams.subCategory }
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
        method: 'POST',
        path: '/api/productsPaginateFav',
        options: {
            auth: false,
            description: 'get products paginate',
            notes: 'get products paginate',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let queryParams = request.query
                    let query = {}

                    query = {
                        $or: [
                            {
                                sku: {$in: request.payload}
                            }
                        ]
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

                    return error
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
                    if (result[0]) {
                        result.forEach(el => {
                            el.info.forEach(a => {
                                if (a.name == "Imagen") {
                                    if (a.data.includes(',')) {
                                        a.data = a.data.split(',')
                                    }
                                }
                                if (a.name == "video") {
                                    if (a.data.includes(',')) {
                                        a.data = a.data.split(',')
                                    }
                                }
                                if (a.name == "pdf") {
                                    if (a.data.includes(',')) {
                                        a.data = a.data.split(',')
                                    }
                                }
                            });
                        });
                    }
                    
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
        path: '/api/modProducts',
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
                                sku: request.payload.sku
                            }
                        ]
                    }

                    let productExist = await Product.find(query)
                    console.log("payload", request.payload);
                    if (productExist[0]) {
    
                        let product = productExist[0]
                        product.title = request.payload.title
                        product.description = request.payload.description
                        product.category = request.payload.category
                        product.subCategory = request.payload.subCategory

                        let aux = {
                            img: 'no',
                            vid: 'no',
                            pdf: 'no'
                        }

                        product.info.forEach(el => {
                            if (el.name == 'Imagen') {
                                el.data = request.payload.image
                                aux.img = 'yes'
                            }
                            if (el.name == 'video') {
                                el.data = request.payload.video
                                aux.vid = 'yes'
                            }
                            if (el.name == 'pdf') {
                                el.data = request.payload.pdf
                                aux.pdf = 'yes'
                            }
                        });

                        if (aux.img == 'no') {
                            product.info.push({
                                name: 'Imagen',
                                data: request.payload.image
                            })
                        }

                        if (aux.vid == 'no') {
                            product.info.push({
                                name: 'video',
                                data: request.payload.video
                            })
                        }

                        if (aux.pdf == 'no') {
                            product.info.push({
                                name: 'pdf',
                                data: request.payload.pdf
                            })
                        }

                        product.info.forEach((el, i) => {
                            if (el.name == 'Imagen') {
                                el.data = request.payload.image
                                aux.img = 'yes'
                                // if (el.data == '') {
                                //     delete product.info[i]
                                // }
                            }
                            if (el.name == 'video') {
                                el.data = request.payload.video
                                aux.vid = 'yes'
                                // if (el.data == '') {
                                //     delete product.info[i]
                                // }
                            }
                            if (el.name == 'pdf') {
                                el.data = request.payload.pdf
                                aux.pdf = 'yes'
                                // if (el.data == '') {
                                //     delete product.info[i]
                                // }
                            }
                        });


                        console.log("produasdadasd", product.info);

                        let productSaved = await Product.findByIdAndUpdate(productExist[0]._id, product)


                        return productSaved
                    }

                    return { error: 'No se ha encontrado el producto a modificar, por favor recargue la pagina'}

                } catch (error) {
                    console.log(error);
                    return {
                        error: 'Ha ocurrido un error al modificar el producto, por favor recargue la página e intentelo nuevamente.'
                    }
                }

            },
            validate: {
                payload: Joi.object().keys({
                    sku: Joi.string().required(),
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    category: Joi.string().required(),
                    subCategory: Joi.string().required(),
                    image: Joi.string().allow(''),
                    video: Joi.string().allow(''),
                    pdf: Joi.string().allow('')
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/productsStar',
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
                                star: 'yes'
                            }
                        ]
                    }

                    let result = await Product.find(query).lean();

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
        path: '/api/productsStar',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let filter = { sku: request.payload.sku }

                    let update = { star: request.payload.star }

                    let result = await Product.findOneAndUpdate(filter, update);
                    return result;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al destacar producto, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/productsStarFiltered',
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
                                star: 'yes'
                            }
                        ]
                    }

                    let result = await Product.find(query).lean();

                    let maxRes = []
                    let rando

                    while (maxRes.length < 8) {
                        rando = result[Math.floor(Math.random() * result.length)]
                        if (!maxRes.includes(rando)) {
                            maxRes.push(rando)
                        }
                    }

                    return maxRes;

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
        path: '/api/productsRelated',
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
                                category: request.payload.category
                            }
                        ]
                    }

                    let result = await Product.find(query).lean();

                    let maxRes = []
                    let rando

                    while (maxRes.length < 4) {
                        rando = result[Math.floor(Math.random() * result.length)]
                        if (!maxRes.includes(rando)) {
                            maxRes.push(rando)
                        }
                    }

                    return maxRes;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar Productos relacionados, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            },
            validate: {
                payload: Joi.object().keys({
                    category: Joi.string().required()
                })
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
    },
    {
        method: 'POST',
        path: '/api/deleteProduct',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {

                    let query = {
                        sku: request.payload.sku
                    }

                    let result = await Product.find(query).lean();

                    await Product.deleteOne(query)


                    return result
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al eliminar producto, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            },
            validate: {
                payload: Joi.object().keys({
                    sku: Joi.string().required()
                })
            }
        }
    }
]


