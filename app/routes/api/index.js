var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../../../config');
var superSecret = config.secret;

// create a new Router
var apiRouter = express.Router();

// test route to make sure everything is working
apiRouter.get('/', function(req, res) {
  res.json({
    message: 'Welcome to our API.'
  });
});


apiRouter.use('/optimize', require('./optimize'));
apiRouter.use('/merge', require('./merge'));

//apiRouter.use('/users', require('./users'));


module.exports = apiRouter;
