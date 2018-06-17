const express = require('express')
const router = express.Router()
const User = require('../models/user')


const isRecognized = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.status(200).send('User is not recognized')
}

const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('unauthorized')
    return res.status(401).end()
}

const isAlreadyLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log('User already logged in as:' + req.user)
        return res.json(req.user)
    }
    return next()
}

module.exports = function (passport) {

    router.get('/api/about', function (req, res) {
        res.json({ success: 'success' })
    })

    router.get('/api/logout', function (req, res) {
        req.logout()
        res.status(200).end()
    })

    router.post('/api/signup', passport.authenticate('signup'), function (req, res) {
        res.json(req.user)
    })

    router.post('/api/login', isAlreadyLoggedIn, passport.authenticate('login'), function (req, res) {
        res.json(req.user)
    })

    router.get('/api/userCheck', isRecognized, function (req, res) {
        res.json({
            user: req.user
        })
    })

    router.get('/api/dash/:userId', isAuthenticated, function (req, res) {

        // make sure user is requesting their own dashboard
        if (req.params.userId.toString() === req.user._id.toString()) {
            // find businesses
            // find products
            // find profile
            User.findById(req.params.userId, '-password', function (err, user) {
                if (err) {
                    console.log(err)
                    res.json(err)
                } else {
                    console.log(user)
                    res.json({
                        user: user
                    })
                }
            })
        } else if (req.params.userId !== req.user._id) {
            res.status(401).end()
        }
    })

    return router
}
