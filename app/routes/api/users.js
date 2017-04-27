var express = require('express');
//var users   = require('../../../data').users;
var query   = require('pg-query');
var bcrypt  = require('bcrypt-nodejs');
var jwt     = require('jsonwebtoken');
var config  = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;

var router = express.Router();
