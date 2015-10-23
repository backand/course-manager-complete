(function() {
  'use strict';

  function httpInterceptor($q, Backand) {
    return {
      requestError: function (rejection) {
        return $q.reject(rejection);
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        if ((rejection.config.url + "").indexOf('token') === -1) {
          // When using refresh token, on 401 responses
          // Backand SDK manages refreshing the session and re-sending the requests
          if (rejection.status === 401 && !Backand.isManagingRefreshToken()) {
            Backand.signout();

            var errorMessage =
                Backand.getUsername() ?
                    'The session has expired, please sign in again.' :
                    null;
            $injector.get('$state').go('login', {error: errorMessage}, {reload: true});
          }
        }
        return $q.reject(rejection);
      }
    };
  }

  angular.module('common.interceptors.http', [])
    .factory('httpInterceptor', httpInterceptor);
})();
