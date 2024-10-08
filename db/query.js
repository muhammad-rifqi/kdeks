const md5 = require('md5');
const { executeQuery } = require('./config');
const fs = require('fs');

let fileswindows = 'D:/kneksbe/kdeks/public/uploads/';
let fileslinux = '/var/www/html/kdeks.rifhandi.com/public_html/kdeks/public/uploads/';

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

    const result = await executeQuery("SELECT * FROM news where id between 580 and 700 ORDER BY id ASC ");
    let promises = result.map(async (item) => {
        return new Promise(async (resolve, reject) => {
            let r = await executeQuery("SELECT * FROM news_categories WHERE id = ?", [item.category_id]);
            let detail = r[0];
            let row = {
                "id": item?.id,
                "title": item?.title,
                "title_en": item?.title_en,
                "news_datetime": item?.news_datetime,
                "content": item?.content,
                "content_en": item?.content_en,
                "excerpt": item?.excerpt,
                "excerpt_en": item?.excerpt_en,
                "is_publish": item?.is_publish,
                "image": item?.image,
                "category_id": item?.category_id,
                "detail": detail
            };
            resolve(row);
        });
    });
    Promise.all(promises)
        .then((rows) => {
            res.status(200).json(rows);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });

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


const insertnews = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const timeupdate = date + ' ' + time;
    const news_datetime = req.body.news_datetime.replace("T", " ");
    const fileupload = req.file.originalname.replace(" ", "");
    const sql = await executeQuery("insert into news(title,title_en,excerpt,excerpt_en,content,content_en,image,is_publish,news_datetime,created_at,updated_at,deleted_at,category_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, fileupload, req.body.is_publish, news_datetime, timeupdate, timeupdate, null, req.body.category_id]);
    if (sql) {
        res.redirect('/news');
    } else {
        console.log(sql);
        res.redirect('/news');
    }
}


const updatenews = async (req, res) => {

    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const timeupdate = date + ' ' + time;
    const news_datetime = req.body.news_datetime.replace("T", " ");
    if (!req.file || req.file == undefined || req.file == "") {
        const sql = await executeQuery("UPDATE news set  title=?,title_en=?,excerpt=?,excerpt_en=?,content=?,content_en=?,is_publish=?,news_datetime=?,created_at=?,updated_at=?,deleted_at=?,category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, req.body.is_publish, news_datetime, timeupdate, timeupdate, null, req.body.news_category_id, req.body.id]);
        if (sql) {
            res.redirect('/news');
        } else {
            console.log(sql);
            res.redirect('/news');
        }
    } else {
        const fileupload = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("UPDATE news set  title=?,title_en=?,excerpt=?,excerpt_en=?,content=?,content_en=?,image=?,is_publish=?,news_datetime=?,created_at=?,updated_at=?,deleted_at=?,category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, fileupload, req.body.is_publish, news_datetime, timeupdate, timeupdate, null, req.body.news_category_id, req.body.id]);
        if (sql) {
            res.redirect('/news');
        } else {
            console.log(sql);
            res.redirect('/news');
        }
    }

}

const insertnewscategory = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const cat_datetime = date + ' ' + time;
    const sql = await executeQuery("insert into news_categories(title,title_en,created_at,updated_at) values(?,?,?,?)",
        [req.body.title, req.body.title_en, cat_datetime, cat_datetime]);
    if (sql) {
        res.redirect('/nc');
    } else {
        console.log(sql)
        res.redirect('/nc');
    }
}

const updatenewscategory = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const sql = await executeQuery("update news_categories set title=?,title_en=?,description=?,description_en=?,created_at=?,updated_at=? where id = ?",
        [req.body.title, req.body.title_en, req.body.description, req.body.description_en, time_datetime, time_datetime, req.body.id]);
    if (sql) {
        res.redirect('/nc');
    } else {
        console.log(sql)
        res.redirect('/nc');
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

const insertphoto = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const photos_datetime = req.body.photo_datetime.replace("T", " ");
    const photoupload = req.file.originalname.replace(" ", "");
    const sql = await executeQuery("insert into news_photos(title,title_en,content,content_en,photo,news_datetime,created_at,updated_at,deleted_at) values(?,?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.content, req.body.content_en, photoupload, photos_datetime, time_datetime, time_datetime, null])
    if (sql) {
        res.redirect('/photo');
    } else {
        console.log(sql)
        res.redirect('/photo');
    }
}

const deletephoto = async (req, res) => {
    const id_photo = req.params.id;
    const foto_photo = req.params.foto;
    if (fs.existsSync(fileswindows + 'photo/' + foto_photo)) {
        fs.unlink(fileswindows + 'photo/' + foto_photo, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM news_photos where id = ? ', [id_photo]);
            if (sql) {
                res.redirect('/photo');
            } else {
                res.redirect('/photo');
                console.log(sql);
            }
        });
        console.log("ada")
    } else {
        const sql = await executeQuery('DELETE FROM news_photos where id = ? ', [id_photo]);
        if (sql) {
            res.redirect('/photo');
        } else {
            res.redirect('/photo');
            console.log(sql);
        }
    }
}

const updatephoto = async (req, res) => {

    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const timeupdate = date + ' ' + time;
    const news_datetime = req.body.news_datetime.replace("T", " ");
    if (!req.file || req.file == undefined || req.file == "") {
        const sql = await executeQuery("UPDATE news_photos set  title=?,title_en=?,content=?,content_en=?,news_datetime=?,created_at=?,updated_at=?,deleted_at=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, news_datetime, timeupdate, timeupdate, null, req.body.id]);
        if (sql) {
            res.redirect('/photo');
        } else {
            console.log(sql);
            res.redirect('/photo');
        }
    } else {
        const fileuploads = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("UPDATE news_photos set  title=?,title_en=?,content=?,content_en=?,photo=?, news_datetime=?,created_at=?,updated_at=?,deleted_at=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, fileuploads, news_datetime, timeupdate, timeupdate, null, req.body.id]);
        if (sql) {
            res.redirect('/photo');
        } else {
            console.log(sql);
            res.redirect('/photo');
        }
    }

}

const insertvideo = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const videos_datetime = req.body.video_datetime.replace("T", " ");
    const sql = await executeQuery("insert into news_videos(title,title_en,content,content_en,video,duration,news_datetime,created_at,updated_at,deleted_at) values(?,?,?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.content, req.body.content_en, req.body.video, req.body.duration, videos_datetime, time_datetime, time_datetime, null]);
    if (sql) {
        res.redirect('/video');
    } else {
        console.log(sql)
        res.redirect('/video');
    }
}

const deletevideo = async (req, res) => {
    const id_video = req.params.id;
    const sql = await executeQuery('DELETE FROM  news_videos where id=?', [id_video]);
    if (sql) {
        res.redirect('/video');
    } else {
        console.log(sql)
        res.redirect('/video');
    }
}

const updatevideos = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const videos_datetime = req.body.video_datetime.replace("T", " ");
    const sql = await executeQuery("update news_videos set title=?,title_en=?,content=?,content_en=?,video=?,duration=?,news_datetime=?,created_at=?,updated_at=? where id = ?",
        [req.body.title, req.body.title_en, req.body.content, req.body.content_en, req.body.video, req.body.duration, videos_datetime, time_datetime, time_datetime, req.body.id]);
    if (sql) {
        res.redirect('/v');
    } else {
        console.log(sql)
        res.redirect('/v');
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

const insertusers = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const pw = md5(req.body.password);
    const sql = await executeQuery("insert into users(name,email,password,role_id,created_at,updated_at) values(?,?,?,?,?,?)",
        [req.body.name, req.body.email, pw, req.body.role_id, time_datetime, time_datetime]);
    if (sql) {
        res.redirect('/users');
    } else {
        console.log(sql)
    }
}

const deleteusers = async (req, res) => {
    const id_users = req.params.id;
    const sql = await executeQuery('DELETE FROM users where id = ? ', [id_users]);
    if (sql) {
        res.redirect('/users');
    } else {
        console.log(sql);
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

const insertagenda = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const agenda_datetime = req.body.agenda_datetime.replace("T", " ");
    const sql = await executeQuery("insert into agendas(title,title_en,url, agenda_datetime ,place,organizer, created_at, updated_at) values(?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.url, agenda_datetime, req.body.place, req.body.organizer, time_datetime, time_datetime]);
    if (sql) {
        res.redirect('/agenda');
    } else {
        console.log(sql)
        res.redirect('/agenda');
    }
}

const deleteagenda = async (req, res) => {
    const id_agenda = req.params.id;
    const sql = await executeQuery('DELETE FROM agendas where id = ? ', [id_agenda]);
    if (sql) {
        res.redirect('/agenda');
    } else {
        console.log(sql);
        res.redirect('/agenda');
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

const files_category = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  report_categories');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const files_category_details = async (req, res) => {
    const id_files_category = req.params.id;
    const sql = await executeQuery('SELECT * FROM  report_categories where id = ? ', [id_files_category]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const insertfileupload = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const timeupdate = date + ' ' + time;
    const file_date = req.body.date;
    const fileuploads = req.file.originalname.replace(" ", "");
    const sql = await executeQuery("insert into reports(title,title_en,content,content_en,file,is_publish,date,created_at,updated_at,report_category_id) values(?,?,?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.content, req.body.content_en, fileuploads, req.body.is_publish, file_date, timeupdate, timeupdate, req.body.file_category_id]);
    if (sql) {
        res.redirect('/elibrary');
    } else {
        console.log(sql);
        res.redirect('/elibrary');
    }
}

const updatefileupload = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const timeupdate = date + ' ' + time;
    const file_date = req.body.date;
    if (!req.file || req.file == undefined || req.file == "") {
        const sql = await executeQuery("update reports set title=?,title_en=?,content=?,content_en=?,is_publish=?,date=?,created_at=?,updated_at=?,report_category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, req.body.is_publish, file_date, timeupdate, timeupdate, req.body.file_category_id, req.body.id]);
        if (sql) {
            res.redirect('/elibrary');
        } else {
            console.log(sql);
            res.redirect('/elibrary');
        }
    } else {
        const fileuploads = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("update reports set title=?,title_en=?,content=?,content_en=?,file=?,is_publish=?,date=?,created_at=?,updated_at=?,report_category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, fileuploads, req.body.is_publish, file_date, timeupdate, timeupdate, req.body.file_category_id, req.body.id]);
        if (sql) {
            res.redirect('/elibrary');
        } else {
            console.log(sql);
            res.redirect('/elibrary');
        }
    }
}

const deletefileupload = async (req, res) => {

    const id_files = req.params.id;
    const file_upload = req.params.file;
    if (fs.existsSync(fileswindows + 'filesupload/' + file_upload)) {
        fs.unlink(fileswindows + 'filesupload/' + file_upload, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM reports where id = ? ', [id_files]);
            if (sql) {
                res.redirect('/elibrary');
            } else {
                console.log(sql);
                res.redirect('/elibrary');
            }
        });
        console.log("ada")
    } else {
        const sql = await executeQuery('DELETE FROM reports where id = ? ', [id_files]);
        if (sql) {
            res.redirect('/elibrary');
        } else {
            console.log(sql);
            res.redirect('/elibrary');
        }
    }

}

//::::::::::::::::::::::::::::::End Of Files/Library :::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::Start Of Modules:::::::::::::::::::::::::::::::::::::::::::::::::::::

module.exports = {
    do_login,
    do_logout,
    news,
    insertnews,
    updatenews,
    news_details,
    news_categories,
    updatenewscategory,
    news_detailnewscategory,
    insertnewscategory,
    news_photo,
    news_video,
    news_photodetail,
    news_videodetail,
    updatephoto,
    insertphoto,
    deletephoto,
    insertvideo,
    updatevideos,
    deletevideo,
    abouts,
    detailabout,
    users,
    userroles,
    insertusers,
    deleteusers,
    detailsusers,
    agenda,
    agendadetail,
    insertagenda,
    deleteagenda,
    files,
    filesdetails,
    files_category,
    files_category_details,
    updatefileupload,
    insertfileupload,
    deletefileupload,
    dashboards,
}
//::::::::::::::::::::::::::::::End Of Module:::::::::::::::::::::::::::::::::::::::::::::::::::::