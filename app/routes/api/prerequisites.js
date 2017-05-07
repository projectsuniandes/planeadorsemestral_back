"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');
var pg         = require('pg');
var query      = require('pg-query');
var async     = require('async');



// create a new Router
var router = express.Router();

// on routes that end in /prerequisites
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



    let sql_subquery  = "SELECT DISTINCT course_code, courses.name, program_id, program_code FROM courses INNER JOIN programs ON courses.program_id = programs.id";
    if(req.query.program1){
        sql_subquery += " WHERE programs.program_code=" + programs[0];
    }
    if(req.query.program2){
        sql_subquery += " OR programs.program_code=" + programs[1];
    }
    if(req.query.program3){
        sql_subquery += " OR programs.program_code=" + programs[2];
    }

    let sql_bigquery = "SELECT course_dependencies.course1_code, course_dependencies.course2_code FROM ";
    sql_bigquery += "(" + sql_subquery + ") " + " AS merged_courses INNER JOIN course_dependencies ON course_dependencies.course2_code = merged_courses.course_code";

    console.log(sql_subquery);
      query(sql_bigquery, function(err, result) {
        if (err){
          console.log(err);
        }
        return res.json(result);
      });
  });
module.exports = router;
