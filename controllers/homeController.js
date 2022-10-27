const { hasUser } = require('../middlewares/guards');
const { getAll, getOwn } = require('../services/auctionService');

const homeController = require('express').Router();

homeController.get('/', (req, res) => {
    res.render('home');
});

homeController.get('/auctions', async (req, res) => {
    const auctions = await getAll();
    res.render('browse', { auctions });
});

homeController.get('/profile', hasUser(), async (req, res) => {
    const auctions = await getOwn(req.user._id);
    res.render('closed-auctions', { auctions });
});

module.exports = homeController;