app.controller('FavoritosCtrl', ['$scope', 'AnuncioService', 'AlertService', function($scope, AnuncioService, AlertService){
    
    $scope.title    =   "Meus Favoritos";
    $scope.anuncios = [];
    
    var promiseAnuncios = AnuncioService.getFavoritos();
    promiseAnuncios.then(function(data) {
        $scope.anuncios = data;
    });
    
    $scope.removerFavorito = function(id){
		AnuncioService.favorito('remove', id).then(function(data){
			AlertService.add("success", "Anúncio removido dos favoritos com sucesso.");
			$("#contentContainer").animate({ scrollTop: 0 }, 200);

		    var promiseAnuncios = AnuncioService.getFavoritos();
		    promiseAnuncios.then(function(data) {
		        $scope.anuncios = data;
		    });
		    
		},function(data){
			AlertService.add("danger", "Erro ao remover dos favoritos.");
		});
	};

}]);