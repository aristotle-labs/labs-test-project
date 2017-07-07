'use strict';

const debug = require('debug')('siteSpeed');
const chromeLauncher = require('chrome-launcher');
// About this package: https://github.com/GoogleChrome/lighthouse
const lighthouse = require('lighthouse');
const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');

var setPerformanceMetrics = function(rawMetrics) {
        var performance = {
            firstByte: 1234,
            speedIndex: rawMetrics['audits']['speed-index-metric']['displayValue']
        };
        return performance;
    };

module.exports = {
    setPerformanceMetrics: setPerformanceMetrics, // exposes the method for unit testing

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
            return lighthouse(url, lighthouseOptions, perfConfig).then(results => {
                chrome.kill();
                return setPerformanceMetrics(results);
        }).catch(err => {
                debug("Error: " + err);
                chrome.kill();
                return "Error";                
        });
        });
    }    
}