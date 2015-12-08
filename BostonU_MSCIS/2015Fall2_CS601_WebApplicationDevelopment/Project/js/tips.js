/* JS for tips.html */

$(document).ready(function(){
  /*
   * Main functions
   * */
  var url = "//gist.githubusercontent.com/Tif-P-HK/042748d0335ad04eb0b6/raw/c93fe06fefe067c4305cf7078b16166c7d854b15/tifphk-tips.json";
  loadJSON(url, function(response) {
    // When DOM is ready, create a JSON "tips" object based on the JSON file,
    // then populate the page with the info from the object
    this.tips = JSON.parse(response);
    populatePage();
  });

  function populatePage(){
    // Each "tip" consists of a title, a description text, a source section linking to the sources,
    // and optionally an image which can be expanded

    // the main div containing each "tip" div
    var tipsDiv = $("#tips");

    for(var i=0; i<this.tips.length; i++){
      var tip = this.tips[i];
      var tipDiv = $("<div/>")
        .attr("id", tip.id)
        .addClass("tip");

      // title
      tipDiv.append(
        $("<h1/>")
          .addClass("sectionTitle glow-blue")
          .text(tip.title)
      );

      // image (if available)
      if(tip.img){
        tipDiv.append(
          $("<div/>")
            .addClass("imgDiv")
            .append(
              $("<img/>")
                .attr("src", tip.img.src)
                .attr("href", tip.img.alt)
                .click(expandImage)
            )
        );
      }

      // the description portion, which consists of a few paragraphs of text and a list of sources
      // create the description with the paragraphs
      var description = $("<div/>")
        .addClass("description")
        .html(tip.description);

      // then create the sources list
      if(tip.sources && tip.sources.length > 0){
        var sourcesList = $("<ul/>");
        for(var j=0; j<tip.sources.length; j++){
          $("<ul/>").append()
          var listItem = $("<li/>")
            .append(
              $("<a/>")
                .attr("href", tip.sources[j].href)
                .text(tip.sources[j].text)
            );
          sourcesList.append(listItem);
        }

        // append the source list to the description
        description.append(
          $("<details/>")
            .append($("<summary/>").text("Sources"))
            .append(sourcesList));
      }


      // append the entire description portion to the tip div
      tipDiv.append(description);

      // append the tip div to the main div
      tipsDiv.append(tipDiv);
    };
  }

  function expandImage(){
    /* Functions for the lightbox effect */
    // Reference:
    // Castledine E. Sharkie C (2010). "JQuery: Novice to Ninja". SitePoint Pty. Ltd. Australia

    // The dark background between the expanded image and the document
    $("<div></div>")
      .attr("id", "overlay")
      .appendTo("body");

    // The container for the image
    var lightbox = $("<div></div>")
      .attr("id", "lightbox")
      .appendTo("body");

    // Show the expanded image
    $("<img/>")
      .attr("id", "expandedImg")
      .attr("src", $(this).attr("src"))
      .load(function() {
        var top = ($(window).height() - lightbox.height()) / 2;
        var left = ($(window).width() - lightbox.width()) / 2;
        lightbox
          .css({
            "top": top + $("header").height(),
            "left": left,
            "z-index": "100"
          })
          .fadeIn();
      })
      .click(function() {
        $("#overlay, #lightbox")
          .fadeOut("slow", function() {
            $(this).remove();
          });
      })
      .appendTo(lightbox);

    return false;
  }

  $(window).resize(function(){
    // if the window is resized, adjust the position of the lightbox to keep it at the center

    var lightbox = $("#lightbox");
    if(lightbox.is(":visible")){
      var top = ($(window).height() - lightbox.height()) / 2;
      var left = ($(window).width() - lightbox.width()) / 2;

      $("#lightbox")
        .css({
          "top": top + $("header").height(),
          "left": left,
          "z-index": "99"
        });
    }
  });

  /*
   * Functions related to the side menu
   * */
  $(".menuHeader").click(function () {
    // Logic for controlling the opening/closing of the side menu items

    $(".accordion ul").slideUp();

    if (!$(this).next().is(":visible")) {
      $(this).next().slideDown();
    }
  });

  $(".accordion li ul li").click(function(){
    // A menu item is clicked, remove the currentItem class from the existing item
    // and apply it to the clicked item
    $(".currentItem").removeClass("currentItem");
    $(this).addClass("currentItem");
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
});