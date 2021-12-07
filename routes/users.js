const express = require('express')
const router = express.Router();
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users= require('../controllers/users')

router.route('/register')
.get(users.renderRegister )
.post( catchAsync(users.register))

router.route('/login')
.get( users.renderLogin)
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.login)

router.get('/logout',(req, res) => {
    req.logOut();
    req.flash('success', 'Logged out successfully!')
    res.redirect('/campgrounds');
})

module.exports = router
