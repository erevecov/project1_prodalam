let internal = {
    menuCat: []
}

initMenu()


function loadingHandler(status) {
    let loadingSelector = querySelector('#loadingScreen')

    if (!status != status === 'stop') {
        loadingSelector.style.display = 'none'
    } else if (status === 'start') {
        loadingSelector.style.display = 'flex'
        loadingSelector.style.position = 'fixed'
    } else {
        loadingSelector.style.display = 'none'
    }
}

// nav-link1

async function initMenu() {
    loadingHandler('start')

    let arrayMenu = []

    const queryString = window.location.href
    const urlParams = new URL(queryString)
    const page = urlParams.searchParams.get('page')
    const search = urlParams.searchParams.get('search')


    let categories = await axios.get('/api/subCategories')

    document.querySelector('#categoriesDropdown1').innerHTML += categories.data.reduce((acc,el,i) => {

        acc += `
        <li class="dropdown-submenu dropright" style="width: max-content;">
            <a id="dropdownMenuSub-${i}" href="#" role="button" data-toggle="dropdown" aria-haspopup="menu" aria-expanded="false" class="dropdown-item dropdown-toggle">${el.parent}</a>

            <ul aria-labelledby="dropdownMenuSub-${i}" class="dropdown-menu shadow">
                ${
                    el.sub.reduce((accSub,elSub,iSub) => {
                        accSub += `
                            <li>
                                <a tabindex="-1" href="/products?subCategory=${elSub}" class="dropdown-item">${elSub}</a>
                            </li>
                        `

                        return accSub
                    }, '')
                }
            </ul>
        </li>
        `

        return acc
    }, '')

    let dropPressed = ''

    $("ul.dropdown-menu [data-toggle='dropdown']").on("mouseover", function(event) {
        event.preventDefault();
        event.stopPropagation();

        $(this).siblings().toggleClass("show");
        
        // Array.from(querySelectorAll('.viewMore')).forEach(el => {
        // Array.from(document.querySelectorAll('.dropdown-menu a')).forEach(function(element){
        //     // console.log('aeaeae',element.attributes,);
            
        //   })
        //   element.addEventListener('click', function (e) {
            
            if (dropPressed !== '') {
                if ($(dropPressed).hasClass('show')) {
                    if (dropPressed !== this.nextElementSibling) {
                        $(dropPressed).removeClass("show");
                    }
                }
            }
            dropPressed = this.nextElementSibling

            
        //         $(this).parents('li.dropdown-menu.show').on('hidden.bs.dropdown', function(e) {
        //         $('.dropdown-submenu .show').removeClass("show");
        //         });
            // if(nextEl && nextEl.classList.contains('show')) {
            //   // prevent opening link if link needs to open dropdown
            //   e.preventDefault();
            //   if(nextEl.style.display == 'block'){
            //     nextEl.style.display = 'none';
            //   } else {
            //     nextEl.style.display = 'block';
            //   }
    
            // }
        // });
        

    });

    // console.log(categories, subCategories)


    // let sub = '/api/subCategories'

    // if (page) {
    //     sub += `?page=${page}`

    //     if (search) {
    //         sub += `&search=${search}`
    //     }
    // } else {
    //     if (search) {
    //         sub += `?search=${search}`
    //     }
    // }


    // let stars = await axios.get(starApiURL)

    // arrayMenu.push(menuCat)

    // console.log('products', stars)

    // internals.menuCat = menuCat.data

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

    // document.querySelector('#nav-link1').innerHTML = menuCat.data.reduce((acc, el, i) => {

    //     // let findProductImg

    //     // el.info.forEach(a => {
    //     //     if (a.name == "Imagen") {
    //     //         findProductImg = a.data
    //     //     }
    //     // });

    //     // let findProductTitle = el.title
    //     // let findProductDescription = el.description
    //     // let findProductInfo = el.info


    //     let menuData = {
    //         _id: el._id,
    //     }

    //     acc += `
    //                     <div class="dropdown-menu">
    //                     <a class="dropdown-item" href="#">Action</a>
    //                     <div class="dropdown-divider"></div>
    //                     <a class="dropdown-item" href="#">Another action</a>
    //                     <div class="dropdown-divider"></div>
    //                     <a class="dropdown-item" href="#">Something else here</a>
    //                     <div class="dropdown-divider"></div>
    //                     <a class="dropdown-item" href="#">Separated link</a>
    //                     </div>
    //     `

    //     return acc
    // }, '')

    Array.from(querySelectorAll('.viewMore')).forEach(el => {
        el.addEventListener('click', () => {
            let productData = internal.menuCat.find(elProduct => elProduct._id === el.dataset.productid)

            handleModal(productData)
        })
    })

    loadingHandler('stop')
}
