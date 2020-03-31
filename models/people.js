const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema

const PeopleSchema = new Schema({
    data:{
        type: Array,
        "default": []
    }
    
});


module.exports = People = mongoose.model('people', PeopleSchema);