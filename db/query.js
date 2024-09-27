const md5 = require('md5');
const { executeQuery } = require('./config');
const fs = require('fs');

// let fileswindows = 'D:/kneksbe/webdevkneks/public/uploads/';
let fileslinux = '/var/www/html/kdeks.rifhandi.com/public_html/webdevkneks/public/uploads/';

//::::::::::::::::::::::::::::::Start Of LOGIN LOGOUT :::::::::::::::::::::::::::::::::::::::::::::::::::::

const do_login = async (req, res) => {
    const email = req?.body?.email;
    const password = md5(req?.body?.password);
    const sql = await executeQuery('SELECT * FROM users where email = ? AND password = ? ', [email, password])
    if (sql?.length > 0) {
        const isLogin = true;
        res.cookie("islogin", isLogin);
        res.cookie("id", sql[0]?.id);
        res.cookie("name", sql[0]?.name);
        res.redirect("/dashboard");
    } else {
        res.redirect("/");
    }

}

const do_logout = (req, res) => {
    res.clearCookie("islogin");
    res.clearCookie("name");
    res.clearCookie("id");
    res.redirect("/");
}

//::::::::::::::::::::::::::::::End Of Login :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Dashboard :::::::::::::::::::::::::::::::::::::::::::::::::::::

const dashboards = async (req, res) => {

    const news_mounts = await executeQuery('SELECT * FROM news');
    const jumlah1 = news_mounts.length;
    const videos_mounts = await executeQuery('SELECT * FROM news_videos');
    const jumlah2 = videos_mounts.length;
    const photos_mounts = await executeQuery('SELECT * FROM news_photos');
    const jumlah3 = photos_mounts.length;
    const files_mounts = await executeQuery('SELECT * FROM reports');
    const jumlah4 = files_mounts.length;

    const mounted = {
        "news": jumlah1,
        "videos": jumlah2,
        "photos": jumlah3,
        "files": jumlah4,
    }

    res.status(200).json(mounted)
}

//::::::::::::::::::::::::::::::End Of Dashboard :::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::: Berita ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const news = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM news');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const news_details = async (req, res) => {
    const id_news = req.params.id;
    const sql = await executeQuery('SELECT * FROM news where id = ? ', [id_news]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const news_categories = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM news_categories');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const news_detailnewscategory = async (req, res) => {
    const id_cat = req.params.id;
    const sql = await executeQuery('SELECT * FROM news_categories where id = ? ', [id_cat]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

//::::::::::::::::::::::::::::::End Of Categories :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Abouts:::::::::::::::::::::::::::::::::::::::::::::::::::::

const abouts = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM abouts');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}

const detailabout = async (req, res) => {
    const id_abouts = req.params.id;
    const sql = await executeQuery('SELECT *  FROM  abouts where id=?', [id_abouts]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

//::::::::::::::::::::::::::::::End Of Abouts :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Photos & Videos :::::::::::::::::::::::::::::::::::::::::::::::::::::

const news_photo = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM news_photos')
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const news_video = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM news_videos')
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const news_photodetail = async (req, res) => {
    const id_ph = req.params.id;
    const sql = await executeQuery('SELECT * FROM  news_photos where id=?', [id_ph]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const news_videodetail = async (req, res) => {
    const id_vid = req.params.id;
    const sql = await executeQuery('SELECT * FROM  news_videos where id=?', [id_vid]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

//::::::::::::::::::::::::::::::End Of Photos & Videos :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Users:::::::::::::::::::::::::::::::::::::::::::::::::::::

const users = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM users');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const userroles = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  roles');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const detailsusers = async (req, res) => {
    const id_users = req.params.id;
    const sql = await executeQuery('SELECT * FROM users where id = ? ', [id_users]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

//::::::::::::::::::::::::::::::End Of Users :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Users :::::::::::::::::::::::::::::::::::::::::::::::::::::

const agenda = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  agendas');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const agendadetail = async (req, res) => {
    const id_files = req.params.id;
    const sql = await executeQuery('SELECT * FROM  agendas where id = ? ', [id_files]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

//::::::::::::::::::::::::::::::End Of Agenda :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Files/Library :::::::::::::::::::::::::::::::::::::::::::::::::::::

const files = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  reports');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const filesdetails = async (req, res) => {
    const id_files = req.params.id;
    const sql = await executeQuery('SELECT * FROM  reports where id = ? ', [id_files]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

//::::::::::::::::::::::::::::::End Of Files/Library :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Modules:::::::::::::::::::::::::::::::::::::::::::::::::::::

module.exports = {
    do_login,
    do_logout,
    news,
    news_details,
    news_categories,
    news_detailnewscategory,
    news_photo,
    news_video,
    news_photodetail,
    news_videodetail,
    abouts,
    detailabout,
    users,
    userroles,
    detailsusers,
    agenda,
    agendadetail,
    files,
    filesdetails,
    dashboards,
}
//::::::::::::::::::::::::::::::End Of Module:::::::::::::::::::::::::::::::::::::::::::::::::::::