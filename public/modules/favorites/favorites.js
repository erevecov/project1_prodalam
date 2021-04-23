let internals = {
    products: []
}

initProducts()

Array.from(querySelectorAll('.viewMore')).forEach(el => {
    el.addEventListener('click', () => {
        handleModal()
    })
})

async function initProducts() {
    loadingHandler('start')

    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')
    const cate = urlParams.searchParams.get('category')

    let productApiURL = 'api/productsPaginate'

    if (page) {
        productApiURL += `?page=${page}`

        if (cate) {
            productApiURL += `&category=${cate}`
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
    }

    // console.log(productApiURL)

    let products = await axios.get(productApiURL)

    // console.log('products', products)

    internals.products = products.data.docs

    let productsUpSelector = document.querySelector('#star-up')
    let productsDownSelector = document.querySelector('#star-down')



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

    document.querySelector('#product-star-container').innerHTML = products.data.docs.reduce((acc,el,i)=> {

        let findProductImg

        el.info.forEach(a => {
            if (a.name == "Imagen") {
                findProductImg = a.data
            }
        });

        let findProductTitle = el.title
        let findProductDescription = el.description
        let findProductInfo = el.info


        let productData = {
            _id: el._id,
            title: (findProductTitle) ? findProductTitle : 'SIN TÍTULO',
            sku: el.sku,
            description: (findProductDescription) ? findProductDescription : 'SIN DESCRIPCIÓN',
            img: (findProductImg) ? findProductImg : '/public/img/NOFOTO_PRODALAM.jpg',
            info: (findProductInfo)
        }

        acc += `
        <div class="col-md-6 product-item-container">
            <div class="product-item">
                <div class="row" style="padding-top: 15px;">
                    <div class="col-7">
                        <h2>${cutText(productData.title, 23)}</h2>

                        <h5>SKU: ${productData.sku}</h5>

                        <p class="text-product">${cutText(productData.description, 70)}</p>

                    </div>

                    <div class="col-5 product-img-container" style="padding-top: 30px;">
                        <img src="${productData.img}" alt="">
                    </div>
                    <div class="col-12" style="padding-bottom: 10px;">
                    <a class="btn btn-custom viewMore" data-productid="${productData._id}">Ver más</a>
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


// ------------------------------------------------------------------------


const handleModal = (originalProductData) => {
    let el = originalProductData
    let findProductImg

    console.log(el)
    el.info.forEach(a => {
        if (a.name == "Imagen") {
            findProductImg = a.data
        }
    });


    let findProductTitle = el.title
    let findProductDescription = el.description
    let findProductInfo = el.info

    let productData = {
        _id: el._id,
        title: (findProductTitle) ? findProductTitle : 'SIN TÍTULO',
        sku: el.sku,
        description: (findProductDescription) ? findProductDescription : 'SIN DESCRIPCIÓN',
        img: (findProductImg) ? findProductImg : '/public/img/NOFOTO_PRODALAM.jpg',
        info: (findProductInfo)
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

                <div class="table-responsive">
                    <table class="table">
                        <tbody id="product-info-container"></tbody>
                    </table>
                </div>

                <h5><span class="spanUno">Para mayor información contacta a tu ejecutivo.<span></h5>

                <a target="_blank" href="/info" class="btn btn-custom3">Contacto</a>
                <button id="picStar" class="btn addToFavBtn"><i class="far fa-star"></i></button>
            </div>

            <div class="col-lg-6 dos">
                <div class="row">

                <div class="col-lg-1 flecha">

                </div>

                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 product-img-modal">
                    <img src="${productData.img}" alt="">
                </div>

                <div class="col-lg-1 flecha">

                </div>

                </div>
            </div>
        </div>
    </div>
	`

    let productInfo = ''

    // console.log(el)

    el.info.forEach(elInfoKey=> {
        // console.log(el.info[0][elInfoKey])
        // console.log("a",elInfoKey)

        if (elInfoKey.name === 'Imagen') {
        } else if (elInfoKey.name === 'Título SAP') {
        } else {
            productInfo += `
                <tr>
                    <td>${elInfoKey.name}:</td>
                    <td>${elInfoKey.data}</td>
                </tr>
            `
        }
    })

    document.querySelector('#product-info-container').innerHTML = productInfo

    let favorites = JSON.parse(localStorage.getItem('favas')) || [];
    // add class 'fav' to each favorite
    // --------------------console.log("favss", favorites);
    // favorites.forEach(function (favorite) {
    //     document.getElementById(favorite).className = 'favas';
    // });
    // register click event listener

    if (favorites.includes(productData.sku)) {
        // console.log("favorites: ", favorites, "includes: ",favorites.includes(productData.sku));
        $('#picStar').html("<i class=\"fas fa-star\"></i>")
    }


    $('#picStar').on('click', function () {
        let pic
        // console.log("asdsadsa", productData.sku);
        if (this.innerHTML.includes("fas")) {
            this.innerHTML = "<i class=\"far fa-star\"></i>"
        } else {
            favorites.push(productData.sku)
            this.innerHTML = "<i class=\"fas fa-star\"></i>"
            localStorage.setItem('favas', JSON.stringify(favorites))
        }

    });

    $('#modal').modal('show')
}