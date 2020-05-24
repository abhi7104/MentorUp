const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    
    name: String,
    image: String,
    position:String
});

module.exports = mongoose.model("Uploads",ProductSchema);   