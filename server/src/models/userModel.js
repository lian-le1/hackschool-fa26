const mongoose = require("mongoose");
const PastGameSchema = require("./pastGameSchema");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            default: ""
        },
        streak: {
            type: Number,
            default: 0
        },
        past_games: {
            type: [PastGameSchema],
            default: []
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { _id: true }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;