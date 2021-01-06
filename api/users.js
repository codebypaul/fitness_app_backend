// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// Models
const db = require('../models');
const User = require('../models/User');
const Food = require('../models/Food')
const Workout = require('../models/Workout')
// GET api/users/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: 'User endpoint OK!'});
});

// POST api/users/register (Public)
router.post('/register', (req, res) => {
    console.log('inside of register')
    const {googleId,displayName,firstName, lastName,dob, email, password,image} = req.body
    // console.log(db);
    db.User.findOne({ email: req.body.email })
    .then(user => {
        // if email already exits, send a 400 response
        console.log(user);
        if (user) {
            if (googleId){
                user.googleId = googleId
                user.displayName = displayName
                user.image = image
                user.save()
            }
            return res.status(400).json({ msg: 'Email already exists' });
        } else {
            // Create a new user
            console.log('else statement');
            const newUser = new User({
                googleId,
                displayName,
                firstName,
                lastName,
                DOB: dob,
                email,
                password,
                image
            });
            // Salt and hash the password, then save the user
            bcrypt.genSalt(10, (err, salt) => {
                // if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    // if (error) throw Error;
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

// POST api/users/login (Public)
router.post('/login', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const googleId = req.body.googleId

    // Find a user via email
    User.findOne({ email })
    .then(user => {
        // If there is not a user
        console.log(user);

        if (!user) {
            res.status(400).json({ msg: 'User not found'});
        } else {
            if(password){
                if (googleId){
                    user.googleId = googleId
                    user.save()
                }
                // A user is found in the database
                bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // Check password for a match
                    if (isMatch) {
                        console.log(isMatch);
                        // User match, send a JSON Web Token
                        // Create a token payload
                        const payload = {
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            image: user.image,
                            createdAt: user.createdAt
                        };
                        // Sign token
                        // 3600000 is one hour
                        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        });
                    } else {
                        return res.status(400).json({ msg: 'Email or Password is incorrect' });
                    }
                })
            }else{
                if (googleId === user.googleId){
                    // User match, send a JSON Web Token
                    // Create a token payload
                    const payload = {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        image: user.image,
                        createdAt: user.createdAt,
                        favoriteFoods: user.favoriteFoods,
                        favoriteWorkouts: user.favoriteWorkouts
                    };
                    // Sign token
                    // 3600000 is one hour
                    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        });
                    });

                } else {
                        return res.status(400).json({ msg: 'Google ID not found' });

                }
                // .then(isMatch => {
                //     // Check password for a match
                //     if (isMatch) {
                //         console.log(isMatch);
                //     } else {
                //     }
                // })

            }

        }
    })
})

// GET api/users/current (Private)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        createdAt: user.createdAt,
        favoriteFoods:user.favoriteFoods,
        favoriteWorkouts: user.favoriteWorkouts
    });
});

router.post('/newfaves',async (req,res)=>{
    console.log(req.body);
    try{
        const user = await User.findOne({_id:req.body.user_id})
        if (user){
            if (req.body.food) user.favoriteFoods.push(req.body.food)
            if (req.body.workout) user.favoriteWorkouts.push(req.body.workout)
            user.save()
            res.status(200)
        } else {
            res.status(404).json('this is not the code you\'re looking for')
        }
    }catch(err){

    }
})

module.exports = router;