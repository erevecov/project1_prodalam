export default {
    method: ['GET'],
    path: '/admin',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials
            let admin = ''
            if(credentials.scope == "sadmin" || credentials.scope == "dev"){
                admin ='ok'
            }
            return h.view('admin', {credentials, admin}, { layout: 'admin-layout' })
        }
    }
}