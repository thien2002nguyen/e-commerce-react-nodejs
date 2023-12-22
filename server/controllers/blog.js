const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    if (!title || !description || !category) {
        throw new Error('Missing inputs')
    }
    const response = await Blog.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Can not create new blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs')
    }
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Can not update blog'
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()
    return res.status(200).json({
        success: response ? true : false,
        blogs: response ? response : 'Can not get blogs'
    })
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
            response
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
        response: blog ? blog : 'Something went wrong'
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.status(200).json({
        success: blog ? true : false,
        deleteBlog: blog ? blog : 'Something went wrong'
    })
})

const uploadImageBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    if (!req.file) {
        throw new Error('Missing inputs')
    }
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Can not upload image blog'
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
    uploadImageBlog,
}
