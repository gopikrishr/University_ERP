/*
// Created by Academy on 20/10/16
// Controller for Managing Students
*/
var Student = require('../models/Student');
var College = require('../models/College');
var Hostel = require('../models/Hostel');
var Validation = require('../services/ValidationService.js');

var HttpStatus = require('http-status');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

//Export the save method to save a Student
//Check if the Roll No already exists 
//throw a Roll no already exists error
//If not then create the Student
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    //Write your save code here
    var student = new Student();
    student.name = req.body.name;
    student.rollNo = req.body.rollNo;
    student.dob = req.body.dob;
    student.email = req.body.email;
    student.mobileNumber = req.body.mobileNumber;
    student.year = req.body.year;
    student.yearOfJoining = req.body.yearOfJoining;
    student.college = req.params.id;
    student.hostel = req.body.hostel;
    student.createdOn = Date.now();
    student.activeStatus = true;
    Student.find({ "rollNo": student.rollNo, "college": student.college }, function (err, results) {
        if (results == null || results.length == 0) {
            student.save(function (saveErr, saveStudent) {
                if (saveErr != null) {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        status: 'failure',
                        code: HttpStatus.BAD_REQUEST,
                        data: '',
                        error: Validation.validationErrors()
                    });
                    return;
                }
                res.status(HttpStatus.OK).json({
                    status: 'success',
                    code: HttpStatus.OK,
                    data: saveStudent,
                    error: ''
                });
            });
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { rollNo: { field: 'rollNo', type: 'user defined' } } })
            });
        }
    });
};

//Export the get method to return
//a Student object given the id in the request parameters
//If the student is not found
//Throw a student not found error
exports.get = function (req, res) {
    Student.findOne({ "_id": req.params.id }).exec(function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }
        res.status(HttpStatus.OK).json({
            status: 'success',
            code: HttpStatus.OK,
            data: results,
            error: ''
        });
    });
};

//Export the list method to return a list of all Students
exports.list = function (req, res) {
    Student.find(function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }
        res.status(HttpStatus.OK).json({
            status: 'success',
            code: HttpStatus.OK,
            data: results,
            error: ''
        });
    });
};

//Export the getByCollege method to list 
//all active Students for a given College
//The College id is passed as id in the request parameters
exports.getByCollege = function (req, res) {
    Student.find({ "college": req.params.id }, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }
        res.status(HttpStatus.OK).json({
            status: 'success',
            code: HttpStatus.OK,
            data: results,
            error: ''
        });
    });
};

//Export the update method
//Find the Student by id passed in the request parameters 
//and update it with the Student object in the request body
//Throw an error
//If the Student Roll No already exists
//If the Roll No is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    Student.find({ "_id": { $ne : req.body._id }, "rollNo": req.body.rollNo }, function (err, results) {        
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }       
        console.log(results);
        var studentById = results.filter(function (result) {
            return result._id == req.body._id;
        });
        var studentByRollNo = results.filter(function (result) {            
            return result.rollNo == req.body.rollNo ? result.rollNo : null;
        });

        if (results == null || studentById == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else if (studentByRollNo.length > 0 && studentByRollNo[0].rollNo == req.body.rollNo) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { rollNo: { field: 'rollNo', type: 'user defined' } } })
            });
        }
        else {
            Student.update({ "_id": req.body._id }, {
                $set: {
                    "name": req.body.name,
                    "rollNo": req.body.rollNo,
                    "mobileNumber": req.body.mobileNumber,
                    "year": req.body.year,
                    "yearOfJoining": req.body.yearOfJoining,
                    "hostel": req.body.hostel,
                    "dob": req.body.dob
                }
            }, function (saveErr, saveStudent) {
                if (saveErr) {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        status: 'failure',
                        code: HttpStatus.BAD_REQUEST,
                        data: '',
                        error: Validation.validationErrors(saveErr)
                    });
                    return;
                }
                res.status(HttpStatus.OK).json({
                    status: 'success',
                    code: HttpStatus.OK,
                    data: saveStudent,
                    error: ''
                });
            });
        }
    });
};

//Export the activate method
//Find the Student by the id request parameter
//Update the Student activeStatus to true
//Throw an error
//If the Student is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    Student.findById(req.params.id, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }
        if (results == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else {
            Student.update({ "_id": req.params.id }, {
                $set: { "activeStatus": "true", "updatedOn": Date.now() }
            }, function (err, results) {
                if (err) {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        status: 'failure',
                        code: HttpStatus.BAD_REQUEST,
                        data: '',
                        error: Validation.validationErrors(saveErr)
                    });
                    return;
                }
                else {
                    res.status(HttpStatus.OK).json({
                        status: 'success',
                        code: HttpStatus.OK,
                        data: results,
                        error: ''
                    });
                }
            });
        }
    });
};

//Export the deactivate method
//Find the Student by the id request parameter
//Update the Student activeStatus to false
//Throw an error
//If the Student is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    Student.findById(req.params.id, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }
        if (results == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else {
            Student.update({ "_id": req.params.id }, {
                $set: { "activeStatus": "false", "updatedOn": Date.now() }
            }, function (err, results) {
                if (err) {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        status: 'failure',
                        code: HttpStatus.BAD_REQUEST,
                        data: '',
                        error: Validation.validationErrors(saveErr)
                    });
                    return;
                }
                else {
                    res.status(HttpStatus.OK).json({
                        status: 'success',
                        code: HttpStatus.OK,
                        data: results,
                        error: ''
                    });
                }
            });
        }
    });
};