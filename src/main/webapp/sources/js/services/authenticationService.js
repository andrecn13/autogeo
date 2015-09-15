app.factory('AuthenticationService', ['$window', function($window) {
    var auth = {
        isLogged: function(){
        	if($window.sessionStorage.token == undefined){
        		return false;
        	}else{
        		return true;
        	}
        },
        getUser: function(){
        	return ($window.sessionStorage.token != undefined) ? JSON.parse(atob($window.sessionStorage.token.split('.')[1])).nome : ''; 
        }
    }
 
    return auth;
}]);