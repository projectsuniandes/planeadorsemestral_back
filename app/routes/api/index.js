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


// route middleware to verify a token
var middleware = function(req,res,next){
  // do logging
      console.log('Somebody just came to our app!');
    // check header or url parameters or post parameters for token
var token = req.body.token || req.query.token || req.headers['x-access-token\ '];
    // decode token
    if(token){
      jwt.verify(token, superSecret, function(err, decoded){
        if(err){
          return res.json({success:false, message: 'Failed to authenticate token. '});
        }
        else{
          //if everything is good, save to req for use in other ROUTESr
          req.decoded = decoded;
          next(); // make sure we go to the next routes and don't stop here
        }
      });
    } else{
      //if there is no token
      //return an HTTP response of 403 (access forbidden) and an error message
      return res.status(403).send({
        success: false,
        message: 'No token provided. '
      });
    }
}


module.exports = apiRouter;
