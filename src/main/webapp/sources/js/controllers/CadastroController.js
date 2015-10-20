app.controller('CadastroCtrl', ['$scope', 'CadastroFactory', 'AlertService', '$routeParams', function($scope, CadastroFactory, AlertService, $routeParams){
    	
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
    
}]);