export default {
    method: ['GET'],
    path: '/admin',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials

            return h.view('admin', {credentials}, { layout: 'admin-layout' })
        }
    }
}