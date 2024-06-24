const Subcategory = require('./subcategoryModel')
const helper = require('../../utilities/helpers')


exports.getAll = async (req, resp) => {
    await Subcategory.find(req.body)
        .populate("categoryId")
        .then(res => {
            resp.send({ success: true, status: 200, message: "All Sub Categories loaded", data: res })
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
    await Subcategory.findOne(query)
        .populate("categoryId")
        .then(res => {
            if (!!res) {
                resp.send({ success: true, status: 200, message: "Subcategory loaded Successfully", data: res })
            }
            else
                resp.send({ success: false, status: 404, message: "No Subcategory Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })

}




exports.addSubcategory = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData.name)
        validation += "name is required,"
    if (!formData.image)
        validation += "image is required,"
    if (!formData.categoryId)
        validation += "categoryId is required,"
    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let total = await Subcategory.countDocuments()
        let subcategoryData = {
            subcategoryId: total + 1,
            categoryId: formData.categoryId,
            name: formData.name,
            image: "subcategory/" + formData.image
        }
        let subcategory = new Subcategory(subcategoryData)
        let prevSubcategory = await Subcategory.findOne({ name: formData.name })
        if (prevSubcategory)
            resp.send({ success: false, status: 409, message: "Subcategory already exists with same name" })
        else
            subcategory.save().then(res => {
                resp.send({ success: true, status: 200, message: "Subcategory added Successfully", data: res })

            }).catch(err => {
                resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
            })
    }


}



exports.updateSubcategory = async (req, resp) => {
    let formData = req.body
    let validation = ""
    if (!formData._id)
        validation += "_id is required"

    if (!!validation)
        resp.send({ success: false, status: 422, message: validation })
    else {
        let query = { _id: formData._id }
        await Subcategory.findOne(query).then(async res => {
            if (!!res) {
                if (!!formData.name)
                    res.name = formData.name
                if (!!formData.categoryId)
                    res.categoryId = formData.categoryId
                if (!!formData.image)
                    res.image = "subcategory/" + formData.image
                if (!!formData.status)
                    res.status = formData.status
                let id = res._id
                let prevSubcategory = await Subcategory.findOne({ $and: [{ name: res.name }, { _id: { $ne: id } }] })
                if (prevSubcategory)
                    resp.send({ success: false, status: 409, message: "Subcategory already exists with same name" })
                else
                    res.save().then(res => {
                        resp.send({ success: true, status: 200, message: "Subcategory updated Successfully", data: res })

                    }).catch(err => {
                        resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
                    })
            }

            else
                resp.send({ success: false, status: 404, message: "No Subcategory Found" })
        }).catch(err => {
            resp.send({ success: false, status: 500, message: !!err.message ? err.message : err })
        })
    }

}

