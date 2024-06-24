const Cart = require("./cartModel")
// const Product = require("../models/productModel")

function addToCart(req, res) {
    let validation=""
  if (!req.body.productId)
        validation += "productId is required,"
    if (!req.body.userId)
        validation += "userId is required,"
    if (!req.body.quantity)
        validation += "quantity is required,"
    if (!!validation)
        res.send({ success: false, status: 422, message: validation })
    else {
        Cart.findOne({ userId: req.body.userId, productId: req.body.productId }).exec()
            .then(cartData => {
                if (cartData == null) {
                    if (req.body.quantity != 0) {
                        let cartObj = new Cart()
                        cartObj.userId = req.body.userId
                        cartObj.productId = req.body.productId
                        cartObj.quantity = req.body.quantity
                        // cartObj.price_per_item = req.body.price_per_item
                        // cartObj.sub_total = (req.body.quantity * req.body.price_per_item)
                        cartObj.save().then(data=>{
                            res.json({
                              'status': 200,
                              'success': true,
                              'message': "item added to cart",
                              'data': data
                            })
                        }).catch(err=>{
                          res.json({
                            'status': 500,
                            'success': false,
                            'message': "server error while items added to the cart",
                            'error': String(err),
                          })
                        })


                    }
                    else {
                        res.json({
                            'status': 200,
                            'success': false,
                            'message': "quantity must not 0",
                            'data': cartObj
                        })
                    }
                }
                else {
                    cartData.quantity += req.body.quantity
                    cartData.save()
                    res.json({
                        'status': 200,
                        'success': true,
                        'message': "quantity updated",
                    })
                }
            })
            .catch(err => {
                res.json({
                    'status': 500,
                    'success': false,
                    'message': "server error while items added to the cart",
                    'error': String(err),
                })
            })
    }
}

function viewCart(req, res) {
    if (!!req.body.userId) {
        Cart.find({ userId: req.body.userId }).populate('productId').exec()
            .then(cartData => {
                // console.log(cartData)
                if(cartData != null) {
                    res.json({
                        'status': 200,
                        'success': true,
                        'message': "cart loaded",
                        'data': cartData
                    })
                }
                else {
                    res.json({
                        'status': 200,
                        'success': false,
                        'message': "your cart is empty",
                    })
                }
            })
            .catch(err => {
                res.json({
                    'status': 500,
                    'success': false,
                    'message': "server error while retrive carts",
                    'error': String(err)
                })
            })
    }
    else {
        res.json({
            'status': 200,
            'success': false,
            'message': "id of user is required"
        })
    }
}

function removeCart(req, res) {
    if (req.body._id == undefined || req.body._id == '') {
        res.json({
            'status': 200,
            'success': false,
            'message': '_id is required'
        })
    }
    else {
        Cart.findOne({ '_id': req.body._id }).exec()
            .then(cartData => {
              if(cartData==null)
                res.json({
                  'status': 500,
                  'success': false,
                  'message': "No cart item found",
                  'error': String(err)
                })
              else{
                Cart.deleteOne({ '_id': req.body._id }).exec()
                    .then(dltData => {
                        res.json({
                            'status': 200,
                            'success': true,
                            'message': "Cart item removed",
                        })
                    })
                    .catch(err => {
                        res.json({
                            'status': 500,
                            'success': false,
                            'message': "server error while removing cart",
                            'error': String(err)
                        })
                    })
                }
            })
    }
}

module.exports = {
    addToCart,
    viewCart,
    removeCart
}
