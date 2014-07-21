'use strict';

angular.module('crp.services', ["ngResource"])
  .service('ClipDataR1', ['$resource', function ($resource) {
    return $resource("/api/clip_data/r1", {}, {query: {method: 'GET', isArray: true}}).query();
  }])
  .service('ClipDataR2', ['$resource', function ($resource) {
    return $resource("/api/clip_data/r2", {}, {query: {method: 'GET', isArray: true}}).query();
  }])
  .service('AssetInfo', ['$resource',function($resource){
    return $resource("/api/asset/:id", {id: '@id'});
  }])
  .service('AssetFlow', ['$resource',function($resource){
    return $resource("/api/asset/:id/flow", {id: '@id'});
  }])

;