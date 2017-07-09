var assert = require('assert');
var chai = require('chai');
var request = require('supertest');
var bodyParser = require('body-parser');
var app = require('../server');
var siteSpeed = require('../siteSpeed');

var expect = chai.expect;

// Default Mocha test to determine the testing is setup correctly
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('Unit Tests', function() {
    describe('Set Performance Metrics', function() {
        it('should return performance with a speedIndex value of "4,234"', function() {
            var performance = siteSpeed.setPerformanceMetrics(
                [{ttfb: 400, headers: 1}, 
                    {"audits": 
                        {"speed-index-metric": {"displayValue": "4,234"},
                        "total-byte-weight": {"rawValue": 100000}}
                    }
                ]);
            assert.equal("4,234", performance.speedIndex);
        });
    });
});

describe('Integration Tests', function() {
    describe('', function() {
        it('should return performance object', function(done) {
            var testUrl = 'https://www.google.com';
            // set the Mocha timeout for this test only
            this.timeout(25000);
            request(app)
            .post('/submit-url')
            .send({"url": testUrl})
            .end(function(err, res) {
                console.log(JSON.stringify(res));
                expect(res.statusCode).to.equal(200);
                expect(JSON.parse(res.text)).to.have.own.property('firstByte');
                done();
            });
        });
    })
});
