var app = angular.module('AutoGeoApp', ["leaflet-directive", "ngRoute", "ui.utils.masks", "ui.bootstrap"]);

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


app.controller('MapaCtrl', ['$scope', '$rootScope', '$filter', 'MapaService', function ($scope, $rootScope, $filter, MapaService) {
	
    $scope.title    =   "Mapa";
    
    $scope.anunciosMarkers = [];
    $scope.anunciosMarkers2 = [];
    
    $scope.enableMenu = false;
    $scope.marcas   = [{nome: "Selecione uma marca"},{nome: "Chevrolet"},{nome: "Ford"},{nome: "Fiat"},{nome: "Wolkswagen"},{nome: "Renault"},{nome: "Pegeout"},{nome: "Toyota"}]
    $scope.filtro = {
        preco: {
            minVal              :   "",
            maxVal              :   "",
            ativo               : false
        },
        km: {
            minKm               :   "",
            maxKm               :   "", 
            ativo               : false
        },
        ano: {
            minAno              :   "",
            maxAno              :   "", 
            ativo               : false
        },
        marca:{
            marca               :   "",
            ativo               : false
        },
        modelo              :   "",
        portas: {
            qtdPortas           :   0,
            ativo               : false
        },
        estado: {
            estadoAutomovel     :   0,
            ativo               : false
        },
        fotos: {
            fotos               :   0,
            ativo               : false
        }
    };
    
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
                message: anuncio.properties.marca +' - '+anuncio.properties.modelo,
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
	
	//Filtro por modelo - busca rapida
    $scope.$watch('filtro.modelo', function (newVal, oldVal) {
    	console.log("Filtro");
        $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2,  $scope.filtro);
    });

    //Filtro geral
    $scope.filtrarAnuncio = function(){
        $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, $scope.filtro);
    };

    $scope.limparFiltro = function(type){
        switch(type){
            case "preco":
                $scope.filtro.preco.minVal = "";
                $scope.filtro.preco.maxVal = "";
                $scope.filtro.preco.ativo = false;
                break; 
            case "km":
                $scope.filtro.km.minKm = "";
                $scope.filtro.km.maxKm = "";
                $scope.filtro.km.ativo = false;
                break;
            case "ano":
                $scope.filtro.ano.minAno = "";
                $scope.filtro.ano.maxAno = "";
                $scope.filtro.ano.ativo = false;
                break;
            case "marca":
                $scope.filtro.marca.marca = $scope.marcas[0];
                $scope.filtro.marca.ativo = false;
                break;
            case "portas":
                $scope.filtro.portas.qtdPortas = 0;
                $scope.filtro.portas.ativo = false;
                break;
            case "estado":
                $scope.filtro.estado.estadoAutomovel = 0;
                $scope.filtro.estado.ativo = false;
                break;
            case "fotos":
                $scope.filtro.fotos.fotos = 0;
                $scope.filtro.fotos.ativo = false;
                break;
            default:
                $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, $scope.filtro); 
        }
        $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, $scope.filtro); 
        
    };

}]);

app.controller('FavoritosCtrl', ['$scope', function($scope){
    
    $scope.title    =   "Meus Favoritos";

}]);

app.directive('enableMenu', function(){
    return{
        restric : "A",
        link    : function(scope, elem, attrs){
            "glyphicon glyphicon-menu-up"
            elem.on('click', function(){
                $(elem).toggleClass(function () {
                    if ( $(elem).is( ".glyphicon-menu-down" ) ) {
                        return "glyphicon-menu-up";
                    } else {
                        return "glyphicon-menu-down";
                    }    
                });
                $( "#containerFiltros" ).slideToggle( "medium" );
            });
        }
    }
});


app.directive('activeLink', ['$location', function (location) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var clazz = attrs.activeLink;
      var path = attrs.href;
      path = path.substring(1);
      scope.location = location;
      scope.$watch('location.path()', function (newPath) {
        if (path === newPath) {
          element.addClass(clazz);
        } else {
          element.removeClass(clazz);
        }
      });
    }
  };
}]);

app.filter('filter', [function() {
  return function(markers, obj) {
    var matches = [];
    angular.forEach(markers, function(marker, featureKey) {
            marker.match = true;
            if(obj.preco.minVal != "" && marker.match == true){
                (marker.props["valor"] >= obj.preco.minVal) ? marker.match=true : marker.match=false;
                obj.preco.ativo = true;
            }
            if(obj.preco.maxVal != "" && marker.match == true){
                (marker.props["valor"] <= obj.preco.maxVal) ? marker.match=true : marker.match=false;
                obj.preco.ativo = true;
            }
            if(obj.km.minKm != "" && marker.match == true){
                (marker.props["km"] >= obj.km.minKm) ? marker.match=true : marker.match=false;
                obj.km.ativo = true;
            }
            if(obj.km.maxKm != "" && marker.match == true){
                (marker.props["km"] <= obj.km.maxKm) ? marker.match=true : marker.match=false;
                obj.km.ativo = true;
            }
            if(obj.ano.minAno != "" && marker.match == true){
                (marker.props["ano"] >= obj.ano.minAno) ? marker.match=true : marker.match=false;
                obj.ano.ativo = true;
            }
            if(obj.ano.maxAno != "" && marker.match == true){
                (marker.props["ano"] <= obj.ano.maxAno) ? marker.match=true : marker.match=false;
                obj.ano.ativo = true;
            }
            if(obj.modelo != "" && marker.match == true){
                (marker.props["modelo"].toUpperCase().indexOf(obj.modelo.toUpperCase()) > -1) ? marker.match=true : marker.match=false;
            }
            if(obj.marca.marca.nome != 'Selecione uma marca' && marker.match == true){
                (marker.props["marca"].toUpperCase().indexOf(obj.marca.marca.nome.toUpperCase()) > -1) ? marker.match=true : marker.match=false;
                obj.marca.ativo = true;
            }
            if(obj.qtdPortas == 0 && marker.match == true){
                marker.match=true;
                obj.portas.ativo = false;
            }else if(obj.portas.qtdPortas > 0 && marker.match == true){
                (marker.props["portas"] == obj.portas.qtdPortas) ? marker.match=true : marker.match=false;
                obj.portas.ativo = true;
            }
            if(obj.estado.estadoAutomovel == 0 && marker.match == true){
                marker.match=true;
                obj.estado.ativo = false;
            }else if(obj.estado.estadoAutomovel > 0 && marker.match == true){
                (marker.props["estado"] == obj.estado.estadoAutomovel) ? marker.match=true : marker.match=false;
                obj.estado.ativo = true;
            }
            if(obj.fotos.fotos == 0 && marker.match == true){
                marker.match=true;
                obj.fotos.ativo = false;
            }else if(obj.fotos.fotos == 1 && marker.match == true){
                (marker.props["fotos"].length > 0) ? marker.match=true : marker.match=false;
                obj.fotos.ativo = true;
            }else if(obj.fotos.fotos == 2 && marker.match == true){
                (marker.props["fotos"] == false) ? marker.match=true : marker.match=false;
                obj.fotos.ativo = true;
            }

            // SE todos os filtros true
            if(marker.match==true){
                matches.push(marker);
            }
    });
    return matches;
  };
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