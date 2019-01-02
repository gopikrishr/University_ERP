/*
// Created by Academy on 20/10/16
// Controller for Managing Hostels
*/

var HttpStatus = require('http-status');
var College = require('../models/College');
var Hostel = require('../models/Hostel');
var Validation = require('../services/ValidationService.js');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

//Export the save method to save a Hostel
//Check if the Hostel already exists for the given College
//throw a Hostel already exists error
//If not then create the Hostel for the Given College
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    var hostel = new Hostel();
    hostel.name = req.body.name;
    hostel.college = req.body.college;
    hostel.createdOn = Date.now();
    hostel.activeStatus = true;
    Hostel.find({ "name": new RegExp('^' + hostel.name + '$', 'i'), "college" : hostel.college }, function (err, results) {
        if (results == null || results.length == 0) {
            hostel.save(function (saveErr, saveHostel) {
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
                    data: saveHostel,
                    error: ''
                });
            });
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'user defined' } } })
            });
        }
    });
};

//Export the list method to return a list of all Hostels
exports.list = function (req, res) {
    Hostel.find(function (err, results) {
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
//all Hostels for a given College
//The College id is passed as id in the request parameters
exports.getByCollege = function (req, res) {
    Hostel.find({ "college": req.params.id }, function (err, results) {
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

//Export the activeListByCollege method to list 
//all active Hostels for a given College
//The College id is passed as id in the request parameters
exports.activeListByCollege = function (req, res) {
    Hostel.find({ "college": req.params.id, "activeStatus": true }, function (err, results) {
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
}

//Export the get method to return
//a Hostel object given the id in the request parameters
exports.get = function (req, res) {
    Hostel.find({ "_id": req.body.id }, function (err, results) {
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
//Find the Hostel by id passed in the request parameters 
//and update it with the Hostel object in the request body
//Throw an error
//If the Hostel name already exists
//If the Hostel is not found
////Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    Hostel.find({ $or: [{ "_id": req.body._id }, { "name": { $regex: new RegExp('^' + req.body.name + '$', 'i') } }] }, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }

        var hostelById = results.filter(function (result) {
            return result._id == req.body._id;
        });
        var hostelByName = results.filter(function (result) {
            return result.name.toLowerCase() == req.body.name.toLowerCase().trim() ? result.name : null;
        });

        if (results == null || hostelById == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else if (hostelByName.length > 0 && hostelByName[0].name.toLowerCase().trim() == req.body.name.toLowerCase().trim()) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'user defined' } } })
            });
        }
        else {
            Hostel.update({ "_id": req.body._id }, { $set: { "name": req.body.name } }, function (saveErr, saveHostel) {
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
                    data: saveHostel,
                    error: ''
                });
            });
        }
    });
};

//Export the activate method
//Find the Hostel by the id request parameter
//Update the Hostel activeStatus to true
//Throw an error
//If the Hostel is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    Hostel.findById(req.params.id, function (err, results) {
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
            Hostel.update({ "_id": req.params.id }, {
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
//Find the Hostel by the id request parameter
//Update the Hostel activeStatus to false
//Throw an error
//If the Hostel is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    Hostel.findById(req.params.id, function (err, results) {
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
            Hostel.update({ "_id": req.params.id }, {
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