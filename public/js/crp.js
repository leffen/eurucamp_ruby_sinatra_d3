'use strict';

var app = angular.module('crp', ["nvd3ChartDirectives", "crp.utils", "crp.services", "ngRoute", "crp.chart"])

  .controller('NavbarController', ['$scope', '$location', function ($scope, $location) {
    $scope.routeIs = function (routeName) {
      return $location.path() === routeName;
    };
  }])

  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.
        when('/dashboard', {
          templateUrl: '/partials/dashboard.html',
          controller: 'ChartController'
        }).
        otherwise({
          redirectTo: '/dashboard'
        });
    }]);





