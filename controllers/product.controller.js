const product = require("../models/product.model")


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
        const { id: taskID } = req.params;
        const task = await product.findOneAndUpdate({ _id: taskID }, req.body)
        if (!task) {
            return res.status(400).json({ success: false, message: "Incorrect id" })
        }
        res.status(200).json({ task })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await product.find({})
        res.send(products);
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
        res.send(products)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }

}

const liveSearch = async (req, res) => {
    try {
        const { name } = req.query
        const skip = Number(req.query.skip) || 0

        const data = await user.find({ name: { $regex: '^' + name, $options: 'i' } }).select("name dp gender _id ").sort({ datetime: -1 }).skip(skip).limit(20)
        res.status(200).json({ success: true, data })
        console.log(data);
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}


module.exports = {
    addProduct,
    updateProduct,
    getAllProduct,
    getProduct
}