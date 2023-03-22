const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    userprofile: {
        type: String,
        required: true,
        unique: true,
    },
    progress: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    }
});

module.exports = mongoose.model("user", userSchema);