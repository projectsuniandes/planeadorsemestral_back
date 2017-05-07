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

// on routes that end in /merge
// ----------------------------------------------------
router.route('/')

// recieve request for merging
.get(function(req, res) {
    // extract programs from query params and save them in programs

    let programs = [];
    if(req.query.program1){
      //console.log("considera programa 1");
      programs.push("'" +req.query.program1 + "'");
    }
    if(req.query.program2){
      //console.log("considera programa 2");
      programs.push("'" +req.query.program2 + "'");
    }
    if(req.query.program3){
      //console.log("considera programa 3");
      programs.push("'" +req.query.program3 + "'");
    }

    let sql  = "SELECT DISTINCT course_code, courses.name, program_id, program_code FROM courses INNER JOIN programs ON courses.program_id = programs.id";
    if(req.query.program1){
        sql += " WHERE programs.program_code=" + programs[0];
    }
    if(req.query.program2){
        sql += " OR programs.program_code=" + programs[1];
    }
    if(req.query.program3){
        sql += " OR programs.program_code=" + programs[2];
    }

    console.log(sql);
      query(sql, function(err, result) {
        if (err){
          console.log(err);
        }
        return res.json(result);
      });
  });

  // on routes that end in /merge/correcto
  // ----------------------------------------------------
  router.route('/correcto')

  // recieve request for merging
  .get(function(req, res) {
      // extract programs from query params and save them in programs

      let programs = [];
      if(req.query.program1){
        //console.log("considera programa 1");
        programs.push("'" +req.query.program1 + "'");
      }
      if(req.query.program2){
        //console.log("considera programa 2");
        programs.push("'" +req.query.program2 + "'");
      }
      if(req.query.program3){
        //console.log("considera programa 3");
        programs.push("'" +req.query.program3 + "'");
      }

      let sql  = "SELECT DISTINCT courses_in_programs.course_code, courses_aux.course_name, courses_in_programs.program_id,";
      sql += " courses_in_programs.program_code, courses_aux.credits FROM courses_in_programs INNER JOIN courses_aux";
      sql+= " ON courses_in_programs.course_code = courses_aux.course_code";
      if(req.query.program1){
          sql += " WHERE courses_in_programs.program_code=" + programs[0];
      }
      if(req.query.program2){
          sql += " OR courses_in_programs.program_code=" + programs[1];
      }
      if(req.query.program3){
          sql += " OR courses_in_programs.program_code=" + programs[2];
      }

      console.log(sql);
        query(sql, function(err, result) {
          if (err){
            console.log("ERRROR FUKK")
            console.log(err);
          }
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
      //console.log(result);
      return res.json(result);
    });
}

module.exports = router;
