const product = require("../models/product.model")
const mongoose = require('mongoose');


const addProduct = async (req, res) => {
    try {
        let { companyName, category, logoURL, productLink, discription } = req.body
        let categoryData;
        if (!companyName || !category || !logoURL || !productLink || !discription) {
            return res.status(400).json({ success: false, message: "companyName, category, logoURL, productLink, discription  are required" })
        }
        if (category) {
            categoryData = category.split(",")
        }
        const data = await product.create({ companyName, category: categoryData, logoURL, productLink, discription })
        return res.status(200).json({ success: true, message: data })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id: productID } = req.params;
        const data = await product.findOneAndUpdate({ _id: productID }, req.body)
        if (!data) {
            return res.status(400).json({ success: false, message: "Incorrect id" })
        }
        res.status(200).json({ success: true, message: data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await product.find({})
        res.send(products.reverse());
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getProduct = async (req, res) => {
    try {
        const { filterCategory: filterProduct } = req.params;
        const products = await product.find({ category: filterProduct });
        if (!products) {
            return res.status(400).json({ success: false, message: "Incorrect id" })
        }
        res.send(products.reverse())

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }

}


const getProductById = async (req, res) => {
    try {
        let _id = req.query.id
        if (!_id) {
            return res.status(404).json({ success: false, message: "id is not provided" })
        }
        if (mongoose.Types.ObjectId.isValid(_id)) {
            _id = mongoose.Types.ObjectId(_id)
            const userInfo = await product.findOne({ _id }).select('_id companyName category logoURL productImage productLink discription comment vote')
            if (!userInfo) {
                return res.status(404).json({ success: false, message: 'user not found' })
            }

            return res.status(200).json({
                success: true, data: {
                    companyName: userInfo.companyName,
                    _id: userInfo._id,
                    category: userInfo.category,
                    logoURL: userInfo.logoURL,
                    productImage: userInfo.productImage,
                    productLink: userInfo.productLink,
                    discription: userInfo.discription,
                    comment: userInfo.comment,
                    vote: userInfo.vote,
                }
            })
        } else {
            return res.status(401).json({ success: false, message: "invalid id" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}


module.exports = {
    addProduct,
    updateProduct,
    getAllProduct,
    getProduct,
    getProductById
}