const OrderDetail = require("./orderDetailModel")

exports.getAll = async (req, resp) => {
  await OrderDetail.find(req.body).populate("productId").then(res => {
      resp.send({ success: true, status: 200, message: "All Ordered Products loaded", data: res })
  }).catch(err => {
      resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
  })
}
