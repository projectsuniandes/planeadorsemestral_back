"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');
var pg         = require('pg');
var query      = require('pg-query');
var async     = require('async');



// create a new Router
var router = express.Router();

// on routes that end in /cleaning
// ----------------------------------------------------
router.route('/prerequisites')

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


    let sql_subquery  = "SELECT DISTINCT courses_aux.course_code, courses_aux.course_name, courses_in_programs.program_code FROM courses_aux INNER JOIN courses_in_programs ON courses_aux.course_code = courses_in_programs.course_code";
    if(req.query.program1){
        sql_subquery += " WHERE courses_in_programs.program_code=" + programs[0];
    }
    if(req.query.program2){
        sql_subquery += " OR courses_in_programs.program_code=" + programs[1];
    }
    if(req.query.program3){
        sql_subquery += " OR courses_in_programs.program_code=" + programs[2];
    }

    let sql_bigquery = "SELECT course_prerequisites.course1_code, course_prerequisites.course2_code FROM ";
    sql_bigquery += "(" + sql_subquery + ") " + " AS merged_courses INNER JOIN course_prerequisites ON course_prerequisites.course2_code = merged_courses.course_code";

    console.log(sql_subquery);
      query(sql_bigquery, function(err, result) {
        if (err){
          console.log(err);
        }
        var map = new Map();
        let prerequisites = [];
        for(let i = 0; i < result.length; i++){
            let current_prerequisite = result[i];
            if(map.has(current_prerequisite.course2_code)){
              let current_list = map.get(current_prerequisite.course2_code);
              current_list.push(current_prerequisite.course1_code);
            }else{
              let current_list = [];
              current_list.push(current_prerequisite.course1_code);
              map.set(current_prerequisite.course2_code, current_list);
            }
        }
        //console.log(map);
        map.forEach(function(value, key) {
          let current_list = value;
          let list_to_save_later = current_list;
          for(let i = 0; i < current_list.length; i++){
            let current_prerequisite = current_list[i];

              if(map.has(current_prerequisite)){
                let prerequisites_from_prerequisite = map.get(current_prerequisite).sort();
                let current_list_copy = current_list.sort();

                let indexI = 0;
                let indexJ = 0;

                while(indexI < prerequisites_from_prerequisite.length && indexJ < current_list_copy.length){
                  if(prerequisites_from_prerequisite[indexI] === current_list_copy[indexJ]){
                    // borramos el elemento de list_to_save_later
                    var index = list_to_save_later.indexOf(current_list_copy[indexJ]);
                    if (index > -1) {
                        list_to_save_later.splice(index, 1);
                    }
                  }
                  else if(prerequisites_from_prerequisite[indexI] < current_list_copy[indexJ]){
                    indexI++;
                  }
                  else {
                    indexJ++;
                  }
                }
              }
            }


          let prerequisite_entry = { course_code: key  , prerequisites: list_to_save_later };
          prerequisites.push(prerequisite_entry);
        });



        return res.json(prerequisites);

      });
  });

  // on routes that end in /cleaning
  // ----------------------------------------------------
  router.route('/corequisites')

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


      let sql_subquery  = "SELECT DISTINCT courses_aux.course_code, courses_aux.course_name, courses_in_programs.program_code FROM courses_aux INNER JOIN courses_in_programs ON courses_aux.course_code = courses_in_programs.course_code";
      if(req.query.program1){
          sql_subquery += " WHERE courses_in_programs.program_code=" + programs[0];
      }
      if(req.query.program2){
          sql_subquery += " OR courses_in_programs.program_code=" + programs[1];
      }
      if(req.query.program3){
          sql_subquery += " OR courses_in_programs.program_code=" + programs[2];
      }

      let sql_bigquery = "SELECT course_corequisites.course1_code, course_corequisites.course2_code FROM ";
      sql_bigquery += "(" + sql_subquery + ") " + " AS merged_courses INNER JOIN course_corequisites ON course_corequisites.course2_code = merged_courses.course_code";

      console.log(sql_subquery);
        query(sql_bigquery, function(err, result) {
          if (err){
            console.log(err);
          }
          var map = new Map();
          let prerequisites = [];
          for(let i = 0; i < result.length; i++){
              let current_prerequisite = result[i];
              if(map.has(current_prerequisite.course2_code)){
                let current_list = map.get(current_prerequisite.course2_code);
                current_list.push(current_prerequisite.course1_code);
              }else{
                let current_list = [];
                current_list.push(current_prerequisite.course1_code);
                map.set(current_prerequisite.course2_code, current_list);
              }
          }
          //console.log(map);
          map.forEach(function(value, key) {
            let current_list = value;
            let list_to_save_later = current_list;
            for(let i = 0; i < current_list.length; i++){
              let current_prerequisite = current_list[i];

                if(map.has(current_prerequisite)){
                  let prerequisites_from_prerequisite = map.get(current_prerequisite).sort();
                  let current_list_copy = current_list.sort();

                  let indexI = 0;
                  let indexJ = 0;

                  while(indexI < prerequisites_from_prerequisite.length && indexJ < current_list_copy.length){
                    if(prerequisites_from_prerequisite[indexI] === current_list_copy[indexJ]){
                      // borramos el elemento de list_to_save_later
                      var index = list_to_save_later.indexOf(current_list_copy[indexJ]);
                      if (index > -1) {
                          list_to_save_later.splice(index, 1);
                      }
                    }
                    else if(prerequisites_from_prerequisite[indexI] < current_list_copy[indexJ]){
                      indexI++;
                    }
                    else {
                      indexJ++;
                    }
                  }
                }
              }


            let prerequisite_entry = { course_code: key  , corequisites: list_to_save_later };
            prerequisites.push(prerequisite_entry);
          });



          return res.json(prerequisites);

        });
    });

    router.route('/requisites')

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


        let sql_subquery  = "SELECT DISTINCT courses_aux.course_code, courses_aux.course_name, courses_in_programs.program_code FROM courses_aux INNER JOIN courses_in_programs ON courses_aux.course_code = courses_in_programs.course_code";
        if(req.query.program1){
            sql_subquery += " WHERE courses_in_programs.program_code=" + programs[0];
        }
        if(req.query.program2){
            sql_subquery += " OR courses_in_programs.program_code=" + programs[1];
        }
        if(req.query.program3){
            sql_subquery += " OR courses_in_programs.program_code=" + programs[2];
        }

        let sql_bigquery = "SELECT course_prerequisites.course1_code, course_prerequisites.course2_code FROM ";
        sql_bigquery += "(" + sql_subquery + ") " + " AS merged_courses INNER JOIN course_prerequisites ON course_prerequisites.course2_code = merged_courses.course_code";

        console.log(sql_subquery);
          query(sql_bigquery, function(err, result) {
            if (err){
              console.log(err);
            }
            var map = new Map();
            let prerequisites = [];
            for(let i = 0; i < result.length; i++){
                let current_prerequisite = result[i];
                if(map.has(current_prerequisite.course2_code)){
                  let current_list = map.get(current_prerequisite.course2_code);
                  current_list.push(current_prerequisite.course1_code);
                }else{
                  let current_list = [];
                  current_list.push(current_prerequisite.course1_code);
                  map.set(current_prerequisite.course2_code, current_list);
                }
            }
            //console.log(map);
            map.forEach(function(value, key) {
              let current_list = value;
              let list_to_save_later = current_list;
              for(let i = 0; i < current_list.length; i++){
                let current_prerequisite = current_list[i];

                  if(map.has(current_prerequisite)){
                    let prerequisites_from_prerequisite = map.get(current_prerequisite).sort();
                    let current_list_copy = current_list.sort();

                    let indexI = 0;
                    let indexJ = 0;

                    while(indexI < prerequisites_from_prerequisite.length && indexJ < current_list_copy.length){
                      if(prerequisites_from_prerequisite[indexI] === current_list_copy[indexJ]){
                        // borramos el elemento de list_to_save_later
                        var index = list_to_save_later.indexOf(current_list_copy[indexJ]);
                        if (index > -1) {
                            list_to_save_later.splice(index, 1);
                        }
                      }
                      else if(prerequisites_from_prerequisite[indexI] < current_list_copy[indexJ]){
                        indexI++;
                      }
                      else {
                        indexJ++;
                      }
                    }
                  }
                }


              let prerequisite_entry = { course_code: key  , prerequisites: list_to_save_later };
              prerequisites.push(prerequisite_entry);
            });

            /// AQUI PONEMOS EL OTRO

            let sql_subquery_co  = "SELECT DISTINCT course_code, courses.name, program_id, program_code FROM courses INNER JOIN programs ON courses.program_id = programs.id";
            if(req.query.program1){
                sql_subquery_co += " WHERE programs.program_code=" + programs[0];
            }
            if(req.query.program2){
                sql_subquery_co += " OR programs.program_code=" + programs[1];
            }
            if(req.query.program3){
                sql_subquery_co += " OR programs.program_code=" + programs[2];
            }

            let sql_bigquery_co = "SELECT course_corequisites.course1_code, course_corequisites.course2_code FROM ";
            sql_bigquery_co += "(" + sql_subquery_co + ") " + " AS merged_courses INNER JOIN course_corequisites ON course_corequisites.course2_code = merged_courses.course_code";

            //console.log(sql_subquery);
              query(sql_bigquery_co, function(err, result) {
                if (err){
                  console.log(err);
                }
                var mapco = new Map();
                let corequisites = [];
                for(let i = 0; i < result.length; i++){
                    let current_corequisite = result[i];
                    if(mapco.has(current_corequisite.course2_code)){
                      let current_list = mapco.get(current_corequisite.course2_code);
                      current_list.push(current_corequisite.course1_code);
                    }else{
                      let current_list = [];
                      current_list.push(current_corequisite.course1_code);
                      mapco.set(current_corequisite.course2_code, current_list);
                    }
                }
                //console.log(map);
                mapco.forEach(function(value, key) {
                  let current_list = value;
                  let corequisite_entry = { course_code: key  , prerequisites: current_list };
                  corequisites.push(corequisite_entry);
                });

                //merge de co con prerequisites
                let prodFinal = [];
                //console.log(map);
                var mapLau = new Map();
                map.forEach(function(value, key){
                  let cor = [];
                  if( mapco.has(key)){
                    cor = mapco.get(key);
                  }
                  let entryF = { course_code: key , prerequisites: value, corequisites: cor};
                  mapLau.set(key, key);
                  prodFinal.push(entryF);

                  })

                mapco.forEach(function(value, key){
                  if(!mapLau.has(key)){
                    let pre = [];
                    let entryF = { course_code: key , prerequisites: pre, corequisites: value};
                    prodFinal.push(entryF);
                  }

                })
                  return res.json(prodFinal);


                });



          });
      });

module.exports = router;
