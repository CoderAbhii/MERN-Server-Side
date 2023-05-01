const router = require("express").Router();
const { playerAddController, getAllPlayerController, getUsersPlayerController, getSingleplayerController, updatePlayerController, deletePlayerController, exportToCsv } = require("../controllers/playerController");
const fetchAdminUser = require("../middlewares/fetchAdminUser");
const fetchLoggeduser = require("../middlewares/fetchLoggedUser");
const { playerAddValidation, playerUpdateValidation } = require("../validations/playerValidation");

router.post('/add-player', fetchLoggeduser, playerAddValidation, playerAddController)

router.get('/get-all-player', fetchAdminUser, getAllPlayerController)

router.get('/get-users-player', fetchLoggeduser, getUsersPlayerController)

router.get('/get-player/:id', fetchLoggeduser, getSingleplayerController)

router.put('/update-player/:id', fetchLoggeduser, playerUpdateValidation, updatePlayerController)

router.delete('/delete-player/:id', fetchAdminUser, deletePlayerController)

router.get('/export-csv', fetchAdminUser, exportToCsv)


module.exports = router;