(function (angular) {
    'use strict';

    //// JavaScript Code ////
    function AuthServiceFactory($http, $q, localStorageService) {
        var apiEndPoint = 'http://ngauthenticationapi.azurewebsites.net/';
        var loginUri = '/login';
        var logoutUri = '/logout';
        var registerUri = '/users';

        var _authentication = {
            isAuth: false,
            userName : ""
        };

        function _setApiEndpoint(endpoint) {
            apiEndPoint = endpoint;
        }

        function _setLoginUri(newloginUri) {
            loginUri = newloginUri;
        }

        function _setLogoutUri(newlogoutUri) {
            logoutUri = newlogoutUri;
        }

        function _getLoginUri() {
            return loginUri;
        }

        function _setRegisterUri(newregisterUri) {
            registerUri = newregisterUri;
        }

        function _saveRegistration (registration) {

            _logOut();

            return $http.post(apiEndPoint + 'api/account/register', registration).then(function (response) {
                return response;
            });

        }

        function _login(loginData) {
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            var deferred = $q.defer();
            $http.post(apiEndPoint + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                deferred.resolve(response);
            }).error(function (err) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _logOut() {
            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.userName = "";
        }

        function _fillAuthData() {
            var authData = localStorageService.get('authorizationData');
            if (authData)
            {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }
        }

        var authServiceFactory = {
            saveRegistration : _saveRegistration,
            login : _login,
            logOut : _logOut,
            fillAuthData : _fillAuthData,
            authentication : _authentication,
            getLoginUri : _getLoginUri
        };

        return {
            setApiEndpoint : _setApiEndpoint,
            setLoginUri : _setLoginUri,
            setLogoutUri : _setLogoutUri,
            setRegisterUri : _setRegisterUri,
            $get : function() {
                return authServiceFactory;
            }
        };
    }

    //// Angular Code ////
    angular.module('LoopbackAuthService').provider('authService',AuthServiceFactory);

})(angular);