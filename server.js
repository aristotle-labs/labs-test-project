'use strict';

var debug = require('debug')('server');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var validurl = require('valid-url');
var siteSpeed = require('./siteSpeed');
var app = express();
app.use(bodyParser.json()); // allows posting from test framework
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Constants
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NAME = 'labs-test-project';

// Routes
app.route('/')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.min.html'));
  });

app.route('/submit-url')
  .post(function (req, res) {
    var url = req.body.url;
    var siteSpeedResults;
    debug('posted to submit-url route');

    //validate url
    if (!validurl.isWebUri(url)) {
      res.statusCode = 400;
      return res.send('URL "' + url + '" invalid. Please check the url and try again.');
    }

    siteSpeed.getSpeedMetrics(url).then(function(result) {
      debug("siteSpeed result: " + JSON.stringify(result));
      res.send(result);     
    }, function(err){
      debug('Error: ' + err);
      res.statusCode = 400;
      res.send('Error: ' + err);
    });    
  });

app.listen(PORT, HOST);
debug('Running on http://' + HOST + ':' + PORT, NAME);

module.exports = app;