
/**
 * Module dependencies.
 */

var bodyParser = require('body-parser');
var express = require('express');
var oauthServer = require('oauth2-server');
var render = require('co-views')('views');
var util = require('util');

// Create an Express application.
var app = express();

// Add body parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Start listening for requests.
app.listen(3000);
