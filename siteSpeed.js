'use strict';

const debug = require('debug')('siteSpeed');
const chromeLauncher = require('chrome-launcher');
// About this package: https://github.com/GoogleChrome/lighthouse
const lighthouse = require('lighthouse');
const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');
const CDP = require('chrome-remote-interface');

var setPerformanceMetrics = function(values) {
        var performance = {
            firstByte: values[0].ttfb,
            speedIndex: values[1]['audits']['speed-index-metric']['displayValue'],
            pageSize: values[1]['audits']['total-byte-weight']['rawValue'],
            h1Count: values[0].headers,
            title: values[0].title,
            metaDescription: values[0].metaDescription
        };
        return performance;
    };

var getCustomMeasures = function (CDP, port, url) {
    return CDP({port: port}).then(protocol => {
        const {Page, Runtime} = protocol;
        return Promise.all([Page.enable(), Runtime.enable()]).then(() => {
            debug("[countHeaders]");                    
            Page.navigate({url: url});
            return Page.loadEventFired().then(() => {
                debug("Load event fired!");
                var headersScript = "document.getElementsByTagName('h1').length";
                var ttfbScript = "window.performance.timing.responseStart - window.performance.timing.fetchStart";
                var titleScript= "document.title";
                var metaDescription = "document.getElementsByName('description')[0].getAttribute('content')";
                return Promise.all([
                    Runtime.evaluate({expression: headersScript}), 
                    Runtime.evaluate({expression: ttfbScript}), 
                    Runtime.evaluate({expression: titleScript}), 
                    Runtime.evaluate({expression: metaDescription})])
                    .then(values => {
                    debug("Custom Measures: " + JSON.stringify(values));
                    return { 
                        headers: values[0].result.value, 
                        ttfb: values[1].result.value, 
                        title: values[2].result.value || null,
                        metaDescription: values[3].result.value || null
                     };
                });
            });
        });
    });
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
            debug("Performance testing started on port " + chrome.port);
            return Promise.all([getCustomMeasures(CDP, chrome.port, url), lighthouse(url, lighthouseOptions, perfConfig)])
                .then(values => {
                    return setPerformanceMetrics(values);
                }).then(results => {
                    chrome.kill();
                    return results;
                }).catch(err => {
                    debug("Error: " + err);
                    chrome.kill();
                    return err;                
                });
        });
    }    
}