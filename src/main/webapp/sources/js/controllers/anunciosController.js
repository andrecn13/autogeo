app.controller('AnuncioCtrl', ['$scope', 'AnuncioService', function($scope, AnuncioService){
    
    $scope.title    =   "Meus Anuncios";
    $scope.anuncios = [];
    
    var promiseAnuncios = AnuncioService.getAnuncios();
    promiseAnuncios.then(function(data) {
        $scope.anuncios = data;
    });
    
}]);

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