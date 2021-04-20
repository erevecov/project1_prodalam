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

    let productApiURL = 'api/productsPaginate'

    if (page) {
        productApiURL += `?page=${page}`

        if (search) {
            productApiURL += `&search=${search}`
        }
    } else {
        if (search) {
            productApiURL += `?search=${search}`
        }
    }

    console.log(productApiURL)

    let products = await axios.get(productApiURL)

    console.log(products)

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

        if (search) {
            prevPageURL += `&search=${search}`
        }

        productsUpSelector.setAttribute('href', prevPageURL)
    }

    if (products.data.nextPage) {
        let nextPageURL = `?page=${products.data.nextPage}`

        if (search) {
            nextPageURL += `&search=${search}`
        }

        productsDownSelector.setAttribute('href', nextPageURL)
    }

    document.querySelector('#product-it-container').innerHTML = products.data.docs.reduce((acc,el,i)=> {
        let findProductTitle = el.info.find(elProductAttribute=> elProductAttribute.attributeId === 25)
        let findProductDescription = el.info.find(elProductAttribute=> elProductAttribute.attributeId === 7)
        let findProductImg = el.info.find(elProductAttribute=> elProductAttribute.attributeId === 5)

        let productData = {
            _id: el._id,
            title: (findProductTitle) ? findProductTitle.data : 'SIN TÍTULO',
            sku: el.sku,
            description: (findProductDescription) ? findProductDescription.data : 'SIN DESCRIPCIÓN',
            img: (findProductImg) ? findProductImg.data : '/public/img/noimg.jpeg',
        }

        acc += `
        <div class="col-md-6 product-item-container">
            <div class="product-item">
                <div class="row">
                    <div class="col-7">
                        <h2>${cutText(productData.title, 22)}</h2>

                        <h5>SKU: ${productData.sku}</h5>

                        <p class="text-product">${cutText(productData.description, 70)}</p>

                        <a class="btn btn-custom viewMore" data-productid="${productData._id}">Ver más</a>
                    </div>

                    <div class="col-5 product-img-container">
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

            handleModal(productData)
        })
    })

    loadingHandler('stop')
}

const handleModal = (originalProductData) => {
    let findProductTitle = originalProductData.info.find(elProductAttribute=> elProductAttribute.attributeId === 25)
    let findProductDescription = originalProductData.info.find(elProductAttribute=> elProductAttribute.attributeId === 7)
    let findProductImg = originalProductData.info.find(elProductAttribute=> elProductAttribute.attributeId === 5)

    let productData = {
        _id: originalProductData._id,
        title: (findProductTitle) ? findProductTitle.data : 'SIN TÍTULO',
        sku: originalProductData.sku,
        description: (findProductDescription) ? findProductDescription.data : 'SIN DESCRIPCIÓN',
        img: (findProductImg) ? findProductImg.data : '/public/img/noimg.jpeg',
    }

	const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

	modalSelector.title.innerHTML = productData.title
	modalSelector.body.innerHTML=`
    <div class="product-modal">
        <div class="row">
            <div class="col-lg-6 uno">
                <h2>${productData.title}</h2>

                <h5>SKU: ${productData.sku}</h5>

                <p class="textDescription">${productData.description}</p>

                <h5>Ancho de la grapa: 11mm</h5>

                <h5>Largo de la grapa: 6,10 y 14mm</h5>

                <h5>Tipo: Manual</h5>

                <h5><span>Para mayor información contacta a tu ejecutivo.<span></h5>

                <a target="_blank" href="/info" class="btn btn-custom3">Contacto</a>
                <button class="btn addToFavBtn"><i class="far fa-star"></i></button>
            </div>

            <div class="col-lg-6 dos">
                <div class="row">

                <div class="col-lg-3 flecha">
                    <a id="categories-left" href="#">
                        <i class="fas fa-chevron-left fa-2x"></i>
                    </a>
                </div>

                <div class="col-lg-6 product-img-container">
                    <img src="${productData.img}" alt="">
                </div>

                <div class="col-lg-3 flecha">
                    <a id="categories-right" href="#">
                        <i class="fas fa-chevron-right fa-2x"></i>
                    </a>
                </div>

                </div>
            </div>
        </div>
    </div>



    <div class="container">

        <h3 class="title1">Productos relacionados</h3>

        <div class="row" id="connected">

            <div class="col-lg-3">
                <div class="card card-custom">
                    <!-- <button class="btn addToFavBtn"></button> -->
                    <div class="card-body card-body-custom">
                        <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                        <p class="card-text card-product-title">Producto relacionado</p>

                        <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <div class="d-grid gap-2">
                            <a class="btn btn-custom2">Ver más</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3">
                <div class="card card-custom">
                    <!-- <button class="btn addToFavBtn"></button> -->
                    <div class="card-body card-body-custom">
                        <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                        <p class="card-text card-product-title">Producto relacionado</p>

                        <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <div class="d-grid gap-2">
                            <a class="btn btn-custom2">Ver más</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3">
                <div class="card card-custom">
                    <!-- <button class="btn addToFavBtn"></button> -->
                    <div class="card-body card-body-custom">
                        <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                        <p class="card-text card-product-title">Producto relacionado</p>

                        <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <div class="d-grid gap-2">
                            <a class="btn btn-custom2">Ver más</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3">
                <div class="card card-custom">
                    <!-- <button class="btn addToFavBtn"></button> -->
                    <div class="card-body card-body-custom">
                        <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                        <p class="card-text card-product-title">Producto relacionado</p>

                        <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <div class="d-grid gap-2">
                            <a class="btn btn-custom2">Ver más</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
	`

    $('#modal').modal('show')
}