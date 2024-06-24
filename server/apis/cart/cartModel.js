const mongooose = require("mongoose")

const cartSchema = mongooose.Schema({
    'userId':{type:mongooose.Schema.Types.ObjectId,ref:'user'},
    'productId':{type:mongooose.Schema.Types.ObjectId,ref:'product'},
    'quantity':{type:Number, default:0},
    'createdAt':{type:Date, default:Date.now()},
    'status':{type:Boolean, default:true}
})

module.exports = mongooose.model('cart',cartSchema)
