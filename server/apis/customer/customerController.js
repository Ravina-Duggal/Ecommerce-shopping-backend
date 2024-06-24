const Customer = require('./customerModel')
const helper = require('../../utilities/helpers')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')

exports.login = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.email && !formData.password)
        validation += "email and password is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { email: formData.email }
        await Customer.findOne(query).then(res => {
            if (!!res) {
                if (bcrypt.compareSync(formData.password, res.password)) {
                    var user = {
                        name: res.name, email: res.email, isAdmin: res.isAdmin, _id: res._id
                    }
                    let token = jwt.sign(user, helper.SECRET)
                    resp.send({ success: true, status: 200, message: "Login Successful", token: token, data: res })
                }
                else resp.send({ success: false, status: 403, message: "Invalid Credentials" })
            }
            else
                resp.send({ success: false, status: 404, message: "No Customer Found" })
        }).catch(err => {
            resp.send({ success: false, status: 404, message: !!err.message ? err.message : err })
        })
    }

}



exports.getAll = async (req, resp) => {
    await Customer.find(req.body).then(res => {
        resp.send({ success: true, status: 200, message: "All Customers loaded", data: res })
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

    let query = { _id: formData._id }
    await Customer.findOne(query).then(res => {
        if (!!res) {
            resp.send({ success: true, status: 200, message: "Customer loaded Successfully", data: res })
        }
        else
            resp.send({ success: false, status: 404, message: "No Customer Found" })
    }).catch(err => {
        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
    })
}




exports.addCustomer = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.name)
        validation += "name is required,"
    if (!formData.email)
        validation += "email is required,"
    if (!formData.password)
        validation += "password is required,"
    if (!formData.contactNo)
        validation += "contactNo is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await Customer.countDocuments()
        let customerData = {
            customerId: total + 1,
            name: formData.name,
            email: formData.email,
            password: bcrypt.hashSync(formData.password, salt),
            contactNo: formData.contactNo
        }
        let customer = new Customer(customerData)
        let prevCustomer = await Customer.findOne({ email: formData.email })
        if (prevCustomer)
            resp.send({ success: false, status: 409, message: "Customer already exists with same email" })
        else
            customer.save().then(res => {
                resp.send({ success: true, status: 200, message: "Customer added Successfully", data: res })

            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }

}



exports.updateCustomer = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Customer.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.name)
                    res.name = formData.name
                if (!!formData.email)
                    res.email = formData.email
                if (!!formData.contactNo)
                    res.contactNo = formData.contactNo
                if (!!formData.password)
                    res.password = bcrypt.hashSync(formData.password, salt)
                if (!!formData.status)
                    res.status = formData.status
                let id = res._id
                let prevCustomer = await Customer.findOne({ $and: [{ email: res.email }, { _id: { $ne: id } }] })
                if (prevCustomer)
                    resp.send({ success: false, status: 409, message: "Customer already exists with same email" })
                else
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Customer updated Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No Customer Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }



}

