let internals = {
    stars: []
}
let banners = []

initProducts()
banImg()
// Array.from(querySelectorAll('.viewMore')).forEach(el => {
//     el.addEventListener('click', () => {
//         handleModal()
//     })
// })

window.onresize = () => {
    changeBannerImg()
}

function changeBannerImg() {
    console.log("aaaaaaaaaaaaaaaaaaaaa", banners);
    if (window.innerWidth < '768') {
        document.querySelector('#carrouselId').innerHTML = banners.reduce((acc, el, i) => {
            let isa = ''
            if (i == 0) {
                isa = "active"
            }
            acc +=`
            <div class="carousel-item ${isa}">
                <a href='${el.urlBan}' >
                    <img src="${el.bannerMovil}" class="d-block w-100">
                </a>
            </div>

            `
            return acc
        }, '')
    } else {
        document.querySelector('#carrouselId').innerHTML = banners.reduce((acc, el, i) => {
            let isa = ''
            if (i == 0) {
                isa = "active"
            }

            acc +=`
            <div class="carousel-item ${isa}">
                <a href='${el.urlBan}' >
                    <img src="${el.banner}" class="d-block w-100">
                </a>
            </div>

            `
            return acc
        }, '')
    }










    // Array.from(document.querySelectorAll('.carouselImg')).forEach(el=> {
    //     el.style.height = `${window.innerWidth / 2}px`
        
    // })
// :^) iwi :c =D
    // console.log({
    //     width: window.innerWidth,
    //     height: window.innerHeight
    // })
}

async function banImg() {
    let res = await axios.get('/api/getBanner')
    console.log("ress", res);
    banners = res.data.ok
    if (res.data.ok) {
        // var span = document.createElement('span');

        document.querySelector('#carouselExampleControls').innerHTML = `
            <div id="carrouselId" class="carousel-inner">
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

        // document.querySelector('#carrouselId').innerHTML = `
        // <div class="carousel-item active">
        //     <a href='${banners[0].urlBan}' >
        //         <img src="${banners[0].banner}" class="d-block w-100 carouselImg" alt=" ">
        //     </a>
        // </div>
        // `
        


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
                    <img src="${findProductImg}" alt="" class="card-img-top" alt="producto">
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
