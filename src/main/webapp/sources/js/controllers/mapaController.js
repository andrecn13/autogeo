app.controller('MapaCtrl', ['$scope', '$rootScope', '$filter', '$modal', 'MapaService', 'AuthenticationService', '$routeParams', '$http', function ($scope, $rootScope, $filter, $modal, MapaService, AuthenticationService, $routeParams, $http) {
	
	$scope.title    =   "Mapa";
    
    $scope.anunciosMarkers = [];
    $scope.anunciosMarkers2 = [];
    
    $scope.center = {
    	lat: -30.0257548,
        lng: -51.1833013,
        zoom: 12
    };
    
    $scope.enableMenu = false;
    $scope.marcas   = []
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
        iconUrl:'build/img/marker-loja.png',
        iconSize:[41, 41], 
        iconAnchor:[12, 0]  
    };  
    
    MapaService.getMarcas().then(function(data){
    	$scope.marcas = data;
    });
    
    var promiseAnuncios = MapaService.getAnuncios(AuthenticationService.getUser());
    promiseAnuncios.then(function(data) {
        $rootScope.anuncios = data.anuncios;
        angular.forEach(data.anuncios, function(anuncio, i) {
            var focus = false;

            if($routeParams.id && $routeParams.id == anuncio.properties.id){
            	focus = true;
            	$scope.center = {
        	    	lat: anuncio.geometry.coordinates[1],
        	        lng: anuncio.geometry.coordinates[0],
        	        zoom: 18
        	    }
            } 
            
        	$scope.anunciosMarkers.push({
            	layer: 'anuncios',
                lat: anuncio.geometry.coordinates[1], 
                lng: anuncio.geometry.coordinates[0], 
                message: "<popup anuncio='anuncios[" + i + "]'></popup>",
                popupOptions: {minWidth: 240, maxWidth: 300},
                props: anuncio.properties,
                focus: focus,
                icon: icon,
            });
        });
        
        $scope.anunciosMarkers2 = $scope.anunciosMarkers;
    });
    
    $scope.legend = {};
 
	angular.extend($scope, {
        defaults: {},
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    type: 'xyz',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            },
            overlays: {
                anuncios: {
                    name: "Anúncios",
                    type: "markercluster",
                    visible: true
                },
                bairros: {
                    name: 'Bairros (POA)',
                    type: 'wms',
                    visible: false,
                    url: 'http://localhost:8080/geoserver/autogoe/wms',
                    layerParams: {
                        layers: 'autogoe:bairros',
                        format: 'image/png',
                        transparent: true
                    } 
                },
                potencial_bairros: {
                    name: 'Potencial de Venda por Bairros (POA)',
                    type: 'wms',
                    visible: false,
                    url: 'http://localhost:8080/geoserver/autogoe/wms',
                    layerParams: {
                        layers: 'autogoe:view',
                        format: 'image/png',
                        transparent: true
                    } 
                }                
            }
        }
    });
    
	//Filtro por modelo - busca rapida
    $scope.$watch('filtro.modelo', function (newVal, oldVal) {
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
                $scope.filtro.marca.marca = {};
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
    
    $scope.ativarEstatistica = function(){
    	$('.legend').show(); 
    	$scope.layers.overlays.potencial_bairros.visible = true;
    	$scope.legend = {
			 position: 'bottomleft',
			 colors: [ '#ff3e38', '#7ec13c' ],
			 labels: [ 'Acima de 2 anúncios por bairro', 'Até 2 anúncios por bairro' ]
    	}
    }
    $scope.desativarEstatistica = function(){
    	$scope.layers.overlays.potencial_bairros.visible = false;
    	$scope.legend = {}
    	$('.legend').hide(); 
    }
    
}]);
