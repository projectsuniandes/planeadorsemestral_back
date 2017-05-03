"use strict";

var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');

// create a new Router
var router = express.Router();

// on routes that end in /optimization
// ----------------------------------------------------
router.route('/')

    // recieve optimization request from client
    .post(function(req, res) {

        // recieve preferences that will become restrictions
        // format those restrictions if necessary

        // ASYNC
        // gets adjacency matrix from module
        // adds already seen subjects in other module

        // ASYNC
        // ask for optimization to our optimization module
        // recieve optimization model

        // transform its format so it fits the GUI?

        // send it to the Angular interface
        let response = "this is the response";

        res.json(response);
      })


module.exports = router;
