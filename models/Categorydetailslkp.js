const mongoose = require('mongoose');

const categorydetailSchema = new mongoose.Schema({
    Name : String,
});


module.exports = mongoose.model('Categorydetailslkp', categorydetailSchema);