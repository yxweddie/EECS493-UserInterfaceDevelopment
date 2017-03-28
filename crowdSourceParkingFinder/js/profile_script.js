//var app = angular.module('profile', []);

app.controller('profile_con', function($scope) 
{
    $scope.icons = [];
    $scope.icons.push("profile_icons/icon1(head).png");
    $scope.icons.push("profile_icons/icon2(star).png");
    $scope.icons.push("profile_icons/icon3(steeringwheel).png");
    $scope.icons.push("profile_icons/icon4(stripes).png");
    $scope.icons.push("profile_icons/icon5(stop).png");
    $scope.icons.push("profile_icons/icon6(keys).png");
    $scope.icons.push("profile_icons/icon7(dollar).png");
    $scope.icons.push("profile_icons/icon8(lights).png");
    
    $scope.icon_source = $scope.icons[0];

    $scope.change = function(x) {
        $scope.icon_source = x;
    }

    $scope.icon_source = "profile_icons/icon1(head).png";


    $scope.username = "User";
    $scope.newName = $scope.username;
    $scope.rank = 0;
});

$(document).ready( function() 
{
    b = parseInt($('body').css('height'), 10);
    a = parseInt($('#app_nav').css('height'), 10);
    
    height = (b - a).toString();
    
    $('#profile').css('height', (b - a).toString() + "px" );
});