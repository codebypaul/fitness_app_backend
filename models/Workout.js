const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name:String,
    picture: String,
    category: String,
    sets: Number,
    reps: Number,
    description: String
})

module.exports = mongoose.model('workout', workoutSchema);