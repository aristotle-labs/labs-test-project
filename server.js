'use strict';

var debug = require('debug')('labs-test-project');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var validurl = require('valid-url');
var siteSpeed = require('./siteSpeed');
var siteSeo = require('./siteSeo');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Constants
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NAME = 'labs-test-project';

// Routes
app.route('/')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
  });

app.route('/submit-url')
  .post(function (req, res) {
    var url = req.body.url;
    debug('posted to submit-url route');

    //validate url
    if (!validurl.isWebUri(url)) {
      return res.send('URL invalid. Please check the url and try again.');
    }

    //test site speed
    var siteSpeedResults = siteSpeed(url);

    //test seo
    var siteSeoResults = siteSeo(url);    

    //return results to user
    res.send('Site Speed Results: ' + siteSpeedResults + ' \n Site SEO Results: ' + siteSeoResults);     
  });

app.listen(PORT, HOST);
debug('Running on http://' + HOST + ':' + PORT, NAME);