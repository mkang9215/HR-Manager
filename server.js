/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Minjung Kang____ Student ID: __151293198____ Date: __Feb 19 2021_____
*
*  Online (Heroku) Link: ___https://lit-reaches-97055.herokuapp.com/ ________________________
*
********************************************************************************/ 

var express = require("express");
var path = require("path");
const data = require("./data-service.js");
var app = express();
const HTTP_PORT = process.env.PORT || 8080;

const multer = require("multer");
const bodyParser = require('body-parser');
const fs = require("fs");

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

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/home.html"));
});

app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/employees", (req, res) => { 
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then((data) => {        
            res.json({message: data });
        }).catch((err) => { 
            res.json({ message: err }); 
        });
    } else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then((data) => {        
            res.json({message: data });
        }).catch((err) => { 
            res.json({ message: err }); 
        });
    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then((data) => {        
            res.json({message: data });
        }).catch((err) => { 
            res.json({ message: err }); 
        });
    } else {
        data.getAllEmployees().then((data) => {        
            res.json(data);
        }).catch((err) => { 
            res.json({ message: err }); 
        });
    }
});

app.get("/employee/:value", (req, res) => {
    data.getEmployeeByNum(req.params.value).then((data) => {        
        res.json(data);
    }).catch((err) => { 
        res.json({ message: err }); 
    });
});


app.get("/managers", function (req, res) {
    data.getManagers().then((data) => {
        res.json(data);
    }).catch((err) => { 
        res.json({ message: err }); 
    });
});

app.get("/departments", function (req, res) {
    data.getDepartments().then((data) => {
        res.json(data);
    }).catch((err) => { 
        res.json({ message: err }); 
    });
});

app.get("/employees/add", (req, res) => { 
    res.sendFile(path.join(__dirname, "./views/addEmployee.html"));
});

app.post("/employees/add", (req, res) => { 
    data.addEmployee(req.body).then(() => {     
        res.redirect("/employees");
    });
});


app.get("/images/add", (req, res) => { 
    res.sendFile(path.join(__dirname, "./views/addImages.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => { 
    fs.readdir("./public/images/uploaded", function(err, items) {  
        res.json({images: items});
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