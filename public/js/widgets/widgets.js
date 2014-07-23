'use strict';

angular.module('widgets', [])
  .directive('bigStat', function () {
    return {
      restrict: 'EA',
      templateUrl: 'partials/big_stat.html',
      scope: {
        panel_css: '=panelCss',
        fa_font: '=faFont',
        title: '=',
        number: '='
      },
      replace: true,
      controller: function ($scope) {
      }
    };
  });
