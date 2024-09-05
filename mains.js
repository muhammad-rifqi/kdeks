require('dotenv').config();
const express = require('express');
const apps = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT;
const path = require('path');
const cookieParser = require("cookie-parser");
const db = require('./db/query');

apps.use(cookieParser());
apps.use(bodyParser.json())
apps.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
apps.use(cors());
apps.use(express.static('public'));

apps.get('/', (req, res) => {
    res.sendFile(path.resolve('./views/login.html'));
})

apps.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve('./views/dashboard.html'));
})

apps.get('/news', (req, res) => {
    res.sendFile(path.resolve('./views/news.html'));
})

apps.get('/tentangkami', (req, res) => {
    res.sendFile(path.resolve('./views/profile/tentangkami.html'));
})

apps.get('/sejarah', (req, res) => {
    res.sendFile(path.resolve('./views/profile/sejarah.html'));
})

apps.get('/sk', (req, res) => {
    res.sendFile(path.resolve('./views/profile/sk.html'));
})

apps.get('/video', (req, res) => {
    res.sendFile(path.resolve('./views/profile/video.html'));
})

apps.listen(3002);