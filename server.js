/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Minjung Kang____ Student ID: __151293198____ Date: __Mar 12 2021_____
*
*  Online (Heroku) Link: ___https://lit-reaches-97055.herokuapp.com/ ________________________
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const data = require("./data-service.js");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const multer = require("multer");
const bodyParser = require('body-parser');
const fs = require("fs");
const exphbs = require('express-handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function onHTTPStart() {
    console.log("Express http server listening on port " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});  
const upload = multer({ storage: storage });

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/employees", (req, res) => { 
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then((data) => {        
            res.render("employees", {employees: data});
        }).catch((err) => { 
            res.render({message: "no results"});
        });
    } else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then((data) => {        
            res.render("employees", {employees: data});
        }).catch((err) => { 
            res.render({message: "no results"});
        });
    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then((data) => {        
            res.render("employees", {employees: data});
        }).catch((err) => { 
            res.render({message: "no results"});
        });
    } else {
        data.getAllEmployees().then((data) => {        
            res.render("employees", {employees: data});
        }).catch((err) => { 
            res.render({message: "no results"});
        });
    }
});

app.get("/employee/:empNum", (req, res) => {
    data.getEmployeeByNum(req.params.empNum).then((data) => {        
        res.render("employee", { employee: data }); 
    }).catch((err) => { 
        res.render("employee",{message:"no results"}); 
    });
});

app.get("/departments", function (req, res) {
    data.getDepartments().then((data) => {
        res.render("departments", {departments: data});
    }).catch((err) => { 
        res.render({message: "no results"});
    });
});

app.get("/employees/add", (req, res) => { 
    res.render("addEmployee");
});

app.post("/employees/add", (req, res) => { 
    data.addEmployee(req.body).then(() => {     
        res.redirect("/employees");
    });
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(() => {     
        res.redirect("/employees");
    });
});

app.get("/images/add", (req, res) => { 
    res.render("addImages");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => { 
    fs.readdir("./public/images/uploaded", function(err, items) {  
        res.render("images", {images: items});
    });     
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

data.initialize().then(function() {   
    app.listen(HTTP_PORT, onHTTPStart);
}).catch((err) => {
    console.log("failed to start " + err);
});