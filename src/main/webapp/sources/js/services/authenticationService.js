app.factory('AuthenticationService', ['$window', function($window) {
    var auth = {
        isLogged: function(){
        	if($window.sessionStorage.token == undefined){
        		return false;
        	}else{
        		return true;
        	}
        }
    }
 
    return auth;
}]);