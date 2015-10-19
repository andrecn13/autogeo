app.factory('MapaService', function($http, $q) {
    return {
        getAnuncios: function(user) {
            var d = $q.defer();
            var url = 'dados/anuncios';
            var saida = { anuncios: [] };
            
            if(user != ''){
            	url = "api/anuncio/lista"
            }

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