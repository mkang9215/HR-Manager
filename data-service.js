const fs = require("fs");
let departments = [];
let employees = [];

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err, data) => {
            if(err) {
                reject("unable to read file");
            }
            employees = JSON.parse(data);
            fs.readFile('./data/departments.json', (err, data) => {
                if(err) {
                    reject("unable to read file");
                }
                departments = JSON.parse(data);                
                resolve();       
            });
        });        
    });    
}

module.exports.getAllEmployees = function() {
    return new Promise((resolve, reject) => {        
        if(employees.length == 0) {
            reject("no results returned");
        }
        resolve(employees);
    });
}

module.exports.getManagers = function() {
    return new Promise(function(resolve, reject) {
        var managers = [];
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].isManager == true) {
                managers.push(employees[i]);
            }
        }
        if(managers.length == 0) {
            reject("no results returned");
        }
        resolve(managers);
    });
}

module.exports.getDepartments = function() {
    return new Promise((resolve, reject) => {        
        if(departments.length == 0) {
            reject("no results returned");
        }
        resolve(departments);
    });
}