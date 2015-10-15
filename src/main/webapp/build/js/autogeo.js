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


/**
 * Listagem de anuncios do usuário
 */
app.controller('AnuncioCtrl', ['$scope', 'AnuncioService', function($scope, AnuncioService){
    
    $scope.title    =   "Meus Anuncios";
    $scope.anuncios = [];
    
    var promiseAnuncios = AnuncioService.getAnuncios();
    promiseAnuncios.then(function(data) {
        $scope.anuncios = data;
    });
    
}]);

/**
 * Cadastro anuncio
 */
app.controller('AnuncioCadastroCtrl', ['$scope', 'AnuncioService', 'AlertService', function($scope, AnuncioService, AlertService){
    
	$scope.anuncio = {acessorios: [],localizacao: {}};
	$scope.marcas = [];
	$scope.acessorios = [];
	$scope.cores = [];
	$scope.combustiveis = [];
	$scope.modelos = [];
	
    var promisseData = AnuncioService.getData();
    promisseData.then(function(data) {
    	$scope.marcas = data.marcas;
    	$scope.acessorios = data.acessorios;
    	$scope.cores = data.cores;
    	$scope.combustiveis = data.combustiveis;
    });
    
    $scope.addAcessorio = function(){
    	$scope.anuncio.acessorios.push($scope.selectedAcessorio);
    };

    $scope.limparAcessorios = function(){
    	$scope.anuncio.acessorios= [];
    };
    
    $scope.getModelo = function(marca){
    	if(marca != null){
	        var promisseModelo = AnuncioService.getModelo(marca);
	        promisseModelo.then(function(data) {
	        	$scope.modelos = data;
	        },function(data){
	        	$scope.modelos = [];
	        });
        }
    };
    
    $scope.cadastrarAnuncio = function(){
    	var promisseSalvar = AnuncioService.salvar($scope.anuncio);
    	promisseSalvar.then(function(data) {
    		AlertService.add("success", "Anúncio cadastrado com sucesso.");
    		$("#contentContainer").animate({ scrollTop: 0 }, 200);
    		$scope.anuncio = {acessorios: [],localizacao: {}};
        },function(data){
        	AlertService.add("danger", "Erro ao realizar cadastro, verifique os dados.");
        	$("#contentContainer").animate({ scrollTop: 0 }, 200);
        });
    };
    
    var mainMarker = {
		lat: -30.0257548,
        lng: -51.1833013,
        focus: true,
        message: "Mova o marker para posicionar a localizção do automóvel",
        draggable: true
    };
    
    angular.extend($scope, {
        defaults: {},
        center: {
        	lat: -30.0257548,
            lng: -51.1833013,
            zoom: 12
        },
        markers: {
            mainMarker: angular.copy(mainMarker)
        }
    });
    
    $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
    	var lat = args.model.lat;
        var lng = args.model.lng;
        
        $scope.anuncio.localizacao = "POINT ("+lat+" "+lng+")";
    });
    
}]);

/**
 * Editar Anuncio
 */
app.controller('AnuncioEditarCtrl', ['$scope', 'AnuncioService', 'AlertService', '$routeParams', '$resource', function($scope, AnuncioService, AlertService, $routeParams, $resource){
    
    var anuncio =  $resource('api/anuncio/'+$routeParams.id).get(function(){
    	$scope.anuncio = anuncio; 
     	mapa(); 
    });
    
    var dados = $resource('api/anuncio').get(function(){
        $scope.dados = dados;
        $scope.anuncio.combustivel = _.find(dados.combustiveis, function(o){ return o.combustivel == $scope.anuncio.combustivel.combustivel; });
        $scope.anuncio.cor = _.find(dados.cores, function(o){ return o.cor == $scope.anuncio.cor.cor; });
        $scope.selectedMarca = _.find(dados.marcas, function(o){ return o.marca == $scope.anuncio.modelo.marca.marca; });
        $scope.getModelo($scope.selectedMarca);
    }); 
    
    $scope.addAcessorio = function(){
    	$scope.anuncio.acessorios.push($scope.selectedAcessorio);
    }; 
    
    $scope.limparAcessorios = function(){
    	$scope.anuncio.acessorios= [];
    };
    
    $scope.getModelo = function(marca){
    	if(marca != null){
    		var promisseModelo = AnuncioService.getModelo(marca);
    		promisseModelo.then(function(data) {
    			$scope.modelos = data;
    			if($scope.anuncio.modelo.nome != ''){
    				$scope.anuncio.modelo = _.find(data, function(o){ return o.nome == $scope.anuncio.modelo.nome; });
    			} 
    		},function(data){
    			$scope.modelos = [];
    		});
    	} 
    };
    
    var mapa = function(){
		var geom = angular.fromJson($scope.anuncio.localizacao);
		var mainMarker = {
			lat: geom.features[0].geometry.coordinates[1],
		    lng: geom.features[0].geometry.coordinates[0],
		    focus: true,
		    message: "Mova o marker para posicionar a localizção do automóvel",
		    draggable: true
		};
		
		angular.extend($scope, {
		    defaults: {},
		    markers: {
		        mainMarker: angular.copy(mainMarker)
		    }
		}); 
		
		$scope.$on("leafletDirectiveMarker.dragend", function(event, args){
			var lat = args.model.lat; 
		    var lng = args.model.lng;
		    
		    $scope.anuncio.localizacao = "POINT ("+lat+" "+lng+")";
		});
		
		$scope.anuncio.localizacao = "POINT ("+geom.features[0].geometry.coordinates[1]+" "+geom.features[0].geometry.coordinates[0]+")";
    }
    
    $scope.center = { 
    	lat: -30.0257548,
        lng: -51.1833013,
        zoom: 13 
    } 
    
    $scope.atualizarAnuncio = function(){
    	console.log($scope.anuncio);  
    	var promisseSalvar = AnuncioService.salvar($scope.anuncio);
    	promisseSalvar.then(function(data) {  
    		AlertService.add("success", "Anúncio atualizado com sucesso.");
    		$("#contentContainer").animate({ scrollTop: 0 }, 200);
        },function(data){
        	AlertService.add("danger", "Erro ao realizar cadastro, verifique os dados.");
        	$("#contentContainer").animate({ scrollTop: 0 }, 200);
        });
    };
     
}]);

app.controller('CadastroCtrl', ['$scope', 'CadastroFactory', 'AlertService', '$timeout', '$window', '$routeParams', function($scope, CadastroFactory, AlertService, $timeout, $window, $routeParams){
    	
	$scope.tipo		=	$routeParams.tipo;
    $scope.title    =   "Cadastro";
    $scope.user		=	{"whatsapp": "true"};
    
    $scope.cadastrarUsuario = function(){
    	CadastroFactory.create($scope.user, function(){
    		$scope.user		=	{"whatsapp": "true"};
    		$("#contentContainer").animate({ scrollTop: 0 }, 200);
    		AlertService.add("success", "Cadastro realizado com sucesso.");
    		$timeout(function(){AlertService.clear();}, 3000);
    	},function(){
    		AlertService.add("danger", "Erro ao salvar dados.");
    	});
	}
    
}]);

app.controller('FavoritosCtrl', ['$scope', function($scope){
    
    $scope.title    =   "Meus Favoritos";

}]);

app.controller('LoginCtrl', ['$scope', '$location', '$window', 'LoginService', 'AuthenticationService', 'AlertService', function($scope, $location, $window, LoginService, AuthenticationService, AlertService){
    
	$scope.user = {};
	
	$scope.login = function() {
		if ($scope.user.email !== undefined && $scope.user.senha !== undefined) {
			LoginService.login($scope.user, function(data) {
				$window.sessionStorage.token = data.token;
				$location.path("/");
			},function(status, data) {
				AlertService.add("danger", "Login Inválido.");
			});
		}
    }

    $scope.logout = function() {
        if (AuthenticationService.isLogged()) {
            delete $window.sessionStorage.token;
            $location.path("/login");
        }
    }
    
    
}]);

app.controller('MapaCtrl', ['$scope', '$rootScope', '$filter', '$modal', 'MapaService', function ($scope, $rootScope, $filter, $modal, MapaService) {
	
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
            	layer: 'anuncios',
                lat: anuncio.geometry.coordinates[1], 
                lng: anuncio.geometry.coordinates[0], 
                message: "<popup anuncio='anuncios[" + i + "]'></popup>",
                popupOptions: {minWidth: 200, maxWidth: 200},
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
        },
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


app.controller('ModalCtrl', function ($scope, $modalInstance, anuncio) {
	
	$scope.anuncio = anuncio;

	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	};
	
});

app.controller('PopUpCtrl', ['$scope', '$modal', function ($scope, $modal) {

	$scope.openDetail = function () {
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'partials/modal.html',
			controller: 'ModalCtrl',
			size: 'md',
			resolve: {
			    anuncio: function () {
			      return $scope.anuncio;
			    }
			}
		});
	}
	
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

app.directive('popup', [ function() {
    return {
        restrict: 'E',
        scope: {
            anuncio: "="
        },
        templateUrl: 'partials/popup.html',
        controller: 'PopUpCtrl'
    };
}]);

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

app.directive('overflowDirective', ['$location', function(location){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			if(location.path() != '/'){
				$(element).css('overflow', 'auto');
			}else{
				$(element).css('overflow', 'hidden');
			}
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

app.factory('AlertService', [ '$rootScope', function($rootScope) {
	
	var alertService = {};
	$rootScope.alerts = [];

	alertService.add = function(type, msg) {
		$rootScope.alerts = [];
		$rootScope.alerts.push({
			'type' : type,
			'msg' : msg
		});
	};
	
	alertService.clear = function() {
		$rootScope.alerts = [];
	};

	return alertService;
} ]);

app.factory('AnuncioService', function($http, $q) {
    return {
    	getAnuncios: function() {
            var d = $q.defer();
            var url = 'api/anuncio/all';

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getAnuncio: function(id) {
            var d = $q.defer();
            var url = 'api/anuncio/'+id;

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getData: function() {
            
            var d = $q.defer();
            var url = 'api/anuncio';

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getModelo: function(marca){
        	var d = $q.defer();
            var url = 'modelo/'+marca.id;

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        salvar: function(anuncio){
        	var d = $q.defer();
            var url = 'api/anuncio/salvar';
            $http({
                method: 'POST',
                url: url,
                data: angular.toJson(anuncio)
            })
            .success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            });

            return d.promise;
        }
    };
});


app.factory('AuthenticationService', ['$window', function($window) {
    var auth = {
        isLogged: function(){
        	if($window.sessionStorage.token == undefined){
        		return false;
        	}else{
        		return true;
        	}
        },
        getUser: function(){
        	return ($window.sessionStorage.token != undefined) ? JSON.parse(atob($window.sessionStorage.token.split('.')[1])).nome : ''; 
        }
    }
 
    return auth;
}]);

app.factory('CadastroFactory', function($resource) {
	return $resource('usuario/salvar', {}, {
        create: { method: 'POST' }
    })
});

app.factory('LoginService', function($resource) {
	return $resource('usuario/login', {}, {
        login: { method: 'POST' }
    })
});

app.factory('MapaService', function($http, $q) {
    return {
        getAnuncios: function() {
            
            var d = $q.defer();
//            var url = 'data_sample/carros.json';
            var url = 'dados/anuncios';
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

app.factory('TokenInterceptor', ['$q', '$window', 'AuthenticationService', function ($q, $window, AuthenticationService) {
	 return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
	 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            return $q.reject(rejection);
        }
    };
}]);