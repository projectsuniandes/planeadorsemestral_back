"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');
var pg         = require('pg');
var query      = require('pg-query');

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

        let programs = []; //["'FISI'", "'ISIS'"]; //
        programs.push("'" +req.query.program1 + "'");
        programs.push("'" +req.query.program2 + "'");
        programs.push("'" +req.query.program3 + "'");
        //let courses = merger.mergeCourses(programs);


        let sql  = "SELECT * FROM courses INNER JOIN programs ON courses.program_id = programs.id WHERE programs.program_code="+ programs[0] + " OR programs.program_code=" + programs[1] + " OR programs.program_code=" + programs[2];
        console.log(sql);
          query(sql, function(err, result) {
            console.log('entra query');
            if (err){
              console.log(err);
            }
            console.log(result);

            return res.json(result);

          });
      });

function getProgramId(programName){
  let sql  = 'SELECT * FROM courses WHERE program_id=1';
  let answer = "asadasdasd";

    query(sql, function(err, result) {
      console.log('entra query');
      if (err){
        console.log(err);
      }
      console.log(result);

      return res.json(result);

    });
}


module.exports = router;
