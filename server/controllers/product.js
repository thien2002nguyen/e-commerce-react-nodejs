const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs')
    }
    if (req.body?.title) {
        req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Can not create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Can not get product'
    })
})

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // Tách các trường hợp đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])
    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formatedQueries = JSON.parse(queryString)
    let colorQueryObject = {}
    // Filtering
    if (queries?.title) {
        formatedQueries.title = { $regex: queries.title, $options: 'i' }
    }
    if (queries?.category) {
        formatedQueries.category = { $regex: queries.category, $options: 'i' }
    }
    if (queries?.color) {
        delete formatedQueries.color
        const listColor = queries.color?.split(',')
        const colorQuery = listColor.map(element => ({ color: { $regex: element, $options: 'i' } }))
        colorQueryObject = { $or: colorQuery }
    }
    const allQuery = { ...colorQueryObject, ...formatedQueries }
    let queryCommand = Product.find(allQuery)
    // Sorting
    // abc,efg => [abc,efg] => abc efg
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    // Pagination
    // Limit: số object lấy về trong 1 lần gọi API
    // Skip: 2 | ex: 1, 2, 3, ..., 10 | bỏ qua số phần tử [3, 4, ..., 10]
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    // price: {gt: 5000, gte: 3000}
    // Execute query
    // Số lượng thỏa mãn điều kiện !== Số lượng sản phẩm trả về 1 lần gọi API
    try {
        const response = await queryCommand.exec()
        const counts = await Product.find(allQuery).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Can not get products',
        });
    } catch {
        throw new Error('Something went wrong')
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body?.title) {
        req.body.slug = slugify(req.body.title)
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body)
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Can not update product'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid, req.body)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Can not delete product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid, updatedAt } = req.body
    if (!star || !pid) {
        throw new Error('Missing inputs')
    }
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(element => element.postedBy.toString() === _id)
    if (alreadyRating) {
        // Update star & comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
        })
    }
    else {
        // Add star & comment
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true })
    }
    // Sum ratings
    const updatedProduct = await Product.findById(pid)
    const raitingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, element) => sum + +element.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / raitingCount) / 10
    await updatedProduct.save()
    return res.status(200).json({
        success: true,
        updatedProduct,
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) {
        throw new Error('Missing inputs')
    }
    const response = await Product.findByIdAndUpdate(pid, {
        $push: {
            images:
                { $each: req.files.map(element => element.path) }
        }
    }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updateProduct: response ? response : 'Can not upload images product'
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
}