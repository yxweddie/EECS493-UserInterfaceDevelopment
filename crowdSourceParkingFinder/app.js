var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/GPS", {
        templateUrl : "./html/gps.html",
        controller : "gps_con"
    });
    $routeProvider
    .when("/Survey", {
        templateUrl : "./html/survey.html",
        //controller : "gpsCtrl"
    });
    $routeProvider
    .when("/Leaderboard", {
        templateUrl : "./html/leaderboard.html",
        controller : "leaderboard_con"
    });
    $routeProvider
    .when("/Profile", {
        templateUrl : "./html/profile.html",
        controller : "profile_con"
    });
    $routeProvider
    .when("/Settings", {
        templateUrl : "./html/settings.html",
        controller : "settings_con"
    });
});

$(document).ready( function() 
{
    $('#app_nav').hide();

    if (window.location.href.includes('#'))
    {
        $('#splash_text').hide();
    	$('#app_nav').show();
    }
    
    setTimeout(function()
    {
        if (!window.location.href.includes('#'))
        {
            $('#splash_text').hide();
            window.location.href = window.location.href + "#/GPS";
        }
    	$('#app_nav').show();
    }, 3500);
});
