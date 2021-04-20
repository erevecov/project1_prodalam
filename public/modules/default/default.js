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

const storageStar = document.querySelector('.addToFavorite')
const showStar = document.querySelector()


// let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// // add class 'fav' to each favorite
// favorites.forEach(function (favorite) {
//     document.getElementById(favorite).className = 'fav';
// });
// // register click event listener
// document.querySelector('.addToFavBtn').addEventListener('click', function (e) {
//     let id = e.target.id,
//         item = e.target,
//         index = favorites.indexOf(id);
//     // return if target doesn't have an id (shouldn't happen)
//     if (!id) return;
//     // item is not favorite
//     if (index == -1) {
//         favorites.push(id);
//         item.className = 'fav';
//         // item is already favorite
//     } else {
//         favorites.splice(index, 1);
//         item.className = '';
//     }
//     // store array in local storage
//     localStorage.setItem('favorites', JSON.stringify(favorites));
// });