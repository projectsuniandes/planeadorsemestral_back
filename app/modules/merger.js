'use strict';
var config     = require('../../config');
var superSecret = config.secret;
var path       = require('path');
var pg         = require('pg');
var query      = require('pg-query');

var async = require("async");


module.exports = {

  getCoursesFromProgram: function(program){
    let sql  = 'SELECT * FROM courses';
    let answer = "back";


      query(sql, function(err, result) {
        //console.log('entra query');
        if (err){
          console.log(err);
        }
        //console.log(result);
        return result;
      });
  }

  // returns a list of all the courses that a student must see while pursuing degrees in programs listed
  mergeCourses : function(programs){
    let coursesProgram1 = [];
    let coursesProgram2 = [];
    let coursesProgram3 = [];

    let sql  = 'SELECT * FROM courses';
    let answer = "back";


      query(sql, function(err, result) {
        //console.log('entra query');
        if (err){
          console.log(err);
        }
        //console.log(result);
        return result;
      });

      while(answer == "back"){

      }
      return answer;

  }
}
