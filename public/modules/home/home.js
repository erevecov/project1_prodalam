let internals = {
    stars: []
}

initProducts()
banImg()
// Array.from(querySelectorAll('.viewMore')).forEach(el => {
//     el.addEventListener('click', () => {
//         handleModal()
//     })
// })

// window.onresize = () => {
//     changeBannerImg()
// }

// function changeBannerImg() {
//     Array.from(document.querySelectorAll('.carouselImg')).forEach(el=> {
//         el.style.height = `${window.innerWidth / 2}px`
//     })

//     console.log({
//         width: window.innerWidth, 
//         height: window.innerHeight
//     })
// }

async function banImg() {
    let res = await axios.get('/api/getBanner')
    if (res.data.ok) {
        // var span = document.createElement('span');

        document.querySelector('#carouselExampleControls').innerHTML = `
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <a href="" >
                        <img src="${res.data.ok[0]}" class="d-block w-100 carouselImg" alt=" ">
                    </a>
                </div>
            </div>

            <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        `
        // ['<img class="thumb" src="', res.data.ok[0], '" title=" photo"/>'].join('');

        // $('#list').html(span)

        changeBannerImg()
    } else {

        toastr.warning("sin banner")
    }
}

async function initProducts() {
    loadingHandler('start')

    let arrayStar = []

    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')

    let starApiURL = 'api/productsStarFiltered'

    if (page) {
        starApiURL += `?page=${page}`

        if (search) {
            starApiURL += `&search=${search}`
        }
    } else {
        if (search) {
            starApiURL += `?search=${search}`
        }
    }

    // console.log(starApiURL)

    let stars = await axios.get(starApiURL)

    arrayStar.push(stars)

    // console.log('products', stars)

    internals.stars = stars.data

    // let productsUpSelector = document.querySelector('#products-up')
    // let productsDownSelector = document.querySelector('#products-down')
    // let infonumPage = document.querySelector('#numPage')
    // let infonumPage0 = document.querySelector('#numPage0')


    // if (products.data.page) {
    //     infonumPage.innerHTML= products.data.page
    //     infonumPage0.innerHTML= products.data.page
    // }
    // if (products.data.prevPage) {
    //     let prevPageURL = `?page=${products.data.prevPage}`

    //     if (search) {
    //         prevPageURL += `&search=${search}`
    //     }

    //     productsUpSelector.setAttribute('href', prevPageURL)
    // }

    // if (products.data.nextPage) {
    //     let nextPageURL = `?page=${products.data.nextPage}`

    //     if (search) {
    //         nextPageURL += `&search=${search}`
    //     }

    //     productsDownSelector.setAttribute('href', nextPageURL)
    // }

    document.querySelector('#featuredProducts').innerHTML = stars.data.reduce((acc, el, i) => {

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
        <div class="col-md-3 destacados">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="${productData.img}" alt="" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Destacado del mes</p>

                    <p class="card-product-description">${cutText(productData.description, 100)}</p>
                </div>

                <div class="card-footer card-footer-custom">
                    <div class="d-grid gap-2">
                    <a class="btn btn-custom viewMore" data-productid="${productData._id}">Ver más</a>
                    </div>
                </div>
            </div>
            <br>
        </div>
        `

        return acc
    }, '')

    Array.from(querySelectorAll('.viewMore')).forEach(el => {
        el.addEventListener('click', () => {
            let productData = internals.stars.find(elProduct => elProduct._id === el.dataset.productid)

            handleModal(productData)
        })
    })

    loadingHandler('stop')
}
