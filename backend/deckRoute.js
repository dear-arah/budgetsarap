const express = require('express');
const router = express.Router();
const Deck = require('./deck'); // Import Deck schema

// Create a new Deck
router.post('/add-deck', async (req, res) => {
    const { title, userId } = req.body;

    try {
        const newDeck = new Deck({ title, userId, flashcards: [] });
        await newDeck.save();
        res.status(201).send({ message: 'Deck created successfully!', deck: newDeck });
    } catch (err) {
        res.status(500).send({ message: 'Error creating deck', error: err.message });
    }
});

// Add a Flashcard to a Deck
router.post('/add-flashcard/:deckId', async (req, res) => {
    const { question, answer } = req.body;
    const { deckId } = req.params;

    try {
        const deck = await Deck.findById(deckId);
        if (!deck) return res.status(404).send({ message: 'Deck not found' });

        deck.flashcards.push({ question, answer });
        await deck.save();

        res.status(200).send({ message: 'Flashcard added successfully!', deck });
    } catch (err) {
        res.status(500).send({ message: 'Error adding flashcard', error: err.message });
    }
});

// Edit a Flashcard
router.put('/edit-card', async (req, res) => {
    const { deckId, cardId, question, answer } = req.body;

    try {
        const deck = await Deck.findById(deckId);
        if (!deck) return res.status(404).send({ message: 'Deck not found' });

        const card = deck.flashcards.id(cardId);
        if (!card) return res.status(404).send({ message: 'Flashcard not found' });

        card.question = question;
        card.answer = answer;
        await deck.save();

        res.status(200).send({ message: 'Flashcard updated successfully!', deck });
    } catch (err) {
        res.status(500).send({ message: 'Error updating flashcard', error: err.message });
    }
});

// Delete a Flashcard
router.delete('/delete-card', async (req, res) => {
    const { deckId, cardId } = req.body;

    try {
        const deck = await Deck.findById(deckId);
        if (!deck) return res.status(404).send({ message: 'Deck not found' });

        const card = deck.flashcards.id(cardId);
        if (!card) return res.status(404).send({ message: 'Flashcard not found' });

        card.remove();
        await deck.save();

        res.status(200).send({ message: 'Flashcard deleted successfully!', deck });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting flashcard', error: err.message });
    }
});

module.exports = router;
