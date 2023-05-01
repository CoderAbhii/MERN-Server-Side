const router = require("express").Router();
const { userSignUpController, userLoginController, userLoggedController, getAllUserController, getSingleUserController, userDeleteController, emailSendController, forgotPasswordController } = require("../controllers/userController");
const fetchLoggeduser = require("../middlewares/fetchLoggedUser");
const fetchAdminUser = require("../middlewares/fetchAdminUser");
const { userSignupValidation, userLoginValidation } = require("../validations/userValidation");

router.post('/user-signup', fetchAdminUser, userSignupValidation, userSignUpController);

router.post('/user-login', userLoginValidation, userLoginController);

router.post('/logged-user', fetchLoggeduser, userLoggedController);

router.get('/all-users', fetchAdminUser, getAllUserController);

router.get('/user/:id', fetchAdminUser, getSingleUserController);

router.delete('/user-delete/:id', fetchAdminUser, userDeleteController);

router.post('/send-email-password-link', emailSendController);

router.post('/forgot-password/:id/:token', forgotPasswordController);

module.exports = router;