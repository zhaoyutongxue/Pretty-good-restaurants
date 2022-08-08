const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

app.use(cookieParser('this is my secret'))

app.get('/', (req, res) => {
    console.log(req.cookies)
    const userName = req.cookies.userName;
    res.send(`Here there ${userName}`)

})

app.get('/setname', (req, res) => {
    res.cookie('userName', 'Peter');
    res.send('OK, send you a cookie')
})

app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', { signed: true })
    res.send('OK, signed your fruit cookie!')
})

app.get('/verifyfruit', (req, res) => {
    res.send(req.signedCookies)
})

app.listen(8080, () => {
    console.log("listening on 8080!")
})