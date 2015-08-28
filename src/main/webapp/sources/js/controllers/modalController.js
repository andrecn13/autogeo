app.controller('ModalCtrl', function ($scope, $modalInstance, anuncio) {
	
	$scope.anuncio = anuncio;

	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	};

});