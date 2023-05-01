const jwt = require('jsonwebtoken');
require("dotenv").config();

const fetchAdminUser = async (req, res, next) => {
    try {
        const token = req.header('auth');
        if (!token) {
            res.status(401).json({
                success: false,
                errorMessage: "Ops you haven't access..!!"
            });
        }
        else {
            const decodedToken = await jwt.verify(token, process.env.APP_SECRET);
            req.user = decodedToken.user;
            const role = req.user.role;
            if (role != "Leader") {
                res.status(401).json({
                    success: false,
                    errorMessage: "Ops access denied"
                })
            }
            else {
                next();
            }
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            errorMessage: "Session Time Out. Please Login Again."
        });
    }
}

module.exports = fetchAdminUser