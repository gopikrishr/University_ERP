/*
// Created by Academy on 20/10/16
// Model file for Hostel
// Fields to be captured
// name: String 
// college: id Reference to College Object
// activeStatus: boolean
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var College = require('../models/College');

//Define the HostelSchema here
var HostelSchema = new Schema({
    name: {type: String, required: true},
    college: { type: ObjectId, ref: 'College', required: true },
    activeStatus: Boolean,
    createdOn: Date,
    updatedOn: Date
});

module.exports = mongoose.model('Hostel', HostelSchema);