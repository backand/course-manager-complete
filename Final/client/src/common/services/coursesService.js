(function() {
  'use strict';

  angular.module('common.services.data')
      .factory('CoursesService', ['$http', 'Backand', coursesService]);

  function coursesService($http, Backand) {

    var factory = {
      list: list,
      create: create,
      update: update,
      destroy: destroy,
      getTasks: getTasks

    };
    return factory;

    ////////////////////////////////

    //return Backand url for object
    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/courses';
    }

    //return Backand url with object's id
    function getUrlForId(courseId) {
      return Backand.getApiUrl() + '/1/objects/courses/' + courseId;
    }

    //get list of courses
    function list() {
      return $http.get(getUrl());
    }

    //create new course
    function create(course) {
      return $http.post(getUrl() + '?returnObject=true', course);
    }

    //update course data
    function update(course) {
      return $http.put(getUrlForId(course.id), course);
    }

    //delete course
    function destroy(courseId) {
      return $http.delete(getUrlForId(courseId));
    }

    //get tasks
    function getTasks(courseId){
      return $http.get(getUrl() + '/' + courseId + '/tasks').then(
          function(tasks){
            tasks.data.data.forEach(function(task){
              task.dueDate = new Date(task.dueDate);
            })
            return tasks;
          }
      );
    }

  }

})();
