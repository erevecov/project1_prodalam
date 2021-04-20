export default {
    method: ['GET'],
    path: '/favorites',
    options: {
        auth: false,
        handler: (request, h) => {

            return h.view('favorites', { pageSelectedFav: true })
        }
    }
}