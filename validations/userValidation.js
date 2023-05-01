const { body } = require('express-validator');

const userSignupValidation = [
    body('name', 'Enter A Valid Name').isLength({ min: 3 }),
    body('role', 'Enter A Valid Role').isLength({ min: 3 }),
    body('role', 'Enter Valid Role').isIn(["Leader", "Co-leader", "Elder"]),
    body('email', 'Enter A Valid Email').isEmail(),
    body('password', 'Password Must Be At Least 5 Characters').isLength({ min: 5 })
]

const userLoginValidation = [
    body('email', 'Enter A Valid Email').isEmail(),
    body('password', 'Password Cannot Be Blank').exists()
]
module.exports = { userSignupValidation, userLoginValidation }