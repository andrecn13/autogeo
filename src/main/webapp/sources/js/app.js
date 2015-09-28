var app = angular.module('AutoGeoApp', ["leaflet-directive", "ngRoute", "ngResource", "ui.utils.masks", "ui.bootstrap"]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) 
{

	$routeProvider
        .when('/', 
        {
            templateUrl: "views/mapa.html",
            controller: "MapaCtrl",
            access: {requiredLogin: false}
        })    
        .when('/favoritos',
        {
            templateUrl: "views/favoritos.html",
            controller: "FavoritosCtrl",
            access: {requiredLogin: true}
        })   
        .when('/cadastro',
        {
            templateUrl: "views/cadastro.html",
            controller: "CadastroCtrl",
            access: {requiredLogin: false}
        })
        .when('/cadastro/anuncio',
        {
            templateUrl: "views/cadastroAnuncio.html",
            controller: "AnuncioCadastroCtrl",
            access: {requiredLogin: true}
        })
        .when('/anuncios',
        {
            templateUrl: "views/anuncios.html",
            controller: "AnuncioCtrl",
            access: {requiredLogin: true}
        })  
        .when('/login',
        {
            templateUrl: "views/login.html",
            controller: "LoginCtrl",
            access: {requiredLogin: false}
        })  
        .otherwise( 
        {
            template: '<h3><strong>404</strong> Página não encontrada</h3>'
        });
	
	$httpProvider.interceptors.push('TokenInterceptor');

}]);
 
app.run(function($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    	$rootScope.alerts = [];
        if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged()) {
    		$location.path("/login");
        }
    });
    
    $rootScope.go = function ( path ) {
    	$location.path( path );
	};
	
	$rootScope.showElement = function () {
    	return (AuthenticationService.isLogged()) ? true : false;
	};
	
	$rootScope.userName = function(){ return AuthenticationService.getUser()}; 
	
});
