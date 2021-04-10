export default {
    method: ['GET'],
    path: '/categories',
    options: {
        auth: false,
        handler: (request, h) => {

            return h.view('categories', { pageSelectedCategories: true })
        }
    }
}