$(document).ready( function() 
{
    b = parseInt($('body').css('height'), 10);
    a = parseInt($('#app_nav').css('height'), 10);

    height = (b - a).toString();
    console.log(height)
    
    $('#extended_survey').css('height', height + "px" );
});

window.addEventListener("resize", function() 
{
    b = parseInt($('body').css('height'), 10);
    a = parseInt($('#app_nav').css('height'), 10);

    height = (b - a).toString();
    console.log(height)
    
    $('#extended_survey').css('height', height + "px" );
});