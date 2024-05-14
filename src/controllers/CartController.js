const CartService = require('../services/CartService')

const createCart = async (req, res) => {
    try { 
      const { userId, items } = req.body;
      console.log('userid, items', userId, items);
      if (!userId || !items) {
        return res.status(400).json({
          status: 'ERR',
          message: 'The input is required'
        });
      }
      const response = await CartService.createCart(req.body);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(500).json({
        message: 'Server error',
        error: e
      });
    }
  };
  

const getAllCart = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        
        const response = await CartService.getAllCart(req.params.id)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelCartDetail = async (req, res) => {
    try {
        const userId = req.params.id;
        const productId = req.params.productId;
      
        if (!userId || !productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId or productId is required'
            })
        }
        const response = await CartService.cancelCartDetails(userId, productId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelCartAll = async (req, res) => {
    try {
        const userId = req.params.id;
        const listChecked = req.body.ids
     
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId or productId is required'
            })
        }
        const response = await CartService.cancelCartAll({userId, listChecked})
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createCart,
    getAllCart,
    cancelCartDetail,
    cancelCartAll
}
