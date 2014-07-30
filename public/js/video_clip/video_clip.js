'use strict';

angular.module('video_clip', ["nvd3ChartDirectives", "crp.utils", "ngResource"])

  .service('VideoClipService', ['$resource', function ($resource) {
    return {
      report: function (id) {return $resource("/api/video_clip/report/:id", {id: '@id'}, {query: {method: 'GET', isArray: true}}).query({id: id});},
      stats: function () {return $resource("/api/video_clip/stats", {}, {query: {method: 'GET'}}).query();},
      notifications: function () {return $resource("/api/video_clip/notifications", {}, {query: {method: 'GET', isArray: true}}).query();},
      chat: function () {return $resource("/api/video_clip/chat", {}, {query: {method: 'GET', isArray: true}}).query();}

    };
  }])

  .factory('TransfertimeNormalizeFilter', [function () {
    var factory = {};

    // Calc a line on the form ax+b where b is the line passing 0 x and a is the angle of the line
    function calc_norm(clip_length) {
      return clip_length * 5.67 + 1200;
    };

    factory.filter = function (series) {
      var data = {};
      data.series = series;

      data.max_x = 0;
      data.discarded_points = [];

      data.filtered_data = _.filter(series, function (e) {
          var max_y = calc_norm(e[2]);
          if (e[1] < 2 * max_y) {
            if (data.max_x < e[2])  data.max_x = e[2];
            return true;
          } else {
            data.discarded_points.push(e);
          }
          return false;
        }
      );
      return data;
    };
    return factory;
  }])

  .controller('VideoClipChartController', ['$scope', 'VideoClipService', 'TransfertimeNormalizeFilter', '$interval',
    function ($scope, VideoClipService, TransfertimeNormalizeFilter, $interval) {

      // Initialize data
      $scope.transfer_data = [
        {key: "test", values: []}
      ];
      $scope.rp2_data = [
        {key: "test", values: []}
      ];

      $scope.transcoding_server_stats = [
        {key: "test", values: []}
      ];

      $scope.stats = {};
      $scope.notifications = [];
      $scope.messages = [];
      $scope.timeline = [];

      // Get data
      VideoClipService.report(1).$promise.then(function (data) {
        $scope.src_data = data;
        $scope.transfer_data = filter1();
      });

      VideoClipService.report(2).$promise.then(function (data) {
        $scope.rp2_src_data = data;
        var data =  TransfertimeNormalizeFilter.filter(data);
        console.log(data);
        $scope.rp2_data = [
          {key: "transcoding", values: data.filtered_data }
        ];
      });
      VideoClipService.stats().$promise.then(function (data) {$scope.stats = data;});
      VideoClipService.notifications().$promise.then(function (data) {$scope.notifications = data;});
      VideoClipService.chat().$promise.then(function (data) { $scope.messages = data;});
      VideoClipService.report(3).$promise.then(function (data) {$scope.timeline = data;});
      VideoClipService.report(4).$promise.then(function (data) {
        $scope.transcoding_server_stats = [
          {key: "Servers", values: data }
        ];
      });

      $interval(function () {
        $scope.clock = new Date();
        $scope.ts = ("0" + $scope.clock.getHours()).slice(-2) + ":" +
          ("0" + $scope.clock.getMinutes()).slice(-2) + ":" +
          ("0" + $scope.clock.getSeconds()).slice(-2);
      }, 1000);


      $scope.$on('elementClick.directive', function (angularEvent, event) {
        $scope.show_asset(event.point[0]);
      });


      function calc_norm(clip_length) {
        return clip_length * 7 + 1500;
      };

      $scope.show_asset = function (data) {
        console.log("Show asset ", data);
      };

      function filter1() {
        var data = TransfertimeNormalizeFilter.filter($scope.src_data);

        return [
          {key: 'assets', values: data.filtered_data},
          {key: 'border_line', values: [
            [-1, calc_norm(0), 0],
            [-1, calc_norm(data.max_x), data.max_x]
          ]}
        ];
      };

    }
  ]);