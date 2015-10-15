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