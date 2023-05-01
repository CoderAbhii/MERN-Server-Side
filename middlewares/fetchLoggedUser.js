const jwt = require('jsonwebtoken');
require("dotenv").config();

const fetchLoggeduser = async (req, res, next) => {
    try {
        const token = req.header('key');
        if (!token) {
            res.status(401).json({
                success: false,
                errorMessage: "Access denied. Login required..!!"
            });
        }
        else {
            const decodedToken = await jwt.verify(token, process.env.APP_SECRET);
            req.user = decodedToken.user;
            next();
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            errorMessage: "Session Time Out. Please Login Again."
        });
    }
}

module.exports = fetchLoggeduser;