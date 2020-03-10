var mongoose = require('mongoose')

var restaurantSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

module.exports = mongoose.model("restaurant", restaurantSchema)