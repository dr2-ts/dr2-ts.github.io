$(document).ready(function(){

    var clicked = false;
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if(scroll > 100 && !clicked){
            $(".go-to-top-button").addClass("show-go-to-top-button");
        }else if(scroll > 10 && clicked){
            $(".go-to-top-button").removeClass("show-go-to-top-button");
        }
        if(scroll == 0){
            $(".go-to-top-button").removeClass("show-go-to-top-button");
            clicked = false;
        }

    });

    $(".go-to-top-button").click(function(){
        clicked = true;
        $('html, body').animate({
            scrollTop: 0
          }, 1000);
    });


    $(".scrollTo").on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
          scrollTop: $(target).offset().top
        }, 1000);
     });

});