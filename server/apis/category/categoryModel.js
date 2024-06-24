const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({

    categoryId: { type: Number, default: 0 },
    name: { type: String, default: "" },
    image: { type: String, default: "category/default.jpg" },
    status: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now }

})


const category = module.exports = mongoose.model('category', categorySchema)
