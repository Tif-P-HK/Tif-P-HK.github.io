$(document).ready(function(){

   // Function for header:
   // Effects for the collapsible header and its child elements
   // Reference: http://jsfiddle.net/jezzipin/JJ8Jc/
  $(function(){
    $("#header").data("size","big");
  });

  $(window).scroll(function(){
    var header = $("#header");
    var siteTitle = $(".siteTitle");
    var mainMenuItem = $("#mainMenu li");
    var sideMenu = $("#sideMenuDiv");

    if($(document).scrollTop() > 0)
    {
      // Scrolling down. Reduce the height of header and main menu, reduce the size of title text
      if($("#header").data("size") == "big")
      {
        header.data("size","small");
        header.stop().animate({
          height:"45"
        },600);

        siteTitle.stop().animate({
          fontSize:"26",
          marginTop: "10"
        }, 600);

        mainMenuItem.stop().animate({
          paddingTop:"5",
          paddingBottom:"5"
        },600);

        // For pages that have the side menu, adjust it's margin-top to make it stay near the top of the page
        sideMenu.css("margin-top", "-20px");
      }
    }
    else
    {
      // Scrolling up. Reverse what was done
      if(header.data("size") == "small")
      {
        header.data("size","big");
        header.stop().animate({
          height:"80"
        },600);

        siteTitle.stop().animate({
          fontSize:"30",
          marginTop: "30"
        }, 600);

        mainMenuItem.stop().animate({
          paddingTop:"23",
          paddingBottom:"23",
        },600);

        sideMenu.css("margin-top", "40px");

      }
    }
  });

  $( ".expandableItem" ).hover(
    // Function for main menu: Open the menu smoothly

    function(){
      $(this).children(".subMenu").slideDown(200);
    },
    function(){
      $(this).children(".subMenu").slideUp(200);
    }
  );

  // Function for breadcrumb text:
  // Construct the page's breadcrumb based on the current items indicated by the items on the main menun
  var breadCrumbText = "";
  $.each($(".currentPage"), function(index, value){
    breadCrumbText += value.firstChild.innerHTML + " > ";
  });
  $(".breadcrumb").html(breadCrumbText.substring(0, breadCrumbText.length - 2));

  // Function for side menu:
  $(window).scroll(function(){
    // Making the side menu on statistics and districts pages float as the document is scrolled
    $("#sideMenuDiv")
      .stop()
      .animate(
        {top: $(document).scrollTop()},
        "slow"
      );
  });

  $(".menuHeader").click(function () {
    // Logic for controlling the opening/closing of the side menu items

    $(".accordion ul").slideUp();

    if (!$(this).next().is(":visible")) {
      $(this).next().slideDown();
    }
  });
});
	