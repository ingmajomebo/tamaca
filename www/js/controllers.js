angular.module('starter')
 
//CONTROLADOR DE LOGIN
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state,$location) {
//Objeto que tienes las variables del usuario email y password 
  $scope.user = {
    email: '',
    password: ''
  };

//Accion del ng-click no recibe ningun parametro 
  $scope.login = function() {
    //Llamamos el servicio del login el cual recibe como parametro un objeto 
    AuthService.login($scope.user).then(function(msg) {
        //Redirige  a incio si el usuario ingreso las credenciales correcta 
        $location.path("inside");
    //funcion que se activa si el usuario no ingreso las credenciales correcta 
    }, function(errMsg) {
      //mostramos un mesaje en un alerta 
      var alertPopup = $ionicPopup.alert({
        title: 'Usuario no existe!',
        template: errMsg
      });
    });
  };
})
 
 //-------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------PENDIENTE POR T
// CONTROLADOR DE REGISTRO DE USUARIO 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    nombreUser: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    cedula: '',
    password: ''
  };


  $scope.signup = function() {
    console.log($scope.user);
    AuthService.register($scope.user).then(function(msg) {
      console.log(msg);
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

//---------------------------------------------------------------------------------------------------
// CONTROLADOR DE DETALLE DE PRODUCTO 

.controller('destalleCtrl', function($scope, AuthService,API_ENDPOINT, $http, $state) {
  //Objeto que tienes las variables titulo
    $scope.settings = {
      title: "Detalle"
    };
 
     //Accion del ng-click funcion submit
    $scope.submit = function(){
      /*Llamamos el servicio del add el cual le enviamos 
        como parametro un objeto $scope.bebida*/
      AuthService.add($scope.bebida);
    };

    //Llamamos el servicio detalle del API REST el cual le mandamos el id del producto.
    $http.get(API_ENDPOINT.url + '/detalle/'+$state.params.id).then(function(result) {  
      //Insertamos los dato recibido al objeto detalle para mostrarlo a la vista
       $scope.detalle = result.data.datos;
       //Insertamos los datos al objeto bebida 
       $scope.bebida = {
          idproducto_servicios: result.data.datos[0].idproducto_servicios,
          nombre: result.data.datos[0].nombres,
          descripcion: result.data.datos[0].descripcion,
          valor: result.data.datos[0].valor,
          sugerencia: ""
      };
    
    });
})

//-------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------
// CONTROLADOR DE LISTA DE PRODUCTO

.controller('listaBebidaCtrl', function($scope, AuthService,API_ENDPOINT, $http, $state) {
    
    //Accion del ng-click funcion getListaBebidas
    $scope.getListaBebidas = function(){
      /*Objeto que tienes dos variables id_departamento y id_tipoProducto
      la inicializamos con un dato para la funcion que este en la api reciba los datos 
      y nos retorne solo las bebidas*/
        $scope.user = {
              id_departamento: 1,
              id_tipoProducto: 1
        };

    //Llamamos el servicio bebida del API REST el cual le mandamos objeto
    $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
       //Insertamos el resultado en un objeto detalle
         $scope.detalle = result.data.bebidas;
    });
    };


    $scope.obteberProductos = function(){
        AuthService.retornarProductos();
    };

    $scope.getListaPlatos = function(){
      $scope.user = {
              id_departamento: 1,
              id_tipoProducto: 2
      };

      $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
        // console.log(result);
        $scope.detalle = result.data.bebidas;
        $scope.data = {showReorder: false};
        console.log($scope.detalle);
      });
    };


    $scope.getListaMantenimiento = function(){
      $scope.user = {
              id_departamento: 2,
              id_tipoProducto: 4
      };

      $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
        // console.log(result);
        $scope.detalle = result.data.bebidas;
        $scope.data = {showReorder: false};
        console.log($scope.detalle);
      });
    };

    $scope.getListaResepcion = function(){
      $scope.user = {
              id_departamento: 3,
              id_tipoProducto: 5
      };

      $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
        // console.log(result);
        $scope.detalle = result.data.bebidas;
        $scope.data = {showReorder: false};
        console.log($scope.detalle);
      });
    };

    $scope.getListAmaLlave = function(){
      $scope.user = {
              id_departamento: 4,
              id_tipoProducto: 3
      };

      $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
        // console.log(result);
        $scope.detalle = result.data.bebidas;
        $scope.data = {showReorder: false};
        console.log($scope.detalle);
      });
    };
  
    $scope.logout = function() {
        AuthService.logout();
        $state.go('outside.login');
    };

    $scope.obtenerCredencial = function(){
      console.log(AuthService.credencial());
    };

    $scope.doRefresh = function(){
       /*Objeto que tienes dos variables id_departamento y id_tipoProducto
      la inicializamos con un dato para la funcion que este en la api reciba los datos 
      y nos retorne solo las bebidas*/
      $scope.user = {
              id_departamento: 3,
              id_tipoProducto: 5
      };
      
      //Llamamos el servicio bebida del API REST el cual le mandamos objeto
      $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
        // console.log(result);
        $scope.detalle = result.data.bebidas;
        $scope.$broadcast('scroll.refreshComplete');
      });
  }

})

//-------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------

// CONTROLADOR DE CARRITO DE COMPRA 

.controller('carritosCtrl', function($scope, AuthService, $ionicPopup,API_ENDPOINT,$route, $http, $state) {
  //Variable para guardar el valor total del carrito ce compra
  $scope.valorTotal = 0;  

  //recibimos los datos de la variable storage del carrito del compra 
  $scope.detalle = JSON.parse(AuthService.retornarProductos());
    
    //For para calcular el valor total de carrito de compra
    angular.forEach($scope.detalle, function(value, key){
        //guardamos el total en una variable valorTotal
        $scope.valorTotal +=  parseInt(value.valor); 
    });


    //Borrar todo el carrito de compra    
    $scope.borrarCarrito = function(){
      //llamar el servicio de AuthService.borrarCarrito();
      AuthService.borrarCarrito();
      //recargar vista 
      $state.reload(true);
    }


    //Borra el producto selecionado de la lista recibe como parametro la posicion de la lista 
    $scope.onItemDelete = function(item) {
        //borra el producto 
        $scope.detalle.splice($scope.detalle.indexOf(item), 1);
        //guarda en la variable a la posicion del array
        $a = $scope.detalle.indexOf(item);
        ///llama el servicio que borra el productto de la variable storage
        AuthService.borrarProductoLocal($a);
    };

    //Envia los productos del carrito al API REST
    $scope.submit = function(){

      //Le pado los valor al objeto producto 
      $scope.producto={
          fecha_final:"",
          calificacion:"",
          //paso el nombre del usuario que esta autenticado 
          Usuarios_email:AuthService.nomUsuario(),
          estado:"",
          //paso los producto como un objeto
          productos:$scope.detalle,
      };

      //Llamamos el servicio solicitudes del API REST el cual le mandamos objeto de producto
      $http.post(API_ENDPOINT.url + '/solicitudes',$scope.producto).then(function(result){
          $valor = result.data.datos;
          console.log($valor);
      });
    }
})

//-------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------

// CONTROLADOR DE INICIO 
.controller('InsideCtrl', function($scope, AuthService, $ionicPopup,API_ENDPOINT, $http, $state) {
  $scope.confirmarHuesped = function() {
       $scope.data = {}
    
      //alerta que aparece cuando el usuario quiere pasar hacer huesped le pide la cedula.
      var myAlert = $ionicPopup.show({
         template: '<input type = "text" placeholder="cedula" ng-model = "data.cedula">',
         title: 'Confirma',
         subTitle: 'Ingrese su cédula',
         scope: $scope,
      
         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Enviar</b>',
               type: 'button-positive',
                  onTap: function(e) {
            
                     if (!$scope.data.cedula) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
                        return $scope.data.cedula;
                     }
                  }
            }
         ]
      });

      //muestra este mensaje si la cedula del usuario no esta registrada como huesped
      myAlert.then(function(res) {
         //console.log($scope.data.cedula);
         AuthService.huesped($scope.data).then(function(msg) {
          //$state.go('inside');
          $scope.memberinfo = msg;
          console.log(msg);
        }, function(errMsg) {
          var alertPopup = $ionicPopup.alert({
            title: 'Autenticación fallo!',
            template: errMsg
          });
        });
         
       });    
  };

  //Si el usuario es huesped puede ver la lista de servicio
  $scope.getListaBebidas = function() {
   /* */
    if(AuthService.credencial() == 'administrador'){
      //redirige hacia la vista 
       $state.go('listaBebida');
    }else{
       console.log('usted no es administrador');
    }
  };
   //cerrar sesión 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

//-------------------------------------------------------------------------------------------------------


.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});


