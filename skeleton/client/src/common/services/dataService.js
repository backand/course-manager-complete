(function() {
  'use strict';

  angular
      .module('common.services.data',[])
      .factory('DataService', ['$http', 'Backand', DataService]);

  function DataService($http, Backand) {

    var factory = {
      get: get,
      list: list,
      create: create,
      update: update,
      destroy: destroy

    };
    return factory;

    ////////////////////////////////

    function get() {
      return ['some', 'data'];
    }

    //return Backand url for object
    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/object';
    }

    //return Backand url with object's id
    function getUrlForId(objectId) {
      return Backand.getApiUrl() + '/1/objects/object/' + objectId;
    }

    //get list of items in the object
    function list() {
      return $http.get(getUrl());
    }

    //create new object
    function create(object) {
      return $http.post(getUrl() + '?returnObject=true', object);
    }

    //update object's data
    function update(object) {
      return $http.put(getUrlForId(object.id), object);
    }

    //delete object
    function destroy(objectId) {
      return $http.delete(getUrlForId(objectId));
    }


  }

})();
