app.directive('enableMenu', function(){
    return{
        restric : "A",
        link    : function(scope, elem, attrs){
            "glyphicon glyphicon-menu-up"
            elem.on('click', function(){
                $(elem).toggleClass(function () {
                    if ( $(elem).is( ".glyphicon-menu-down" ) ) {
                        return "glyphicon-menu-up";
                    } else {
                        return "glyphicon-menu-down";
                    }    
                });
                $( "#containerFiltros" ).slideToggle( "medium" );
            });
        }
    }
});

app.directive('popup', [ function() {
    return {
        restrict: 'E',
        scope: {
            anuncio: "="
        },
        templateUrl: 'partials/popup.html',
        controller: 'PopUpCtrl'
    };
}]);

app.directive('activeLink', ['$location', function (location) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var clazz = attrs.activeLink;
      var path = attrs.href;
      path = path.substring(1);
      scope.location = location;
      scope.$watch('location.path()', function (newPath) {
        if (path === newPath) {
          element.addClass(clazz);
        } else {
          element.removeClass(clazz);
        }
      });
    }
  };
}]);

app.directive('overflowDirective', ['$location', function(location){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			if(location.path() != '/'){
				$(element).css('overflow', 'auto');
			}else{
				$(element).css('overflow', 'hidden');
			}
		}
	};
}]);