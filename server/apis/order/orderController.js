const Order = require('./orderModel')
const OrderDetail = require('../orderDetail/orderDetailModel')
const Product = require('../product/productModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    if (!!req.decoded && req.decoded.userType == 2)
        req.body.userId = req.decoded._id
    await Order.find(req.body)
        .populate("userId").then(res => {
            resp.send({ success: true, status: 200, message: "All Orders loaded", data: res })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
}



exports.getSingle = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"

    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Order.findOne(query)
            .populate("userId")
            .then(res => {
                if (!!res) {
                    resp.send({ success: true, status: 200, message: "Order loaded Successfully", data: res })
                }
                else
                    resp.send({ success: false, status: 404, message: "No Order Found" })
            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }


}



exports.addOrder = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.orderDetail)
        validation += "orderDetail is required,"
    if (!formData.userId)
        validation += "userId is required,"
    if (!formData.address)
        validation += "address is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {

       
            let total = await Order.countDocuments()
            let orderData = new Order()
            orderData.orderId = total + 1
            orderData.userId = formData.userId
            orderData.address = formData.address
            // orderData.paymentMethod = formData.paymentMethod
            // orderData.shipmentUrl = formData.shipmentUrl
            // orderData.trackingId = formData.trackingId
            orderData.save().then(res => {
              let productArr = JSON.parse(formData.orderDetail)
              let totalAmount = 0
              for(let i = 0; i< productArr.length; i++){
                let orderDetailData = {
                  orderId:res._id,
                  productId:productArr[i].productId,
                  price:productArr[i].price,
                  quantity:productArr[i].quantity,
                }
                let orderDetail = new OrderDetail(orderDetailData)
                orderDetail.save()
                totalAmount += productArr[i].price*productArr[i].quantity
              }
              orderData.amountTotal = totalAmount
              orderData.save().then(updatedRes=>{
                resp.send({ success: true, status: 200, message: "Order added Successfully", data: updatedRes })
              }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
              })
            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })

    }
}



exports.updateOrder = async (req, resp) => {
    // if (!!req.decoded && req.decoded.userType == 2) {
    //     resp.send({ success: false, status: 404, message: "Unauthorized access" })
    // } else {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Order.findOne(query).then(async res => {
            if (!!res) {
                let isInValid = false
                if (!!formData.orderStatus) {
                    if (formData.orderStatus == 5 && res.orderStatus > 2) {
                        isInValid = true
                    } else {
                        res.orderStatus = formData.orderStatus
                    }
                }
                if (!!formData.trackingId)
                    res.trackingId = formData.trackingId
                if (!!formData.shipmentUrl)
                    res.shipmentUrl = formData.shipmentUrl
                if (isInValid)
                    resp.send({ success: true, status: 200, message: "Order cannot be cancelled" })
                else
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Order updated Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No Order Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
    //   }


}

