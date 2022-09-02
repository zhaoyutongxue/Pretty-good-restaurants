const e = require('express');
const express = require('express')
const app = express();
const session = require('express-session')
const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }

app.use(session(sessionOptions));


app.get('/viewcount', (req, res) => {
    if (req.session.count) {
        req.session.count += 1;
    }
    else {
        req.session.count = 1
    }
    res.send(`you have view this page for ${req.session.count} times`)
})

app.get('/register', (req, res) => {
    const { username = 'henry' } = req.query;
    req.session.username = username;
    res.redirect('/greet')
})

app.get('/greet', (req, res) => {
    const { username } = req.session;
    res.send(`Welcome back ${username}`)
})

app.listen(8080, () => {
    console.log('listenning on 8080!')
})
