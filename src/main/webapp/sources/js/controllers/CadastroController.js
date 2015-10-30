app.controller('CadastroCtrl', ['$scope', 'CadastroFactory', 'AlertService', '$routeParams', 'MapaService', function($scope, CadastroFactory, AlertService, $routeParams, MapaService){
    	
	$scope.tipo		=	$routeParams.tipo;
    $scope.title    =   "Cadastro";
    $scope.user		=	{loja:null};
    
    $scope.cadastrarUsuario = function(){
    	console.log(angular.toJson($scope.user));
    	CadastroFactory.create($scope.user, function(){
    		AlertService.add("success", "Cadastro realizado com sucesso.");
    		$("#contentContainer").animate({ scrollTop: 0 }, 200);
    		$scope.user = {};
    	},function(){
    		AlertService.add("danger", "Erro ao salvar dados.");
    		$("#contentContainer").animate({ scrollTop: 0 }, 200);
    	});
	}
    
    var mainMarker = {
		lat: -30.0257548,
        lng: -51.1833013,
        focus: true,
        message: "Clique e mova para posicionar o seu estabelecimento",
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
        
        $scope.user.loja.localizacao = "POINT ("+lat+" "+lng+")";
    });
    
    $scope.geocode = function() {
		MapaService.geocode($scope.endereco).then(
			function(data) {
				if(data.results[0].locations.length > 0){
					$scope.markers.mainMarker.lat =  data.results[0].locations[0].latLng.lat;
					$scope.markers.mainMarker.lng =  data.results[0].locations[0].latLng.lng;
					$scope.center.lat = data.results[0].locations[0].latLng.lat;
					$scope.center.lng = data.results[0].locations[0].latLng.lng;
					
					$scope.user.loja.localizacao = "POINT ("+data.results[0].locations[0].latLng.lat+" "+data.results[0].locations[0].latLng.lng+")";
				}
			}, function(data) {
				console.log(data);
			}
		)
	}
    
}]);