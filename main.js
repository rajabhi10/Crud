require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 4000;

// Database Connection
    mongoose.connect(process.env.DB_URI,
         { useNewUrlParser: true,
            useUnifiedTopology: true
         });
  const db = mongoose.connection;
   db.once('open', () => {
        console.log('Database connected...');
      });
    db.on('error', (err) => {
      console.error('Connection failed...', err);
    });

    // Middlewares
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Session
    app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    }));

    // Global Middleware
    app.use((req, res, next) => {
        res.locals.session = req.session 
        res.locals.user = req.user
        next();
    });

     // set Template engine
     app.set('view engine', 'ejs');

     // Route prefix
     app.use('', require('./routes/routes'))

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});