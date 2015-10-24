(function() {
  'use strict';

  angular
      .module('app')
      .config(config)
      .controller('CoursesCtrl', ['CoursesService', 'coursesList', CoursesCtrl]);

  function config($stateProvider) {
    $stateProvider
      .state('root.courses', {
        url: '/courses',
        views: {
          '@': {
            templateUrl: 'src/app/courses/courses.tpl.html',
            controller: 'CoursesCtrl',
            controllerAs: 'vm',
            resolve: {
              coursesList: function (CoursesService) {
                return CoursesService.list();
              }
            }
          }
        }
      })
  }
  /**
   * @name  CoursesController
   * @description Controller
   */
  function CoursesCtrl (CoursesService, coursesList){

    var vm = this;
    vm.courses = null;
    vm.loading = [];

    //get the courses from the resolve
    vm.courses = coursesList.data.data;

    function readCourses(){
      CoursesService.list().then(
        function(coursesList){
          vm.courses = coursesList.data.data;
        }
      )
    }

    vm.createCourse = function(course, isValid) {
      if (isValid) {
        CoursesService.create(course)
          .then(function (result) {
            //add the new course locally
            vm.courses.push(result.data);
          })
          .catch(function (reason) {
            // alert
            console.log(reason);
          });
      }
    };

    vm.updateCourse = function(course, index){
      vm.loading[index] = true;

      CoursesService.update(course).
        then(function (result) {
          //do something good
          vm.loading[index] = false;
        })
        .catch(function (reason) {
          // alert
          console.log(reason);
        });
    };

    vm.deleteCourse = function(id){
      CoursesService.destroy(id).
        then(function (result) {
          //refresh the course list
          readCourses();
        })
        .catch(function (reason) {
          // alert
          console.log(reason);
        });
    }

  }

})();
