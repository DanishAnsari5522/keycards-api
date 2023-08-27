const express = require("express")
const route = express.Router()
const authlogin = require("../middleware/auth.middleware")

const { addProduct, updateProduct, getAllProduct, getProduct,getProductById } = require("../controllers/product.controller")

route.post("/addProduct",authlogin, addProduct)
route.get("/getAllProduct", getAllProduct)
route.get("/filterProduct/:filterCategory", getProduct)
route.route('/updateProduct/:id').put(updateProduct)
route.route("/getProductById").get(getProductById)


module.exports = route