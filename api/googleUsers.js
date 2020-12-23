// const router = require('express').Router()
const axios = require('axios')
const passport = require('passport')
const User = require('../models/User')


module.exports = (app) =>{
    app.post('/auth', async (req,res)=>{
    
        const {googleId, displayName, firstName, lastName, email, image} = req.body
        let user = await User.findOne({email})
    
        if (user) {
            console.log(`found user: ${user.id}`);
            user.googleId = googleId
            user.displayName = displayName
            user.image = image
            user.save()
        } else {
            console.log('we have a new guy in town');
            const newUser = new User({
                googleId,
                displayName,
                firstName,
                lastName,
                image
            })
            newUser.save()
        }
    })

    // route /auth/google
    app.get('/auth/google',passport.authenticate('google', { scope: ['profile','email']}))
    
    app.get('/auth/google/callback',passport.authenticate('google'),(req,res)=>{
        try{ 
            console.log(req.user);
            axios.post('http://localhost:8000/api/users/login',req.user)
        }
        catch (err){
            console.log(err);
        }
    })
    
    app.get('/auth/google/currentUser',(req,res)=>{
        console.log(req.user);
        res.send(req.user)
    })
    // desc logout if current user
    // route /logout
    app.get('/auth/logout',(req,res)=>{
        req.logout()
        res.redirect('/')
    })

}

