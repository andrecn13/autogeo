app.filter('filter', [function() {
  return function(markers, obj) {
    var matches = [];
    angular.forEach(markers, function(marker, featureKey) {
            marker.match = true;
            if(obj.preco.minVal != "" && marker.match == true){
                (marker.props["valor"] >= obj.preco.minVal) ? marker.match=true : marker.match=false;
                obj.preco.ativo = true;
            }
            if(obj.preco.maxVal != "" && marker.match == true){
                (marker.props["valor"] <= obj.preco.maxVal) ? marker.match=true : marker.match=false;
                obj.preco.ativo = true;
            }
            if(obj.km.minKm != "" && marker.match == true){
                (marker.props["km"] >= obj.km.minKm) ? marker.match=true : marker.match=false;
                obj.km.ativo = true;
            }
            if(obj.km.maxKm != "" && marker.match == true){
                (marker.props["km"] <= obj.km.maxKm) ? marker.match=true : marker.match=false;
                obj.km.ativo = true;
            }
            if(obj.ano.minAno != "" && marker.match == true){
                (marker.props["ano"] >= obj.ano.minAno) ? marker.match=true : marker.match=false;
                obj.ano.ativo = true;
            }
            if(obj.ano.maxAno != "" && marker.match == true){
                (marker.props["ano"] <= obj.ano.maxAno) ? marker.match=true : marker.match=false;
                obj.ano.ativo = true;
            }
            if(obj.modelo != "" && marker.match == true){
                (marker.props["modelo"].toUpperCase().indexOf(obj.modelo.toUpperCase()) > -1) ? marker.match=true : marker.match=false;
            }
            if(obj.marca.marca.marca != "" && marker.match == true){
                (marker.props["marca"].toUpperCase().indexOf(obj.marca.marca.marca.toUpperCase()) > -1) ? marker.match=true : marker.match=false;
                obj.marca.ativo = true; console.log(obj.marca.marca.marca);
            }
            if(obj.qtdPortas == 0 && marker.match == true){
                marker.match=true;
                obj.portas.ativo = false;
            }
            if(obj.estado.estadoAutomovel == 0 && marker.match == true){
                marker.match=true;
                obj.estado.ativo = false;
            }else if(obj.estado.estadoAutomovel > 0 && marker.match == true){
                (marker.props["estado"] == obj.estado.estadoAutomovel) ? marker.match=true : marker.match=false;
                obj.estado.ativo = true;
            }
            if(obj.fotos.fotos == 0 && marker.match == true){
                marker.match=true;
                obj.fotos.ativo = false;
            }else if(obj.fotos.fotos == 1 && marker.match == true){
                (marker.props["fotos"].length > 0) ? marker.match=true : marker.match=false;
                obj.fotos.ativo = true;
            }else if(obj.fotos.fotos == 2 && marker.match == true){
                (marker.props["fotos"] == false) ? marker.match=true : marker.match=false;
                obj.fotos.ativo = true;
            }

            // SE todos os filtros true
            if(marker.match==true){
                matches.push(marker);
            }
    });
    return matches;
  };
}]);