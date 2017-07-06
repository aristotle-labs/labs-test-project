'use strict';

const debug = require('debug')('siteSpeed');
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');

module.exports = {
    getSpeedMetrics: function(url) {
        debug("Launching Chrome.")
        return chromeLauncher.launch({
            port: 9222,
            chromeFlags: ['--headless', '--disable-gpu', '--host-rules MAP * 127.0.0.1, EXCLUDE localhost'],
        }).then((chrome) => {
            var lighthouseOptions = {
                output: 'json',
                port: chrome.port,
            };
            debug("Lighthouse debugging started on port " + chrome.port);
            return lighthouse(url, lighthouseOptions).then(function(results) {
                chrome.kill();
                // This is simply returning the raw results in JSON.
                // TODO: filter down the results to the relevant ones (ex. speed index) and 
                // add additional custom requirements (ex. h1 tag count).
                return results;
            }, function(err) {
                debug("Error: " + err);
                chrome.kill();
                return "Error";                
            });
        });
    }    
}