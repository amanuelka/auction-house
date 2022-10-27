const { getById } = require('../services/auctionService');

function preload() {
    return async function (req, res, next) {
        res.locals.auction  = await getById(req.params.id);
        next();
    };
}

module.exports = preload;