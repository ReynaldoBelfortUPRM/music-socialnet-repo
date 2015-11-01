var home= angular.module('home',[]);


home.controller('postsCtrl', function($scope, $http) {
    $http.get("json/posts.json")
    .success(function(response) {$scope.posts = response.posts;});
});

home.controller('businessHomeCtrl', function($scope, $http) {
    $http.get("json/business_page.json")
    .success(function(response) {$scope.business = response.business_page;});
});

home.controller('accountHomeCtrl', function($scope, $http) {
    $http.get("json/account.json")
    .success(function(response) {$scope.accounts = response.account;});
});