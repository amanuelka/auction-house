const { hasUser, isOwner } = require('../middlewares/guards');
const { parseError } = require('../middlewares/parsers');
const preload = require('../middlewares/preloader');
const { create, update, deleteById, getByIdPopulated, bid, close } = require('../services/auctionService');

const auctionController = require('express').Router();

auctionController.get('/create', hasUser(), (req, res) => {
    res.render('create');
});

auctionController.post('/create', hasUser(), async (req, res) => {
    const data = { ...req.body, author: req.user._id };
    try {
        await create(data);
        res.redirect('/auctions');
    } catch (error) {
        res.render('create', { errors: parseError(error), ...data });
    }
});

auctionController.get('/:id', async (req, res) => {
    const auction = await getByIdPopulated(req.params.id);

    auction.isOwner = req.user && auction.author._id == req.user._id;
    auction.isBidder = req.user && auction.bidder?._id == req.user._id;

    res.render('details', { ...auction });
});

auctionController.get('/:id/edit', hasUser(), preload(), isOwner(), (req, res) => {
    const auction = res.locals.auction;
    res.render('edit', { ...auction });
});

auctionController.post('/:id/edit', hasUser(), preload(), isOwner(), async (req, res) => {
    try {
        await update(req.params.id, { ...req.body, _id: req.params.id });
        res.redirect(`/auction/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), ...req.body });
    }
});

auctionController.get('/:id/delete', hasUser(), preload(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/auctions');
});

auctionController.post('/:id/bid', hasUser(), preload(), async (req, res) => {
    const auction = await getByIdPopulated(req.params.id);
    try {
        await bid(req.params.id, req.user._id, req.body.amount);
        res.redirect(`/auction/${req.params.id}`);
    } catch (error) {
        res.render('details', { errors: parseError(error), ...auction, ...req.body });
    }
});

auctionController.get('/:id/close', preload(), isOwner(), async (req, res) => {
    await close(req.params.id);
    res.redirect('/profile');
});

module.exports = auctionController;