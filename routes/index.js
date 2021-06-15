const { response, request } = require('express')
const express = require('express')
const router = express.Router()
const  { ensureAuthenticated: performedAuthentication, ensureNotAuthenticated: notPerformedAuthentication, ensureAuth } = require('../middelwares/authentications')
//const  { ensureAuth } = require('../middelwares/authentications')

const renderIndex = (request, response, next) => {
    response.render('index', {layout: 'main'})
}

const renderDashboard = async (request, response) => {
    try {
        response.render('dashboard', {
        name: request.user.firstName,
        })
    } catch (err) {
        console.error(err)
        response.render('error/500')
    }
}

const renderLogin = (request, response, next) => {
    response.render('login', {layout: 'login'})
}

// desc    Home
// route   GET /
router.get('/', renderIndex)

// desc    login page
// route   GET /login
router.get('/login', 
        notPerformedAuthentication, 
        renderLogin
);

// desc    Dashboard
// route   GET /dashboard
router.get('/dashboard', performedAuthentication, 
        renderDashboard,
)

module.exports = router