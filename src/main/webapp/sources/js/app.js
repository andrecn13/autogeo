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
