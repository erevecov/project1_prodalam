const Product = require('../../models/productModel');

module.exports = [
    {
        method: 'GET',
        path: '/api/categories',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    // let result = await Product.find({}).lean();

                    let result = await Product.find({}).distinct('category')

                    /*
                    let cats = []
                    //let parentCats = []

                    result.forEach((el) => {
                        if (!cats.includes(el.category)) {
                            cats.push(el.category)
                        }
                        // if (!parentCats.includes(el.categoryFather) && el.categoryFather !== '-') {
                        //     parentCats.push(el.categoryFather)
                        // }
                    })

                    */
                    let categories = []

                    let cats = result.sort()
                    // parentCats = parentCats.sort()

                    categories.push({cats})
                    // categories.push({parentCats})

                    return categories;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar categorias, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/categoriesProducts',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await Product.find({}).lean();

                    let cats = []
                    //let parentCats = []

                    result.forEach((el) => {
                        if (!cats.includes(el.category)) {
                            cats.push(el.category)
                        }
                        // if (!parentCats.includes(el.categoryFather) && el.categoryFather !== '-') {
                        //     parentCats.push(el.categoryFather)
                        // }
                    })

                    let categories = []

                    cats = cats.sort()
                    // parentCats = parentCats.sort()

                    categories.push({cats})
                    // categories.push({parentCats})

                    return categories;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar categorias, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    }
]