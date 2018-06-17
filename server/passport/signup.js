const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bCrypt = require('bcrypt-nodejs')

module.exports = function (passport) {

    // Generates hash using bCrypt
    const createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function (req, username, password, done) {

        // const findOrCreateUser = function () {
        // find a user in Mongo with provided username
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log('Error in SignUp: ' + err)
                return done(err)
            }

            // user already exists
            if (user) {
                console.log('User already exists with username: ' + username)
                return done(null, false)
            }


            // if they arent a user already

            const newUser = new User()

            newUser.username = req.body.userName
            newUser.password = createHash(password)
            newUser.email = req.body.email
            newUser.name.first = req.body.firstName
            newUser.name.last = req.body.lastName

            return newUser.save(function (saveErr) {
                if (err) {
                    console.log('Error in Saving user: ' + saveErr)
                    throw saveErr
                }
                console.log('User Registration succesful for ' + newUser)
                return done(null, newUser)
            })
        })
        // }
        // Delay the execution of findOrCreateUser and execute the method
        // in the next tick of the event loop
        // process.nextTick(findOrCreateUser)
        // findOrCreateUser();
        console.log(passport)
    }))
}
