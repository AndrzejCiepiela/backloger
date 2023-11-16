// The User model file is a JavaScript file where you define the schema and model for user data. 
// (This typically includes fields like username, password, email, and any other data you want to store for each user.)
//
// Create by: Andrzej Ciepiela
// Create on: 11/13/2023
// Last update: 11/13/2023

// Importing mongoose to use its features for creating a model
const mongoose = require('mongoose');

// Defining the schema for the User model
// The schema is a structure that defines the shape of documents within a collection in MongoDB
const userSchema = new mongoose.Schema({
    // Define fields here, e.g., username, password, etc.
    // Each field can have types and other options like required, unique, etc.
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    // Add other fields as needed.
});

// Creating the User model from the schema
// 'User' is the name of the model. It is used to create instances of the model
// userSchema is the schema that this model will follow
const User = mongoose.model('User', userSchema);

// Exporting the User model
// This allows other files in your Node.js application to import the User model and use it to interact with the User collection in the database
module.exports = User;