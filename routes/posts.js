const { response, request } = require('express')
const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')

// Description    Show add page
// Route   GET /posts/add
router.get('/add', 
    ( request, response ) => {
        response.render('posts/add')
    })

// proccess add form
// route POST /posts
router.post('/', 
    async (request, response) => {
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

// @desc    Show single post
// @route   GET /posts/:id
router.get(
    '/:id',
    async (request, response) => {
        try {
            let post = await Post.findById(request.params.id).populate('user').lean()

            if (!post) {
              return response.render('error/404')
            }
        
            if (post.user._id != request.user.id && post.status == 'private') {
              response.render('error/404')
            } else {
              response.render('posts/display', {
                post,
              })
            }
        } catch(err){
            console.error(err)
            response.render('error/404')
        }
    }
)

// Get to edit page with the post id
// Route GET /posts/edit/:id
router.get(
    '/edit/:id', 
    async (request, response) => {
        try {
            const post = await Post.findOne({
                _id: request.params.id
            }).lean()

            if(!post) return response.render('error/404')
            
            if (post.user._id != request.user.id) {
                response.redirect('/posts')
            } else {
                response.render('posts/edit', {post})
            }
                
        } catch {
            console.error(err)
            return response.render('error/500')
        }
    }
)

// Update single post
// Route PUT /posts/:id
router.put(
    '/:id', 
    async (request, response) => {
        try {
            let post = await Post.findById(request.params.id).lean()
            console.log(">>>>>>>>>> request.params.id", request.params.id, "request.params._id doesnt work", request.params._id, "post.user", post.user, "request.user.id", request.user.id)
            if(!post) return response.render('error/404')
            
            if (post.user != request.user.id) {
                response.redirect('/posts')
            } else {
               post = await Post.findOneAndUpdate(
                   {_id: request.params.id}, 
                   request.body, 
                   {
                       new: true,
                       runValidators: true
                   }
                )
                response.redirect('/dashboard')
            }
        } catch(err) {
            console.error(err)
            return response.render('error/500')
        }
    })

// Delete single post
// Route DELETE /posts/:id

router.delete(
    '/:id', 
    async (request, response) => {
        try {
            //let post = await Post.findById(request.params.id).lean()
            await Post.remove({_id: request.params.id})
            response.redirect("/dashboard")
       
        } catch(err) {
            console.error(err)
            return response.render('error/500')
        }
    })

//Fetch and display user posts
// Route GET /posts/user/:userId

router.get(
    '/user/:userId',
    async (request, response) => {
        try {
            const posts = await Post.find({
                    user: request.params.userId,
                    status: 'public',
                })
            .populate('user')
            .lean()

            response.render('posts/index',{
                posts,
            })

        } catch(err) {
            console.error(err)
            return response.render('error/500')
        }
    })
module.exports = router