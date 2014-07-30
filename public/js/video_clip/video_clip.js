'use strict';

var chart_module = angular.module('video_clip', ["nvd3ChartDirectives", "crp.utils","ngResource"])

  .service('VideoClipService', ['$resource', function ($resource) {
    return { report: function (id) {return $resource("/api/video_clip/report/:id", {id: '@id'}, {query: {method: 'GET', isArray: true}}).query({id: id});}};
  }])

  .factory('TransfertimeNormalizeFilter', [function () {
    var factory = {};

    // Calc a line on the form ax+b where b is the line passing 0 x and a is the angle of the line
    function calc_norm(clip_length) {
      return clip_length * 5.67 + 1200;
    };

    factory.filter = function (series) {
      var data = {};
      var max_y = 3600*8;
      data.series = series;

      data.max_x = 0;
      data.discarded_points = [];

      data.filtered_data = _.filter(series, function (e) {
          if (e[1] < max_y) {
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

    factory.filter1 = function (series) {
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

  .controller('VideoClipChartController', ['$scope', 'VideoClipService', 'TransfertimeNormalizeFilter', 'CrpUtils',
    function ($scope, VideoClipService, TransfertimeNormalizeFilter, CrpUtils) {

      // Initialize data
      $scope.transfer_data = [{key: "test", values: []} ];

      // Get data
      VideoClipService.report(1).$promise.then(function (data) {
        $scope.src_data = data;
        $scope.transfer_data = [{key: "transcoding", values: data }];
      });

      $scope.data_x = function () {return function (d, i) {return d[2]}};
      $scope.data_y = function () {return function (d, i) {return d[1]}};

      // handle graphs
      $scope.xAxisTickFormatFunction = function () { return function (secs) {return CrpUtils.secondsToTime(secs);};};
      $scope.yAxisTickFormatFunction = function () {return function (d) {return CrpUtils.secondsToTime(d);};};

      $scope.infoColor = function () {
        return function (d, i) {
          if (i === 0) return 'blue';
          return 'red';
        };
      };

      $scope.$on('elementClick.directive', function (angularEvent, event) {
        $scope.show_asset(event.point[0]);
      });


      $scope.tooltip = function () {
        return function (key, x, y, e, graph) {
          if (e.seriesIndex == 1) return "";
          return  'Video clip ' +
            '<h1>' + e.point[0] + '</h1>';
        };
      };

      function calc_norm(clip_length) {
        return clip_length * 5.67 + 1200;
      };

      $scope.Nofilter = function () {
        $scope.transfer_data = [{key: 'assets', values: $scope.src_data}];
      };


      $scope.filter1 = function () {
        var data = TransfertimeNormalizeFilter.filter($scope.src_data);

        $scope.transfer_data = [{key: 'assets', values: data.filtered_data}];
      };

      $scope.filter2 = function () {
        var data = TransfertimeNormalizeFilter.filter1($scope.src_data);

        $scope.transfer_data = [
          {key: 'assets', values: data.filtered_data}
        ];
      };

      $scope.filter3 = function () {
        var data = TransfertimeNormalizeFilter.filter1($scope.src_data);

        $scope.transfer_data = [
          {key: 'assets', values: data.filtered_data},
          {key: 'border_line', values: [
            [-1, calc_norm(0), 0],
            [-1, calc_norm(data.max_x), data.max_x]
          ]}
        ];
      };
    }
  ]);