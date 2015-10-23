(function() {
  'use strict';
  angular
    .module('app')
    .config(config)
    .controller('TasksCtrl',['CoursesService', 'TasksService', 'tasksList', '$stateParams','$filter', TasksCtrl]);

  function config($stateProvider) {
    $stateProvider
      .state('root.tasks', {
        parent: 'root.courses',
        url: '/:courseId/tasks',
        views: {
          '@': {
            templateUrl: 'src/app/tasks/tasks.tpl.html',
            controller: 'TasksCtrl',
            controllerAs: 'vm',
            resolve: {
              tasksList: function(CoursesService, $stateParams) {
                return CoursesService.getTasks($stateParams.courseId);
              }
            }
          }
        }
      });
  }

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function TasksCtrl(CoursesService, TasksService, tasksList, $stateParams, $filter) {
    var vm = this;

    //The course
    var courseId = $stateParams.courseId;

    //get the tasks fro the specific course
    vm.tasks = tasksList.data.data;

    function readTasks(){
      CoursesService.getTasks(courseId).then(
          function(tasks){
            vm.tasks = tasks.data.data;
          }
      )
    }

    vm.createTask = function(task, isValid){
      if (isValid) {
        //add the course that the note related to
        var newTask = angular.copy(task);
        newTask.course = courseId;
        newTask.dueDate = toUTCDate(task.dueDate);

        TasksService.create(newTask)
            .then(function (result) {
              //you can add it locally or refresh from server
              result.data.dueDate = new Date(result.data.dueDate); //update the date
              vm.tasks.push(result.data);
              resetForm();
            })
            .catch(function (reason) {
              // alert
              console.log(reason);
            });
      }
    }

    vm.updateTask = function(task){
      vm.loading = true;

      task.dueDate = toUTCDate(task.dueDate);
      TasksService.update(task).
          then(function (result) {
            //do something good
            vm.loading = false;
          })
          .catch(function (reason) {
            // alert
            console.log(reason);
          });
    }

    vm.deleteTask = function(id){
      TasksService.destroy(id).
          then(function (result) {
            //refresh the course list
            readTasks();
          })
          .catch(function (reason) {
            // alert
            console.log(reason);
          });
    }

    function resetForm() {
      vm.newTask = {
        dueDate: null,
        description: ''
      };
    };

    function toUTCDate(date){
      return $filter('date')(new Date(date), 'yyyy-MM-dd');
    }

  }


})();
