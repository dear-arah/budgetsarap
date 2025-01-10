const express = require('express');
const router = express.Router();
const Deck = require('./deck');

// Middleware to validate user (you can modify this)
const authenticateUser = (req, res, next) => {
    const token = req.headers['x-access-token'];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ status: 'error', data: 'Unauthorized' });
    }
};

// Create a deck
router.post('/create-deck', authenticateUser, async (req, res) => {
    const { title } = req.body;
    const userId = req.user._id;

    try {
        const deck = await Deck.create({ userId, title, flashcards: [] });
        res.send({ status: 'ok', data: deck });
    } catch (err) {
        res.status(400).send({ status: 'error', data: err.message });
    }
});

// Add a flashcard to a deck
router.post('/add-flashcard', authenticateUser, async (req, res) => {
    const { deckId, question, answer } = req.body;

    try {
        const deck = await Deck.findById(deckId);
        if (!deck) return res.status(404).send({ status: 'error', data: 'Deck not found' });

        deck.flashcards.push({ question, answer });
        await deck.save();

        res.send({ status: 'ok', data: deck });
    } catch (err) {
        res.status(400).send({ status: 'error', data: err.message });
    }
});

module.exports = router;
