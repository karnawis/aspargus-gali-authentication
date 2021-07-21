const { response } = require('express')
const express = require('express')
const router = express.Router()
const  { ensureAuthenticated: performedAuthentication, ensureNotAuthenticated: notPerformedAuthentication, ensureAuth } = require('../middelwares/authentications')
const Post = require('../models/Post')

// I can try to move ensure authentication to be passed as middleware to all /posts

// Show add post page
// Route GET posts/add

router.get('/add', performedAuthentication, ( request, response ) => {
    response.render('posts/add')
})

// proccess add form
// route POST /posts
router.post('/', performedAuthentication, async (request, response) => {
    try {
        //request.body will have the body that will be sent by form
        //it needs to be parsed. 
        //you can get the user from the request, the user is part of the user schema
        request.body.user = request.user.id
        await Post.create(request.body)
        response.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        response.render('error/500')
    }
})

// description Show all posts
// route GET posts - fetch posts and render them 
router.get(
    '/', 
    performedAuthentication, 
    async ( request, response ) => {
        try {

            const posts = await Post.find({status: 'public'})
                .populate('user')//populate using user data model
                .sort({createdAt: 'desc'})//decending 
                .lean()//to pass it to template

            console.log('posts >>>', posts)
            response.render('posts/index', {
                posts,
            })


        } catch (err) {
            console.error(err)
            response.render('error/500')
        }
    }
)

// Edit page
// Route GET/posts/edit/:id
router.get(
    '/edit/:id', 
    performedAuthentication,
    async (request, response) => {
        try {
            const post = await Post.findOne({
                _id: request.params.id
            }).lean()
            if(!post) return response.render('error/404')
            
            if (post.user != request.user.id) {
                response.redirect('/posts')
            } else {
                response.render('posts/edit')
            }
                
        } catch {
            console.error(err)
            return response.render('error/500')
        }
    }
)


module.exports = router