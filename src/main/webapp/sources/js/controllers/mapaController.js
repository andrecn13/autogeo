app.controller('MapaCtrl', ['$scope', 'MapaService', function ($scope, MapaService) {

    $scope.title    =   "Mapa";

	angular.extend($scope, {
        defaults: {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            maxZoom: 14,
            path: {
                weight: 10,
                color: '#800000',
                opacity: 1
            }
        },
        center: {
            lat: 51.505,
            lng: -0.09,
            zoom: 8
        }
    });

}]);

app.controller('FavoritosCtrl', ['$scope', function($scope){
    
    $scope.title    =   "Meus Favoritos";

}]);