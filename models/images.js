const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema

const ImageSchema = new Schema({
    images:{
        type: Array,
        "default": []
    }
    
});


module.exports = Image = mongoose.model('images', ImageSchema);