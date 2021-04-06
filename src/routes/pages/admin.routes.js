export default {
    method: ['GET'],
    path: '/admin',
    options: {
        handler: (request, h) => {
            return h.view('admin')
        }
    }
}