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
        path: '/api/subCategories',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await Product.find({}).lean();

                    let parentCategory = result.map(function (el) {
                        let a = {
                            parent: el.category,
                            sub: el.subCategory
                        }
                        return a
                    })

                    var reduced = parentCategory.reduce((unique, o) => {
                        if(!unique.some(obj => obj.parent === o.parent && obj.sub === o.sub)) {
                          unique.push(o);
                        }
                        return unique;
                    },[]);

                    let subCategories = []

                    reduced.forEach(el => {
                        if(!subCategories.some(obj => obj.parent === el.parent)) {
                            subCategories.push(el)
                        } else {
                            for (let i = 0; i < subCategories.length; i++) {

                                if (!Array.isArray(subCategories[i].sub)) {
                                    subCategories[i].sub = [subCategories[i].sub]
                                }

                                if (Array.isArray(subCategories[i].sub)) {
                                    if (subCategories[i].parent == el.parent) {
                                        subCategories[i].sub.push(el.sub)
                                    }
                                }
                                
                            }
                        }
                    });

                    return  subCategories;

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar sub categorias, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    }
]