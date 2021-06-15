const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            }, 
            async(accessToken, refreshToken, profile, done) => {
                //it hangs here with unauthorized or server error if we don't use call back 'done' or 'cb'
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                  }

                  try {
                    let user = await User.findOne({googleId: profile.id})
                    //console.log('user >>>>>>>>>', user)
                    
                    if (user ) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }

                  } catch(error){
                    console.error(error)
                  }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) =>
        done(error, user));
    });
}