const Auction = require('../models/Auction');

async function create(data) {
    return Auction.create(data);
}

async function getAll() {
    return Auction.find({ closed: false }).lean();
}

async function getById(id) {
    return Auction.findById(id).lean();
}

async function getByIdPopulated(id) {
    return Auction.findById(id).populate('author', 'firstName lastName').populate('bidder', 'firstName lastName').lean();
}

async function update(id, auction) {
    const existing = await Auction.findById(id);
    Object.assign(existing, auction);
    await existing.save();
}

async function deleteById(id) {
    return Auction.findByIdAndDelete(id);
}

async function bid(auctionId, userId, amount) {
    const auction = await Auction.findById(auctionId);
    if (Number(amount) <= auction.price) {
        throw new Error('Bid amount has to be bigger than the current price');
    } else if (auction.author == userId) {
        throw new Error('You cannot bid for your own auction');
    } else {
        auction.bidder = userId;
        auction.price = Number(amount);
        await auction.save();
    }
}

async function close(id) {
    const auction = await Auction.findById(id);
    if (auction.bidder) {
        auction.closed = true;
        await auction.save();
    }
}

async function getOwn(userId) {
    return Auction.find({ author: userId, closed: true }).populate('bidder').lean();
}

module.exports = { getAll, getById, create, update, deleteById, getByIdPopulated, bid, getOwn, close };