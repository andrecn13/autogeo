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
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    layerOptions: {
                        "showOnSelector": false
                     }
                }
            },
            overlays: {
                anuncios: {
                    name: "Anúncios",
                    type: "markercluster",
                    visible: true,
                    layerParams: {
                        showOnSelector: false
                    }
                },
                potencial_bairros: {
                    name: 'Potencial de Venda por Bairros (POA)',
                    type: 'wms',
                    visible: false,
                    url: 'http://ec2-54-94-128-189.sa-east-1.compute.amazonaws.com:8080/geoserver/autogoe/wms',
                    layerParams: {
                        layers: 'autogoe:view',
                        format: 'image/png',
                        transparent: true,
                        showOnSelector: false
                    },
                    legend: {
               			 position: 'bottomleft',
               			 colors: [ '#E50800', '#F14410', '#FD8121' ],
               			 labels: [ 'Mais de 5 anúncios ativos', 'Até 5 anúncios ativos', 'Até 2 anúncios ativos' ]
                   	}
                },
                potencial_preco_bairros: {
                    name: 'Automóveis acima de R$ 85.000,00 por Bairros (POA)',
                    type: 'wms',
                    visible: false,
                    url: 'http://ec2-54-94-128-189.sa-east-1.compute.amazonaws.com:8080/geoserver/autogoe/wms',
                    layerParams: {
                        layers: 'autogoe:view_preco',
                        format: 'image/png',
                        transparent: true,
                        showOnSelector: false
                    },
                    legend: {
               			 position: 'bottomleft',
               			 colors: [ '#3C9603', '#7CC032', '#BCEA61' ],
               			 labels: [ 'Mais de 5 anúncios > R$ 85.000,00', 'Até 5 anúncios > R$ 85.000,00', 'Até 2 anúncios > R$ 85.000,00' ]
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
    
    $scope.ativarEstatistica = function(mapName){
    	$('.legend').show(); 
    	$scope.desativarEstatistica();
    	$scope.layers.overlays[mapName].visible = true;
    	$scope.legend = $scope.layers.overlays[mapName].legend;
    }
    
    $scope.desativarEstatistica = function(){
    	for(var layer in $scope.layers.overlays){
    		if(layer != 'anuncios'){
    			$scope.layers.overlays[layer].visible = false;
    		}
    	}
    	$scope.legend = {};
    	$('.legend').hide();
    }
    
    //force to hide layer control
    $('.leaflet-control').hide()
    
}]);
