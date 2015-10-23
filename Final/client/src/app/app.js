(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config(BackandProvider, $stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/courses');
    $logProvider.debugEnabled(true);

    BackandProvider.setAppName('eduh1');
    //BackandProvider.setSignUpToken('0b9bf00e-31f8-4d49-932b-ae0f687bd2d7');
    BackandProvider.setAnonymousToken('557c10bf-d75a-440e-8281-66712c528be4');

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          'header': {
            templateUrl: 'src/common/header.tpl.html',
            controller: 'HeaderCtrl'
          },
          'footer': {
            templateUrl: 'src/common/footer.tpl.html',
            controller: 'FooterCtrl'
          }
        }
      });
  }

  function MainCtrl($log) {
    $log.debug('MainCtrl loaded!');
  }

  function run($log) {
    $log.debug('App is running!');
  }

  angular.module('app', [
      'ui.router',
      'backand',
      'home',
      'getting-started',
      'common.header',
      'common.footer',
      'common.services.backand',
      'common.services.data',
      'common.directives.version',
      'common.filters.uppercase',
      'common.interceptors.http',
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .value('version', '1.1.0');
})();
