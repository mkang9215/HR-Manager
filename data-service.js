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

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {        
        employeeData.employeeNum = employees.length + 1;
        employeeData.isManager = ( employeeData.isManager) ? true : false;
        employees.push(employeeData);
        resolve();
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => { 
        var arr = [];
        
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].status == status.replace(/"/g, '')) {
                arr.push(employees[i]);
            }
        }       
        if(arr.length == 0) {
            reject("no results returned");
        }
        resolve(arr);
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {        
        var arr = [];
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].department == department) {
                arr.push(employees[i]);
            }
        }
        if(arr.length == 0) {
            reject("no results returned");
        }
        resolve(arr);
    });
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {        
        var arr = [];
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].employeeManagerNum == manager) {
                arr.push(employees[i]);
            }
        }
        if(arr.length == 0) {
            reject("no results returned");
        }
        resolve(arr);
    });
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {        
        var foundEmployee = null;
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].employeeNum == num) {
                foundEmployee = employees[i];
            }
        }
        if(!foundEmployee) {
            reject("no results returned");
        }
        resolve(foundEmployee);
    });
}

module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {    
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].employeeNum == employeeData.employeeNum) {
                employees[i] = employeeData;
                resolve();
            }
        }
    });
}
