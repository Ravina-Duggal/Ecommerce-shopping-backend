const router = require('express').Router()
const helper = require('../utilities/helpers')


//controllers
const userController = require('../apis/user/userController')

const categoryController = require('../apis/category/categoryController')
const subcategoryController = require('../apis/subcategory/subcategoryController')
const productController = require('../apis/product/productController')
const orderController = require('../apis/order/orderController')
const cartController = require('../apis/cart/cartController')
const dashboardController = require('../apis/dashboard/dashboardController')
const orderDetailController = require('../apis/orderDetail/orderDetailController')

//auth
router.post('/user/login', userController.login)


//user
router.post('/user/add', userController.addUser)
router.post('/user/update', userController.updateUser)

//category
router.post('/category/all', categoryController.getAll)
router.post('/category/single', categoryController.getSingle)

//subcategory
router.post('/subcategory/all', subcategoryController.getAll)
router.post('/subcategory/single', subcategoryController.getSingle)

//product
router.post('/product/all', productController.getAll)
router.post('/product/single', productController.getSingle)


router.use(require('../middleware/tokenChecker'))

//dashboard
router.get('/dashboard', dashboardController.dashboard)


//customer
router.post('/user/all', userController.getAll)
router.post('/user/single', userController.getSingle)


//category

router.post('/category/add', helper.uploadImageFun.single('category_image'), categoryController.addCategory)
router.post('/category/update', helper.uploadImageFun.single('category_image'), categoryController.updateCategory)

//subcategory

router.post('/subcategory/add', helper.uploadImageFun.single('subcategory_image'), subcategoryController.addSubcategory)
router.post('/subcategory/update', helper.uploadImageFun.single('subcategory_image'), subcategoryController.updateSubcategory)

//product

router.post('/product/add', helper.uploadImageFun.single('product_image'), productController.addProduct)
router.post('/product/update', helper.uploadImageFun.single('product_image'), productController.updateProduct)

//customer
router.post('/order/all', orderController.getAll)
router.post('/order/single', orderController.getSingle)
router.post('/order/add', orderController.addOrder)
router.post('/order/update', orderController.updateOrder)

router.post('/orderDetail/all', orderDetailController.getAll)

//cart
router.post('/cart/all', cartController.viewCart)
router.post('/cart/add', cartController.addToCart)
router.post('/cart/remove', cartController.removeCart)



router.all('*', (req, res) => {
    res.send({
        success: false,
        status: 404,
        message: "Invalid Address"
    })
})

module.exports = router
