const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
require('dotenv').config()

module.exports = (passport) =>{
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshTo, profile, done)=>{
        console.log(profile);
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
        }
        let user = await User.findOne({ googleId: profile.id})
        try {
            if (user){
                done(null,user)
            }else{
                User.create(newUser)
                done(null,user)
            }
        } catch (err) {
            console.log(err);
        }
    }))
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done)=> {User.findById(id,(err, user) =>done(err, user))});
}