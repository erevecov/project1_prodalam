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

    let productApiURL = 'api/productsPaginateFav'

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

    // console.log(productApiURL)
    let itemStar = JSON.parse(localStorage.getItem("favor"))

    if (itemStar == null || itemStar.length == 0) {
        document.querySelector('#product-star-container').innerHTML = `
        <br>

        <div class="col-md-3"></div>
        <div class="col-md-6" style="
            flex: 0 0 50%;
            max-width: 50%;
            padding-top: 167px;
            padding-bottom: 180px;
        "><h2>Sin Productos seleccionados</h2></div>
        <div class="col-md-3"></div>
        <div class="col-md-12"></div>
        <br>
        `
        loadingHandler('stop')
    } else {
        let products = await axios.post(productApiURL, itemStar)
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
                    <div class="row" style="padding-top: 25px; padding-bottom: 15px;">
                    <div class="col-sm-7">
                    <h2>${cutText(productData.title, 23)}</h2>

                    <h5>SKU: ${productData.sku}</h5>

                    <p class="text-product">${cutText(productData.description, 70)}</p>
                    <div  style="padding-bottom: 10px;">
                    <a class="btn btn-custom viewMore" data-productid="${productData._id}">Ver más</a>
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

                handleModal(productData)
            })
        })

        loadingHandler('stop')
    }
}

function changeImg(productData) {
    let modalImg
    let modalVid

    productData.info.forEach(a => {
        if (a.name == "Imagen") {
            if (a.data.includes(",")) {
                modalImg = a.data.split(",")
            } else {
                modalImg = [a.data]
            }
        }
    });
    if (!modalImg) {
        modalImg = ['/public/img/NOFOTO_PRODALAM.jpg']
    }
    document.querySelector('#carrouselModal').innerHTML = modalImg.reduce((acc, el, i) => {
        let isa = ''
        if (i == 0) {
            isa = "active"
        }
        acc +=`
        <div class="carousel-item ${isa}">
            <a href='#' >
                <img src="${el}" class="d-block w-100">
            </a>
        </div>
        `
        return acc
    }, '')

    productData.info.forEach(a => {
        if (a.name == "video") {
            if (a.data.includes(",")) {
                modalVid = a.data.split(",")
                let b = []
                modalVid.forEach(ey=> {
                    let c = ey.split("=")
                    b.push(c[1])
                })
                modalVid = b
            } else {
                if (a.data !== ''){
                    let c = a.data.split("=")
                    modalVid = [c[1]]
                }
            }
            if (a.data !== ''){
                document.querySelector('#carrouselModal').innerHTML += modalVid.reduce((acc, el, i) => {
                    acc +=`
                    <div class="carousel-item">
                        <div class="youtube-player" data-id="${el}"></div>
                    </div>
                    `
                    return acc

                }, '')
            }
        }
    });

    initYouTubeVideos()
    function labnolIframe(div) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute(
            'src',
            'https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0&controls=0'
        );
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '1');
        iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        );
        div.parentNode.replaceChild(iframe, div);
    }
    
    function initYouTubeVideos() {
    var playerElements = document.getElementsByClassName('youtube-player');
        for (var n = 0; n < playerElements.length; n++) {
            var videoId = playerElements[n].dataset.id;
            var div = document.createElement('div');
            div.setAttribute('data-id', videoId);
            var thumbNode = document.createElement('img');
            thumbNode.src = '//i.ytimg.com/vi/ID/hqdefault.jpg'.replace(
            'ID',
            videoId
            );
            div.appendChild(thumbNode);
            var playButton = document.createElement('div');
            playButton.setAttribute('class', 'play');
            div.appendChild(playButton);
            div.onclick = function () {
            labnolIframe(this);
            };
            playerElements[n].appendChild(div);
        }
    }
}


const handleModal = (originalProductData) => {
    let el = originalProductData
    let findProductImg
    let findProductPdf = ''

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
    el.info.forEach(a => {
        if (a.name == "pdf") {
            if (a.data.includes(",")) {
                findProductPdf = a.data.split(",")
                findProductPdf = '<a class="aPdf" href="'+findProductPdf[0]+'">Descargar ficha técnica</a>'
            } else if (a.data == '') {
                findProductPdf = ''
            } else {
                findProductPdf = '<a class="aPdf" href="'+a.data+'">Descargar ficha técnica</a>'
            }
        }
    });

    let findProductTitle = el.title
    let findProductDescription = el.description
    let findProductInfo = el.info

    let productData = {
        _id: el._id,
        title: (findProductTitle) ? findProductTitle : 'SIN TÍTULO',
        category: el.category,
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
                ${findProductPdf}
                <h5><span class="spanUno">Para mayor información contacta a tu ejecutivo.<span></h5>

                <a target="_blank" href="/info" class="btn btn-custom3">Contacto</a>
                <button style="font-family: SFProDisplay-Light !important;" id="picStar" class="btn addToFavBtn"><i class="far fa-star"></i> </button>
            </div>

            <div class="col-lg-6 dos">
                <div id="controlsCarrousel" class="carousel slide" data-ride="carousel" data-interval="false">
                    <div id="carrouselModal" class="carousel-inner"></div>

                    <a class="carousel-control-prev" id="products-left" href="#controlsCarrousel" role="button" data-slide="prev">
                        <i class="fas fa-chevron-left fa-2x"></i>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" id="products-right" href="#controlsCarrousel" role="button" data-slide="next">
                        <i class="fas fa-chevron-right fa-2x"></i>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
	`
    changeImg(productData)
    let productInfo = ''

    // console.log(el)

    el.info.forEach(elInfoKey=> {
        // console.log(el.info[0][elInfoKey])
        // console.log("a",elInfoKey)

        if (elInfoKey.name === 'Imagen') {
        } else if (elInfoKey.name === 'Título SAP') {
        } else if (elInfoKey.name === 'video') {
        } else if (elInfoKey.name === 'pdf') {
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

    let favorites = JSON.parse(localStorage.getItem('favor')) || [];
    if (favorites.includes(productData.sku)) {
        $('#picStar').html("<i class=\"fas fa-star\"> Eliminar de Favoritos</i>")
    }


    $('#picStar').on('click', function () {
        if (this.innerHTML.includes("fas")) {
            this.innerHTML = "<i class=\"far fa-star\"> Agregar a Favoritos</i>"
            favorites = favorites.filter(e => e !== productData.sku);
            localStorage.setItem('favor', JSON.stringify(favorites))
            initProducts()
        } else {
            favorites.push(productData.sku)
            this.innerHTML = "<i class=\"fas fa-star\"> Eliminar de Favoritos</i>"
            localStorage.setItem('favor', JSON.stringify(favorites))
            initProducts()
        }
    });

    $('#modal').modal('show')
}