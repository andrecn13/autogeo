app.controller('MapaCtrl', ['$scope', '$rootScope', 'MapaService', function ($scope, $rootScope, MapaService) {

    $scope.title    =   "Mapa";
    $scope.anunciosMarkers = [];
    $scope.anunciosMarkers2 = [];
    
    var icon = {  
        iconUrl:'build/img/marker-icon.png',
        iconSize:[25, 41],
        iconAnchor:[12, 0]  
    }; 
    
    var promiseAnuncios = MapaService.getAnuncios();
    promiseAnuncios.then(function(data) {
        $rootScope.anuncios = data.anuncios;
        angular.forEach(data.anuncios, function(anuncio, i) {
            $scope.anunciosMarkers.push({
                lat: anuncio.geometry.coordinates[1], 
                lng: anuncio.geometry.coordinates[0], 
                message: "teste",
                popupOptions: {minWidth: 100, maxWidth: 100},
                props: anuncio.properties
            });
        });
        $scope.anunciosMarkers2 = $scope.anunciosMarkers;
    });
 
	angular.extend($scope, {
        defaults: {},
        center: {
        	lat: -30.0257548,
            lng: -51.1833013,
            zoom: 12
        }
    });

}]);

app.controller('FavoritosCtrl', ['$scope', function($scope){
    
    $scope.title    =   "Meus Favoritos";

}]);