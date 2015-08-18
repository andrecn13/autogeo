var app = angular.module('AutoGeoApp', ["leaflet-directive"]);


app.controller('MapaCtrl', ['$scope', '$http', '$rootScope', 'MapaService', function ($scope, $http, $rootScope, MapaService) {

	$scope.anunciosMarkers = [];
    $scope.anunciosMarkers2 = [];

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
        poa: {
            lat: -30.0257548,
            lng: -51.1833013,
            zoom: 12
        },
        defaults: {
            scrollWheelZoom: true
        }
    });

}]);

app.factory('MapaService', function($http, $q) {
    return {
        getAnuncios: function() {
            
            var d = $q.defer();
            var url = '/data_sample/carros.json';
            var saida = { anuncios: [] };

            $http.get(url)
                .success(function(anuncios){
                    angular.forEach(anuncios.features, function(anuncio) {
                        saida.anuncios.push(anuncio);
                    });
                    d.resolve(saida);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        }
    };
});