const express = require('express');
const mongoose = require('mongoose');

// define port explaining to use express
const PORT = process.env.PORT || 3001;
const app = express();


// middleware functions


// express.json() helps parse incoming request into JSON payload.
app.use(express.json());
// helps parse the URL encoding data allowing objects and array to be encoded into URL encoded format
app.use(express.urlencoded({ extended: true}))
// 
app.use(require('./routes'))

// creating access to the mongodb database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

mongoose.set('debug', true);

// start listening
app.listen(PORT, () => console.log(`🌍 Now listening on Port: ${PORT}`));