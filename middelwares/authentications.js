//middleware is a function that has access to request and response

//if a user is authenticated then take them to dashboard 
//if user is not authenticated then take them to login page

const ensureAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
         next()
    } else {
        response.redirect('/login')
    }
}

const ensureNotAuthenticated = (request, response, next) => {
    if(!request.isAuthenticated()) {
        return next()
    } else {
        response.redirect('/dashboard')
    }
}

module.exports = { ensureAuthenticated, ensureNotAuthenticated  }