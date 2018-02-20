const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();
app.use(express.static('public'));

const s3 = new aws.S3({
    region: 'us-east-2'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'nodewebapptestbucket',
        acl: 'public-read',
        key: function (request, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
}).array('upload', 1);
  

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.get("/success", function (request, response) {
    response.sendFile(__dirname + '/public/success.html');
});

app.get("/error", function (request, response) {
    response.sendFile(__dirname + '/public/error.html');
});

app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
        if (error) {
        console.log(error);
        return response.redirect("/error");
        }
        console.log('File uploaded successfully.');
        response.redirect("/success");
    });
});

app.listen(8080, function () {
    console.log('Server listening on port 8080.');
});