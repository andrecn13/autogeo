var app = angular.module('AutoGeoApp', ["leaflet-directive", "ngRoute"]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) 
{

	$routeProvider
        .when('/mapa',
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


app.controller('MapaCtrl', ['$scope', 'MapaService', function ($scope, MapaService) {

    $scope.title    =   "Mapa";

	angular.extend($scope, {
        defaults: {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            maxZoom: 14,
            path: {
                weight: 10,
                color: '#800000',
                opacity: 1
            }
        },
        center: {
            lat: 51.505,
            lng: -0.09,
            zoom: 8
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
            var url = '/data_sample/carros.json';
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