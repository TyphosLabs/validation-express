"use strict";

module.exports = function(validation_base){
    
    // add a .express() function to the validation base
    validation_base.express = function expressValidation(validations, options) {
        var validation = validation_base.Object(validations);
        return function (req, res, next) {
            var field;
            
            req.valid = {};
            var result = validation.validate((options && options.query ? req.query : req.body), req.valid);
            
            // replace the invalid values with the valid ones
            if(options && options.query){
                for(field in req.valid){
                    req.query[field] = req.valid[field];
                }
            } else {
                for(field in req.valid){
                    req.body[field] = req.valid[field];
                }
            }
            
            if (result instanceof validation_base.Invalid){
                // need to have a sparse flag
                var bad;
                for(field in result.fields){
                    if(result.fields[field]._type === 'NO_VALIDATION'){
                        delete result.fields[field];
                    } else {
                        bad = true;
                    }
                }
                
                // if still bad
                if(bad){
                    req.invalid = result;
                }
            }
            next();
        };
    };
};