/* JS for news.html  */

$(document).ready(function(){

  $("#eventsDiv ul li").click(function(){
    // Function for the menu at the top:
    // Apply the "current" class to the clicked menu item
    $("#eventsDiv ul li").removeClass("current");
    $(this).addClass("current");
  });

  $(".imgBtn").click(function(){
    // Function for the image switching buttons:
    // Show the corresponding image when a button is clicked
    var btn = $(this);
    var btnNode = btn[0];
    var toShowIndex = 0;
    var toHideIndex = 0;
    var anchors = $(".eventsOnMonth a");

    // When a button is clicked, set its background color the same as when it's in hover state to make it look selected
    // Note: Not using the ":active" selector in CSS so that the "button" will stay selected until another one is clicked
    $(".imgBtn").css("background-color", "#FFFFFF");
    btn.css("background-color", "#FFBF00");

    // Find the index of the button using previousElementSibling instead of harding the id
    while(btnNode = btnNode.previousElementSibling)
      toShowIndex++;

    // Find the index of the currently visible anchor element
    while(toHideIndex < anchors.length){
      if(!anchors[toHideIndex].classList.contains("hide"))
        break;
      else
        toHideIndex++;
    }

    // If the button corresponding to the currently visible anchor is clicked,
    // then do nothing
    if(toHideIndex === toShowIndex)
      return;

    // First hide all anchors, then show the one selected
    anchors.addClass("hide");
    anchors[toShowIndex].classList.remove("hide");
  });

  $("#eventsDiv ul li").click(function(){
    // For the months that don't have contents yet, replace the image gallery by a text
    // Otherwise, show the image gallery

    var images = $(".imageGalleryUI:visible");
    if($(this).hasClass("notAvailableMonth")){
      if(images.length !== 0) {
        images.hide();
        $("#notAvailableTextDiv").show();
      }
    }
    else{
      $("#notAvailableTextDiv").hide();
      $(".imageGalleryUI").show();
    }
  });
});