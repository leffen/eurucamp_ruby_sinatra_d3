'use strict';

angular.module('widgets', [])
  .filter('momentFromNow', [function () {
    return function (value, format, suffix) {
      if (typeof value === 'undefined' || value === null) {
        return '';
      }



      var m = moment(Date.parse(value));

      return m.fromNow();
    };
  }])
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
  })
  .directive('notifications', function () {
    return {
      restrict: 'EA',
      templateUrl: 'partials/notifications.html',
      scope: {
        data: '=',
        title: '='
      },
      replace: true,
      controller: function ($scope) {
      }
    };
  })
  .directive('chat', function () {
    return {
      restrict: 'EA',
      templateUrl: 'partials/chat.html',
      scope: {
        data: '=',
        title: '='
      },
      replace: true,
      controller: function ($scope) {
        $scope.chat_side = function(id) {
          return id % 2 === 0 ? 'left' : 'right';
        };
      }
    };
  })


;
