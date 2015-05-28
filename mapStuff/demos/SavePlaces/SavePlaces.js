var map;
var service;
var infowindow;
var markers;

function initialize(){
    var initialMapCenter = {lat: 22.314711204904285, lng: 114.22324419021606};
    var mapOptions = {
        center: { lat: initialMapCenter.lat, lng: initialMapCenter.lng},
        zoom: 18,
        disableDefaultUI: true  //disable the default UIs on map
    };
    //The map element
    map = new google.maps.Map($('#map-canvas')[0], mapOptions);

    //PlacesService - it will be a global variable,
    //otherwise each time a search is redone, the "Listing by..." texts will append
    service = new google.maps.places.PlacesService(map);

    //Place the description window div at the top left of the map
    var descWindowDiv = $('#descriptionWindowDiv')[0];
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(descWindowDiv);

    //Create the marker array to be placed on search result
    //and an info Window to be opened when a marker is clicked
    markers = [];
    infowindow = new google.maps.InfoWindow();

    //When the page loads up, do a search using the current map center
    searchPlaces(map.getCenter());
};

//search for places using map center and given types
function searchPlaces(mapCenter){
    //Delete all map markers before doing a new search
    for(var i=0; i<markers.length; i++)
        markers[i].setMap(null);
    markers = [];

    //available types are at https://developers.google.com/places/documentation/supported_types
    var request = {
        location: mapCenter,
        rankBy: google.maps.places.RankBy.DISTANCE,
        types: ["bakery", "cafe", "park", "hair_care", "grocery_or_supermarket", "school", "restaurant"]
    };

    //make request to get the search nearby results
    service.nearbySearch(request, searchDoneCallBack);
}

//When search is done, check status and display results on map using markers
function searchDoneCallBack(results, status, pagination){
    if(status == google.maps.places.PlacesServiceStatus.OK){
      for(var i=0; i<results.length; i++)
        createMarkers(results[i]);
    }
    else if(status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
        $("#resultsLbl").text("No results came back");
    }
    else {
        $("#resultsLbl").text("Error occurred: " + status);
    }
};

//Create a marker for each result and push to markers so that they can be deleted later
//Create a simple info Window to show the name of the result
function createMarkers(result){
    var marker = new google.maps.Marker({
        position: result.geometry.location,
        map: map
    });
    markers.push(marker);

    marker.addListener('click', function(){
        //show an info Window with a save control at the marker
        infowindow.setContent('<small><b>' + result.name + '</b></small><br><div id="saveControl" style="max-width:200px;max-height:30px;overflow-y:hidden"></div>');
        infowindow.open(map, this);

        //update the save control with the clicked result
        updateSaveControl(result);
    });
}

//update the save widget with the clicked result
function updateSaveControl(result){
    // Create a new SaveWidgetOptions object for result
    var saveWidgetOptions = {
        place: {
            placeId: result.place_id,
            location: {lat: result.geometry.location.lat(), lng: result.geometry.location.lng()}
        },
        attribution: {
            source: 'Just a HongKer',
            webUrl: 'https://github.com/Tif-Pun'
        }
    };

    // Append a Save Control to the info window.
    var infoWindowDiv = $('#saveControl')[0];
    var saveWidget = new google.maps.SaveWidget(infoWindowDiv, saveWidgetOptions);
};

//Re-do search using the current map center when the Search button is clicked
$('#searchbtn').click(function(){
    searchPlaces(map.getCenter());
});

//call initialize when the HTML finishes loading
google.maps.event.addDomListener(window, 'load', initialize);