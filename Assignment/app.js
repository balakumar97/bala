const https = require('https');
const fs = require('fs');
const express = require("express");
const app = express();
const multer = require("multer");
const path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 3000;
app.set("view engine", "ejs");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

var upload = multer({ storage: storage });

var uploadMultiple = upload.fields([{ name: 'file1', maxCount: 10 }, { name: 'file2', maxCount: 10 }])


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));

});
app.get("/fileUpload", (req, res) => {
    res.render("app");
});
app.get("/fileDownload", (req, res) => {
    res.render("app2");
});
app.post('/create', (req, res) => {
    console.log("check 1")
    function downloadFile(url, callback) {
        const filename = path.basename(url);
        const req = https.get(url, (res) => {
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on("error", (err) => {
                console.log("Error Writing to the stream");
                console.log(err);
            });
            fileStream.on("close", () => {
                callback(filename);
            });
            fileStream.on("finish", () => {
                fileStream.close();
                console.log("Done!");
            });
        });

        req.on("error", (err) => {
            console.log("Error downloading the file");
            console.log(err);
        });

    }
    console.log(req.body);
    downloadFile(req.body.url, (fname) => {
        console.log(fname);
        res.redirect('/');
    });


});
app.post('/uploadfile', uploadMultiple, function (req, res, next) {

    if (req.files) {
        console.log(req.files)
        res.send("<h1>Files uploaded successfully</h1>");
    }

});

app.listen(PORT, () => {
    console.log(`App is listening on Port ${PORT}`);
});