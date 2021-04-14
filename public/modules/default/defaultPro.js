Array.from(querySelectorAll('.viewMore')).forEach(el => {
    el.addEventListener('click', () => {
        handleModal()
    })
})


const handleModal = () => {
   
	const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

	modalSelector.title.innerHTML=`
		Producto
	`
	modalSelector.body.innerHTML=`
    <div class="product-modal">
        <div class="row">
            <div class="col-md-6 uno">
                <h2>Grapadora Manual Bostitch PC4000 Cable para grapas de 6, 10 y 14mm Caja con 12un</h2>

                <h5>SKU: 57651-CA</h5>

                <p class="textDescription">Grapadora manual marca Bostitch modelo PC4000 que usa grapas 5019 de 6mm, 10mm y 14mm. Estructura 100% metálica y sistema anti-atasco de corchetes. Caja de 12 unidades.</p>

                <h5>Ancho de la grapa: 11mm</h5>
                
                <h5>Largo de la grapa: 6,10 y 14mm</h5>
                
                <h5>Tipo: Manual</h5>

                <h5>Para mayor información contacta a tu ejecutivo.</h5>
                
                <a href="/info" class="btn btn-custom contactBtn">Contacto</a>
            </div>

            <div class="col-md-6">
                <div class="row">

                <div class="col-2">
                    <a id="categories-left" href="#">
                        <i class="fas fa-chevron-left fa-2x"></i>
                    </a>
                </div>

                <div class="col-8 product-img-container">
                    <img src="/public/products-imgs/76355_1.jpg" class="img-fluid" alt="Responsive image" width="300" height="300">
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