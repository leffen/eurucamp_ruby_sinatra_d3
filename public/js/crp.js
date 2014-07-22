'use strict';

var app = angular.module('crp', ["nvd3ChartDirectives", "video_clip", "crp.utils","ngRoute"])

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
          controller: 'VideoClipChartController'
        }).
        otherwise({
          redirectTo: '/dashboard'
        });
    }]);





