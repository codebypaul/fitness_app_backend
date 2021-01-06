const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false
    },
    displayName: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    DOB: {
        type: String
    },
    image: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    favoriteFoods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref :'Food'
    }],
    favoriteWorkouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref :'Workout'
    }]

})

module.exports = mongoose.model('User',UserSchema)