let categoryApiURL = 'api/category'

    if (page) {
        categoryApiURL += `?page=${page}`

        if (search) {
            categoryApiURL += `&search=${search}`
        }
    } else {
        if (search) {
            categoryApiURL += `?search=${search}`
        }
    }

    console.log(categoryApiURL)

    let categorys = await axios.get(categoryApiURL)

    console.log(categorys)

    internals.categorys = categorys.data.docs


    let catNumPage = document.querySelector('#numPage')
    let catNumPage0 = document.querySelector('#numPage0')

    if (infos.data.page) {
        catNumPage0.innerHTML= categorys.data.page
    }
    if (infos.data.page) {
        catNumPage.innerHTML= categorys.data.page
    }