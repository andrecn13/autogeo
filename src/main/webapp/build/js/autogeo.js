var app = angular.module('AutoGeoApp', ["leaflet-directive", "ngRoute"]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) 
{

	$routeProvider
        .when('/', 
        {
            templateUrl: "views/mapa.html",
            controller: "MapaCtrl"
        })    
        .when('/favoritos',
        {
            templateUrl: "views/favoritos.html",
            controller: "FavoritosCtrl"
        })        
        .otherwise( 
        {
            template: '<h3><strong>404</strong> Página não encontrada</h3>'
        });

}]);
 
// app.run(function($http) { 
// 	var user	=	'restclient';
// 	var psw		=	'restclient';

// 	$http.defaults.headers.common.Authorization = 'Basic '+Base64.encode(user+':'+psw)

// });


app.controller('MapaCtrl', ['$scope', '$rootScope', 'MapaService', function ($scope, $rootScope, MapaService) {

    $scope.title    =   "Mapa";
    $scope.anunciosMarkers = [];
    $scope.anunciosMarkers2 = [];
    
    var icon = {  
        iconUrl:'build/img/marker-icon.png',
        iconSize:[25, 41],
        iconAnchor:[12, 0]  
    }; 
    
    var promiseAnuncios = MapaService.getAnuncios();
    promiseAnuncios.then(function(data) {
        $rootScope.anuncios = data.anuncios;
        angular.forEach(data.anuncios, function(anuncio, i) {
            $scope.anunciosMarkers.push({
                lat: anuncio.geometry.coordinates[1], 
                lng: anuncio.geometry.coordinates[0], 
                message: "teste",
                popupOptions: {minWidth: 100, maxWidth: 100},
                props: anuncio.properties
            });
        });
        $scope.anunciosMarkers2 = $scope.anunciosMarkers;
    });
 
	angular.extend($scope, {
        defaults: {},
        center: {
        	lat: -30.0257548,
            lng: -51.1833013,
            zoom: 12
        }
    });

}]);

app.controller('FavoritosCtrl', ['$scope', function($scope){
    
    $scope.title    =   "Meus Favoritos";

}]);

app.factory('MapaService', function($http, $q) {
    return {
        getAnuncios: function() {
            
            var d = $q.defer();
            var url = 'data_sample/carros.json';
            var saida = { anuncios: [] };

            $http.get(url)
                .success(function(anuncios){
                    angular.forEach(anuncios.features, function(anuncio) {
                        saida.anuncios.push(anuncio);
                    });
                    d.resolve(saida);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        }
    };
});