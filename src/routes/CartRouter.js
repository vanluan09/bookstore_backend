const express = require("express");
const router = express.Router()
const CartController = require('../controllers/CartController');
const { authUserMiddleWare} = require("../middleware/authMiddleware");

router.post('/create/:id',authUserMiddleWare, CartController.createCart)
router.get('/get-all-cart/:id',authUserMiddleWare, CartController.getAllCart)
router.delete('/cancel-cart/:id/:productId',authUserMiddleWare, CartController.cancelCartDetail)
router.delete('/cancel-all-cart/:id',authUserMiddleWare, CartController.cancelCartAll)



module.exports = router