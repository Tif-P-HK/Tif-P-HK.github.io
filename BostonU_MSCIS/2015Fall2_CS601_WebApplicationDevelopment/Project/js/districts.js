/* JS for districts.html */

// ArcGIS JS API requires loading through AMD
require(["esri/map", "esri/geometry/Point", "dojo/domReady!"
], function(Map, Point) {
  // When DOM is ready, create the map component,
  var map = new Map("hongKongMap", {
    center: [114.1, 22.35],
    zoom: 10,
    basemap: "streets"
  });

  /*
   * Main functions
   * */
  // Using https here. Interestingly IE will fail to load the JSON if going protocol-less
  var url = "https://gist.githubusercontent.com/Tif-P-HK/3ea37ae6b5e623db35e2/raw/69b2a6456180d75c2f031829441bf6f550c2cf56/tifphk-districts.json";
  loadJSON(url, function(response) {
    // When DOM is ready, create a JSON "district" object based on the url to the JSON file,
    // then populate the page using the default "hongkong" object
    this.districts = JSON.parse(response);
    populatePage("hongkong");
  });

  function populatePage(districtId){
    // Populate the page using the JSON object

    // First, find the district to show based on the given id
    var districts = $.grep(this.districts, function(item){
      return item.id === districtId;
    });

    // Currently the JSON file only contains info for three districts (Central, Eastern, Kwun Tong).
    // For those that don't have any data yet, fall back to the default
    if(districts.length === 0){
      districts = $.grep(this.districts, function(item){
        return item.id === "hongkong";
      });
    }

    this.district = districts[0];

    //Use the district object to populate the following content:
    // Recenter the map to the district
    recenterMap();

    // Create the images in the image gallery
    createImages();

    // Update district title and description
    createDescription();
  }

  function recenterMap(){
    // Recenter the map based on the district's location and the zoom level specified in the JSON object

    map.centerAndZoom(new Point(this.district.location.center), this.district.location.zoom);
  }

  function createImages(){
    // Create the images for the image gallery, then kick off the slideshow

    var imagesDiv = $("#imageGallery");
    var imageContainer;
    var photos;

    imagesDiv.children().remove();  //First, remove all exiting images from the image gallery
    photos = this.district.photos;
    // Then add the images
    for(var i=0; i<photos.length; i++){
      imageContainer = $("<div/>").addClass("imageContainer");
      if(i==0)
        imageContainer.attr("id", "firstImg");
      else
        imageContainer.addClass("hide");

      imagesDiv.append(
        imageContainer
          .append(
            $("<img/>")
              .attr("src", photos[i].src)
              .attr("alt", photos[i].alt)
          )
          .append(
            $("<span/>")
              .html(photos[i].caption)
          )
      );
    }

    // if a timer was previously set to slide the images (i.e. this.interval != undefined)
    // clear the timer and restart it for the current set of images
    // Don't start the timer if the district has only one image (e.g. the Eastern district)
    if(this.interval)
      clearInterval(this.interval);
    if($("#imageGallery").children().length > 1)
      slideImages();
  }

  function createDescription(){
    // Create the elements for the district title, description and icons to external sites

    // Icons to external sites. Hide if the URL info is missing
    var tripAdvisorUrl = this.district.description.tripAdvisorUrl;
    var tripAdvisorUrlUI = $("#tripAdvisorUrl");
    if(tripAdvisorUrl !== ""){
      tripAdvisorUrlUI
        .attr("href", tripAdvisorUrl)
        .attr("target", "_blank");
      tripAdvisorUrlUI.removeClass("hide");
    }
    else
      tripAdvisorUrlUI.addClass("hide");

    var openRiceUrl = this.district.description.openRiceUrl;
    var openRiceUrlUI = $("#openRiceUrl");
    if(openRiceUrl !== ""){
      openRiceUrlUI
        .attr("href", openRiceUrl)
        .attr("target", "_blank");
      openRiceUrlUI.removeClass("hide");
    }
    else
      openRiceUrlUI.addClass("hide");

    // District title
    var title = district.id === "hongkong" ? district.location.area : district.location.area + " > " + district.name;
    $("#districtTitleText").text(title);

    // District description
    var districtDescription = $("#districtDescription");
    districtDescription.children().remove();
    districtDescription.addClass("justify");
    districtDescription.append(district.description.details);
  }

  $("#districtMenu li ul li").click(function(){
    // When an item on the sde menu is clicked, remove the currentItem class from the existing item
    // and apply it to the clicked item
    $(".currentItem").removeClass("currentItem");
    $(this).addClass("currentItem");

    // Use the id of the menu item to look up for the district info from the JSON object
    populatePage($(this)[0].id);
  });

  /*
   * Helper functions
   * */
  function loadJSON(url, callback) {
    // Load a JSON file with the data used by the page
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", url, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  function slideImages(){
    // Set a timer to slide images that belong to the same districts
    // Reference:
    // http://jsfiddle.net/xYWzU/9/

    this.interval = setInterval(function(){
      // For every 6 seconds, slide out current image, then slide in the next image
      var hideOptions = {
        "direction": "left",
        "mode": "hide"
      };
      var showOptions = {
        "direction": "right",
        "mode": "show"
      };

      var firstImage = $("#firstImg");
      var currentImage = $(".imageContainer:visible");
      // If the current image is the last one, set its next image to be the first image
      var nextImage = currentImage.is(":last-child")? firstImage: currentImage.next(".imageContainer");

      currentImage.effect("slide", hideOptions, 2000);
      nextImage.effect("slide", showOptions, 2000);

    }, 6000);
  }
});