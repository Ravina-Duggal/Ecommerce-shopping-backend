const fs = require('fs')
const path = require('path')
const multer = require('multer')

const SECRET = "SECRET"


var imageStorageFun = multer.diskStorage({

    destination: function (req, file, cb) {
        // console.log("req:" + req);
        // console.log("file:" + file);
        var string = file.fieldname.split("_");

        var dir = "/tmp/" + string[0]

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);

    },
    filename: function (req, file, cb) {

        var string = file.fieldname.split("_")
        var dir = "/tmp/" + string[0]
        var fileName = file.originalname.replace(path.extname(file.originalname), "")
        req.body[string[1]] = fileName + path.extname(file.originalname)
        let filePath = dir + "/" + req.body[string[1]]

        if (fs.existsSync(filePath)) {
            req.body[string[1]] = fileName + Date.now() + path.extname(file.originalname)
            //logger.error("exists:", path);
        }
        cb(null, req.body[string[1]]) //Appending extension
    }
})

function unlinkImage(pic) {
    if (pic != undefined && pic.path != undefined) {
        fs.unlink(pic.path, (err) => { });
    }
}

var uploadImageFun = multer({
    storage: imageStorageFun
});


module.exports = {
    uploadImageFun,
    unlinkImage,
    SECRET
}
