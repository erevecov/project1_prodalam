Array.from(querySelectorAll('.viewMore')).forEach(el => {
    console.log('array');
    el.addEventListener('click', () => {
        console.log('listener');
        handleModal()
        console.log('modal');
    })
})

Array.from(document.querySelectorAll('.card-custom')).forEach(el=> {
    el.addEventListener('mouseover', function() {
        this.style.border = '1px solid #7f8c8d'
    })

    el.addEventListener('mouseout', function() {
        this.style.border = 'none'
    })
})
console.log('fuera array');


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
    <div class="product-item">
        <div class="row">
            <div class="col-7">
                <h2>Grapadora Manual Bostitch PC4000 Cable para grapas de 6, 10 y 14mm Caja con 12un</h2>

                <h5 class="sku">SKU: 57651-CA</h5>

                <p class="textDescription">Grapadora manual marca Bostitch modelo PC4000 que usa grapas 5019 de 6mm, 10mm y 14mm. Estructura 100% metálica y sistema anti-atasco de corchetes. Caja de 12 unidades.</p>

                <h5>Ancho de la grapa: 11mm</h5>
                
                <h5>Largo de la grapa: 6,10 y 14mm</h5>
                
                <h5>Tipo: Manual</h5>
                
                <a href="/info" class="btn btn-custom">Contacto</a>
            </div>

            <div class="col-5 product-img-container">
                
            </div>

            <div class="col-5">
                <a id="categories-up" href="#">
                    <i class="fas fa-chevron-up fa-2x"></i>
                </a>
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
	modalSelector.footer.innerHTML=`
	
	`

    $('#modal').modal('show')
}
