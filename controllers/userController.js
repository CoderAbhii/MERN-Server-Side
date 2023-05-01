const UserModel = require("../models/userModel");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require("path")
require("dotenv").config();



let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.Mail_User,
        pass: process.env.Mail_Password,
    },
});


const userSignUpController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                nbErr: errors.array().length
            });
        }
        let email = await UserModel.findOne({ email: req.body.email });
        if (email) {
            return res.status(400).json({
                success: false,
                errorMessage: "User already exist with this email"
            })
        }
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);
        const dateCreated = moment(new Date()).format('LLL');

        let user = await UserModel.create({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            password: hashedPassword,
            dateCreated
        });
        const data = {
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        }
        const authenticationToken = jwt.sign(data, process.env.APP_SECRET, { expiresIn: '9h' });

        let userName = user.name
        res.status(200).json({
            success: true,
            authenticationToken,
            successMessage: `${userName} Sign Up Successfully`,
            date: dateCreated,
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const userLoginController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                nbErr: errors.array().length
            });
        }
        const { email, password } = req.body;
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                errorMessage: "Invalid Credintials"
            });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({
                success: false,
                errorMessage: "Invalid Credintials"
            });
        }
        const data = {
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        }
        const authenticationToken = jwt.sign(data, process.env.APP_SECRET, { expiresIn: '9h' });
        let name = user.name;
        const loginTime = moment(new Date()).format('LLL');
        res.status(200).json({
            success: true,
            authenticationToken,
            user: name,
            successMessage: `${name} Login Successfully`,
            time: `Logged On - ${loginTime}`
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const userLoggedController = async (req, res) => {
    try {
        let UserId = req.user.id;
        const user = await UserModel.findById(UserId);
        res.status(200).json({
            success: true,
            user: user.name,
            role: req.user.role,
            successMessage: `Logged in user name is ${user.name}`,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const getAllUserController = async (req, res) => {
    try {
        const allUsers = await UserModel.find().select("-password");
        return res.status(200).json({
            success: true,
            allUsers,
            total_users: allUsers.length
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const getSingleUserController = async (req, res) => {
    try {
        const userId = await UserModel.findById(req.params.id).select("-password");
        if (!userId) {
            res.status(404).json({
                success: false,
                errorMessage: "User not found"
            });
        }
        else {
            res.status(200).json({
                success: true,
                userId
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const userDeleteController = async (req, res) => {
    try {
        let userDetails = await UserModel.findById(req.params.id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                successMessage: "User Not Found"
            });
        }
        userDetails = await UserModel.findByIdAndDelete(req.params.id);
        let userDeleted = userDetails.name;
        res.status(200).json({
            success: true,
            successMessage: `${userDeleted} - Deleted Successfully`
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const emailSendController = async (req, res) => {
    try {
        const { email } = req.body;
        let findUser = await UserModel.findOne({ email });
        if (!findUser) {
            return res.status(400).json({
                success: false,
                errorMessage: "Invalid Credintials"
            });
        }
        const token = jwt.sign({ _id: findUser._id }, process.env.APP_SECRET, { expiresIn: '120s' });

        const setUserToken = await UserModel.findByIdAndUpdate({ _id: findUser._id }, { verifytoken: token }, { new: true });
        if (setUserToken) {

            transporter.use('compile', hbs({
                viewEngine: {
                    extName: ".handlebars",
                    partialsDir: path.resolve('views'),
                    defaultLayout: false,
                },
                viewPath: path.resolve('views'),
                extName: ".handlebars",
            }));

            const mailOption = ({
                from: "predatorabhi2802@gmail.com",
                to: email,
                subject: "Password reset email",
                template: 'email',
                context: {
                    id: findUser._id,
                    token: setUserToken.verifytoken
                },
            });
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(400).json({
                        success: false,
                        errorMessage: "Email not send"
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        successMessage: "We have send you password reset link on your email id"
                    });
                }
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: true,
            errorMessage: "Internal Server Error"
        });
    }
}

const forgotPasswordController = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;


        const validUser = await UserModel.findOne({ _id: id, verifytoken: token });

        const checkTokenValid = await jwt.verify(token, process.env.APP_SECRET);

        if (validUser && checkTokenValid._id) {
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(password, salt);
            const setNewUserPassword = await UserModel.findByIdAndUpdate({ _id: id }, { password: newPassword });

            res.status(200).json({
                success: true,
                user: setNewUserPassword.name,
                successMessage: "Password reset successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                errorMessage: "Invalid credintials"
            })
        }

    } catch (error) {
        if (error.message == "jwt expired") {
            res.status(408).json({
                success: false,
                errorMessage: "You link expired pls try again"
            });
        }
        else {
            console.log(error.message)
            res.status(500).json({
                success: false,
                errorMessage: "Internal Server Error"
            });
        }
    }
}

module.exports = { userSignUpController, userLoginController, userLoggedController, getAllUserController, getSingleUserController, userDeleteController, emailSendController, forgotPasswordController }