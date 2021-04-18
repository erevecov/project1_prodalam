const search = document.querySelector('#navbar-search-input');
const btn = document.querySelector('searchBtn');

const filterSearch = () =>{
    const text = search.nodeValue.toLowerCase();


}

btn.addEventListener('click', filterSearch)