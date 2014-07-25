'use strict';

angular.module('video_clip')
  .directive('rpTranscodeDistribution', function () {
    return {
      restrict: 'EA',
      templateUrl: 'js/video_clip/rp_transcode_distribution.html',
      scope: {
        report_data: '=data',
        title: '='
      },
      replace: true,
      controller: function ($scope, CrpUtils) {

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
        $scope.tooltip = function () {
          return function (key, x, y, e, graph) {
            if (e.seriesIndex == 1) return "";
            return  'Video clip ' +
              '<h1>' + e.point[0] + '</h1>';
          };
        };

      }
    };
  })
  .directive('rpTranscodeBar', function () {
    return {
      restrict: 'EA',
      templateUrl: 'js/video_clip/rp_transcoding_bar.html',
      scope: {
        report_data: '=data',
        title: '='
      },
      replace: true,
      controller: function ($scope, CrpUtils) {
        $scope.xAxisTickFormatFunction = function () { return function (secs) {return CrpUtils.secondsToTime(secs);};};
        $scope.yAxisTickFormatFunction = function () {return function (d) {return CrpUtils.secondsToTime(d);};};
      }
    };
  })
  .directive('rpServerBar', function () {
    return {
      restrict: 'EA',
      templateUrl: 'js/video_clip/rp_server_bar.html',
      scope: {
        report_data: '=data',
        title: '='
      },
      replace: true,
      controller: function ($scope) {
        $scope.data_y = function () {return function (d, i) {return d[1]}};
      }
    };
  })
;