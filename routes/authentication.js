const express = require('express')
const passport = require('passport')
const router = express.Router()

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
router.get('/google', passport.authenticate('google',  { scope: ['profile'] }))

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

//callback = /auth/google/callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (request, response) => {
        response.redirect('/dashboard');
    }
);

//Logout = /auth/logout
router.get('/logout', (request, response) => {
    try {
    request.logout()
    //response.redirect('/')
    response.clearCookie('connect.sid');
    request.session.destroy(function (err) {
        response.redirect('/dashboard'); //Inside a callback… bulletproof!
      });
    } catch(err) {
        console.error(err)
    }
   
})

module.exports = router