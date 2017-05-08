angular.module('starter')
 
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state,$location) {
  $scope.user = {
    email: '',
    password: ''
  };
    
  $scope.login = function() {
    console.log($scope.user);
    AuthService.login($scope.user).then(function(msg) {
      //$state.go('inside');
      $location.path("inside");
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
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

.controller('destalleCtrl', function($scope, AuthService, $ionicPopup,API_ENDPOINT, $http, $state) {
    $scope.settings = {
      title: "Detalle"
    };


    $scope.submit = function(){
        console.log($scope.bebida);
    };


    $http.get(API_ENDPOINT.url + '/detalle/'+$state.params.id).then(function(result) {          
       $scope.detalle = result.data.datos;
       $scope.bebida = {
          nombre: result.data.datos[0].nombres,
          descripcion: result.data.datos[0].descripcion,
          valor: result.data.datos[0].valor,
          sugerencia: ""
      };
       console.log(result.data.datos);
    });
})

.controller('listaBebidaCtrl', function($scope, AuthService, $ionicPopup,API_ENDPOINT, $http, $state) {
    $scope.getListaBebidas = function(){
        $scope.user = {
              id_departamento: 1,
              id_tipoProducto: 1
        };


    $http.post(API_ENDPOINT.url + '/bebidas',$scope.user).then(function(result) {
     // console.log(result);
       $scope.detalle = result.data.bebidas;
       $scope.data = {showReorder: false};
       console.log($scope.detalle);
    });
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
     //debugger;
  };

})
 
.controller('InsideCtrl', function($scope, AuthService, $ionicPopup,API_ENDPOINT, $http, $state) {
  $scope.confirmarHuesped = function() {
       $scope.data = {}
    
      // Custom popup
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

      myAlert.then(function(res) {
         //console.log($scope.data.cedula);
      AuthService.huesped($scope.data).then(function(msg) {
          //$state.go('inside');
           $scope.memberinfo = msg;

      console.log(msg);
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
         //console.log('Tapped!', res);
        
      });    
  };
 
  $scope.getListaBebidas = function() {
   /* */
    if(AuthService.credencial() == 'administrador'){
       $state.go('listaBebida');
    }else{
       console.log('usted no es administrador');
    }
  };
   
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    //$state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});


