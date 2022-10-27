const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const auctionController = require('../controllers/auctionController');

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/auction', auctionController);
    
    app.get('*', (req, res) => { res.render('404'); });
};