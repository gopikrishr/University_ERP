/*
// Created by Academy on 20/10/16
// Model file for State
// Fields to be captured
// name: String 
// country: id Reference to Country Object
// activeStatus: boolean
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/
var mongoose = require("mongoose");
var Country = require('../master/Country.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the StateSchema Here
var StateSchema = new Schema({
    name: {type: String, required: true},
    country: {type: Schema.ObjectId, ref : 'Country', required: true},
    activeStatus: Boolean,
    createdOn: Date,
    updatedOn: Date
});

module.exports = mongoose.model('State', StateSchema);