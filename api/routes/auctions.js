const express = require('express');
const controller = require('../controllers/auctions');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router.route('/').get(controller.get).post(validator('addAuction'), isAuth, rbac('auctions', 'create'), controller.add);

router
	.route('/:id')
	.get(validator({ params: 'objectId' }), controller.getById)
	.patch(validator({ body: 'auction', params: 'objectId' }), isAuth, rbac('auctions', 'update'), controller.update)
	.delete(validator({ params: 'objectId' }), isAuth, rbac('auctions', 'delete'), controller.delete);

router
	.route('/:id/bets')
	.get(validator({ params: 'objectId' }), controller.getBets)
	.put(validator({ params: 'objectId', body: 'bet' }), isAuth, rbac('bets', 'create'), controller.addBet);

router.route('/basePrice/:basePrice').get(controller.getByBasePrice);

module.exports = router;
