'use strict';

var app = angular.module('crp', ["nvd3ChartDirectives", "crp.utils", "crp.services",  "ui.router","crp.chart","ui.bootstrap"])

  .controller('MainController', ['$scope', '$state','ClipDataR1', 'ClipDataR2', 'CrpUtils', 'AssetFlow',
    function ($scope,$state, ClipDataR1, ClipDataR2, CrpUtils, AssetFlow) {

      $scope.show_asset = function (asset_id) {
        AssetFlow.get({id: asset_id}, function (data) {
          $scope.asset = data;
          $scope.asset.image_url = "http://www.tv2.no/tvid/" + $scope.asset.image;
          $scope.asset.duration_str = CrpUtils.secondsToTime($scope.asset["process_duration_calc"]);
        });
      };

    }])
  .controller('NavbarController', ['$scope', '$location', function ($scope, $location) {
    $scope.routeIs = function (routeName) {
      return $location.path() === routeName;
    };
  }])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    $stateProvider.state("dashboard", {  url: "/dashboard", templateUrl: "/partials/dashboard.html" , controller: 'ChartController'});
  });





