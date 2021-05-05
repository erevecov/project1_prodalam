function changeImg(productData) {


        document.querySelector('#carrouselId').innerHTML = productData.img.reduce((acc, el, i) => {
            let isa = ''
            if (i == 0) {
                isa = "active"
            }
            acc +=`
            <div class="carousel-item ${isa}">
                <a href='' >
                    <img src="${productData.img}" class="d-block w-100">
                </a>
            </div>
            `
            return acc
        }, '')
}

const handleModal = async (originalProductData,showrels) => {
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

                <h5><span class="spanUno">Para mayor información contacta a tu ejecutivo.<span></h5>

                <a target="_blank" href="/info" class="btn btn-custom3">Contacto</a>
                <button id="picStar" class="btn addToFavBtn"><i class="far fa-star"></i> Agregar a Favoritos</button>
            </div>

            <div class="col-lg-6 dos">
            <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                <div id="carrouselId" class="carousel-inner">
                </div>

                <a class="carousel-control-prev" id="products-left" href="#carouselExampleControls" role="button" data-slide="prev">
                        <i class="fas fa-chevron-left fa-2x"></i>
                <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" id="products-right" href="#carouselExampleControls" role="button" data-slide="next">
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
        let pic
        // console.log("asdsadsa", productData.sku);
        if (this.innerHTML.includes("fas")) {
            this.innerHTML = "<i class=\"far fa-star\"></i>"
        } else {
            // let favo = {
            //     sku: productData.sku
            // }

            favorites.push(productData.sku)
            this.innerHTML = "<i class=\"fas fa-star\"></i>"
            localStorage.setItem('favor', JSON.stringify(favorites))
        }

    });
// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    let cate = {
        category: productData.category
    }

    if (showrels) {
        let relacionPro = await axios.post('api/productsRelated', cate )

        document.querySelector('#connected').innerHTML = relacionPro.data.reduce((acc, el, i) => {

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
    // else {

    // }

    $('#modal').modal('show')
}