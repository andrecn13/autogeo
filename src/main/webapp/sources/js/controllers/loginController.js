app.controller('LoginCtrl', ['$scope', '$location', '$window', 'LoginService', 'AuthenticationService', 'AlertService', function($scope, $location, $window, LoginService, AuthenticationService, AlertService){
    
	$scope.user = {};
	
	$scope.login = function() {
		if ($scope.user.email !== undefined && $scope.user.senha !== undefined) {
			LoginService.login($scope.user, function(data) {
				$window.sessionStorage.token = data.token;
				$location.path("/");
			},function(status, data) {
				AlertService.add("danger", "Login Inválido.");
			});
		}
    }

    $scope.logout = function() {
        if (AuthenticationService.isLogged()) {
            delete $window.sessionStorage.token;
            $location.path("/login");
        }
    }
    
    
}]);