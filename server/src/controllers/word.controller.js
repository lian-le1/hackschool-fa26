const fs = require("fs");
const path = require("path");

const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Backup list of ~12,000 five-letter words, used if the dictionary API is down.
const FALLBACK_WORDS = new Set(
    fs.readFileSync(path.join(__dirname, "../data/words.txt"), "utf8").split("\n")
);

const checkWord = async (req, res) => {
    // Step 2: Read the word from the URL, as lowercase
    const word = (req.params.word || "").toLowerCase();

    // Step 3: Validate the input (must be exactly 5 letters)
    if (!/^[a-z]{5}$/.test(word))
        return res.status(400).json({ error: "Word must be exactly 5 letters." });

    // Steps 4 + 5a: Ask the dictionary API, with a backup plan
    try {
        const response = await fetch(DICTIONARY_API + word, {
            signal: AbortSignal.timeout(200),
        });

        // 200 = word exists, 404 = word doesn't exist
        if (response.status === 200 || response.status === 404) {
            const valid = response.status === 200;
            return res.json({ word, valid, source: "api" });
        }
    } catch (err) {
        console.error("Dictionary API request failed; using fallback word list:", err.message);
    }

    // Step 5b: Fallback, check our own word list
    res.json({ word, valid: FALLBACK_WORDS.has(word), source: "fallback" });
};

module.exports = { checkWord };