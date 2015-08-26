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