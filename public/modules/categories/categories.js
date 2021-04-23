let internals = {
    categorys: []
}

initCategory()

async function initCategory() {
    loadingHandler('start')

    // let categoryApiURL = 'api/productsPaginate'

    // const queryString = window.location.href
    // const urlParams = new URL(queryString)
    // const page = urlParams.searchParams.get('page')
    // const search = urlParams.searchParams.get('search')
    // const cate = urlParams.searchParams.get('category')

    // if (page) {
    //     categoryApiURL += `?page=${page}`

    //     if (cate) {
    //         categoryApiURL += `&category=${cate}`
    //     }
    //     if (search) {
    //         categoryApiURL += `&search=${search}`
    //     }
    // } else {
    //     if (search) {
    //         categoryApiURL += `?search=${search}`
    //     }
    //     if (cate) {
    //         categoryApiURL += `?category=${cate}`
    //     }
    // }

    // // console.log(categoryApiURL)

    // let categorys = await axios.get(categoryApiURL)

    let categoryList = await axios.get('api/categories')

    // console.log(categorys)

    // internals.categorys = categorys.data.docs

    // let categorysUpSelector = document.querySelector('#categories-up')
    // let categorysDownSelector = document.querySelector('#categories-down')
    // let catNumPage = document.querySelector('#numPage')
    // let catNumPage0 = document.querySelector('#numPage0')

    // if (categorys.data.page) {
    //     catNumPage0.innerHTML= categorys.data.page
    //     catNumPage.innerHTML= categorys.data.page
    // }

    // if (categorys.data.prevPage) {
    //     let prevPageURL = `?page=${categorys.data.prevPage}`

    //     if (search) {
    //         prevPageURL += `&search=${search}`
    //     }

    //     categorysUpSelector.setAttribute('href', prevPageURL)
    // }

    // if (categorys.data.nextPage) {
    //     let nextPageURL = `?page=${categorys.data.nextPage}`

    //     if (search) {
    //         nextPageURL += `&search=${search}`
    //     }

    //     categorysDownSelector.setAttribute('href', nextPageURL)
//     // }
// console.log("aaaaaaaaaaa",categoryList);
    document.querySelector('#categories-it-container').innerHTML = categoryList.data[0].cats.reduce((acc,el,i)=> {

        acc += `
        <div class="col-md-6 category-item-container">
        <a href="/products?category=${el}">
            <div class="category-item" style="background-image: url('/public/modules/categories/imgCat/${el.replace(',','')}.jpg');">

                <h2>${el}</h2>
            </div>
        </a>
        </div>
        `

        return acc

    }, '')

    loadingHandler('stop')
}