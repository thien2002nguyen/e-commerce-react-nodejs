const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    const imageFile = req.file
    if (!title || !description || !category || !imageFile) {
        throw new Error('Missing inputs')
    }
    const data = { title, description, category, image: imageFile.path }
    const response = await Blog.create(data)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Created' : 'Can not create new blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const { title, category, description } = req.body
    const data = {}
    if (title) {
        data.title = title
    }
    if (category) {
        data.category = category
    }
    if (description) {
        data.description = description
    }
    if (req.file) {
        data.image = req.file.path
    }
    const response = await Blog.findByIdAndUpdate(bid, data, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Can not update blog'
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formatedQueries = JSON.parse(queryString)
    let queriesObject = {}
    if (queries?.search) {
        delete formatedQueries.search
        queriesObject = {
            $or: [
                { title: { $regex: queries.search, $options: 'i' } },
                { category: { $regex: queries.search, $options: 'i' } },
            ]
        }
    }
    const allQuery = { ...formatedQueries, ...queriesObject }
    let queryCommand = Blog.find(allQuery)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_BLOG
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    try {
        const response = await queryCommand.exec()
        const counts = await Blog.find(allQuery).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            data: response ? response : 'Can not get blogs',
        });
    } catch {
        throw new Error('Something went wrong')
    }
})

/**
 * Khi người dùng like 1 blog thì:
 * 1. Check xem người đó trước đó có dislike hay không => bỏ dislike
 * 2. Check xem người đó có like hay không => có ? bỏ like : like
 */

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) {
        throw new Error('Missing inputs')
    }
    const blog = await Blog.findById(bid)
    const alreadyDislike = blog?.dislikes?.find(element => element.toString() === _id)
    if (alreadyDislike) {
        const response = await Blog.findByIdAndUpdate(bid,
            { $pull: { dislikes: _id } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Liked' : 'Something went wrong'
        })
    }
    const isLiked = blog?.likes?.find(element => element.toString() === _id)
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid,
            { $pull: { likes: _id } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid,
            { $push: { likes: _id } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            response
        })
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) {
        throw new Error('Missing inputs')
    }
    const blog = await Blog.findById(bid)
    const alreadyLike = blog?.likes?.find(element => element.toString() === _id)
    if (alreadyLike) {
        const response = await Blog.findByIdAndUpdate(bid,
            { $pull: { likes: _id } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            response
        })
    }
    const isDisliked = blog?.dislikes?.find(element => element.toString() === _id)
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid,
            { $pull: { dislikes: _id } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid,
            { $push: { dislikes: _id } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            response
        })
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname')
    return res.status(200).json({
        success: blog ? true : false,
        data: blog ? blog : 'Something went wrong'
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Blog.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Deleted' : 'Something went wrong'
    })
})

module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
}
