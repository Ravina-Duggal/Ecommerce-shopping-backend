const mongoose = require('mongoose')
const orderDetailSchema = mongoose.Schema({
    orderId: {type: mongoose.Schema.Types.ObjectId, default: null, ref: "order" },
    productId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "product" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 }

})



const orderDetail = module.exports = mongoose.model('orderDetail', orderDetailSchema)
