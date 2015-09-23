app.factory('AlertService', [ '$rootScope', function($rootScope) {
	
	var alertService = {};
	$rootScope.alerts = [];

	alertService.add = function(type, msg) {
		$rootScope.alerts = [];
		$rootScope.alerts.push({
			'type' : type,
			'msg' : msg
		});
	};
	
	alertService.clear = function() {
		$rootScope.alerts = [];
	};

	return alertService;
} ]);