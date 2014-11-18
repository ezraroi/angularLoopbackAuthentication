(function (angular) {
    'use strict';

    //// JavaScript Code ////
    function AuthInterceptorServiceFactory($q, $location, authService, localStorageService) {
        function _request(config) {
            config.headers = config.headers || {};
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = authData.token;
            }
            return config;
        }

        function _responseError(rejection) {
            if (rejection.status === 401) {
                $location.path(authService.getLoginUri());
            }
            return $q.reject(rejection);
        }

        return {
            request : _request,
            responseError : _responseError
        };
    }

    //// Angular Code ////
    angular.module('LoopbackAuthService').factory('authInterceptorService',AuthInterceptorServiceFactory);

})(angular);
