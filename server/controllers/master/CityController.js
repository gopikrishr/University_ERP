/*
// Created by Academy on 20/10/16
// Controller for Managing City Master
*/

var HttpStatus = require('http-status');
var State = require('../../models/master/State');
var Country = require('../../models/master/Country');
var City = require('../../models/master/City');
var Validation = require('../../services/ValidationService.js');

//Export the save method to save a City
//Check if the city already exists 
//throw a city already exists error
//If not then create the city
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    var city = new City();
    city.name = req.body.name;
    city.country = req.body.country;
    city.state = req.body.state;
    city.createdOn = Date.now();
    city.activeStatus = true;
    City.find({ "name": { $regex: RegExp('^' + city.name + '$', 'i') } }, function (err, results) {
        if (results == null || results.length == 0) {
            city.save(function (saveErr, saveCity) {
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
                    data: saveCity,
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

//Export the list method to return a list of all Cities
exports.list = function (req, res) {
    City.find().populate("state").exec(function (err, results) {
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


//Export the activeList method to list all active Cities
exports.activeList = function (req, res) {
    City.find({ "activeStatus": true }, function (err, results) {
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

//Export the getByState method to list 
//all active Cities for a given State
//The state id is passed as id in the request parameters
exports.getByState = function (req, res) {
    City.find({ "state": req.params.id }, function (err, results) {
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
//a City object given the id in the request parameters
exports.get = function (req, res) {
    City.find({ "_id": req.body.id }, function (err, results) {
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
//Find the city by id passed in the request parameters 
//and update it with the city object in the request body
//Throw an error
//If the city name already exists
//If the city is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    City.find({ $or: [{ "_id": req.body._id }, { "name": { $regex: new RegExp('^' + req.body.name + '$', 'i') } }] }, function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors()
            });
            return;
        }

        var cityById = results.filter(function (result) {
            return result._id == req.body._id;
        });
        var cityByName = results.filter(function (result) {
            return result.name.toLowerCase() == req.body.name.toLowerCase().trim() ? result.name : null;
        });

        if (results == null || cityById == null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'notfound' } } })
            });
        }
        else if (cityByName.length > 0 && cityByName[0].name.toLowerCase().trim() == req.body.name.toLowerCase().trim()) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                data: '',
                error: Validation.validationErrors({ name: 'ValidationError', errors: { name: { field: 'Name', type: 'user defined' } } })
            });
        }
        else {
            City.update({ "_id": req.body._id }, { $set: { "name": req.body.name, "country": req.body.country, "state": req.body.state } }, function (saveErr, saveCity) {
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
                    data: saveCity,
                    error: ''
                });
            });
        }
    });
};

//Export the activate method
//Find the city by the id request parameter
//Update the city activeStatus to true
//Throw an error
//If the city is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    City.findById(req.params.id, function (err, results) {
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
            City.update({ "_id": req.params.id }, {
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
//Find the city by the id request parameter
//Update the city activeStatus to false
//Throw an error
//If the city is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    City.findById(req.params.id, function (err, results) {
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
            City.update({ "_id": req.params.id }, {
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