app.controller('ModalCtrl', function ($scope, $modalInstance, anuncio, AnuncioService, AlertService) {
	
	$scope.anuncio = anuncio;
	
	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.favoritar = function(option){
		if(option == 'add' || option == 'remove'){
			AnuncioService.favorito(option, $scope.anuncio.properties.id).then(function(data){
				if(option == 'add'){
					AlertService.add("success", "Adicionado as favoritos com sucesso.");
					$scope.anuncio.properties.favorito = true;
				}else{
					AlertService.add("success", "Removido dos favoritos com sucesso.");
					$scope.anuncio.properties.favorito = false;
				}
			},function(data){
				AlertService.add("danger", "Erro ao adicionar aos favoritos.");
			});
		}
	};
	
});