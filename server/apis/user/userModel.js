const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    userId: { type: Number, default: 0 }
    ,
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    userType: { type: Number, default: 2 },// 1=> Admin, 2=> Customer

    createdAt: { type: Date, default: Date.now }

})


const User = module.exports = mongoose.model('user', userSchema)
