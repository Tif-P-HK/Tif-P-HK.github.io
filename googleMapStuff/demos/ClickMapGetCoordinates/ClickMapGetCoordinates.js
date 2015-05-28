function initialize() {

    //The map element
    var initialMapCenter = {lat: 22.314711204904285, lng: 114.22324419021606};
    var mapOptions = {
        center: { lat: initialMapCenter.lat, lng: initialMapCenter.lng},
        zoom: 18
    };
    //google.maps.Map expects a DOM element, but $('#map_container') returns a jQuery object
    //hence doing [0] to get the actual DOM object
    //http://stackoverflow.com/questions/3839074/google-maps-v3-map-container-selector-using-jquery
    var map = new google.maps.Map($('#map-canvas')[0], mapOptions);

    //A marker to be shown at where the map is clicked
    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        draggable:true
    });

    //An info window which shows the coordinates of the marker
    var infoWindow = new google.maps.InfoWindow();

    //helper functions to update the content in the info window and the coordinate text
    {
        var updateInfoWindow = function(contentText){
            infoWindow.setContent(contentText);
            infoWindow.open(map, marker);
        };

        var updateCoordinateText = function(coordinateText){
            $("#coordinateText").text(coordinateText);
        };

        var updateCoordinatesOnUI = function(contentText){
            updateInfoWindow(contentText);
            updateCoordinateText(contentText);
        };
    }

    //On initialized, the info Window and the coordinateText label show the coordinates of the marker
    updateInfoWindow(marker.getPosition().lat() + ", " + marker.getPosition().lng());
    updateCoordinateText(marker.getPosition().lat() + ", " + marker.getPosition().lng());

    //Event hanadlers
    {
        //On map click, update the marker position and the lat long infoWindow with the clicked position
        google.maps.event.addListener(map, 'click', function(event){
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            marker.setPosition(new google.maps.LatLng(latitude, longitude));

            var latLongText = latitude + ", " + longitude;
            updateCoordinatesOnUI(latLongText);
        });

        //On dragging marker, show the new coordinates
        google.maps.event.addListener(marker, 'dragend', function(event){
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();

            var latLongText = latitude + ", " + longitude;
            updateCoordinatesOnUI(latLongText);
        });

        //Wire the Home button to the click event
        $("#homebtn").click(function(){
            map.setCenter(initialMapCenter);
            marker.setPosition(initialMapCenter);

            var latLongText = marker.getPosition().lat() + ", " + marker.getPosition().lng();
            updateCoordinatesOnUI(latLongText);
        });
    }
}

//call initialize when the HTML finishes loading
google.maps.event.addDomListener(window, 'load', initialize);
