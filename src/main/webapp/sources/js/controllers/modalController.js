app.controller('PopUpCtrl', ['$scope', '$modal', function ($scope, $modal) {

	$scope.openDetail = function () {
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'partials/modal.html',
			controller: 'ModalInstanceCtrl',
			size: 'lg',
			resolve: {
			    anuncio: function () {
			      return $scope.anuncio;
			    }
			}
		});
	}
	
}]);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, anuncio) {
	
	$scope.anuncio = anuncio;

	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	};

});