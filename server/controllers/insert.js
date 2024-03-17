const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const data = require('../../data/ecommerce.json')
const ProductCategory = require('../models/productCategory')
const categoryData = require('../../data/cate_brand')
const categoryBlog = require('../../data/cate_blog')
const slugify = require('slugify')
const BlogCategory = require('../models/blogCategory')

const fn = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 1000) + '',
        description: product?.description,
        brand: product?.brand,
        thumb: product?.thumb,
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100 / 23500),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 100),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(element => element.label === 'Color')?.variants[0] || 'WHITE',
        totalRatings: 0
    })
}

const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for (let product of data) {
        promises.push(fn(product))
    }
    await Promise.all(promises)
    return res.status(200).json('Done')
})

const fn_category = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image
    })
}

const insertCategory = asyncHandler(async (req, res) => {
    const promises = []
    for (let cate of categoryData) {
        promises.push(fn_category(cate))
    }
    await Promise.all(promises)
    return res.status(200).json('Done')
})

const fn_blogcategory = async (cate) => {
    await BlogCategory.create({
        title: cate
    })
}

const insertBlogCategory = asyncHandler(async (req, res) => {
    const promises = []
    for (let cate of categoryBlog) {
        promises.push(fn_blogcategory(cate))
    }
    await Promise.all(promises)
    return res.status(200).json('Done')
})

module.exports = {
    insertProduct,
    insertCategory,
    insertBlogCategory,
}