/*
// Created by Academy on 20/10/16
// Controller for managing the State Master
*/

var State = require('../../models/master/State');
var Country = require('../../models/master/Country');
var City = require('../../models/master/City');
var HttpStatus = require('http-status');
var mongoose = require('mongoose');
var Validation = require('../../services/ValidationService.js');
var ObjectId = mongoose.Types.ObjectId;

//Export the save method to save a State
//Check if the State already exists 
//throw a State already exists error
//If not then create the State
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    var state = new State();
    state.name = req.body.name;
    state.country = req.body.country;
    state.createdOn = Date.now();
    state.activeStatus = true;
    State.find({ "name": { $regex: new RegExp('^' + state.name + '$', 'i') } }, function (err, results) {        
        if (results == null || results.length == 0) {
            state.save(function (saveErr, saveState) {
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
                    data: saveState,
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

//Export the list method to return a list of all States
exports.list = function (req, res) {
    State.find().populate("country").exec(function (err, results) {
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

//Export the activeList method to list all active States
exports.activeList = function (req, res) {
    State.find({ "activeStatus": true }, function (err, results) {
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
//all States for a given Country
//The Country id is passed as id in the request parameters
exports.getByCountry = function (req, res) {
    State.find({ "country": req.params.id }, function (err, results) {
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
//Find the State by id passed in the request parameters 
//and update it with the State object in the request body
//Throw an error
//If the State name already exists
//If the State is not found
////Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    State.find({ $or: [{ "_id": req.body._id }, { "name": { $regex: new RegExp('^' + req.body.name + '$', 'i') } }] }, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }

        var stateById = results.filter(function (result) {
            return result._id == req.body._id;
        });
        var stateByName = results.filter(function (result) {
            return result.name.toLowerCase() == req.body.name.toLowerCase().trim() ? result.name : null;
        });

        if (results == null || stateById == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else if (stateByName.length > 0 && stateByName[0].name.toLowerCase().trim() == req.body.name.toLowerCase().trim()) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'user defined' } } })
            });
        }
        else {
            State.update({ "_id": req.body._id }, { $set: { "name": req.body.name, "country": req.body.country } }, function (saveErr, saveState) {
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
                    data: saveState,
                    error: ''
                });
            });
        }
    });
};

//Export the activate method
//Find the State by the id request parameter
//Update the State activeStatus to true
//Throw an error
//If the State is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    State.findById(req.params.id, function (err, results) {
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
            State.update({ "_id": req.params.id }, {
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
//Find the State by the id request parameter
//Update the State activeStatus to false
//Throw an error
//If the State is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    State.findById(req.params.id, function (err, results) {
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
            State.update({ "_id": req.params.id }, {
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