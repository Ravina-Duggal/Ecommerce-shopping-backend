const Category = require('./categoryModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    await Category.find(req.body).then(res => {
        resp.send({ success: true, status: 200, message: "All Categories loaded", data: res })
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
    await Category.findOne(query).then(res => {
        if (!!res) {
            resp.send({ success: true, status: 200, message: "Category loaded Successfully", data: res })
        }
        else
            resp.send({ success: false, status: 404, message: "No Category Found" })
    }).catch(err => {
        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
    })

}



exports.addCategory = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.name)
        validation += "name is required,"
    if (!formData.image)
        validation += "image is required,"


    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await Category.countDocuments()
        let categoryData = {
            categoryId: total + 1,
            name: formData.name,
            image: "category/" + formData.image
        }
        let category = new Category(categoryData)
        let prevCategory = await Category.findOne({ name: formData.name })
        if (prevCategory)
            resp.send({ success: false, status: 409, message: "Category already exists with same name" })
        else
            category.save().then(res => {
                resp.send({ success: true, status: 200, message: "Category added Successfully", data: res })

            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }


}



exports.updateCategory = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Category.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.name)
                    res.name = formData.name
                if (!!formData.image)
                    res.image = "category/" + formData.image
                if (!!formData.status)
                    res.status = formData.status
                let id = res._id
                let prevCategory = await Category.findOne({ $and: [{ name: res.name }, { _id: { $ne: id } }] })
                if (prevCategory)
                    resp.send({ success: false, status: 409, message: "Category already exists with same name" })
                else
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Category updated Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }
            else
                resp.send({ success: false, status: 404, message: "No Category Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }


}

