/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Minjung Kang____ Student ID: __151293198____ Date: __Feb 5 2021_____
*
*  Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 

var express = require("express");
var path = require("path");
const data = require("./data-service.js");
var app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

function onHTTPStart() {
    console.log("Express http server listening on port " + HTTP_PORT);
}

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/home.html"));
});
app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/employees", function (req, res) { 
    data.getAllEmployees().then((data) => {
        res.json(data);
    }).catch((err) => { 
        res.json('{ message: ' + err + '}'); 
    });

});
app.get("/managers", function (req, res) {
    data.getManagers().then((data) => {
        res.json(data);
    }).catch((err) => { 
        res.json('{ message: ' + err + '}'); 
    });
});
app.get("/departments", function (req, res) {
    data.getDepartments().then((data) => {
        res.json(data);
    }).catch((err) => { 
        res.json('{ message: ' + err + '}'); 
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

data.initialize().then(function() {   
    app.listen(HTTP_PORT, onHTTPStart);
}).catch(function(err) {
    console.log("failed to start " + err);
});