/*
// Created by Academy on 20/10/16
// Controller for Managing Colleges
*/
var HttpStatus = require('http-status');
var College = require('../models/College');
var State = require('../models/master/State');
var Country = require('../models/master/Country');
var City = require('../models/master/City');
var Validation = require('../services/ValidationService.js');

//Export the save method to save a College
//Check if the College already exists
//throw a College already exists error
//If not then create the College
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    var college = new College();
    college.name = req.body.name;
    college.addressLine1 = req.body.addressLine1;
    college.addressLine2 = req.body.addressLine2;
    college.country = req.body.country;
    college.state = req.body.state;
    college.city = req.body.city;
    college.createdOn = Date.now();
    college.activeStatus = true;
    College.findOne({ "name": { $regex: RegExp('^' + college.name + '$', 'i') } }, function (err, results) {
        if (results == null) {
            college.save(function (saveErr, saveCollege) {
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
                    data: saveCollege,
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

//Export the list method to return a list of all Colleges
exports.list = function (req, res) {
    College.find().populate("city").populate("state").exec(function (err, results) {
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

//Export the activeList method to return a list of all Active Colleges
exports.activeList = function (req, res) {
    College.find({ "activeStatus": true }, function (err, results) {
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

//Export the getByCountry method to list 
//all active Colleges for a given Country
//The Country id is passed as id in the request parameters
exports.getByCountry = function (req, res) {
    College.find({ "country": req.params.id }, function (err, results) {
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

//Export the get method to return
//a College object given the id in the request parameters
exports.get = function (req, res) {
    College.findOne({ "_id": req.params.id }).populate("city").populate("state").populate("country").exec(function (err, results) {
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
//Find the College by id passed in the request parameters 
//and update it with the College object in the request body
//Throw an error
//If the College name already exists
//If the College is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    College.find({ "_id": { $ne: req.body._id }, "name": req.body.name }, function (err, results) {        
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }

        if (results.length > 0) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'user defined' } } })
            });
            return;
        }

        College.find({ "_id": req.body._id }, function (err, results) {
            if (err != null) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'failure',
                    code: HttpStatus.BAD_REQUEST,
                    data: '',
                    error: Validation.validationErrors()
                });
                return;
            }

            var collegeById = results.filter(function (result) {
                return result._id == req.body._id;
            });

            if (results == null || collegeById == null) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'failure',
                    code: HttpStatus.BAD_REQUEST,
                    data: '',
                    error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
                });
            }

            else {
                College.update({ "_id": req.body._id }, { $set: { "name": req.body.name, "addressLine1": req.body.addressLine1, "addressLine2": req.body.addressLine2, "country": req.body.country, "state": req.body.state, "city": req.body.city } }, function (saveErr, saveCollege) {
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
                        data: saveCollege,
                        error: ''
                    });
                });
            }
        });
    });
};

//Export the activate method
//Find the College by the id request parameter
//Update the College activeStatus to true
//Throw an error
//If the College is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    College.findById(req.params.id, function (err, results) {
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
            College.update({ "_id": req.params.id }, {
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
//Find the College by the id request parameter
//Update the College activeStatus to false
//Throw an error
//If the College is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    College.findById(req.params.id, function (err, results) {
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
            College.update({ "_id": req.params.id }, {
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