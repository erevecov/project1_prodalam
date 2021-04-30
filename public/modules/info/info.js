let internals = {
    infos: []
}

initInfos()

async function initInfos() {

    loadingHandler('start')

    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')

    let infoApiURL = '/api/infoPaginate'

    if (page) {
        infoApiURL += `?page=${page}`

        if (search) {
            infoApiURL += `&search=${search}`
        }
    } else {
        if (search) {
            infoApiURL += `?search=${search}`
        }
    }

    let infos = await axios.get(infoApiURL)

    console.log(infos)

    internals.infos = infos.data.docs

    let infosUpSelector = document.querySelector('#infos-up')
    let infosDownSelector = document.querySelector('#infos-down')
    let infonumPage = document.querySelector('#numPage')
    let infonumPage0 = document.querySelector('#numPage0')

    if (infos.data.page) {
        infonumPage0.innerHTML= infos.data.page
    }
    if (infos.data.page) {
        infonumPage.innerHTML= infos.data.page
    }
    if (infos.data.prevPage) {
        infosUpSelector.setAttribute('href', `?page=${infos.data.prevPage}`)
    }

    if (infos.data.nextPage) {
        infosDownSelector.setAttribute('href', `?page=${infos.data.nextPage}`)
    }

    document.querySelector('#info-it-container').innerHTML = infos.data.docs.reduce((acc,el,i)=> {
        
        console.log(el.phone.split('/'));
        acc += `
        <div class="card col-md-12 info-card">
            <h4>${el.title}</h4>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span id="dateInfo">${el.address}</span>
                            </li>

                            <li class="list-group-item">
                                <i class="fa fa-phone fa-flip-horizontal" aria-hidden="true"></i>
                                <span id="dateInfo">${el.phone.split('/').reduce((accPhone,elPhone)=>{
                                    accPhone += `<a href="tel:${elPhone}">  ${elPhone}</a>`
                                    return accPhone
                                }, '')}</span>
                            </li>

                            <li class="list-group-item">
                                <i class="fas fa-user-tie"></i>
                                <span id="dateInfo">${el.in_charge}</span>
                            </li>

                            <li class="list-group-item">
                                <i class="fas fa-envelope"></i>
                                <span id="dateInfo"><a style="text-decoration: none;"href="mailto:${el.email}">
                                    ${el.email}
                                    </a>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-6 map">
                        <iframe class="responsive-iframe" src="${el.src}" width="300" height="180" style="border-radius: 30px; border: none;" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                </div>
            </div>
        </div>
        `

        return acc
    }, '')

    loadingHandler('stop')
}
