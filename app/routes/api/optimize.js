var express = require('express');
var users   = require('../../../data').users;
var config  = require('../../../config');

// Handles weird responses from our optimization node
router.post('/report', function(req, res) {
  res.json('love is a laserquest');

});


// on routes that end in /optimization
// ----------------------------------------------------
router.route('/')

    // recieve optimization from optimization node
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


        res.json(response);
      })


module.exports = router;
