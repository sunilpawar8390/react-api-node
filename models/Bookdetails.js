const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookdetailSchema = new mongoose.Schema({
    Bookname : String,
    Category: { type: Schema.Types.ObjectId, ref: 'Categorydetailslkp' },
    Publisher: { type: Schema.Types.ObjectId, ref: 'Publisherdetailslkp' },
    Quantity: Number,
    BDID: Number,
    IsActive: {type: Boolean, default: true},
});

module.exports = mongoose.model('Bookdetails', bookdetailSchema);