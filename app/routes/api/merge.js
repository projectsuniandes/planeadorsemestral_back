"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');
var pg         = require('pg');
var query      = require('pg-query');
var async     = require('async');

// calls the module that merges subjects
//var merger = require('../../modules/merger');



// create a new Router
var router = express.Router();

// on routes that end in /optimization
// ----------------------------------------------------
router.route('/')

    // recieve request for merging
    .get(function(req, res) {
        // extract programs from query params and save them in programs
        let programs = []; //
        //let courses = merger.mergeCourses(programs);

        let sql  = 'SELECT * FROM courses WHERE program_id=1';
        let answer = "asadasdasd";
        var promise = query(sql, function(err, result) {
            console.log('entra query');
            if (err){
              console.log(err);
            }

            answer=result;
            return res.json(result);



          });



      })


module.exports = router;
