"use strict";

var query      = require('pg-query');
var express = require('express');
// create a new Router
var router = express.Router();
// on routes that end in /programs
// ----------------------------------------------------
router.route('/')

//get all programs
.get(function(req,res){
  let sql = "SELECT * FROM programs";
  query(sql, function(err,result){
    if(err){
      console.log(error);
    }
    return res.json(result);
  });
});
module.exports = router;
