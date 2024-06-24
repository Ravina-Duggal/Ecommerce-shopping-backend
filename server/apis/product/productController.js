const Product = require('./productModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    await Product.find(req.body)
        .populate("categoryId")
        .populate("subcategoryId")
        .then(res => {
            resp.send({ success: true, status: 200, message: "All Products loaded", data: res })
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
        await Product.findOne(query)
            .populate("categoryId")
            .populate("subcategoryId").then(res => {
                if (!!res) {
                    resp.send({ success: true, status: 200, message: "Product loaded Successfully", data: res })
                }
                else
                    resp.send({ success: false, status: 404, message: "No Product Found" })
            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }


}



exports.addProduct = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.name)
        validation += "name is required,"
    if (!formData.image)
        validation += "image is required,"
    if (!formData.categoryId)
        validation += "categoryId is required,"
    if (!formData.subcategoryId)
        validation += "subcategoryId is required,"
    if (!formData.price)
        validation += "price is required,"
    if (!formData.description)
        validation += "Description is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await Product.countDocuments()
        let productData = {
            productId: total + 1,
            price: formData.price,
            categoryId: formData.categoryId,
            subcategoryId: formData.subcategoryId,
            name: formData.name,
            description: formData.description,
            image: "product/" + formData.image
        }
        let product = new Product(productData)
        let prevProduct = await Product.findOne({ name: formData.name })
        if (prevProduct)
            resp.send({ success: false, status: 409, message: "Product already exists with same name" })
        else
            product.save().then(res => {
                resp.send({ success: true, status: 200, message: "Product added Successfully", data: res })

            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }
}



exports.updateProduct = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Product.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.name)
                    res.name = formData.name
                if (!!formData.image)
                    res.image = "product/" + formData.image
                if (!!formData.categoryId)
                    res.categoryId = formData.categoryId
                if (!!formData.subcategoryId)
                    res.subcategoryId = formData.subcategoryId
                if (!!formData.price)
                    res.price = formData.price
                if (!!formData.status)
                    res.status = formData.status
                if (!!formData.description)
                    res.description = formData.description
                let id = res._id
                let prevProduct = await Product.findOne({ $and: [{ name: res.name }, { _id: { $ne: id } }] })
                if (prevProduct)
                    resp.send({ success: false, status: 409, message: "Product already exists with same name" })
                else
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Product updated Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No Product Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }
}

