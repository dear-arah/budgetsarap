const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoUrl = 'mongodb+srv://dearahmbarsolasco:1234@cluster0.2sq5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const JWT_SECRET = 'vX5&%78$ABdf!1zqL#RW9dcpQYx2UKeT3J4o*hg6@mnNpOw';

mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error: ', err);
});

require('./UserDetails');

const User = mongoose.model('UserInfo');


const Deck = require('./deck'); // Import Deck model

// Middleware to validate user using email
const authenticateUser = async (req, res, next) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).send({ status: 'error', data: 'Email is required' });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: 'error', data: 'User not found' });
    }
  
    req.user = user; // Attach user info to the request
    next();
};

app.post('/register', async(req, res) => {   
    const {name, email, mobile, password} = req.body;

    const oldUser = await User.findOne({email: email});

    if (oldUser) {
        return res.send({ data: 'Email is already in use' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    try {   
        await User.create({
            name: name,
            email: email,
            mobile: mobile,
            password: encryptedPassword,
        });
        res.send({ status: 'Ok', data: 'User registered successfully' });
    } catch (err) {
        res.send({ status: 'error', data: err });
    }
});


app.post("/login-user", async(req, res)=>{
    const {email, password} = req.body;
    const oldUser = await User.findOne({email: email});

    if(!oldUser){
        return res.send({data: "User does not exist."})
    }

    const isPasswordValid = await bcrypt.compare(password, oldUser.password);
    if (isPasswordValid) {
        const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
        return res.status(200).send({ status: "ok", data: token });
    } else {
        return res.status(400).send({ status: "error", data: "Invalid password." });
    }

})


// Deck Routes
app.post('/api/decks/create-deck', authenticateUser, async (req, res) => {
    const { title, email } = req.body;

    if (!title) {
        return res.status(400).send({ status: 'error', data: 'Deck title is required' });
    }

    try {
        const deck = await Deck.create({ userEmail: email, title, flashcards: [] });
        res.send({ status: 'ok', data: deck });
    } catch (err) {
        res.status(400).send({ status: 'error', data: err.message });
    }
});


app.post('/api/decks/add-flashcard', authenticateUser, async (req, res) => {
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


//binago
app.get('/api/decks/:deckId', authenticateUser, async (req, res) => {
    const { deckId } = req.params;

    try {
        const deck = await Deck.findOne({ _id: deckId, userEmail: req.user.email });
        if (!deck) {
            return res.status(404).send({ status: 'error', data: 'Deck not found' });
        }

        res.send({ status: 'ok', data: { flashcards: deck.flashcards, title: deck.title } });
    } catch (err) {
        res.status(400).send({ status: 'error', data: err.message });
    }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


