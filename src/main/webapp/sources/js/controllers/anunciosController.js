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
app.controller('AnuncioCadastroCtrl', ['$scope', 'AnuncioService', 'AlertService', 'AuthenticationService', function($scope, AnuncioService, AlertService, AuthenticationService){
    
	//verify is user logged is PARTICULAR or LOJA
	$scope.isLoja = AuthenticationService.isLoja();
	
	$scope.anuncio = {acessorios: []};
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
app.controller('AnuncioEditarCtrl', ['$scope', 'AnuncioService', 'AlertService', '$routeParams', '$resource', '$location', 'AuthenticationService', function($scope, AnuncioService, AlertService, $routeParams, $resource, $location, AuthenticationService){
    
	//verify is user logged is PARTICULAR or LOJA
	$scope.isLoja = AuthenticationService.isLoja();
	
    var anuncio =  $resource('api/anuncio/'+$routeParams.id).get(function(){
    	$scope.anuncio = anuncio; 
    	if(!AuthenticationService.isLoja()){
    		mapa(); 
    	}
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
    	var promisseSalvar = AnuncioService.salvar($scope.anuncio);
    	promisseSalvar.then(function(data) {  
    		AlertService.add("success", "Anúncio atualizado com sucesso.");
    		$("#contentContainer").animate({ scrollTop: 0 }, 200);
        },function(data){
        	AlertService.add("danger", "Erro ao realizar cadastro, verifique os dados.");
        	$("#contentContainer").animate({ scrollTop: 0 }, 200);
        });
    };
    
    $scope.deletar = function(){
    	if($scope.motivo != undefined){ 
    		console.log($scope.motivo);
    		var promisseDeletar = AnuncioService.deletar($routeParams.id, $scope.motivo);
    		promisseDeletar.then(function(data) {  
    			$location.path("/anuncios"); 
            },function(data){ 
            	AlertService.add("danger", "Erro ao deletar o anúncio, tente novamente!");
            	$("#contentContainer").animate({ scrollTop: 0 }, 200);
            });
    	}
    }
     
}]);