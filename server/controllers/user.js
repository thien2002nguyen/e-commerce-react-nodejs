const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')

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
    if (response && await response?.isCorrectPassword(password)) {
        // tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
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

const refreshAccessToken = asyncHandler(async (req, res) => {
    // lấy token từ cookies
    const cookie = req.cookies
    // check trong cookies có refresh token không
    if (!cookie?.refreshToken) {
        throw new Error('No refresh token in cookies')
    }
    // check token có hợp lệ hay không
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            return res.status(401).json({
                success: false,
                mes: 'Invalid refresh token'
            })
        }
        // check xem refreshToken có khớp với refreshToken trong database hay không
        const response = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken })
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ?
                generateAccessToken(response.id, response.role) : 'Refresh token not matched'
        })
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    // check có refresh token trong cookies không
    if (!cookie && !cookie?.refreshToken) {
        throw new Error('No refresh token in cookies')
    }
    // xóa refresh token ở database
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // xóa refresh token ở trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is successfully'
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    // client gửi email
    const { email } = req.query
    // check email có được gửi lên hay không
    if (!email) {
        throw new Error('Missing email')
    }
    // check email có trong database hay không
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('User not found')
    }
    // tạo reset token và lưu vào database
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    // gửi email để reset password
    const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. 
    Link này sẽ hết hạn sau 15 phút kể từ bây giờ 
    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`
    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    // lấy password và token được gửi lên từ client
    const { password, token } = req.body
    if (!password || !token) {
        throw new Error('Missing inputs')
    }
    // check xem reset token hợp lệ hay không
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) {
        throw new Error('Invalid reset token')
    }
    // thay đổi password tài khoản và lưu vào database
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangeAt = Date.now()
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) {
        throw new Error('Missing inputs')
    }
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} delete` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs')
    }
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? response : 'Something went wrong'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs')
    }
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? response : 'Something went wrong'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
}