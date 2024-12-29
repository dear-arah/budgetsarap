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

app.get('/', (req, res) => {
    res.send({ status: 'Started' });
});

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


