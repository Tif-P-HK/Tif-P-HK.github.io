$(document).ready(function(){

  //effects for the collapsible header and its elements
  $(function(){
    $('#header').data('size','big');
  });

  $(window).scroll(function(){
    if($(document).scrollTop() > 0)
    {
      // scroll down

      if($('#header').data('size') == 'big')
      {
        $('#header').data('size','small');
        $('#header').stop().animate({
          height:'-=35'
        },600);

        $('#siteTitle').stop().animate({
          fontSize:'-=4',
          marginTop: '-=20'
        }, 600);

        $('#mainMenu li').stop().animate({
          paddingTop:'-=16',
          paddingBottom:'-=16',
        },600);

        //$("#sideMenuDiv").css("margin-top", "-70px");
        $("#sideMenuDiv").css("margin-top", "-20px");
      }
    }
    else
    {
      if($('#header').data('size') == 'small')
      {
        $('#header').data('size','big');
        $('#header').stop().animate({
          height:'+=35'
        },600);

        $('#siteTitle').stop().animate({
          fontSize:'+=4',
          marginTop: '+=20'
        }, 600);

        $('#mainMenu li').stop().animate({
          paddingTop:'+=15',
          paddingBottom:'+=15',
        },600);
        //
        //$("#sideMenuDiv").css("margin-top", "0");
        $("#sideMenuDiv").css("margin-top", "40px");

      }
    }
  });

  //effect for the slidedown effect on the dopdown menu
  //http://callmenick.com/post/slide-down-menu-with-jquery-and-css
  $( '.expandableItem' ).hover(
    function(){
      $(this).children('.subMenu').slideDown(200);
    },
    function(){
      $(this).children('.subMenu').slideUp(200);
    }
  );

  // construct the page's breadcrumb based on the current item
  var breadCrumbText = "";
  $.each($(".currentPage"), function(index, value){
    breadCrumbText += value.firstChild.innerHTML + " > ";
  });
  $(".breadcrumb").html(breadCrumbText.substring(0, breadCrumbText.length - 2));

  // effects for making the side menu (e.g. on statistics and districts pages)
  // float as the document is scrolled
  $(window).scroll(function(){
    $("#sideMenuDiv")
      .stop()
      .animate(
        {top: $(document).scrollTop()},
        "slow"
      );
  });
});
	