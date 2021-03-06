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