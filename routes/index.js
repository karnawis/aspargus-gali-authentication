const { response } = require('express')
const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.send('Hello World')
})

router.get('/login', (request, response) => {
    response.render('login', {
        layout: 'login'
    })

})

router.get('/dashboard', (request, response) => {
    response.send('dashboard')
})

module.exports = router