app.controller('leaderboard_con', function($scope) 
{
    $scope.rankings = [];
    
    $scope.getGlobal = function()
    {
        $scope.rankings = [];
        $scope.rankings.push({rank: 1, name: 'YoURsTrULy77', pic: './profile_icons/icon7(dollar).png'})
        $scope.rankings.push({rank: 2, name: 'ThAtGuY00', pic: './profile_icons/icon5(stop).png'})
        $scope.rankings.push({rank: 3, name: 'OMGUNICORNS!!X_X!!', pic: './profile_icons/icon1(head).png'})
        $scope.rankings.push({rank: 4, name: 'thanksobama1', pic: './profile_icons/icon2(star).png'})
        $scope.rankings.push({rank: 5, name: 'cHicKEn-LovEr9', pic: './profile_icons/icon8(lights).png'})
        $scope.rankings.push({rank: 6, name: 'KEKpepe001', pic: './profile_icons/icon3(steeringwheel).png'})
        $scope.rankings.push({rank: 7, name: 'me-me-Master29', pic: './profile_icons/icon6(keys).png'})
        $scope.rankings.push({rank: 8, name: 'PutinForPrez2020', pic: './profile_icons/icon4(stripes).png'})
        $scope.rankings.push({rank: 9, name: 'POTUS-DT', pic: 'blank'})
        $scope.rankings.push({rank: 10, name: 'NeuralNet5000', pic: './profile_icons/icon7(dollar).png'})
        
        $('#btn_global').css('opacity', 1.0)
        $('#btn_country').css('opacity', .5)
        $('#btn_local').css('opacity', .5)
    };
    
    $scope.getCountry = function()
    {
        $scope.rankings = [];
        $scope.rankings.push({rank: 1, name: 'YoURsTrULy77', pic: './profile_icons/icon7(dollar).png'})
        $scope.rankings.push({rank: 2, name: 'thanksobama1', pic: './profile_icons/icon2(star).png'})
        $scope.rankings.push({rank: 3, name: 'PutinForPrez2020', pic: './profile_icons/icon4(stripes).png'})
        $scope.rankings.push({rank: 4, name: 'POTUS-DT', pic: 'blank'})
        $scope.rankings.push({rank: 5, name: 'USA-USA-USA!!1!!1', pic: './profile_icons/icon2(star).png'})
        $scope.rankings.push({rank: 6, name: 'LionSFaN9', pic: './profile_icons/icon8(lights).png'})
        $scope.rankings.push({rank: 7, name: 'XKCD-Freak:)', pic: './profile_icons/icon6(keys).png'})
        $scope.rankings.push({rank: 8, name: 'MegaWolverine88', pic: './profile_icons/icon3(steeringwheel).png'})
        $scope.rankings.push({rank: 9, name: 'YaBoiSMgen7', pic: './profile_icons/icon5(stop).png'})
        $scope.rankings.push({rank: 10, name: 'P&R#1!', pic: './profile_icons/icon7(dollar).png'})
        
        $('#btn_global').css('opacity', .5)
        $('#btn_country').css('opacity', 1.0)
        $('#btn_local').css('opacity', .5)
    };
    
    $scope.getLocal = function()
    {
        $scope.rankings = [];
        $scope.rankings.push({rank: 1, name: 'YoURsTrULy77', pic: './profile_icons/icon7(dollar).png'})
        $scope.rankings.push({rank: 2, name: 'USA-USA-USA!!1!!1', pic: './profile_icons/icon2(star).png'})
        $scope.rankings.push({rank: 3, name: 'LionSFaN9', pic: './profile_icons/icon8(lights).png'})
        $scope.rankings.push({rank: 4, name: 'MegaWolverine88', pic: './profile_icons/icon3(steeringwheel).png'})
        $scope.rankings.push({rank: 5, name: 'AATownee3', pic: 'blank'})
        $scope.rankings.push({rank: 6, name: 'BlimpeysRulz!!', pic: './profile_icons/icon4(stripes).png'})
        $scope.rankings.push({rank: 7, name: '493ForBestClassLOL', pic: './profile_icons/icon6(keys).png'})
        $scope.rankings.push({rank: 8, name: 'MxAxRxYxSxUxE', pic: './profile_icons/icon5(stop).png'})
        $scope.rankings.push({rank: 9, name: 'o<-< & ><>', pic: './profile_icons/icon1(head).png'})
        $scope.rankings.push({rank: 10, name: 'OSUSuxLMAO', pic: './profile_icons/icon3(steeringwheel).png'})
        
        $('#btn_global').css('opacity', .5)
        $('#btn_country').css('opacity', .5)
        $('#btn_local').css('opacity', 1.0)
    };
    
    $scope.getGlobal();
});

$(document).ready( function() 
{
    b = parseInt($('body').css('height'), 10);
    l = parseInt($('#locale_picker').css('height'), 10);
    a = parseInt($('#app_nav').css('height'), 10);

    height = (b - l - a).toString();
    
    $('#leaderboard_div').css('height', height + "px" );
});

window.addEventListener("resize", function() 
{
    b = parseInt($('body').css('height'), 10);
    l = parseInt($('#locale_picker').css('height'), 10);
    a = parseInt($('#app_nav').css('height'), 10);
    
    height = (b - l - a).toString();
    
    $('#leaderboard_div').css('height', (b - l - a).toString() + "px" );
});
