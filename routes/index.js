const express = require('express')
const router = express.Router()
const  { ensureAuthenticated: performedAuthentication, ensureNotAuthenticated: notPerformedAuthentication, ensureAuth } = require('../middelwares/authentications')
const Post = require('../models/Post')
const postRoutes = require('./posts')
const authenticateRoutes = require('./authentication')

const renderIndex = (request, response, next) => {
    response.render('index', {layout: 'main'})
}

const renderDashboard = async (request, response) => {
    try {
        const posts = await Post.find({user: request.user.id}).lean()
        response.render('dashboard', {
            name: request.user.firstName,
            posts
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

router.use('/auth', authenticateRoutes)

//access to all post pages needs authentication
router.use('/posts',
        performedAuthentication,
        postRoutes
        )

module.exports = router