const User = require('../user/userModel')
const Product = require('../product/productModel')
const Order = require('../order/orderModel')


exports.dashboard = async (req, res) => {
    let totalCustomers = await User.find({ userType: 2 })
    let totalProducts = await Product.countDocuments()
    let totalOrders = await Order.countDocuments()
    res.send({ success: true, status: 200, totalOrders: totalOrders, totalCustomers: totalCustomers.length, totalProducts: totalProducts })
}

