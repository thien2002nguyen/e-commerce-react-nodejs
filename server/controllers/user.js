const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')

// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstname, lastname, phone } = req.body
//     // kiểm tra dữ liệu truyền lên
//     if (!email || !password || !firstname || !lastname || !phone) {
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs'
//         })
//     }
//     // check email và phone tồn tại hay không
//     const response = await User.findOne({ email }) || await User.findOne({ phone })
//     if (response) {
//         throw new Error('User has existed')
//     }
//     else {
//         // tạo tài khoản người dùng mới
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfully. Please go login' : 'Something went wrong'
//         })
//     }
// })

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, phone } = req.body
    // kiểm tra dữ liệu truyền lên
    if (!email || !password || !firstname || !lastname || !phone) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    // check email hoặc phone tồn tại hay không
    const response = await User.findOne({ email }) || await User.findOne({ phone })
    if (response) {
        throw new Error('User has existed')
    }
    else {
        const token = makeToken()
        res.cookie('dataRegister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        const html = `Click the link to complete the account registration process.
            This link will expire 15 minutes from now 
            <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
        await sendMail({ email, html, subject: 'Success Register Digital World' })
        return res.status(200).json({
            success: true,
            mes: 'Please check your email to active account'
        })
    }
})
const finalRegister = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    const { token } = req.params
    if (!cookie || cookie?.dataRegister?.token !== token) {
        res.clearCookie('dataRegister')
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    }
    const newUser = await User.create({
        email: cookie?.dataRegister?.email,
        password: cookie?.dataRegister?.password,
        phone: cookie?.dataRegister?.phone,
        firstname: cookie?.dataRegister?.firstname,
        lastname: cookie?.dataRegister?.lastname,
    })
    res.clearCookie('dataRegister')
    if (newUser) {
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    }
    else {
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
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
    // check email hay phone tồn tại hay không
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
        // res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData,
            refreshToken: newRefreshToken
        })
    }
    else {
        throw new Error('Invalid credentials')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    // select | tên các trường cần lấy | thêm (-) trước các trường không cần lấy
    const user = await User.findById(_id).select('-refreshToken -password').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'quantity sold'
        }
    }).populate('wishlist', 'title thumb price color description')
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
    const { email } = req.body
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
    const html = `Click the link to change your account password.  
        This link will expire 15 minutes from now 
        <a href=${process.env.CLIENT_URL}/resetpassword/${resetToken}>Click here</a>`
    const data = {
        email,
        html,
        subject: 'Forgot Password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs?.response?.includes('OK') ? true : false,
        mes: rs?.response?.includes('OK') ? 'Please check your email to active account'
            : 'Something went wrong. Please try later'
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
    const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formatedQueries = JSON.parse(queryString)
    if (queries?.name) {
        formatedQueries.name = { $regex: queries.name, $options: 'i' }
    }
    if (req.query.search) {
        delete formatedQueries.search
        formatedQueries['$or'] = [
            { firstname: { $regex: req.query.search, $options: 'i' } },
            { lastname: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    }
    let queryCommand = User.find(formatedQueries)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.USERS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    try {
        const response = await queryCommand.exec()
        const counts = await User.find(formatedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Can not get users',
        });
    } catch {
        throw new Error('Something went wrong')
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} delete` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { firstname, lastname, email, phone, address } = req.body
    if (!_id || !firstname || !lastname || !email || !phone) {
        throw new Error('Missing inputs')
    }
    const data = { firstname, lastname, email, phone, address }
    if (req.file) {
        data.avatar = req.file.path
    }
    const response = await User.findByIdAndUpdate(_id, data, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong'
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
        mes: response ? 'Updated' : 'Something went wrong'
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { address } = req.body
    if (!address) {
        throw new Error('Missing inputs')
    }
    const response = await User.findByIdAndUpdate(_id, { address: address }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated address' : 'Something went wrong'
    })
})

const updateProductCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity = 1, color, price, thumb, title } = req.body
    if (!pid || !color || !price || !thumb || !title) {
        throw new Error('Missing inputs')
    }
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(element => element.product.toString() === pid)
    if (alreadyProduct && alreadyProduct?.color === color) {
        const response = await User.updateOne(
            { cart: { $elemMatch: alreadyProduct } },
            {
                $set: {
                    'cart.$.quantity': quantity,
                    'cart.$.price': price,
                    'cart.$.thumb': thumb,
                    'cart.$.title': title
                }
            },
            { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Product added to cart' : 'Something went wrong'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id,
            { $push: { cart: { product: pid, quantity, color, price, thumb, title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Product added to cart' : 'Something went wrong'
        })
    }
})

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(element => element.product.toString() === pid &&
        element.color.toLowerCase() === color.toLowerCase())
    if (!alreadyProduct) {
        return res.status(401).json({
            success: false,
            mes: 'Cart not found'
        })
    }
    const response = await User.findByIdAndUpdate(
        _id,
        { $pull: { cart: { product: pid, color } } },
        { new: true }
    )
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Product removed from cart' : 'Something went wrong'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { cart } = req.body
    if (!_id || !cart) {
        throw new Error('Missing inputs')
    }
    const response = await User.findByIdAndUpdate(_id, { cart: cart }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated cart' : 'Something went wrong'
    })
})

const updateWishlist = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { _id } = req.user
    const user = await User.findById(_id)
    const alreadyInWishlist = user.wishlist?.find(element => element.toString() === pid)
    if (alreadyInWishlist) {
        const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: pid } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Removed product from wishlist' : 'Failed to update wishlist'
        })
    }
    else {
        const response = await User.findByIdAndUpdate(_id, { $push: { wishlist: pid } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Add product to wishlist' : 'Failed to update wishlist'
        })
    }
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
    updateUserAddress,
    updateProductCart,
    finalRegister,
    removeProductInCart,
    updateCart,
    updateWishlist,
}