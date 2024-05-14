const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const createCart = (newCart) => {
    return new Promise(async (resolve, reject) => {
      const { userId, items } = newCart;
      try {
        let checkCart = await Cart.findOne({ user: userId });
        if (checkCart) {
          const existingItemIndex = checkCart.items.findIndex((item) => item.product.toString() === items.product);
  
          if (existingItemIndex > -1) {
            // Sản phẩm đã tồn tại, cập nhật số lượng
            checkCart.items[existingItemIndex].amount += items.amount;

          } else {
            // Sản phẩm không tồn tại, thêm mới
            checkCart.items.push({
              product: items.product,
              amount: items.amount,
              price: items.price,
              name: items.name,
              image: items.image,
              countInStock: items.countInStock
            });
          }
  
          await checkCart.save(); // Lưu thay đổi vào cơ sở dữ liệu
          resolve({
            status: 'OK',
            message: 'Cart updated successfully',
          });
        } else {
          // Nếu giỏ hàng không tồn tại, tạo mới
          await Cart.create({
            user: userId,
            items: [items] 
          });
          resolve({
            status: 'OK',
            message: 'Cart created successfully',
          });
        }
      } catch (e) {
        console.error('Error:', e);
        reject(e);
      }
    });
  };
  

const getAllCart = (newId) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const allCart = await Cart.findOne({ user: newId }).sort({createdAt: -1, updatedAt: -1})
        
            resolve({
                status: 'OK',
                message: 'Success',
                data: allCart.items
            })
        } catch (e) {
            reject(e)
        }
    })
}


const cancelCartDetails = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    
    console.log('cancelled', userId, productId)
      try {
        let checkCart = await Cart.findOne({ user: userId });
        if(checkCart) {
          await Cart.updateOne( 
            { user: userId },
            { $pull: { items: { product: productId} } }
          );
          resolve({
              status: 'OK',
              message: 'success',
          })
        }
        else {
          reject( {
            status:'ERR',
            message: 'error',
          })
        }
  
      } catch (e) {
          reject(e)
      }
  })
}

const cancelCartAll = (allChecked) => {
  return new Promise(async (resolve, reject) => {
    const { userId, listChecked } = allChecked;
  
    try {
      let checkCart = await Cart.findOne({ user: userId });
        if(checkCart) {
          await Cart.updateOne( 
            { user: userId },
            { $pull: { items: { product: { $in: listChecked }} } }
          );
        resolve({
          status: 'OK',
          message: 'success',
        });
      } else {
        reject({
          status: 'ERR',
          message: 'error',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {
  createCart,
  getAllCart,
  cancelCartDetails,
  cancelCartAll
};
