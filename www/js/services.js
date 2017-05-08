angular.module('starter')
 
.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;
  var rolUsuario = 'yourRol';
  var nombreUsuario = 'yourUsuario';
  var productos = 'arrayProducto';
  var ArrayProductos = [];

 //funcion para guardar el token el localstorage 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
     // debugger;
      useCredentials(token);
    }
    return token;
  }


//funcion que carga el rol del usuario del localstorage
  function loadUserRol(){
    var rol = window.localStorage.getItem(rolUsuario);
    //debugger;
    return rol;
  }

//funcion que carga el nombre del usuario del localstorage
  function loadNombreUser(){
    var nomUser = window.localStorage.getItem(nombreUsuario);
    return nomUser;
  }
//-----------------------------------------------------------------------------
  function saveProducto(productosArray){
    //Insertamos el poducto a un array 
    ArrayProductos.push(productosArray);
    //Insertamos el array a la variable storage y volvemos ese array en un json.stringify
    window.localStorage.setItem(productos, JSON.stringify(ArrayProductos))
  }

//funcion para obtener productos 
  function obtenerProductos(){
    var getProductos = window.localStorage.getItem(productos);
    return getProductos;
   // debugger;
  }
 //funcion para borrar producto del la varible de localstorage
  function borrarProducto(item){
      var a = JSON.parse(window.localStorage.getItem(productos));
      window.localStorage.removeItem(productos);
      ArrayProductos.splice(item,1);
      a.splice(item, 1);
      var vecto = a;
      window.localStorage.setItem(productos, JSON.stringify(vecto));
  }

//-------------------------------------------------------------------------------

//funcion para guardar el token en el localstorage
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

//funcion que guarda el rol y el nombre del usuario en el localstorage
  function storeUserRol(rol){
    //debugger;
    $roles = rol[1];

    window.localStorage.setItem(rolUsuario, rol[0]);
    window.localStorage.setItem(nombreUsuario, rol[1]);
  }

//funcion que le asigna los valores al token true
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

//funcion que destruye la credenciales del local storage
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

//funcion que borra los producto del localstorage
  function destroyCarrito(){
    window.localStorage.removeItem(productos);
  }
 

//funcion para el registro de usuario 
  var register = function(user) {
    return $q(function(resolve,reject){
        $http.post(API_ENDPOINT.url + 'registrar',user).then(function(result) {
            resolve(result.data.success);
      });
    });
      
  };
//---------------------------------------------------------------------------------
/*servicio add esta funcion es para añadir un producto a la 
  variable storag para el carrito de compra*/ 
  var add = function(productosArray){
      saveProducto(productosArray);
  }
  
//--------------------------------------------------------------------------------

//funcion del login
  var login = function(user) {
    
    return $q(function(resolve, reject) {
      //Llamamos el servicio auth_login del API REST el cual le mandamos objeto user
      $http.post(API_ENDPOINT.url + 'auth_login',user).then(function(result) {
        //si el usaurio ingreso las credenciales correcta este retornara success como true
        if (result.data.success) {
          //mandamos el token a la funcion storeUserCredentials
          storeUserCredentials(result.data.token);
          //mandamos las credenciales que es nombre y rol storeUserRol
          storeUserRol(result.data.credencial);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

//verificar si el usuario es huesped
  var huesped = function(user) { 
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + 'huesped',user).then(function(result) {
       //resultado si el usuario es huesped o no 
        if (result.data.success) {
          resolve(result.data.mgs);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 

 //funciones que llamamos en la vista 
  var logout = function() {
    destroyUserCredentials();
  };

  var credencial = function(){
    //debugger;
    return loadUserRol();
  };

  var nomUsuario = function(){
    return loadNombreUser();
  }

  var borrarCarrito = function(){
    destroyCarrito();
  }

  var borrarProductoLocal = function(item){
     borrarProducto(item);
  }
//------------------------------------------------------------------------

var retornarProductos = function(){
  return obtenerProductos();
}
//------------------------------------------------------------------------

//carga las credenciales;
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    logout: logout,
    huesped: huesped,
    credencial: credencial,
    nomUsuario: nomUsuario,
    add: add,
    retornarProductos: retornarProductos,
    borrarCarrito: borrarCarrito,
    borrarProductoLocal: borrarProductoLocal,

    isAuthenticated: function() {return isAuthenticated;},
  };
})
 
//el que controla los erores y da respuesta a las peticiones http
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