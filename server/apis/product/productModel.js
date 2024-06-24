const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    productId: { type: Number, default: 0 },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'subcategory' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'category' },
    price: { type: Number, default: 0 },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "category/default.jpg" },
    status: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now }

})


const product = module.exports = mongoose.model('product', productSchema)
