const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken, generalResetToken} = require("./JwtService")
const EmailService = require("../services/EmailService")
const jwt = require('jsonwebtoken')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password} = newUser
        try {
            const checkUserEmail = await User.findOne({
                email: email
            })
            if (checkUserEmail !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại!'
                })
            }
            const checkUserName = await User.findOne({
                name: name
            })
            if (checkUserName !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Tên đăng nhập đã tồn tại!'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
               
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            console.log(checkUser._id)
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại!'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Email hoặc mật khẩu không chính xác!'
                })
            }
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token, 
                userId: checkUser._id
            })
        } catch (e) {
            console.log('e', e)
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const forgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
           
            const user = await User.findOne({ email });
       
            // Kiểm tra xem người dùng có tồn tại không
            if (!user) {
                resolve( {
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại!'
                })
            }
            console.log('user', user);

            // Tạo token reset password
            const resetToken = await generalResetToken(user._id);

            // Gửi email chứa liên kết để reset mật khẩu
            await EmailService.sendResetPasswordEmail(user._id, email, resetToken);

            resolve({
                status: 'OK',
                message: 'Vui lòng kiểm tra email để đặt lại mật khẩu!'
            })
        } catch (e) {
            // Ghi lại lỗi cụ thể và trả về thông báo lỗi
            console.error('Lỗi trong quá trình thực hiện reset mật khẩu:', e);
            return reject({
                message: 'Có lỗi xảy ra trong quá trình thực hiện reset mật khẩu.'
            });
        }

    })
};

const resetPassword = (id, token, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra người dùng tồn tại
            const checkUser = await User.findOne({ _id: id });
            if (!checkUser) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại!'
                });
            }

            // Xác thực token
            jwt.verify(token, process.env.RESET_TOKEN, (err, decoded) => {
                if (err) {
                    reject({
                        status: 'ERR',
                        message: 'Lỗi với token'
                    });
                } else {
                
                    bcrypt.hash(password, 10)
                    .then(hash => {
                
                        User.findByIdAndUpdate({_id: id}, {password: hash})
                        .then(() => {
                            resolve({
                                status: 'OK',
                                message: 'Mật khẩu đã được cập nhật thành công!'
                            });
                        })
                        .catch(err => {
                            reject({
                                status: 'ERR',
                                message: 'Có lỗi xảy ra khi cập nhật mật khẩu!'
                            });
                        });
                    })
                    .catch(err => {
                        console.error('Lỗi  mật khẩu:', err)
                        reject({
                            status: 'ERR',
                            message: 'Có lỗi xảy ra khi mã hóa mật khẩu!'
                        });
                    });
                }
            });
        } catch (e) {
            console.error('Lỗi trong quá trình thực hiện reset mật khẩu:', e)
            reject({
                status: 'ERR',
                message: 'Có lỗi xảy ra khi xử lý yêu cầu!'
            });
        }
    });
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    forgotPassword,
    resetPassword
}