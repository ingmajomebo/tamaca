angular.module('starter')
 
.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;
  var rolUsuario = 'yourRol';
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
     // debugger;
      useCredentials(token);
    }
    return token;
  }

  function loadUserRol(){
    var rol = window.localStorage.getItem(rolUsuario);
    //debugger;
    return rol;
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function storeUserRol(rol){
    window.localStorage.setItem(rolUsuario, rol);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var register = function(user) {
    
      $http.post(API_ENDPOINT.url + '/signup').then(function(result) {
        console.log(result.data.success);

      });
  };
 
  var login = function(user) {
   
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + 'auth_login',user).then(function(result) {
        // debugger;
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          storeUserRol(result.data.rol);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };


  var huesped = function(user) {
   
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + 'huesped',user).then(function(result) {
         //debugger;
        if (result.data.success) {
          //storeUserCredentials(result.data.mgs);
          resolve(result.data.mgs);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };

  var credencial = function(){
    return loadUserRol();
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    logout: logout,
    huesped: huesped,
    credencial: credencial,
    isAuthenticated: function() {return isAuthenticated;},
  };
})
 
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});