const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const deckSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
    flashcards: [flashcardSchema],
});

module.exports = mongoose.model('Deck', deckSchema);