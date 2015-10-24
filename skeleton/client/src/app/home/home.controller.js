(function() {
  'use strict';

  angular.module('home', [])
      .config(config)
      .controller('HomeCtrl',['data', HomeCtrl]);

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
  function HomeCtrl(data) {
    var vm = this;
    vm.data = data.data;
  }


})();
