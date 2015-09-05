app.controller('AnuncioCtrl', ['$scope', 'MapaService', function($scope, MapaService){
    
    $scope.title    =   "Meus Anuncios";
    $scope.anuncios = [];
    
    var promiseAnuncios = MapaService.getAnuncios();
    promiseAnuncios.then(function(data) {
        $scope.anuncios = data.anuncios;
    });
    
}]);