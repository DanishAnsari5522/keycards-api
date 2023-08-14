const express = require("express")
const route = express.Router()
const { addProduct, updateProduct, getAllProduct, getProduct } = require("../controllers/product.controller")

route.post("/addProduct", addProduct)
route.get("/getAllProduct", getAllProduct)
route.get("/filterProduct/:filterCategory", getProduct)
route.route('/updateProduct/:id').put(updateProduct)


module.exports = route