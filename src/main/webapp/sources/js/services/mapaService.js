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
        },
        geocode: function(endereco){
        	var d = $q.defer();
            var url = 'http://open.mapquestapi.com/geocoding/v1/address';
            
            $http.get(url, {
                params: { 
                	key: "NneFYreg0kkMxkfuUI39iacW1CHr6ADs",
                	location: endereco,
                	outFormat: "json"
            	}
	        })
            .success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            }); 

            return d.promise;
        }
    };
});