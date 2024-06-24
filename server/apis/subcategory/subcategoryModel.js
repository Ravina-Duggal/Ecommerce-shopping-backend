const mongoose = require('mongoose')
const subcategorySchema = mongoose.Schema({
    subcategoryId: { type: Number, default: 0 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'category' },
    name: { type: String, default: "" },
    image: { type: String, default: "category/default.jpg" },
    status: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now }

})


const subcategory = module.exports = mongoose.model('subcategory', subcategorySchema)
