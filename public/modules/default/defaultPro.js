let internals = {
    products: []
}

initProducts()

async function initProducts() {
    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')

    let productApiURL = 'api/productsPaginate'

    if (page) {
        productApiURL += `?page=${page}`
    }

    if (search) {
        productApiURL += `&search=${search}`
    }

    let products = await axios.get(productApiURL)

    console.log(products)

    internals.products = products.data.docs

    let productsUpSelector = document.querySelector('#products-up')
    let productsDownSelector = document.querySelector('#products-down')

    if (products.data.prevPage) {
        productsUpSelector.setAttribute('href', `?page=${products.data.prevPage}`)
    }

    if (products.data.nextPage) {
        productsDownSelector.setAttribute('href', `?page=${products.data.nextPage}`)
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
                        <h2>${cutText(productData.title, 30)}</h2>

                        <h5>SKU: ${productData.sku}</h5>

                        <p class="text-product">${cutText(productData.description, 150)}</p>

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
            <div class="col-md-6 uno">
                <h2>${productData.title}</h2>

                <h5>SKU: ${productData.sku}</h5>

                <p class="textDescription">${productData.description}</p>

                <h5>Ancho de la grapa: 11mm</h5>
                
                <h5>Largo de la grapa: 6,10 y 14mm</h5>
                
                <h5>Tipo: Manual</h5>

                <h5>Para mayor información contacta a tu ejecutivo.</h5>
                
                <a target="_blank" href="/info" class="btn btn-custom contactBtn">Contacto</a>
            </div>

            <div class="col-md-6">
                <div class="row">

                <div class="col-2">
                    <a id="categories-left" href="#">
                        <i class="fas fa-chevron-left fa-2x"></i>
                    </a>
                </div>

                <div class="col-8 product-img-container">
                    <img src="${productData.img}" alt="Responsive image">
                </div>

                <div class="col-2">
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
        <div class="col-md-2"></div>
        <div class="col-md-2">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Producto relacionado</p>

                    <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <div class="d-grid gap-2">
                        <a class="btn btn-custom">Ver más</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Producto relacionado</p>

                    <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <div class="d-grid gap-2">
                        <a class="btn btn-custom">Ver más</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Producto relacionado</p>

                    <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <div class="d-grid gap-2">
                        <a class="btn btn-custom">Ver más</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Producto relacionado</p>

                    <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <div class="d-grid gap-2">
                        <a class="btn btn-custom">Ver más</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-2"></div>
    </div>
</div>


	`

    $('#modal').modal('show')
}