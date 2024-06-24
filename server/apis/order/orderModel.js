const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
    orderId: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "user" },
    amountTotal: { type: Number, default: 0 },
    orderStatus: { type: Number, default: 1 }, // 1-> Placed , 2-> Confirmed , 3=> Shipped , 4=>Delivered , 5=> Cancelled
    address: { type: String, default: "" },
    shipmentUrl: { type: String, default: "" },
    trackingId: { type: String, default: "" },
    paymentMethod: {type:String, default: '' },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }

})



const order = module.exports = mongoose.model('order', orderSchema)
