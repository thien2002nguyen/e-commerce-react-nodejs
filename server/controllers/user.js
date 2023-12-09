const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    // kiểm tra dữ liệu truyền lên
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    // check email tồn tại hay không
    const user = await User.findOne({ email })
    if (user) {
        throw new Error('User has existed')
    }
    else {
        // tạo tài khoản người dùng mới
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login' : 'Something went wrong'
        })
    }
})

// Refresh token => cấp mới access token
// Access token => xác thực người dùng và phân quyền
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // check dữ liệu truyền lên
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    // check email tồn tại hay không
    const response = await User.findOne({ email })
    // check password đúng hay sai
    if (response && await response.isCorrectPassword(password)) {
        // tách password và role ra khỏi response
        const { password, role, ...userData } = response.toObject()
        // tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // tạo refresh token
        const refreshToken = generateRefreshToken(response._id)
        // lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true })
        // lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    }
    else {
        throw new Error('Invalid credentials')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    // select | tên các trường cần lấy | thêm (-) trước các trường không cần lấy
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
}