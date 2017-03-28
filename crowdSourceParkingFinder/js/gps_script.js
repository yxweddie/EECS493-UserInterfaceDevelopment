app.controller("gps_con", function ($scope) {
    var parkinglots = [
      {
        marker_id : 0,
        occupancy : 'Empty',
        lat       : 42.2759818379864,
        long      : -83.7310233133682,
        draggable: false,
        title: "Ann Arbor Parking",
        icon : "./img/green.png",
        infow: '<ul class="menu">\
                <li class="item-2"><a onclick="open_survey()">rate</a></li>\
						    <li class="item-4"><a onclick="direct_route(0)">route</a></li>\
                <li class="item-5"><a onclick="close_window(0)">center</a></li>\
                </ul>'
      },
      {
        marker_id : 1,
        occupancy : 'Full',
        lat       : 42.2859818379864,
        long      : -83.7710233133682,
        draggable: false,
        title: "Ann Arbor Parking 2",
        icon : "./img/red.png",
        infow: '<ul class="menu">\
                <li class="item-2"><a onclick="open_survey()">rate</a></li>\
						    <li class="item-4"><a onclick="direct_route(1)">route</a></li>\
                <li class="item-5"><a onclick="close_window(1)">center</a></li>\
                </ul>'
      },
      {
        marker_id : 2,
        occupancy : 'Full',
        lat       : 42.2258818379864,
        long      : -83.7510233133682,
        draggable: false,
        title: "Ann Arbor Parking 3",
        icon : "./img/orange.png",
        infow: '<ul class="menu">\
                <li class="item-2"><a onclick="open_survey()">rate</a></li>\
						    <li class="item-4"><a onclick="direct_route(2)">route</a></li>\
                <li class="item-5"><a onclick="close_window(2)">center</a></li>\
                </ul>'
      },
    ];
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(42.2759818379864, -83.7310233133682),
        mapTypeId: 'roadmap',
        preserveViewport: true
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    $scope.map.addListener('bounds_changed', function() {
      searchBox.setBounds($scope.map.getBounds());
    });

    $scope.markers = [];

    // search box
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      $scope.markers.forEach(function(marker) {
        marker.setMap(null);
      });

      $scope.markers.push(new google.maps.Marker({
          map: $scope.map,
          position: $scope.currentPos,
      }));

      var bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        // TODO : always do the current one.
        for (i = 0; i < parkinglots.length; i++){
            createMarker(parkinglots[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      $scope.map.fitBounds(bounds);
    });

    //var infoWindow = new google.maps.InfoWindow();
    var infowindows=[];
    allC = [];
    //TODO 1: parsing the parking lot accoding to the bound we just search.
    //     2: according to the occupancy change the icon.
    var createMarker = function (info){
        console.log(info.icon);
        var image = {
          url: info.icon,
          // This marker is 20 pixels wide by 32 pixels high.
          scaledSize: new google.maps.Size(29, 29),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };

        var marker = new google.maps.Marker({
            id : info.marker_id,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.title,
            icon : image,
            map: $scope.map
        });

        $scope.markers.push(marker);
        var myOptions = {
               content: "<div>" + info.infow + "</div>",
               disableAutoPan: false,
               maxWidth: 0,
               alignBottom: true,
               pixelOffset: new google.maps.Size(-83, 80),
               zIndex: null,
               boxClass: "info-windows",
               closeBoxURL: "",
               pane: "floatPane",
               enableEventPropagation: true,
               infoBoxClearance: "10px",
               position: marker.position
        };

        var infowindow = new InfoBox(myOptions);
        infowindows[info.marker_id] = infowindow;
        var c = 0;
        allC.push(c);
        google.maps.event.addListener(marker, 'click', function(){
            // console.log("Dial change state.")
            // console.log(allC[info.marker_id]);
            if(allC[info.marker_id] == 0){
                infowindow.open($scope.map);
                allC[info.marker_id]=1;

                for (var i = 0; i < infowindows.length; i ++){
                  console.log(i);
                  if (i != info.marker_id){
                    infowindows[i].close();
                    allC[i]=0;
                  }
                }

            }else{
                infowindow.close();
                allC[info.marker_id]=0;
            }
        });
    }
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap($scope.map);
    directionsDisplay.setOptions( { suppressMarkers: true } );

    direct_route = function(id){
      infowindows[id].close();
      var info = parkinglots[id];
      var destInfo = {
        lat: info.lat,
        lng: info.long
      };
      directionsService.route({
        origin: $scope.currentPos,
        destination: destInfo,
        travelMode: 'DRIVING'
        }, function(response, status) {
          if(status == 'OK') {
            console.log(response);
            directionsDisplay.setDirections(response);
          }
          else{
            window.alert('Directions request failed due to ' + status);
          }
      })

    }

    open_survey = function() {
      $(".survey").show();
    }

    var handleLocationError = function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    }

    // getting the current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // save for later.
        $scope.currentPos = pos;
        $scope.markers.push(new google.maps.Marker({
            map: $scope.map,
            position: pos,
        }));

        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        $scope.map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, $scope.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, $scope.map.getCenter());
    }
    close_window = function(id){
      infowindows[id].close();
    }
    // draws the markers
    for (i = 0; i < parkinglots.length; i++){
        createMarker(parkinglots[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

    $scope.selectEmpty = function()
    {
        console.log("Lots!");
        $(".survey").hide();
    }

    $scope.selectHalfway = function()
    {
        console.log("Some");
        $(".survey").hide();
    }

    $scope.selectFilled = function()
    {
        console.log("None");
        $(".survey").hide();
    }
});
