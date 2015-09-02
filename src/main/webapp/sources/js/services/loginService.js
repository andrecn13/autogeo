app.factory('LoginService', function($resource) {
	return $resource('usuario/login', {}, {
        login: { method: 'POST' }
    })
});