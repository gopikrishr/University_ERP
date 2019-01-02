/*
// Created by Academy on 20/10/16
// Create ValidationService with a single function validationErrors
// Capture the mongodb errors and return them as Understandable messages
// For example if a required field is not included, then capture the error
// return <field name> is Required
*/
exports.validationErrors = function (err) {
    var errors = {};
    if (err) {
        switch (err.name) {
            case 'ValidationError':
                for (field in err.errors) {
                    switch (err.errors[field].type) {
                        case 'required':
                            errors[field] = [field] + ' is Required';
                            break;
                        case 'user defined':
                            errors[field] = 'Already Exist';
                            break;
                        case 'enum':
                            errors[field] = 'Invalid ' + [field];
                            break;
                        case 'notfound':
                            errors[field] = 'Country Not Found';
                            break;
                    }
                }
                break;
            case 'CastError':
                if (err.type === 'number') {
                    errors[err.path] = [err.path] + ' must be a Number';
                }
                if (err.type === 'date') {
                    errors[err.path] = [err.path] + ' must be a Valid Date';
                }
                if (err.type === 'ObjectId') {
                    errors[err.path] = [err.path] + ' is NotValid';
                }
                break;            
        }
    }           
    if (err == null){        
        errors = { name: "An Error Occurred while processing the request. Please try after some time" };
    }
    return errors;
};