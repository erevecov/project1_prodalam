
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



    <div class="container">

        <h3 class="title1">Productos relacionados</h3>

        <div class="row" id="connected">

            <div class="col-lg-3">
                <div class="card card-custom">
                    <!-- <button class="btn addToFavBtn"></button> -->
                    <div class="card-body card-body-custom1"
                    style="text-align: center !important;
                    color: var(--grey1);
                    background-color: #f8f8f8;">
                        <img src="${productData.img}" class="card-img-top" alt="producto">
                        <p class="card-text card-product-title">Producto relacionado</p>

                        <p class="card-product-description">${cutText(productData.description, 100)}</p>
                        <div class="d-grid gap-2">
                            <a class="btn btn-custom2" style="    color: var(--grey1);
                            border: 1px solid var(--grey1);
                            border-radius: 20px;
                            font-size: 18px;
                            padding-top: 2px;
                            padding-bottom: 2px;
                            padding-right: 15px;
                            padding-left: 15px;"
                             data-productid="${productData._id}">Ver más</a>
                        </div>
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

    $('#modal').modal('show')
}