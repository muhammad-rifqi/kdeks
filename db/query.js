const md5 = require('md5');
const { executeQuery } = require('./config');
const fs = require('fs');

// let fileswindows = 'D:/kneksbe/webdevkneks/public/uploads/';
let fileslinux = '/var/www/html/webdev.rifhandi.com/public_html/webdevkneks/public/uploads/';

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

const api_login = async (req, res) => {
    const email = req?.body?.email;
    const password = md5(req?.body?.password);
    const sql = await executeQuery('SELECT * FROM users where email = ? AND password = ? ', [email, password])
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
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

//::::::::::::::::::::::::::::::Start Of Abouts :::::::::::::::::::::::::::::::::::::::::::::::::::::
const abouts = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM abouts');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}


const deleteabout = async (req, res) => {
    const id_abouts = req.params.id;
    const sql = await executeQuery('DELETE FROM  abouts where id=?', [id_abouts]);
    if (sql) {
        res.redirect('/tk');
    } else {
        console.log(sql)
        res.redirect('/tk');
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
//::::::::::::::::::::::::::::::Start Of Structure :::::::::::::::::::::::::::::::::::::::::::::::::::::
const structure = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  structure_assets');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}

const inserstructure = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const times = date + ' ' + time;
    const fileuploads = req.file.originalname.replace(" ", "");
    const sql = await executeQuery("insert into structure_assets(name,position,photo,tag,created_at,updated_at) values(?,?,?,?,?,?)",
        [req.body.name, req.body.position, fileuploads, req.body.tag, times, times]);
    if (sql) {
        res.redirect('/s');
    } else {
        console.log(sql);
        res.redirect('/s');
    }
}

const deletestructure = async (req, res) => {
    const id_abouts = req.params.id;
    const foto_abouts = req.params.foto;

    if (fs.existsSync(fileslinux + 'structure/' + foto_abouts)) {
        fs.unlink(fileslinux + 'structure/' + foto_abouts, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM  structure_assets where id=?', [id_abouts]);
            if (sql) {
                res.redirect('/s');
            } else {
                console.log(sql)
                res.redirect('/s');
            }
        });
    } else {
        const sql = await executeQuery('DELETE FROM  structure_assets where id=?', [id_abouts]);
        if (sql) {
            res.redirect('/hi');
        } else {
            console.log(sql);
        }
    }

}

const detailstructure = async (req, res) => {
    const id_abouts = req.params.id;
    const sql = await executeQuery('SELECT *  FROM  structure_assets where id=?', [id_abouts]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const updatestructure = async (req,res) => {

    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const times = date + ' ' + time;
    if(!req.file || req.file == "" || req.file == undefined){
        const sql = await executeQuery("update structure_assets set name=?,position=?,tag=?,created_at=?,updated_at=? where id = ?",
            [req.body.name, req.body.position, req.body.tag, times, times,req.body.id]);
        if (sql) {
            res.redirect('/s');
        } else {
            console.log(sql);
            res.redirect('/s');
        }    
    }else{
        const fileuploads = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("update structure_assets set name=?,position=?,photo=?,tag=?,created_at=?,updated_at=? where id=?",
            [req.body.name, req.body.position, fileuploads, req.body.tag, times, times, req.body.id]);
        if (sql) {
            res.redirect('/s');
        } else {
            console.log(sql);
            res.redirect('/s');
        }    
    }    
}
//::::::::::::::::::::::::::::::End Of Structure :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of ISSUE :::::::::::::::::::::::::::::::::::::::::::::::::::::

const hotissue = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  hot_issues');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const hotissue_detail = async (req, res) => {
    const id_h = req.params.id;
    const sql = await executeQuery('SELECT * FROM  hot_issues where id=?', [id_h]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const hotissuecategory = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  hot_categories');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const detailhotissuecategory = async (req, res) => {
    const ppp = req.params.id;
    const sql = await executeQuery('SELECT * FROM  hot_categories where id = ? ', [ppp]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deletehotissuecategory = async (req, res) => {
    const idcat = req.params.id;
    const sql = await executeQuery('DELETE FROM  hot_categories where id=?', [idcat]);
    if (sql) {
        res.redirect('/hic');
    } else {
        console.log(sql)
        res.redirect('/hic');
    }
}

const deletehotissuesubcategory = async (req, res) => {
    const idsubcat = req.params.id;
    const sql = await executeQuery('DELETE FROM  hot_subcategories where id=?', [idsubcat]);
    if (sql) {
        res.redirect('/hisc');
    } else {
        console.log(sql)
        res.redirect('/hisc');
    }
}

const hotissuesubcategory = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  hot_subcategories');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}

const detailhotissuesubcategory = async (req, res) => {
    const id_sub = req.params.id;
    const sql = await executeQuery('SELECT * FROM  hot_subcategories where id = ? ', [id_sub]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}

const inserthotissue = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const hot_issue_datetime = date + ' ' + time;
    const issue_datetime = req.body.issue_datetime.replace("T", " ");
    const fileupload = req.file.originalname.replace(" ", "");
    const sql = await executeQuery("insert into hot_issues(title,title_en,excerpt,excerpt_en,content,content_en,image,is_publish,hot_issue_datetime,created_at,updated_at,deleted_at,hot_subcategory_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, fileupload, req.body.is_publish, issue_datetime, hot_issue_datetime, hot_issue_datetime, null, req.body.category_id]);
    if (sql) {
        res.redirect('/hi');
    } else {
        console.log(sql);
        res.redirect('/hi');
    }
}

const inserthotissubcategory = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const hot_issue_datetime = date + ' ' + time;
    const sql = await executeQuery("insert into hot_subcategories(title,title_en,created_at,updated_at,hot_category_id) values(?,?,?,?,?)",
        [req.body.title, req.body.title_en, hot_issue_datetime, hot_issue_datetime, req.body.hot_category_id])
    if (sql) {
        res.redirect('/hisc');
    } else {
        console.log(sql);
        res.redirect('/hisc');
    }

}

const updatehotissue = async (req, res) => {

    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const hot_issue_datetime = date + ' ' + time;
    const issue_datetime = req.body.issue_datetime.replace("T", " ");
    if (!req.file || req.file == undefined || req.file == "") {
        const sql = await executeQuery("update hot_issues set title=?,title_en=?,excerpt=?,excerpt_en=?,content=?,content_en=?,is_publish=?,hot_issue_datetime=?,created_at=?,updated_at=?,deleted_at=?,hot_subcategory_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, req.body.is_publish, issue_datetime, hot_issue_datetime, hot_issue_datetime, null, req.body.category_id, req.body.id]);
        if (sql) {
            res.redirect('/hi');
        } else {
            console.log(sql);
            res.redirect('/hi');
        }
    } else {
        const fileupload = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("update hot_issues  set title=?,title_en=?,excerpt=?,excerpt_en=?,content=?,content_en=?,image=?,is_publish=?,hot_issue_datetime=?,created_at=?,updated_at=?,deleted_at=?,hot_subcategory_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, fileupload, req.body.is_publish, issue_datetime, hot_issue_datetime, hot_issue_datetime, null, req.body.category_id, req.body.id]);
        if (sql) {
            res.redirect('/hi');
        } else {
            console.log(sql);
            res.redirect('/hi');
        }
    }

}

const deletehotissue = async (req, res) => {
    const id_issue = req.params.id;
    const foto_issue = req.params.foto;

    if (fs.existsSync(fileslinux + 'hot_issue/' + foto_issue)) {
        fs.unlink(fileslinux + 'hot_issue/' + foto_issue, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM hot_issues where id = ? ', [id_issue]);
            if (sql) {
                res.redirect('/hi');
            } else {
                console.log(sql);
                res.redirect('/hi');
            }
        });
    } else {
        const sql = await executeQuery('DELETE FROM hot_issues where id = ? ', [id_issue]);
        if (sql) {
            res.redirect('/hi');
        } else {
            console.log(sql);
            res.redirect('/hi');
        }
    }
}

//::::::::::::::::::::::::::::::End Of ISSUE :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of institutions :::::::::::::::::::::::::::::::::::::::::::::::::::::
const institutions = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  institutions');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const detailinstitutions = async (req, res) => {
    const id_inst = req.params.id;
    const sql = await executeQuery('SELECT *  FROM  institutions where id=?', [id_inst]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deleteinstitution = async (req, res) => {
    const id_inst = req.params.id;
    const sql = await executeQuery('DELETE FROM  institutions where id = ? ', [id_inst]);
    if (sql) {
        res.redirect('/i');
    } else {
        console.log(sql);
        res.redirect('/i');
    }
}
//::::::::::::::::::::::::::::::End Of institutions :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Sosmed :::::::::::::::::::::::::::::::::::::::::::::::::::::
const sosmed = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  social_medias');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}

const detailsosmed = async (req, res) => {
    const id_sosmed = req.params.id;
    const sql = await executeQuery('SELECT *  FROM  social_medias where id=?', [id_sosmed]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deletesosmed = async (req, res) => {
    const id_sosmed = req.params.id;
    const sql = await executeQuery('DELETE FROM  social_medias where id = ? ', [id_sosmed]);
    if (sql) {
        res.redirect('/sm');
    } else {
        console.log(sql);
        res.redirect('/sm');
    }
}
//::::::::::::::::::::::::::::::End Of Sosmed :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Scope :::::::::::::::::::::::::::::::::::::::::::::::::::::
const scopes = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  scopes');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const detailscopes = async (req, res) => {
    const id_scopes = req.params.id;
    const sql = await executeQuery('SELECT *  FROM  scopes where id=?', [id_scopes]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deletescopes = async (req, res) => {
    const id_scopes = req.params.id;
    const sql = await executeQuery('DELETE FROM  scopes where id = ? ', [id_scopes]);
    if (sql) {
        res.redirect('/scp');
    } else {
        console.log(sql);
        res.redirect('/scp');
    }
}
//::::::::::::::::::::::::::::::End Of Scope :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Maps :::::::::::::::::::::::::::::::::::::::::::::::::::::
const maps = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  map')
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}
//::::::::::::::::::::::::::::::End Of Maps :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Contacts :::::::::::::::::::::::::::::::::::::::::::::::::::::
const contacts = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  contacts');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }

}
//::::::::::::::::::::::::::::::End Of Contacts :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Banner :::::::::::::::::::::::::::::::::::::::::::::::::::::
const banners = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  banners');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const detailbanner = async (req, res) => {
    const id_banners = req.params.id;
    const sql = await executeQuery('SELECT *  FROM  banners where id=?', [id_banners]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deletebanner = async (req, res) => {
    const id_banners = req.params.id;
    const sql = await executeQuery('DELETE FROM  banners where id = ? ', [id_banners]);
    if (sql) {
        res.redirect('/b');
    } else {
        console.log(sql);
        res.redirect('/b');
    }
}
//::::::::::::::::::::::::::::::End Of Banner :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Agenda :::::::::::::::::::::::::::::::::::::::::::::::::::::
const agendas = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  agendas');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const agendadetails = async (req, res) => {
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
        res.redirect('/a');
    } else {
        console.log(sql)
        res.redirect('/a');
    }
}

const deleteagenda = async (req, res) => {
    const id_agenda = req.params.id;
    const sql = await executeQuery('DELETE FROM agendas where id = ? ', [id_agenda]);
    if (sql) {
        res.redirect('/a');
    } else {
        console.log(sql);
        res.redirect('/a');
    }
}

//::::::::::::::::::::::::::::::End Of Agenda :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of FILES :::::::::::::::::::::::::::::::::::::::::::::::::::::
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
        res.redirect('/f');
    } else {
        console.log(sql);
        res.redirect('/f');
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
    if(!req.file || req.file == undefined || req.file == ""){
        const sql = await executeQuery("update reports set title=?,title_en=?,content=?,content_en=?,is_publish=?,date=?,created_at=?,updated_at=?,report_category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, req.body.is_publish, file_date, timeupdate, timeupdate, req.body.file_category_id, req.body.id]);
        if (sql) {
            res.redirect('/f');
        } else {
            console.log(sql);
            res.redirect('/f');
        }    
    }else{
        const fileuploads = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("update reports set title=?,title_en=?,content=?,content_en=?,file=?,is_publish=?,date=?,created_at=?,updated_at=?,report_category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, fileuploads, req.body.is_publish, file_date, timeupdate, timeupdate, req.body.file_category_id, req.body.id]);
        if (sql) {
            res.redirect('/f');
        } else {
            console.log(sql);
            res.redirect('/f');
        }    
    }
}

const deletefileupload = async (req, res) => {

    const id_files = req.params.id;
    const file_upload = req.params.file;
    if (fs.existsSync(fileslinux + 'filesupload/' + file_upload)) {
        fs.unlink(fileslinux + 'filesupload/' + file_upload, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM reports where id = ? ', [id_files]);
            if (sql) {
                res.redirect('/f');
            } else {
                console.log(sql);
                res.redirect('/f');
            }
        });
        console.log("ada")
    } else {
        const sql = await executeQuery('DELETE FROM reports where id = ? ', [id_files]);
        if (sql) {
            res.redirect('/f');
        } else {
            console.log(sql);
            res.redirect('/f');
        }
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

const insertfilecategorydetails = async (req, res) => {
    const today = new Date();
    const month = (today.getMonth() + 1);
    const mmm = month.length < 2 ? "0" + month : month;
    const date = today.getFullYear() + '-' + mmm + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const time_datetime = date + ' ' + time;
    const sql = await executeQuery("insert into report_categories(title,title_en,report_categories.orders,created_at,updated_at) values(?,?,?,?,?)",
        [req.body.title, req.body.title_en, req.body.order, time_datetime, time_datetime]);
    if (sql) {
        res.redirect('/fc');
    } else {
        console.log(sql)
        res.redirect('/fc');
    }
}

const deletefilecategorydetail = async (req, res) => {
    const id_files_category = req.params.id;
    const sql = await executeQuery('DELETE FROM report_categories where id = ? ', [id_files_category]);
    if (sql) {
        res.redirect('/fc');
    } else {
        console.log(sql);
        res.redirect('/fc');
    }
}

//::::::::::::::::::::::::::::::End Of Files :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of PDES :::::::::::::::::::::::::::::::::::::::::::::::::::::

const pdes = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  syariah')
    const array = [];
    sql?.forEach((listdata) => {
        const ddd = {
            "id": listdata?.id,
            "name": listdata?.name,
            "link": listdata?.link,
            "menu_id": listdata?.menu_id,
            "submenu_id": listdata?.submenu_id,
            "order": listdata?.order,
        }
        array.push(ddd)
    });
    if (array?.length > 0) {
        res.status(200).json(array)
    } else {
        res.status(200).json({ "success": false })
    }
}

const pdes_menu = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  syariah_menu');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const pdes_submenu = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  syariah_submenu');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const pdes_overview = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM  syariah_overview');
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}
//::::::::::::::::::::::::::::::End Of PDES :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of News:::::::::::::::::::::::::::::::::::::::::::::::::::::
const posts = async (req, res) => {
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

const newsdetail = async (req, res) => {
    const id_n = req.params.id;
    const sql = await executeQuery('SELECT * FROM  news where id=?', [id_n]);
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

const detailnewscategory = async (req, res) => {
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
        res.redirect('/n');
    } else {
        console.log(sql);
        res.redirect('/n');
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
            res.redirect('/n');
        } else {
            console.log(sql);
            res.redirect('/n');
        }
    } else {
        const fileupload = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("UPDATE news set  title=?,title_en=?,excerpt=?,excerpt_en=?,content=?,content_en=?,image=?,is_publish=?,news_datetime=?,created_at=?,updated_at=?,deleted_at=?,category_id=? where id = ?",
            [req.body.title, req.body.title_en, req.body.excerpt, req.body.excerpt_en, req.body.content, req.body.content_en, fileupload, req.body.is_publish, news_datetime, timeupdate, timeupdate, null, req.body.news_category_id, req.body.id]);
        if (sql) {
            res.redirect('/n');
        } else {
            console.log(sql);
            res.redirect('/n');
        }
    }

}

const deletenews = async (req, res) => {
    const id_news = req.params.id;
    const foto_news = req.params.foto;
    if (fs.existsSync(fileslinux + 'news/' + foto_news)) {
        fs.unlink(fileslinux + 'news/' + foto_news, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM news where id = ? ', [id_news]);
            if (sql) {
                res.redirect('/n');
            } else {
                console.log(sql);
                res.redirect('/n');
            }
        });
        console.log("ada")
    } else {
        const sql = await executeQuery('DELETE FROM news where id = ? ', [id_news]);
        if (sql) {
            res.redirect('/n');
        } else {
            console.log(sql);
            res.redirect('/n');
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
//::::::::::::::::::::::::::::::End Of News:::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Photos:::::::::::::::::::::::::::::::::::::::::::::::::::::
const categories = async (req, res) => {
    const names = req.params.name;
    const sql = await executeQuery('SELECT * FROM news_' + names + '')
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
        res.redirect('/ph');
    } else {
        console.log(sql)
        res.redirect('/ph');
    }
}

const photodetail = async (req, res) => {
    const id_ph = req.params.id;
    const sql = await executeQuery('SELECT * FROM  news_photos where id=?', [id_ph]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deletephoto = async (req, res) => {
    const id_photo = req.params.id;
    const foto_photo = req.params.foto;
    if (fs.existsSync(fileslinux + 'photo/' + foto_photo)) {
        fs.unlink(fileslinux + 'photo/' + foto_photo, async function (err) {
            if (err) return console.log(err);
            const sql = await executeQuery('DELETE FROM news_photos where id = ? ', [id_photo]);
            if (sql) {
                res.redirect('/ph');
            } else {
                res.redirect('/ph');
                console.log(sql);
            }
        });
        console.log("ada")
    } else {
        const sql = await executeQuery('DELETE FROM news_photos where id = ? ', [id_photo]);
        if (sql) {
            res.redirect('/ph');
        } else {
            res.redirect('/ph');
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
            res.redirect('/ph');
        } else {
            console.log(sql);
            res.redirect('/ph');
        }
    } else {
        const fileuploads = req.file.originalname.replace(" ", "");
        const sql = await executeQuery("UPDATE news_photos set  title=?,title_en=?,content=?,content_en=?,photo=?, news_datetime=?,created_at=?,updated_at=?,deleted_at=? where id = ?",
            [req.body.title, req.body.title_en, req.body.content, req.body.content_en, fileuploads, news_datetime, timeupdate, timeupdate, null, req.body.id]);
        if (sql) {
            res.redirect('/ph');
        } else {
            console.log(sql);
            res.redirect('/ph');
        }
    }

}
//::::::::::::::::::::::::::::::End Of Photos :::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Videos:::::::::::::::::::::::::::::::::::::::::::::::::::::
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
        res.redirect('/v');
    } else {
        console.log(sql)
        res.redirect('/v');
    }
}

const videodetail = async (req, res) => {
    const id_vid = req.params.id;
    const sql = await executeQuery('SELECT * FROM  news_videos where id=?', [id_vid]);
    if (sql?.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const deletevideo = async (req, res) => {
    const id_video = req.params.id;
    const sql = await executeQuery('DELETE FROM  news_videos where id=?', [id_video]);
    if (sql) {
        res.redirect('/v');
    } else {
        console.log(sql)
        res.redirect('/v');
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

//::::::::::::::::::::::::::::::End Of Videos:::::::::::::::::::::::::::::::::::::::::::::::::::::
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
        res.redirect('/u');
    } else {
        console.log(sql)
    }
}

const updatepassword = async (req, res) => {
    const id_users = req.cookies.id;
    const sql = await executeQuery('SELECT * FROM users where id = ? ', [id_users])
    if (sql.length > 0) {
        res.status(200).json(sql)
    } else {
        res.status(200).json({ "success": false })
    }
}

const changespassword = async (req, res) => {
    const sql = await executeQuery('SELECT * FROM users where id = ? ', [req.body.id_user]);
    if (md5(req.body.old_password) == sql[0]?.password) {
        if (req.body.new_password == req.body.verify_password) {
            await executeQuery("UPDATE users SET name=? , password=? WHERE id=? ", [req.body.names, md5(req.body.new_password), req.body.id_user]);
            console.log('success');
            res.redirect('/logout');
        } else {
            console.log('new password and password confirm not match !');
        }
    } else {
        console.log('password not match in database!');
    }
}

const deleteuser = async (req, res) => {
    const id_users = req.params.id;
    const sql = await executeQuery('DELETE FROM users where id = ? ', [id_users]);
    if (sql) {
        res.redirect('/u');
    } else {
        console.log(sql);
    }
}
//::::::::::::::::::::::::::::::End Of Users:::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::Start Of Modules:::::::::::::::::::::::::::::::::::::::::::::::::::::
module.exports = {
    do_login,
    do_logout,
    api_login,
    dashboards,
    categories,
    photodetail,
    deletephoto,
    updatephoto,
    posts,
    newsdetail,
    news_categories,
    deletenews,
    updatenews,
    insertnews,
    insertnewscategory,
    detailnewscategory,
    updatenewscategory,
    insertphoto,
    insertvideo,
    updatevideos,
    videodetail,
    deletevideo,
    abouts,
    deleteabout,
    detailabout,
    structure,
    deletestructure,
    detailstructure,
    inserstructure,
    updatestructure,
    hotissue,
    hotissue_detail,
    hotissuecategory,
    detailhotissuecategory,
    hotissuesubcategory,
    deletehotissuecategory,
    deletehotissuesubcategory,
    detailhotissuesubcategory,
    updatehotissue,
    deletehotissue,
    inserthotissue,
    inserthotissubcategory,
    institutions,
    detailinstitutions,
    deleteinstitution,
    sosmed,
    detailsosmed,
    deletesosmed,
    scopes,
    detailscopes,
    deletescopes,
    maps,
    contacts,
    banners,
    deletebanner,
    detailbanner,
    agendas,
    agendadetails,
    insertagenda,
    deleteagenda,
    files,
    filesdetails,
    insertfileupload,
    updatefileupload,
    deletefileupload,
    files_category,
    files_category_details,
    insertfilecategorydetails,
    deletefilecategorydetail,
    pdes,
    pdes_menu,
    pdes_submenu,
    pdes_overview,
    users,
    userroles,
    insertusers,
    updatepassword,
    changespassword,
    deleteuser,
}
//::::::::::::::::::::::::::::::End Of Module:::::::::::::::::::::::::::::::::::::::::::::::::::::