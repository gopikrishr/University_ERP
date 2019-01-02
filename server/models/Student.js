/*
// Created by Academy on 20/10/16
// Model file for Student
// Fields to be captured
// name: String 
// rollno: String
// dob: Date
// email: String
// mobileNumber: Number
// year: String restrict possible values to "I Year", "II Year", "III Year", "IV Year", "V Year"
// yearofJoining: String
// college: id Reference to College Object
// hostel: id Reference to Hostel Object
// activeStatus: String
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/

var mongoose = require('mongoose');
var College = require('../models/College.js');
var Hostel = require('../models/Hostel.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the StudentSchema Here
var StudentSchema = new Schema({
    name: {type: String, required: true},
    rollNo: {type: Number, required: true},
    dob: {type: Date, required: true},
    email: {type: String, required: true},
    mobileNumber: {type: Number, required: true},
    year: { type: String, enum: ["I Year", "II Year", "III Year", "IV Year", "V Year"], required: true },
    yearOfJoining: {type: Number, required: true},
    college: { type: ObjectId, ref: "College", required: true },
    hostel: { type: ObjectId, ref: "Hostel", required: true },
    activeStatus: Boolean,
    createdOn: Date,
    updatedOn: Date
});

module.exports = mongoose.model('Student', StudentSchema);
