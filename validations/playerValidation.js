const { body } = require('express-validator');

const playerAddValidation = [
    body('townhall_player', "Enter A Valid Name").isLength({ min: 1 }),
    body('townhall_tag', "Enter A Valid Tag Of Your TownHall").isLength({ max: 10 }),
    body('townhall_level', "Enter A Valid Level Of Your TownHall").isLength({ maxx: 2 }),
    body('war_stars', "Enter A Valid War Stars").isLength({ max: 4 }),
    body('experience_level', "Enter A Valid Exp Level").isLength({ max: 3 }),
    body('king_level', "Enter A Valid Level Of Your King").isLength({ max: 2 }),
    body('queen_level', "Enter A Valid Level Of Your Queen").isLength({ max: 2 }),
    body('warden_level', "Enter A Valid Level Of Your Warder").isLength({ max: 2 }),
    body('royal_champion_level', "Enter A Valid Level Of Your Royal Champion").isLength({ max: 2 }),
    body('walls', "Enter A Valid Walls").isLength({ max: 3 }),
    body('playerAddDate', "Enter A Valid Date").isLength({ min: 3 }),
]

const playerUpdateValidation = [
    body('townhall_player', "Enter A Valid Name").isLength({ min: 1 }),
    body('townhall_tag', "Enter A Valid Tag Of Your TownHall").isLength({ max: 10 }),
    body('townhall_level', "Enter A Valid Level Of Your TownHall").isLength({ maxx: 2 }),
    body('war_stars', "Enter A Valid War Stars").isLength({ max: 4 }),
    body('experience_level', "Enter A Valid Exp Level").isLength({ max: 3 }),
    body('king_level', "Enter A Valid Level Of Your King").isLength({ max: 2 }),
    body('queen_level', "Enter A Valid Level Of Your Queen").isLength({ max: 2 }),
    body('warden_level', "Enter A Valid Level Of Your Warder").isLength({ max: 2 }),
    body('royal_champion_level', "Enter A Valid Level Of Your Royal Champion").isLength({ max: 2 }),
    body('walls', "Enter A Valid Walls").isLength({ max: 3 }),
    body('playerAddDate', "Enter A Valid Date").isLength({ min: 3 }),
]
module.exports = { playerAddValidation, playerUpdateValidation }