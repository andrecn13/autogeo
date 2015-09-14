app.controller('AnuncioCtrl', ['$scope', 'MapaService', function($scope, MapaService){
    
    $scope.title    =   "Meus Anuncios";
    $scope.anuncios = [];
    
    var promiseAnuncios = MapaService.getAnuncios();
    promiseAnuncios.then(function(data) {
        $scope.anuncios = data.anuncios;
    });
    
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
    
}]);