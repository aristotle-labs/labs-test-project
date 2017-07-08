var app = angular.module('labsTest', ['ngProgress']);

app.controller('performanceController', function($http, ngProgressFactory) {
    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();
    vm.urlHeading = "Enter your site's URL to analyze performance and SEO.";
    vm.hasResults = false;
    vm.hasError = false;
    vm.hideSubmit = false;
    vm.url, vm.performance, vm.keywords;
    vm.submitUrl = function() {
        vm.hideSubmit = true;
        vm.progressbar.reset();
        vm.progressbar.start();
        vm.hasError = false;
        vm.hasResults = false;
        console.log(vm.url);
        $http.defaults.timeout = 30000;
        $http.post('/submit-url', {url: vm.url}).then(function(response) {
            console.log(JSON.stringify(response));
            vm.performance = response.data;
            if(Object.keys(vm.performance).length == 0) {
                return Promise.reject(new Error("No Content"));
            } else {
                //check if the meta description contains any of the keywords
                if(vm.performance.metaKeywords != null) {
                    vm.keywords = vm.performance.metaKeywords.split(",").filter(function(element) {
                        return vm.performance.metaDescription.toLowerCase().indexOf(element.trim().toLowerCase()) >= 0;
                    });
                }
                vm.progressbar.complete();
                vm.hasResults = true;
                vm.hideSubmit = false;
            }
        }).catch(function(err) {
            vm.progressbar.complete();
            vm.hasError = true;
            vm.hideSubmit = false;
            console.error(err);
        });
    };
});