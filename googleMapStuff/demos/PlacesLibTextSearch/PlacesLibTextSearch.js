function initialize(){
    //Create the map at the beginning, as usual
    var initialMapCenter = {lat: 22.314711204904285, lng: 114.22324419021606};
    var mapOptions = {
        center: { lat: initialMapCenter.lat, lng: initialMapCenter.lng},
        zoom: 18,
        disableDefaultUI: true  //disable the default UIs on map
    };
    var map = new google.maps.Map($('#map-canvas')[0], mapOptions);

    //Overlay the search UIs on the map
    var searchControlDiv = $('#searchControlDiv')[0];
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchControlDiv);

    //An Autocomplete attaching to the input textbox. Then bind it to the map
    var searchTxt = $('#searchTxt')[0];
    var autocomplete = new google.maps.places.Autocomplete(searchTxt);
    autocomplete.setTypes(['geocode']);
    autocomplete.bindTo('bounds', map);

    //Listen to place changed event i.e. when a place is clicked
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry)
            return;

        if(place.geometry.viewport){
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: initialMapCenter
        });
        marker.setIcon({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        });
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
    });
};

google.maps.event.addDomListener(window, 'load', initialize);