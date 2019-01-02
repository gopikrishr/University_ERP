/*
// Created by Academy on 20/10/16
// Controller for Managing the Country Master
*/

var mongoose = require('mongoose');
var Schema = mongoose.schema;
var Country = require('../../models/master/Country');
var HttpStatus = require('http-status');
var Validation = require('../../services/ValidationService.js');

//Export the save method to save a Country
//Check if the country already exists 
//throw a country already exists error
//If not then create the country
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    var country = new Country();
    country.name = req.body.name;
    country.createdOn = Date.now();
    country.activeStatus = true;
    Country.find({ "name": new RegExp('^' + country.name + '$', 'i') }, function (err, results) {               
        if (results == null || results.length == 0) {
            country.save(function (saveErr, saveCountry) {
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
                    data: saveCountry,
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

//Export the list method to return a list of all Countries
exports.list = function (req, res) {
    Country.find(function (err, results) {
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

//Export the activeList method to list all active Countries
exports.activeList = function (req, res) {
    Country.find({ "activeStatus": true }, function (err, results) {
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
//Find the Country by id passed in the request parameters 
//and update it with the country object in the request body
//Throw an error
//If the country name already exists
//If the country is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    Country.find({ $or: [{ "_id": req.body._id }, { "name": new RegExp('^' + req.body.name + '$', 'i')}] }, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }

        var countryById = results.filter(function (result) {
            return result._id == req.body._id;
        });
        var countryByName = results.filter(function (result) {
            return result.name.toLowerCase() == req.body.name.toLowerCase().trim() ? result.name : null;
        });

        if (results == null || countryById == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else if (countryByName.length > 0 && countryByName[0].name.toLowerCase().trim() == req.body.name.toLowerCase().trim()) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'user defined' } } })
            });
        }
        else {
            Country.update({ "_id": req.body._id }, { $set: { "name": req.body.name } }, function (saveErr, saveCountry) {
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
                    data: saveCountry,
                    error: ''
                });
            });
        }
    });
};

//Export the activate method
//Find the Country by the id in request parameter
//Update the Country's activeStatus to true
//Throw an error
//If the country is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    Country.findById(req.params.id, function (err, results) {
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
            Country.update({ "_id": req.params.id }, {
                $set: { "activeStatus": "true", "updatedOn": Date.now() }
            }, function (err, results) {
                res.status(HttpStatus.OK).json({
                    status: 'success',
                    code: HttpStatus.OK,
                    data: results,
                    error: ''
                });
            });
        }
    });
};

//Export the deactivate method
//Find the Country by the id in request parameter
//Update the Country's activeStatus to false
//Throw an error
//If the country is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    Country.findById(req.params.id, function (err, results) {
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
            Country.update({ "_id": req.params.id }, {
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