/*
// Created by Academy on 20/10/16
// Model file for College
// Fields to be captured
// name: String 
// addressLine1: String
// addressLine2: String
// city: Id reference to City Object
// state: Id reference to State Object
// country: Id reference to Country Object
// activeStatus: boolean
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/

var mongoose = require("mongoose");
var Country = require('../models/master/Country.js');
var State = require('../models/master/State.js');
var City = require('../models/master/City.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the CollegeSchema here
var CollegeSchema = new Schema({
    name: {type: String, required: true},
    addressLine1: {type: String, required: true},
    addressLine2: String,
    city: {type: ObjectId, ref:'City', required: true},
    state: {type: ObjectId, ref:'State', required: true},
    country: {type: ObjectId, ref:'Country', required: true},
    activeStatus: Boolean,
    createdOn: Date,
    updatedOn: Date
});

module.exports = mongoose.model('College', CollegeSchema);