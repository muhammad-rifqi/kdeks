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

const multer = require('multer')
let storages = multer.diskStorage(
    {
        destination: './public/uploads/news/',
        filename: function (req, file, cb) {
            cb(null, file.originalname.replace(" ",""));
        }
    }
);
let news_path = multer({ storage: storages });
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
let disks = multer.diskStorage(
    {
        destination: './public/uploads/photo/',
        filename: function (req, file, cb) {
            cb(null, file.originalname.replace(" ",""));
        }
    }
);
let photo_path = multer({ storage: disks });
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
let drives = multer.diskStorage(
    {
        destination: './public/uploads/filesupload/',
        filename: function (req, file, cb) {
            cb(null, file.originalname.replace(" ",""));
        }
    }
);
let files_path = multer({ storage: drives });

apps.get('/', (req, res) => {
    res.sendFile(path.resolve('./views/login.html'));
})

apps.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve('./views/dashboard.html'));
})

apps.get('/news', (req, res) => {
    res.sendFile(path.resolve('./views/news_management/news.html'));
})

apps.get('/news_add', (req, res) => {
    res.sendFile(path.resolve('./views/news_management/news_add.html'));
})

apps.get('/news_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/news_management/news_edit.html'));
})

apps.get('/news_category', (req, res) => {
    res.sendFile(path.resolve('./views/news_management/news_category.html'));
})

apps.get('/news_category_add', (req, res) => {
    res.sendFile(path.resolve('./views/news_management/news_category_add.html'));
})

apps.get('/news_category_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/news_management/news_category_edit.html'));
})

apps.get('/tentangkami', (req, res) => {
    res.sendFile(path.resolve('./views/profile/tentangkami.html'));
})

apps.get('/tentangkami_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/profile/tentangkami_edit.html'));
})

apps.get('/sejarah', (req, res) => {
    res.sendFile(path.resolve('./views/profile/sejarah.html'));
})

apps.get('/sejarah_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/profile/sejarah_edit.html'));
})

apps.get('/sk', (req, res) => {
    res.sendFile(path.resolve('./views/profile/sk.html'));
})

apps.get('/video', (req, res) => {
    res.sendFile(path.resolve('./views/profile/video.html'));
})

apps.get('/video_add', (req, res) => {
    res.sendFile(path.resolve('./views/profile/video_add.html'));
})

apps.get('/video_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/profile/video_edit.html'));
})

apps.get('/photo', (req, res) => {
    res.sendFile(path.resolve('./views/profile/photos.html'));
})

apps.get('/photo_add', (req, res) => {
    res.sendFile(path.resolve('./views/profile/photos_add.html'));
})

apps.get('/photo_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/profile/photos_edit.html'));
})

apps.get('/agenda', (req, res) => {
    res.sendFile(path.resolve('./views/agenda/agenda.html'));
})

apps.get('/agenda_add', (req, res) => {
    res.sendFile(path.resolve('./views/agenda/agenda_add.html'));
})

apps.get('/agenda_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/agenda/agenda_edit.html'));
})

apps.get('/home_management', (req, res) => {
    res.sendFile(path.resolve('./views/home_management/home.html'));
})

apps.get('/elibrary', (req, res) => {
    res.sendFile(path.resolve('./views/e-library/elibrary.html'));
})

apps.get('/elibrary_add', (req, res) => {
    res.sendFile(path.resolve('./views/e-library/elibrary_add.html'));
})

apps.get('/elibrary_edit/:id', (req, res) => {
    res.sendFile(path.resolve('./views/e-library/elibrary_edit.html'));
})

apps.get('/users', (req, res) => {
    res.sendFile(path.resolve('./views/user_management/users.html'));
})

apps.get('/users_add', (req, res) => {
    res.sendFile(path.resolve('./views/user_management/users_add.html'));
})

apps.get('/opini', (req, res) => {
    res.sendFile(path.resolve('./views/opini/opini.html'));
})

//::::::::::::::: Api & Query DB AUTH ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

apps.get('/api_news', db.news);

apps.get('/api_news_detail/:id', db.news_details);

apps.post('/insertnews', news_path.single('photo'), db.insertnews);

apps.post('/updatenews', news_path.single('photo'), db.updatenews);

apps.get('/api_newscategory', db.news_categories);

apps.get('/api_detailnewscategory/:id', db.news_detailnewscategory);

apps.get('/api_newsphoto', db.news_photo);

apps.get('/deletephoto/:id/:foto' , db.deletephoto);

apps.post('/insertphoto', photo_path.single('photo'), db.insertphoto);

apps.post('/updatephoto', photo_path.single('photo'), db.updatephoto);

apps.get('/api_newsvideo', db.news_video);

apps.get('/api_detail_newsphoto/:id', db.news_photodetail);

apps.get('/api_detail_newsvideo/:id', db.news_videodetail);

apps.get('/api_users', db.users);

apps.get('/api_usersroles', db.userroles);

apps.get('/api_detailusers/:id', db.detailsusers);

apps.get('/api_agenda', db.agenda);

apps.get('/api_detailagenda/:id', db.agendadetail);

apps.get('/api_files', db.files);

apps.get('/api_detail_files/:id', db.filesdetails);

apps.get('/api_files_category', db.files_category);

apps.get('/api_files_detail_category/:id', db.files_category_details);

apps.post('/insertfiles', files_path.single('file_data'), db.insertfileupload);

apps.post('/updatefileupload', files_path.single('file_data'), db.updatefileupload);

apps.get('/deletefilesupload/:id/:file' , db.deletefileupload);

apps.get('/api_about', db.abouts);

apps.get('/api_detailabout/:id', db.detailabout);

apps.post('/act_login', db.do_login);

apps.get("/logout", db.do_logout);

apps.listen(3002);