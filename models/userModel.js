const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    role: {
        type: String,
        require: true,
        trim: true,
        enum: ["Leader", "Co-leader", "Elder"]
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    verifytoken: {
        type: String
    },
    dateCreated: Date,
    dateUpdated: Date
});
const userModel = mongoose.model('user-collection', userSchema);
module.exports = userModel;