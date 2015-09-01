app.factory('CadastroFactory', function($resource) {
	return $resource('usuario/salvar', {}, {
        create: { method: 'POST' }
    })
});