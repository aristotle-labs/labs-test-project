var app = angular.module('labsTest', ['ngProgress']);

app.controller('performanceController', function($http, ngProgressFactory) {
    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();
    vm.urlHeading = "Enter your site's URL to analyze performance and SEO.";
    vm.hasResults = false;
    vm.url, vm.performance;
    vm.submitUrl = function() {
        vm.progressbar.start();
        console.log(vm.url);
        $http.post('/submit-url', {url: vm.url}).then(function(response) {
            console.log(JSON.stringify(response));
            vm.performance = response.data;
            vm.progressbar.complete();
            vm.hasResults = true;
        }).catch(function(err) {
            console.error(err);
        });
    };
});