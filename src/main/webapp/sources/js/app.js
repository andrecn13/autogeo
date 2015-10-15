var app = angular.module('AutoGeoApp', ["leaflet-directive", "ngRoute", "ngResource", "ui.utils.masks", "ui.bootstrap"]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) 
{

	$routeProvider
        .when('/', 
        {
            templateUrl: "views/mapa.html",
            controller: "MapaCtrl",
            access: {requiredLogin: false, blockWhenLogged: false}
        })    
        .when('/favoritos',
        {
            templateUrl: "views/favoritos.html",
            controller: "FavoritosCtrl",
            access: {requiredLogin: true, blockWhenLogged: false}
        })   
        .when('/cadastro',
        {
            templateUrl: "views/tipoCadastro.html",
            access: {requiredLogin: false, blockWhenLogged: true}
        })
        .when('/cadastro/:tipo',
        {
            templateUrl: "views/cadastro.html",
            controller: "CadastroCtrl",
            access: {requiredLogin: false, blockWhenLogged: true}
        })
        .when('/anuncio/novo',
        {
            templateUrl: "views/cadastroAnuncio.html",
            controller: "AnuncioCadastroCtrl",
            access: {requiredLogin: true, blockWhenLogged: false}
        })
         .when('/anuncio/editar/:id',
        {
            templateUrl: "views/editarAnuncio.html",
            controller: "AnuncioEditarCtrl",
            access: {requiredLogin: true, blockWhenLogged: false}
        })
        .when('/anuncios',
        {
            templateUrl: "views/anuncios.html",
            controller: "AnuncioCtrl",
            access: {requiredLogin: true, blockWhenLogged: false}
        })  
        .when('/login',
        {
            templateUrl: "views/login.html",
            controller: "LoginCtrl",
            access: {requiredLogin: false, blockWhenLogged: false}
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
        if (nextRoute.access.blockWhenLogged && AuthenticationService.isLogged()) {
    		$location.path("/");
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
