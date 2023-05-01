const PlayerModel = require("../models/playerModel")
const { validationResult } = require('express-validator');
const moment = require("moment");
const csv = require('fast-csv');
const fs = require('fs');


const playerAddController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                nbErr: errors.array().length
            });
        }
        const { townhall_player, townhall_tag, townhall_level, war_stars, experience_level, king_level, queen_level, warden_level, royal_champion_level, walls, playerAddDate } = req.body;

        let player = await PlayerModel.findOne({ townhall_tag });
        if (player) {
            return res.status(400).json({
                success: false,
                errorMessage: "Player already exist with this townhall tag"
            });
        }
        const dateCreated = moment(new Date()).format('LL');
        const playerData = new PlayerModel({
            townhall_player, townhall_tag, townhall_level, war_stars, experience_level, king_level, queen_level, warden_level, royal_champion_level, walls, playerAddDate, dateCreated, playerAddedBy: req.user.name, user: req.user.id
        })
        const savedPlayer = await playerData.save();
        let playerName = savedPlayer.townhall_player;
        success = true;
        res.status(200).json({
            success: true,
            successMessage: `${playerName} - Player Added Successfully on ${dateCreated}`,
            playerAddedBy: req.user.name
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const getAllPlayerController = async (req, res) => {
    try {
        const { player } = req.query;
        const sort = req.query;
        const { date } = req.query;
        const page = req.query.page || 1


        const ITEM_PER_PAGE = 5;
        const skip = (page - 1) * ITEM_PER_PAGE;

        const count = await PlayerModel.countDocuments();
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        const searchResult = player ? { townhall_player: { $regex: player, $options: "i" } }: {}

        const searchResultDate = date? {playerAddDate: date} : searchResult

        const allPlayer = await PlayerModel.find(searchResultDate).sort({ createdAt: sort.sort == "New" ? -1 : 1 }).limit(ITEM_PER_PAGE + skip);
        res.status(200).json({
            success: true,
            allPlayer,
            total_docs: count,
            total_pages: pageCount,
            current_page: page,
            players_per_page: ITEM_PER_PAGE
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const getUsersPlayerController = async (req, res) => {
    try {
        const { player } = req.query;
        const sort = req.query;
        const page = req.query.page || 1


        const ITEM_PER_PAGE = 3;
        const skip = (page - 1) * ITEM_PER_PAGE;

        const count = await PlayerModel.countDocuments({ user: req.user.id });
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        const seachResult = player ? { user: req.user.id, townhall_player: { $regex: player, $options: "i" } } : { user: req.user.id }

        const allPlayer = await PlayerModel.find(seachResult).sort({ createdAt: sort.sort == "New" ? -1 : 1 }).limit(ITEM_PER_PAGE + skip);

        res.status(200).json({
            success: true,
            allPlayer,
            total_docs: count,
            total_pages: pageCount,
            current_page: page,
            players_per_page: ITEM_PER_PAGE
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const getSingleplayerController = async (req, res) => {
    try {
        let playerData = await PlayerModel.findById(req.params.id);
        if (!playerData) {
            return res.status(404).json({
                success: false,
                errorMessage: "Player not found"
            });
        }

        else if (req.user.role == "Leader") {
            playerData = await PlayerModel.findById(req.params.id);
            res.status(200).json({
                success: true,
                playerData,
                total_players: playerData.length
            });
        }
        else if (playerData.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                errorMessage: "Not allowed"
            });
        }

        else if (playerData.user.toString() == req.user.id) {
            playerData = await PlayerModel.findById(req.params.id);
            res.status(200).json({
                success: true,
                playerData,
                total_players: playerData.length
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

const updatePlayerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                nbErr: errors.array().length
            });
        }
        const { townhall_player, townhall_tag, townhall_level, war_stars, experience_level, king_level, queen_level, warden_level, royal_champion_level, walls, playerAddDate } = req.body;

        const updatePlayer = {};
        if (townhall_player) { updatePlayer.townhall_player = townhall_player };
        if (townhall_tag) { updatePlayer.townhall_tag = townhall_tag };
        if (townhall_level) { updatePlayer.townhall_level = townhall_level };
        if (war_stars) { updatePlayer.war_stars = war_stars };
        if (experience_level) { updatePlayer.experience_level = experience_level };
        if (king_level) { updatePlayer.king_level = king_level };
        if (queen_level) { updatePlayer.queen_level = queen_level };
        if (warden_level) { updatePlayer.warden_level = warden_level };
        if (royal_champion_level) { updatePlayer.royal_champion_level = royal_champion_level };
        if (walls) { updatePlayer.walls = walls };
        if (playerAddDate) { updatePlayer.playerAddDate = playerAddDate };


        let playerData = await PlayerModel.findById(req.params.id);
        if (!playerData) {
            return res.status(404).json({
                success: false,
                errorMessage: "Player Not Found"
            });
        }
        let playerTag = await PlayerModel.findOne({ townhall_tag: req.body.townhall_tag });
        if (!playerTag) {
            return res.status(400).json({
                success: false,
                errorMessage: "Playe tag cannot be changed"
            });
        }
        else if (req.user.role == "Leader") {
            const dateUpdated = moment(new Date()).format('LLLL');
            playerData = await PlayerModel.findByIdAndUpdate(req.params.id, { $set: updatePlayer, dateUpdated }, { new: true })
            let playerName = playerData.townhall_player;
            res.status(200).json({
                success: true,
                updatedBy: req.user.role,
                successMessage: `${playerName} - Player Updated Successfully on ${dateUpdated}`
            });
        }
        else if (playerData.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                errorMessage: "Not Allowed"
            });
        }
        else if (playerData.user.toString() == req.user.id) {
            const dateUpdated = moment(new Date()).format('LLLL');
            playerData = await PlayerModel.findByIdAndUpdate(req.params.id, { $set: updatePlayer, dateUpdated }, { new: true })
            let playerName = playerData.townhall_player;
            res.status(200).json({
                success: true,
                updatedBy: req.user.role,
                successMessage: `${playerName} - Player Updated Successfully on ${dateUpdated}`
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

const deletePlayerController = async (req, res) => {
    try {
        let playerData = await PlayerModel.findById(req.params.id);
        if (!playerData) {
            return res.status(404).json({
                success: false,
                errorMessage: "Player Not Found"
            });
        }
        playerData = await PlayerModel.findByIdAndDelete(req.params.id);
        let playerName = playerData.townhall_player;
        res.status(200).json({
            success: true,
            successMessage: `${playerName} - Player Deleted Successfully`
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}

const exportToCsv = async (req, res) => {
    try {
        const sort = req.query;
        const allPlayer = await PlayerModel.find().sort({ createdAt: sort.sort == "New" ? -1 : 1 });

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export/")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/");
            }
            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/reservations.csv"
        );

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.status(200).json({
                downloadUrl: `http://localhost:7000/files/export/reservations.csv`,
            });
        });
        if (allPlayer.length > 0) {
            allPlayer.map((element) => {
                csvStream.write({
                    PlayerName: element.townhall_player ? element.townhall_player : "No data",
                    PlayerTag: element.townhall_tag ? element.townhall_tag : "No data",
                    PlayerTownHall: element.townhall_level ? element.townhall_level : "No data",
                    WarStars: element.war_stars ? element.war_stars : "No data",
                    PlayerXpLevel: element.experience_level ? element.experience_level : "No data",
                    KingLevel: element.king_level ? element.king_level : "No data",
                    QueenLevel: element.queen_level ? element.queen_level : "No data",
                    Wardenlevel: element.warden_level ? element.warden_level : "No data",
                    RoyalChampionLevel: element.royal_champion_level ? element.royal_champion_level : "No data",
                    Walls: element.walls ? element.walls : "No data",
                    PlayerAddedDate: element.playerAddDate ? element.playerAddDate : "No data"
                })
            })
        }
        csvStream.end();
        writablestream.end();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
    }
}


module.exports = {
    playerAddController, getAllPlayerController, getUsersPlayerController, getSingleplayerController
    , updatePlayerController, deletePlayerController, exportToCsv
}