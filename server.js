// File to set up basic express server
// Create by: Andrzej Ciepiela
// Create on: 11/09/2023
// Last update: 11/16/2023

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming you have a User model set up with Mongoose
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({estended:true}));
app.use(bodyParser.json());


// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false} // Set to true if using https
})); 


// // Test Route
// app.get('/test', (req, res) => {
//     res.send('OK');
//   });  


// User Registration Route
// handle user registration, hashing password with bcrypt
app.post('/register', async (req,res) => {
    try {
        // Define minimum and maximum lengths
        const minUsernameLength = 3;
        const maxUsernameLength = 15;
        const minPasswordLength = 6;
        const maxPasswordLength = 20;

        // Validate username length
        if (req.body.username.length < minUsernameLength || req.body.username.length > maxUsernameLength){
            return res.status(400).send({ message: 'Username must be between 3 and 15 characters long'});
        }

        // Validate password length
        if (req.body.password.length < minPasswordLength || req.body.password.length > maxPasswordLength){
            return res.status(400).send({message: 'Password must be between 6 and 20 characters long'});
        }

        // Check if the user already exists
        const existingUser = await User.findOne({username: req.body.username});
        if (existingUser){
            return res.status(400).send({ message: "User already exists"});
        }        

        // If user does not exist, proceed with registration
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });

        const result = await user.save();
        res.status(201).send({ message: 'User created', user: result });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send({ message: 'Error registering user', error: error });
    }
});


// DELETE route to delete a user
app.delete('/delete-user', async (req,res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username: username });
        if (!user){
            return res.status(404).send({ message: 'User not found'});
        }

        // Check if the provided password matches the user's password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Authentication failed' });
        }

        // Delete the user
        await User.deleteOne({ _id: user._id });
        res.send({ message: 'User deleted successfully' });

    } catch (error) {
        console.error("Delete User Error", error);
        res.status(500).send({ message: 'Error deleting user', error: error });
    }
});


// User Login Route
// create a route for user login, checking password with bcrypt
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id; // Create a session
            res.send({ message: 'Logged in successfully' });
        } else {
            res.status(400).send({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error logging in', error: error });
    }
});

// User Logout Route
// Provide a route for logging out and destroying the session
app.get('/logout',(req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(400).send({ message: 'Unable to log out'});
        } else {
            res.send({ message: 'Logout successful'});
        }
    });
});


// Connect to MongoDB Atlas
mongoose.connect(process.env.DB_CONNECTION_STRING)
.then (() => {
    // Database connected successfully
    // Start the server
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
        console.log('Server is running on port ${PORT}');
    });
})
.catch (err => {
    // Handle the error if the database connection fails
    console.error("Database connection failed", err);
});
