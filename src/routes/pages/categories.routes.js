export default {
    method: ['GET'],
    path: '/categories',
    options: {
        handler: (request, h) => {

            return h.view('categories', { pageSelectedCategories: true })
        }
    }
}