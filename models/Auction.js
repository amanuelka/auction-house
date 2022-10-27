const { Schema, model, Types } = require('mongoose');

const auctionSchema = new Schema({

    title: { type: String, required: true, minlength: [4, 'Title must be at least 4 characters long'] },
    description: { type: String, maxlength: [200, 'Description cannot be more than 200 characters long'] },
    category: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    bidder: { type: Types.ObjectId, ref: 'User' },
    closed: { type: Boolean, default: false }
});

const Auction = model('Auction', auctionSchema);
module.exports = Auction;