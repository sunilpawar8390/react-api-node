const mongoose = require('mongoose');

const publisherdetailSchema = new mongoose.Schema({
    Name : String,
});

module.exports = mongoose.model('Publisherdetailslkp', publisherdetailSchema);