let internals = {
    products: []
}

initProducts()

async function initProducts() {
    loadingHandler('start')

    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')
    const cate = urlParams.searchParams.get('category')
    const subCate = urlParams.searchParams.get('subCategory')

    let productApiURL = 'api/productsPaginate'

    if (page) {
        productApiURL += `?page=${page}`

        if (cate) {
            productApiURL += `&category=${cate}`
        }
        if (subCate) {
            productApiURL += `&subCategory=${subCate}`
        }
        if (search) {
            productApiURL += `&search=${search}`
        }
    } else {
        if (search) {
            productApiURL += `?search=${search}`
        }
        if (cate) {
            productApiURL += `?category=${cate}`
        }
        if (subCate) {
            productApiURL += `?subCategory=${subCate}`
        }
    }

    // console.log(productApiURL)

    let products = await axios.get(productApiURL)

    // console.log('products', products)

    internals.products = products.data.docs

    let productsUpSelector = document.querySelector('#products-up')
    let productsDownSelector = document.querySelector('#products-down')
    let infonumPage = document.querySelector('#numPage')
    let infonumPage0 = document.querySelector('#numPage0')


    if (products.data.page) {
        infonumPage.innerHTML= products.data.page
        infonumPage0.innerHTML= products.data.page
    }
    if (products.data.prevPage) {
        let prevPageURL = `?page=${products.data.prevPage}`

        if (cate) {
            prevPageURL += `&category=${cate}`
        }

        if (search) {
            prevPageURL += `&search=${search}`
        }

        if (subCate) {
            prevPageURL += `&subCategory=${subCate}`
        }

        productsUpSelector.setAttribute('href', prevPageURL)
    }

    if (products.data.nextPage) {
        let nextPageURL = `?page=${products.data.nextPage}`

        if (cate) {
            nextPageURL += `&category=${cate}`
        }

        if (search) {
            nextPageURL += `&search=${search}`
        }

        if (subCate) {
            nextPageURL += `&subCategory=${subCate}`
        }

        productsDownSelector.setAttribute('href', nextPageURL)
    }

    document.querySelector('#product-it-container').innerHTML = products.data.docs.reduce((acc,el,i)=> {

        let findProductImg

        el.info.forEach(a => {
            if (a.name == "Imagen") {
                if (a.data.includes(",")) {
                    findProductImg = a.data.split(",")
                    findProductImg = findProductImg[0]
                } else {
                    findProductImg = a.data
                }
            }
        });

        let findProductTitle = el.title
        let findProductDescription = el.description
        let findProductInfo = el.info


        let productData = {
            _id: el._id,
            title: (findProductTitle) ? findProductTitle : 'SIN T??TULO',
            sku: el.sku,
            description: (findProductDescription) ? findProductDescription : 'SIN DESCRIPCI??N',
            img: (findProductImg) ? findProductImg : '/public/img/NOFOTO_PRODALAM.jpg',
            info: (findProductInfo)
        }

        acc += `
        <div class="col-md-6 product-item-container">
            <div class="product-item">
                <div class="row" style="padding-top: 25px; padding-bottom: 15px;">
                    <div class="col-sm-7">
                        <h2>${cutText(productData.title, 23)}</h2>

                        <h5>SKU: ${productData.sku}</h5>

                        <p class="text-product">${cutText(productData.description, 70)}</p>

                        <div  style="padding-bottom: 10px;">
                            <a class="btn btn-custom viewMore" data-productid="${productData._id}">Ver m??s</a>
                        </div>
                    </div>

                    <div class="col-sm-5 product-img-container">
                        <img src="${productData.img}" alt="">
                    </div>
                </div>
            </div>
        </div>
        `

        return acc
    }, '')

    Array.from(querySelectorAll('.viewMore')).forEach(el => {
        el.addEventListener('click', () => {

            let productData = internals.products.find(elProduct=>elProduct._id === el.dataset.productid)

            handleModal(productData,true)
        })
    })

    loadingHandler('stop')
}