"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');

// calls the module that merges subjects
var merger = require('../../modules/merger');



// create a new Router
var router = express.Router();

// on routes that end in /optimization
// ----------------------------------------------------
router.route('/')

    // recieve request for merging
    .get(function(req, res) {

        let response = "this is the response";

        res.json(response);
      })


module.exports = router;
