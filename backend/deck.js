const mongoose = require('mongoose');
const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const deckSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    flashcards: [flashcardSchema],
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, // Automatically store creation time
});

module.exports = mongoose.model('Deck', deckSchema);
