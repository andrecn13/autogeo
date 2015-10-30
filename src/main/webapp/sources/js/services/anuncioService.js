app.factory('AnuncioService', function($http, $q) {
    return {
    	getAnuncios: function() {
            var d = $q.defer();
            var url = 'api/anuncio/all';

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getFavoritos: function() {
            var d = $q.defer();
            var url = 'api/anuncio/favoritos';

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getAnuncio: function(id) {
            var d = $q.defer();
            var url = 'api/anuncio/'+id;

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getData: function() {
            
            var d = $q.defer();
            var url = 'api/anuncio';

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        getModelo: function(marca){
        	var d = $q.defer();
            var url = 'modelo/'+marca.id;

            $http.get(url)
                .success(function(data){
                    d.resolve(data);
                })
                .error(function(msg, code) {
                    d.reject(msg);
                });

            return d.promise;
        },
        salvar: function(anuncio, files){
        	var d = $q.defer();
            var url = 'api/anuncio/salvar';
                        
            $http({
                method: 'POST',
                url: url,
                headers: { 'Content-Type': angular.identity },
                transformRequest: function (data) {
                	
                    var formData = new FormData(); 
                    formData.append("anuncio", angular.toJson(data.model));
                    for(var i in data.files) {
                    	formData.append("file", data.files[i]);
                    }
                    return formData;
                },
                data: { model: anuncio, files: files }
            })
            .success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            });

            return d.promise;
        },
        deletar: function(id, motivo){
        	var d = $q.defer();
            var url = 'api/anuncio/deletar/'+id;
            $http({
                method: 'POST',
                url: url,
                data: angular.toJson(motivo)
            })
            .success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            });

            return d.promise;
        },
        favorito: function(acao, id){
        	var d = $q.defer();
            var url = 'api/anuncio/favorito/'+acao+'/'+id;
            $http({
                method: 'GET',
                url: url
            })
            .success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            });

            return d.promise;
        },
        getPrecoFipe: function(anuncio){
        	var d = $q.defer();
            var url = 'dados/fipe/preco/'
            	+anuncio.modelo.marca.fipe_id+'/'
            	+anuncio.modelo.fipe_id+'/'
            	+anuncio.ano+'/'
            	+anuncio.combustivel.codigo; 
            
            $http.get(url).success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            }); 

            return d.promise;
        },
        getPrecoFipeAnuncio: function(id){
        	var d = $q.defer();
            var url = 'dados/fipe/preco/anuncio/'+id; 
            
            $http.get(url).success(function(data){
                d.resolve(data);
            })
            .error(function(msg, code) {
                d.reject(msg);
            }); 

            return d.promise;
        }
    };
});
