(function() {
  'use strict';

  angular.module('home', [])
      .config(config)
      .controller('HomeCtrl',['DataService','date', HomeCtrl]);

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home', {
        url: '/home',
        views: {
          '@': {
            templateUrl: 'src/app/home/home.tpl.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm',
            resolve: {
              data: function(DataService) {
                return DataService.get();
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
  function HomeCtrl(DataService, data) {
    var home = this;
    home.data = data.data;
  }


})();
