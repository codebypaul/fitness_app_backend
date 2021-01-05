const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: String,
    ingredients: [String],
    instructions : [String],
    nutritionData: [String],
    category: String,
    image : String
})

module.exports = mongoose.model('Food',foodSchema)