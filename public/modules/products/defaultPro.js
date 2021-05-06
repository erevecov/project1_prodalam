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
                let c = a.data.split("=")
                modalVid = [c[1]]
            }
            document.querySelector('#carrouselModal').innerHTML += modalVid.reduce((acc, el, i) => {
                acc +=`
                <div class="carousel-item">
                    <div class="youtube-player" data-id="${el}"></div>
                </div>
                `
                return acc

            }, '')
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

const handleModal = async (originalProductData, showrels) => {
    let el = originalProductData
    let findProductImg
    let findProductPdf

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
                findProductPdf = '<a id="aPdf" href="'+findProductPdf[0]+'">Descargar ficha técnica</a>'
            } else if (a.data == '') {
                findProductPdf = ''
            } else {
                findProductPdf = '<a id="aPdf" href="'+a.data+'">Descargar ficha técnica</a>'
            }
        }
    });
    // if (!findProductPdf){
        
    // }

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
        info: (findProductInfo),
    }

	const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),

    }

	modalSelector.title.innerHTML = productData.title
	modalSelector.body.innerHTML=`
    <div class="product-modal">
        <div class="row" style="flex-flow: row wrap-reverse;">
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
                <button id="picStar" class="btn addToFavBtn"><i class="far fa-star"></i> Agregar a Favoritos</button>
            </div>

            <div class="col-lg-6 dos">
            <div id="controlsCarrousel" class="carousel slide" data-ride="carousel" data-interval="false">
                <div id="carrouselModal" class="carousel-inner">
                </div>

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

    ${
        (showrels) ? `
            <div class="container">

                <h3 class="title1">Productos relacionados</h3>

                <div class="row" id="connected"></div>

            </div>
        `
        :
        ''
    }
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
    // add class 'fav' to each favorite
    // --------------------console.log("favss", favorites);
    // favorites.forEach(function (favorite) {
    //     document.getElementById(favorite).className = 'favor';
    // });
    // register click event listener

    if (favorites.includes(productData.sku)) {
        // console.log("favorites: ", favorites, "includes: ",favorites.includes(productData.sku));
        $('#picStar').html("<i class=\"fas fa-star\"></i>")
    }


    $('#picStar').on('click', function () {
        if (this.innerHTML.includes("fas")) {
            this.innerHTML = "<i class=\"far fa-star\"></i>"
        } else {
            favorites.push(productData.sku)
            this.innerHTML = "<i class=\"fas fa-star\"></i>"
            localStorage.setItem('favor', JSON.stringify(favorites))
        }

    });

    let cate = {
        category: productData.category
    }

    if (showrels) {
        let relacionPro = await axios.post('api/productsRelated', cate )

        document.querySelector('#connected').innerHTML = relacionPro.data.reduce((acc, el, i) => {

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
//cambiar destacados name
            acc += `
            <div class="col-lg-3 destacados">
            <div class="card card-custom">
                <!-- <button class="btn addToFavBtn"></button> -->
                <div class="card-body card-body-custom">
                    <img src="${productData.img}" alt="" class="card-img-top" alt="producto">
                    <p class="card-text card-product-title">Producto relacionado</p>

                    <p class="card-product-description">${cutText(productData.description, 100)}</p>
                </div>

                <div class="card-footer card-footer-custom">
                    <div class="d-grid gap-2">
                    <a class="btn btn-custom2 viewMore" data-productid="${productData._id}">Ver más</a>
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
                let productData = relacionPro.data.find(elProduct => elProduct._id === el.dataset.productid)

                window.location.href = `products?search=${productData.sku}`
            })
        })
    }

    $('#modal').modal('show')
}