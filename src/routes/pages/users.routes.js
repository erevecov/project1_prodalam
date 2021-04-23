export default {
    method: ['GET'],
    path: '/users',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials
            let admin = ''
            if(credentials.scope == "sadmin" || credentials.scope == "dev"){
                admin ='ok'
                return h.view('users', {credentials, admin}, { layout: 'admin-layout' })
            } else {
                return h.view('notFound', {credentials}, { layout: 'admin-layout' })
            }
            
        }
    }
}