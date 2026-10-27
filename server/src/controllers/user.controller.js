const User = require("../models/userModel");

const getUsers = async (req, res) => {
    const users = await User.find();
    if (users.length === 0)
        return res.status(404).json({ error: "Users not found." });
    res.json(users);
};

const getUserByName = async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
};

const getRecentUsers = async (req, res) => {
    const users = await User.find()
        .sort({ created_at: -1 })
        .limit(10);
    if (users.length === 0)
        return res.status(404).json({ error: "Users not found." });
    res.json(users);
};

const createUser = async (req, res) => {
    const { email, username, password, bio } = req.body;

    // Check if all required fields are provided
    if (!email || !username || !password)
        return res.status(400).json({ error: "Email, username, and password are required." });

    // Check if the username is already taken
    if (await User.findOne({ username }))
        return res.status(409).json({ error: "That username is already taken." });

    // Check if the email is already in use
    if (await User.findOne({ email }))
        return res.status(409).json({ error: "That email is already in use." });

    const user = await User.create({ email, username, password, bio });

    // Remove the password before sending the user back
    const { password: _removed, ...safeUser } = user.toObject();

    // Return the user
    res.json(safeUser);
};

const login = async (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are provided
    if (!username || !password)
        return res.status(400).json({ error: "Username and password are required." });

    // Check if the username and password provided are valid
    const user = await User.findOne({ username });
    if (!user || user.password !== password)
        return res.status(401).json({ error: "Invalid username or password." });

    // Remove the password before sending the user back
    const { password: _removed, ...safeUser } = user.toObject();

    // Return the user
    res.json(safeUser);
};

const addPastGame = async (req, res) => {
    const { word, guessed_words } = req.body;

    // Check if all required fields are provided
    if (!word || !Array.isArray(guessed_words) || guessed_words.length === 0)
        return res.status(400).json({ error: "word and guessed_words are required." });

    // Check if the user exists
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found." });

    // A win means the last guess was the word
    const won =
        guessed_words[guessed_words.length - 1].toUpperCase() === word.toUpperCase();

    // Add the new game to the user's past games
    user.past_games.push({ word, guessed_words, date: new Date() });

    // Update the user's streak if won
    user.streak = won ? user.streak + 1 : 0;

    // Save the updated user
    await user.save();

    // Return the result
    res.json({ game: user.past_games.at(-1), streak: user.streak });
};

module.exports = {
    login,
    createUser,
    addPastGame,
    getUsers,
    getUserByName,
    getRecentUsers,
};