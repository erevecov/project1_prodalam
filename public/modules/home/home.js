let internals = {
    stars: []
}

initProducts()

// Array.from(querySelectorAll('.viewMore')).forEach(el => {
//     el.addEventListener('click', () => {
//         handleModal()
//     })
// })

async function initProducts() {
    loadingHandler('start')

    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')

    let starApiURL = 'api/productsStar'

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

    document.querySelector('#featuredProducts').innerHTML = stars.data.reduce((acc,el,i)=> {

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
            img: (findProductImg) ? findProductImg : '/public/img/noimg.jpeg',
            info: (findProductInfo)
        }

        acc += `
        <div class="col-md-3 destacados">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="${productData.img}" alt="" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Destacado de la semana</p>

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
            let productData = internals.stars.find(elProduct=>elProduct._id === el.dataset.productid)

            handleModal(productData)
        })
    })

    loadingHandler('stop')
}

// Array.from(document.querySelectorAll('.card-custom')).forEach(el=> {
//     // el.addEventListener('mouseover', function() {
//     //     this.style.border = '1px solid #7f8c8d'
//     // })

//     el.addEventListener('mouseout', function() {
//         this.style.border = 'none'
//     })
// })



// const handleModal = () => {

// 	const modalSelector = {
//         title: document.querySelector('#modal_title'),
//         body: document.querySelector('#modal_body'),
//         footer: document.querySelector('#modal_footer'),
//     }

// 	modalSelector.title.innerHTML=`
// 		Producto
// 	`

// 	modalSelector.body.innerHTML=`
//     <div class="product-modal">
//         <div class="row">
//             <div class="col-lg-6 uno">
//                 <h2>Grapadora Manual Bostitch PC4000 Cable para grapas de 6, 10 y 14mm Caja con 12un</h2>

//                 <h5>SKU: 57651-CA</h5>

//                 <p class="textDescription">Grapadora manual marca Bostitch modelo PC4000 que usa grapas 5019 de 6mm, 10mm y 14mm. Estructura 100% metálica y sistema anti-atasco de corchetes. Caja de 12 unidades.</p>

//                 <h5>Ancho de la grapa: 11mm</h5>

//                 <h5>Largo de la grapa: 6,10 y 14mm</h5>

//                 <h5>Tipo: Manual</h5>

//                 <h5><span class="spanUno">Para mayor información contacta a tu ejecutivo.<span></h5>

//                 <a href="/info" class="btn btn-custom3">Contacto</a>
//                 <button class="btn addToFavBtn"><i class="far fa-star"></i></button>
//             </div>

//             <div class="col-lg-6 dos">
//                 <div class="row">

//                 <div class="col-2">
//                     <a id="categories-left" href="#">
//                         <i class="fas fa-chevron-left fa-2x"></i>
//                     </a>
//                 </div>

//                 <div class="col-8 product-img-container">
//                     <img src="/public/img/noimg.jpeg" class="img-fluid">
//                 </div>

//                 <div class="col-2">
//                     <a id="categories-right" href="#">
//                         <i class="fas fa-chevron-right fa-2x"></i>
//                     </a>
//                 </div>

//                 </div>
//             </div>
//         </div>
//     </div>


//     <div class="container">

//         <h3 class="title1">Productos relacionados</h3>

//         <div class="row" id="connected">

//             <div class="col-lg-3">
//                 <div class="card card-custom">
//                     <!-- <button class="btn addToFavBtn"></button> -->
//                     <div class="card-body card-body-custom">
//                         <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
//                         <p class="card-text card-product-title">Producto relacionado</p>

//                         <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//                         <div class="d-grid gap-2">
//                             <a class="btn btn-custom2">Ver más</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-lg-3">
//                 <div class="card card-custom">
//                     <!-- <button class="btn addToFavBtn"></button> -->
//                     <div class="card-body card-body-custom">
//                         <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
//                         <p class="card-text card-product-title">Producto relacionado</p>

//                         <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//                         <div class="d-grid gap-2">
//                             <a class="btn btn-custom2">Ver más</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-lg-3">
//                 <div class="card card-custom">
//                     <!-- <button class="btn addToFavBtn"></button> -->
//                     <div class="card-body card-body-custom">
//                         <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
//                         <p class="card-text card-product-title">Producto relacionado</p>

//                         <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//                         <div class="d-grid gap-2">
//                             <a class="btn btn-custom2">Ver más</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-lg-3">
//                 <div class="card card-custom">
//                     <!-- <button class="btn addToFavBtn"></button> -->
//                     <div class="card-body card-body-custom">
//                         <img src="/public/img/tornillo1.png" class="card-img-top" alt="producto">
//                         <p class="card-text card-product-title">Producto relacionado</p>

//                         <p class="card-product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//                         <div class="d-grid gap-2">
//                             <a class="btn btn-custom2">Ver más</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>

// 	`
//     $('#modal').modal('show')
// }
