const mongoose = require('mongoose');
const { Schema } = mongoose;


const playerSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    townhall_player: {
        type: String,
        required: true,
        trim: true
    },
    townhall_tag: {
        type: String,
        required: true,
        trim: true
    },
    townhall_level: {
        type: String,
        required: true,
        trim: true
    },
    war_stars: {
        type: Number,
        required: true,
        trim: true
    },
    experience_level: {
        type: Number,
        required: true,
        trim: true
    },
    king_level: {
        type: Number,
        required: true,
        trim: true
    },
    queen_level: {
        type: Number,
        required: true,
        trim: true
    },
    warden_level: {
        type: Number,
        required: true,
        trim: true
    },
    royal_champion_level: {
        type: Number,
        required: true,
        trim: true
    },
    walls: {
        type: String,
        required: true,
        trim: true
    },
    playerAddDate: {
        type: String,
        required: true,
        trim: true,
    },
    playerAddedBy: {
        type: String,
        trim: true,
    },
    dateCreated: String,
    dateUpdated: String,
}, { timestamps: true }
);
const Player = mongoose.model('player-collection', playerSchema);
module.exports = Player;