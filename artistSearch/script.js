var app = angular.module('493Search', []);

app.controller('searchResult',[ '$scope', '$http', function($scope, $http,$filter) {
  // your code goes here
  $scope.artists = [];
  $scope.totalGener = [];
  $scope.filterSet = new Set();
  $scope.ifContain = function(gg){
    return $scope.filterSet.has(gg);
  }
  $scope.updateFilterArray = function(gg,choose){
    if (gg === undefined ) {
      $scope.filterSet = new Set();
    }else{
      if(!$scope.filterSet.has(gg)){
        $scope.filterSet.add(gg);
        //console.log($scope.filterSet);
      }else{
        $scope.filterSet.delete(gg);
      }
    }

  }
  $scope.getArtists = function(artist){
      //console.log(artist);
      if($scope.filterSet.size == 0){return true;}
      var res = false;
      var tgener = artist.genres;
      var l      = tgener.length;
      for (var i = 0; i< l;i++){
        if($scope.filterSet.has(tgener[i])){
          res = true;
        }
      }
      return res;
  }
  $scope.search = function(keycode){
    if(keycode == 13) {
      var qString = $scope.queryString,
          qUrl    = "https://api.spotify.com/v1/search?q="+qString+"&type=artist";
      $http({
        method: 'GET',
        url: qUrl,
      }).then(function successCallback(response) {
        console.log(response);
        var artists = response.data.artists.items;
        var aCount  = artists.length;
        $scope.resultCount = aCount;
        if( aCount == 0){
          alert(" no artist found with the keyword")
        }else{
          $scope.artists = artists;
          var totalGener = new Set();
          for (var i =0; i< aCount ; i++){
            var a = artists[i];
            var g = a.genres;
            var l = g.length;
            for (var j = 0; j < l; j++){
              if(!totalGener.has(g[j]))
                totalGener.add(g[j]);
            }
          }
          // convert to array
          var Geners =[];
          totalGener.forEach(function(value) {
            Geners.push(value);
          });
          //console.log(Geners);
          $scope.totalGener = Geners;
        }

      }, function errorCallback(response) {
        alert(" This is a bad keyword attempt, please enter a none empty keyword");
      });

    }
  }
}]);

app.controller('similarArtistsCtrl',['$scope', '$http', function($scope, $http,$filter) {
  // your code goes here
  $scope.getSimilar = function(uri){
    var splitStringArray = uri.split(":");
        queryId          = splitStringArray[2];
        sqUrl            = "https://api.spotify.com/v1/artists/"+queryId+"/related-artists"
    $http({
      method: 'GET',
      url: sqUrl,
    }).then(function successCallback(response) {
      console.log(response);
      var sartists = response.data.artists;
      var aCount  = sartists.length;
      if( aCount == 0){
        // alert(" no artist found with the keyword")
      }else{
        $scope.sartists = sartists;
      }

    }, function errorCallback(response) {
      // alert(" This is a bad keyword attempt, please enter a none empty keyword");
    });
}

}]);
