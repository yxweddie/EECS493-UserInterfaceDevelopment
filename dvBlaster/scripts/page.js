////  Page-scoped globals  ////

// Counters
var rocketIdx = 1;
var asteroidIdx = 0;

// Size Constants
var MAX_ASTEROID_SIZE = 50;
var MIN_ASTEROID_SIZE = 15;
var ASTEROID_SPEED = 5;
var ROCKET_SPEED = 10;
var SHIP_SPEED = 25;
var OBJECT_REFRESH_RATE = 50;  //ms
var SCORE_UNIT = 100;  // scoring is in 100-point units
var SPAWNING_RATE = 1;
var N_LIFE        = 3;
var GAME_START    = 0;
var GAME_RUNNING  = 1;
var GAME_OVER     = -1;
var State         = null;
var M             = gup("itemRate")||10;
var destroyedasteroidIdx = 0;
var IF_SHIELD     = false;
var checked      = true;

// Size vars
var maxShipPosX, maxShipPosY;

// Global Window Handles (gwh__)
var gwhGame, gwhOver, gwhStatus, gwhScore, gwhSplash;

// Global Object Handles
var ship,life;

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
var KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
}


////  Functional Code  ////

// Main
$(document).ready( function() {
  //console.log("Ready!");

  // Set global handles (now that the page is loaded)
  gwhGame = $('.game-window');
  gwhOver = $('.game-over');
  gwhStatus = $('.status-window');
  gwhScore = $('#score-box');
  gwhRate  = $('#rate-box');
  gwhSplash = $('.game-splash');
  ship = $('#enterprise');  // set the global ship handle
  life    = $('#life');


  // Set global positions
  maxShipPosX = gwhGame.width() - ship.width();
  maxShipPosY = gwhGame.height() - ship.height();

  $(window).keydown(keydownRouter);
  settingPanelHAndler.init();
  splashHandler.init();
  gobackHandler.init();
  State = GAME_START;

  //$(window).keydown(moveShip);
  //$(window).keydown(fireRocket);
  //$(window).keydown(createAsteroid);

  // Periodically check for collisions (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();  // Remove elements if there are collisions
  }, 100);
});



function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
      // createAsteroid();
      break;
    case KEYS.spacebar:
      //console.log("the state is ", State);
      if(State === GAME_RUNNING){
        soundHandler.play_rocketSound();
        fireRocket();
        rateHandler.increaseRocket();
        rateHandler.updateRate();
      }
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      moveShip(e.which);
      break;
    default:
    //  console.log("Invalid input!");
  }
}

// Check for any collisions and remove the appropriate object if needed
function checkCollisions() {
  // First, check for rocket-asteroid checkCollisions
  /* NOTE: We dont use a global handle here because we need to refresh this
   * list of elements when we make the reference.
   */
  $('.rocket').each( function() {
    var curRocket = $(this);  // define a local handle for this rocket
    $('.asteroid').each( function() {
      var curAsteroid = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curAsteroid)) {
        // If a rocket and asteroid collide, destroy both
        curRocket.remove();
        curAsteroid.remove();

        if (curAsteroid.find('img').hasClass("shield") === false){
          if (destroyedasteroidIdx <10) destroyedasteroidIdx++;
          console.log("destroyed",destroyedasteroidIdx);
        }

        // update the rate
        rateHandler.increaseAsteroid();
        rateHandler.updateRate();
        // Score points for hitting an asteroid! Smaller asteroid --> higher score
        var points = Math.ceil(MAX_ASTEROID_SIZE-curAsteroid.width()) * SCORE_UNIT;
        // Update the visible score
        gwhScore.html(parseInt($('#score-box').html()) + points);
      }
    });
  });


  // Next, check for asteroid-ship interactions
  $('.asteroid').each( function() {
    var curAsteroid = $(this);
    if (isColliding(curAsteroid, ship)) {
      curAsteroid.remove();
      if(!IF_SHIELD){
        if (curAsteroid.find('img').hasClass("shield")){
          $('.ship_shield').show();
          IF_SHIELD = true;
        }else{
          lifeHandler.desLife();
          soundHandler.play_explodeSound();
          lifeHandler.explosion();
          if(lifeHandler.getLife() >0){
            //console.log('remaing life : ',lifeHandler.getLife() );
            lifeHandler.draw();
          }else{
            //
            setTimeout(function(){
              soundHandler.play_gameoverSound();
              ship.hide();
              settingPanelHAndler.stop();
              State = GAME_OVER;
              $('#game_over_score').text(gwhScore.text());
              // Hide primary windows
              // Show "Game Over" screen
              gwhGame.hide();
              //gwhStatus.hide();
              gwhOver.show();
            },500);

          }
          // Remove all game elements
          // remove all rockets

          $('.rocket').remove();
          $('.asteroid').remove();  // remove all asteroids
          rocketIdx = 1;
          asteroidIdx = 1;
          destroyedasteroidIdx = 0;
        }
      }else{
        if (!curAsteroid.find('img').hasClass("shield")){
          $('.ship_shield').hide();
          IF_SHIELD = false;
        }

      }
    }
  });
}

// Check if two objects are colliding
function isColliding(o1, o2) {
  // Define input direction mappings for easier referencing
  o1D = { 'left': parseInt(o1.css('left')),
          'right': parseInt(o1.css('left')) + o1.width(),
          'top': parseInt(o1.css('top')),
          'bottom': parseInt(o1.css('top')) + o1.height()
        };
  o2D = { 'left': parseInt(o2.css('left')),
          'right': parseInt(o2.css('left')) + o2.width(),
          'top': parseInt(o2.css('top')),
          'bottom': parseInt(o2.css('top')) + o1.height()
        };

  // If horizontally overlapping...
  if ( (o1D.left < o2D.left && o1D.right > o2D.left) ||
       (o1D.left < o2D.right && o1D.right > o2D.right) ||
       (o1D.left < o2D.right && o1D.right > o2D.left) ) {

    if ( (o1D.top > o2D.top && o1D.top < o2D.bottom) ||
         (o1D.top < o2D.top && o1D.top > o2D.bottom) ||
         (o1D.top > o2D.top && o1D.bottom < o2D.bottom) ) {

      // Collision!
      return true;
    }
  }
  return false;
}

// Return a string corresponding to a random HEX color code
function getRandomColor() {
  // Return a random color. Note that we don't check to make sure the color does not match the background
  return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
}

// Handle asteroid creation events
function createAsteroid() {
  //console.log('Spawning asteroid...');

  // NOTE: source - http://www.clipartlord.com/wp-content/uploads/2016/04/aestroid.png
  var asteroidDivStr = "<div id='a-" + asteroidIdx + "' class='asteroid'></div>"
  // Add the rocket to the screen
  gwhGame.append(asteroidDivStr);
  // Create and asteroid handle based on newest index
  var curAsteroid = $('#a-'+asteroidIdx);

  asteroidIdx++;  // update the index to maintain uniqueness next time

  // Set size of the asteroid (semi-randomized)
  var astrSize = MIN_ASTEROID_SIZE + (Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE));

  if( ((destroyedasteroidIdx) % (M)) === 0 && destroyedasteroidIdx !=0 ){
    curAsteroid.append("<img src='img/shield.png' height='" + 60 + "'" + " width='"+60+"'" + " class='" + "shield'/>");
    destroyedasteroidIdx = 0;
  }else{
    curAsteroid.append("<img src='img/asteroid.png' height='" + astrSize + "'/>");
    curAsteroid.css('width', astrSize+"px");
    curAsteroid.css('height', astrSize+"px");
  }


  /* NOTE: This position calculation has been moved lower since verD -- this
  **       allows us to adjust position more appropriately.
  **/
  // Pick a random starting position within the game window
  var startingPosition = Math.random() * (gwhGame.width()-astrSize);  // Using 50px as the size of the asteroid (since no instance exists yet)

  // Set the instance-specific properties
  curAsteroid.css('left', startingPosition+"px");

  // Make the asteroids fall towards the bottom
  setInterval( function() {
    curAsteroid.css('top', parseInt(curAsteroid.css('top'))+ASTEROID_SPEED);
    // Check to see if the asteroid has left the game/viewing window
    if (parseInt(curAsteroid.css('top')) > (gwhGame.height() - curAsteroid.height())) {
      curAsteroid.remove();
    }
  }, OBJECT_REFRESH_RATE);
}

// Handle "fire" [rocket] events
function fireRocket() {
  //console.log('Firing rocket...');

  // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png
  var rocketDivStr = "<div id='r-" + rocketIdx + "' class='rocket'><img src='img/rocket.png'/></div>";
  // Add the rocket to the screen
  gwhGame.append(rocketDivStr);
  // Create and rocket handle based on newest index
  var curRocket = $('#r-'+rocketIdx);
  rocketIdx++;  // update the index to maintain uniqueness next time

  // Set vertical position
  curRocket.css('top', ship.css('top'));
  // Set horizontal position
  var rxPos = parseInt(ship.css('left')) + (ship.width()/2);  // In order to center the rocket, shift by half the div size (recall: origin [0,0] is top-left of div)
  curRocket.css('left', rxPos+"px");

  // Create movement update handler
  setInterval( function() {
    curRocket.css('top', parseInt(curRocket.css('top'))-ROCKET_SPEED);
    // Check to see if the rocket has left the game/viewing window
    if (parseInt(curRocket.css('top')) < curRocket.height()) {
      //curRocket.hide();
      curRocket.remove();
    }
  }, OBJECT_REFRESH_RATE);
}

// Handle ship movement events
function moveShip(arrow) {
  switch (arrow) {
    case KEYS.left:  // left arrow
      var newPos = parseInt(ship.css('left'))-SHIP_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      ship.css('left', newPos);
    break;
    case KEYS.right:  // right arrow
      var newPos = parseInt(ship.css('left'))+SHIP_SPEED;
      if (newPos > maxShipPosX) {
        newPos = maxShipPosX;
      }
      ship.css('left', newPos);
    break;
    case KEYS.up:  // up arrow
      var newPos = parseInt(ship.css('top'))-SHIP_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      ship.css('top', newPos);
    break;
    case KEYS.down:  // down arrow
      var newPos = parseInt(ship.css('top'))+SHIP_SPEED;
      if (newPos > maxShipPosY) {
        newPos = maxShipPosY;
      }
      ship.css('top', newPos);
    break;
  }
}

// Rate Handler (1)
var rateHandler = (function ($){
  var asteroidDestroyed = 0,
      rocketLaunched    = 0;
      gwhRate           = $('#rate-box');

  return {
    restart:function(){
      asteroidDestroyed  = 0;
      rocketLaunched     = 0;
      gwhRate.text("0%");
    },
    increaseRocket : function(){
      rocketLaunched++;
    },
    increaseAsteroid : function(){
      asteroidDestroyed++;
    },
    updateRate : function(){
    //  console.log(asteroidDestroyed + ", " + rocketLaunched);
      var rate = ( (asteroidDestroyed / rocketLaunched )* 100).toFixed(0);
      gwhRate.text(rate + "%");
    }
  }
})($);

//Setting Panel Handler (2, 4)
var settingPanelHAndler = (function($,SPAWNING_RATE) {
  var timer = null;
  var stop     = false;
  var spawnAsteroid = function(){
    var MIN_RATE = (SPAWNING_RATE * 0.5);
    var MAX_RATE = (SPAWNING_RATE * 1.5);
    var rand     = (Math.random());
    var tempRate = (MIN_RATE + rand* (SPAWNING_RATE)).toFixed(3);
    console.log("The SPAWNING_RATE is : ", tempRate);
    console.log("new rate is from ",MIN_RATE," , ",MAX_RATE, "Math Random", rand," and the tempRate is ", tempRate);

    setTimeout(function() {
            if(!stop){
              createAsteroid();
              spawnAsteroid();
            }
    }, tempRate*1000);
  }

  return {
    stop :function(){
      stop = true;
    },
    start:function(){
      stop = false;
    },

    spawnAsteroid:spawnAsteroid,

    init : function(){
      var settingPanelBt    = $('#setting-panel-bt'),
          settingPanel      = $('#setting-panel'),
          asteroidSRate     = $('#asteroid-spawning-rate'),
          muteAudiocb       = $('#mute-audio-check-box'),
          updateBt          = $('#update-bt');

      settingPanelBt.click(function(){
        var text = settingPanelBt.text();
        switch (text) {
          case "Open Setting Panel":
            settingPanel.css("display","block");
            settingPanelBt.text("Close Setting Panel");
            break;
          case "Close Setting Panel":
            settingPanel.css("display","none");
            settingPanelBt.text("Open Setting Panel");
            break;
        }
      });

      asteroidSRate.focusout(function(){

        var tempS = 1;
        if(asteroidSRate.val()!=""){
          tempS = (parseFloat(asteroidSRate.val())).toFixed(1)
        }else{
          alert("Please enter a number range from 0.2 to 4");
        }
        console.log(tempS);
        if (tempS > 4 || tempS < 0.2 || tempS === NaN){
          alert("Please enter a number range from 0.2 to 4");
        }
      });

      updateBt.click(function(){
        var tempS = 1;
        if(asteroidSRate.val()!=""){
          tempS = (parseFloat(asteroidSRate.val())).toFixed(1)
        }

        console.log(tempS);
        if (tempS > 4 || tempS <0.2 || tempS === NaN){
          alert("Please enter a number range from 0.2 to 4.");
        }else{
          if($('#mute-audio-check-box').is(':checked')){
            checked=true;
          }else{
            checked=false;
          }
          SPAWNING_RATE = tempS || SPAWNING_RATE;
          settingPanel.css("display","none");
          settingPanelBt.text("Open Setting Panel");
        }
      });
    }
  }
})($,SPAWNING_RATE);

// Life Handler (3)
var lifeHandler = (function($,N_LIFE){
  var saveDefault = N_LIFE;
  N_LIFE = gup("life") || N_LIFE;
  //console.log("The ship life is : ", N_LIFE );

  return {
    reSetLife : function(){
      N_LIFE = gup("life") || saveDefault;
    },
    setShip : function(){
      ship.css("left","122px");
      ship.css("top","530px");
      //console.log(ship);
    },
    desLife : function(){
      N_LIFE =  N_LIFE - 1;
    },
    getLife : function(){
      return N_LIFE;
    },
    draw : function(){
      var lifeContainer = $("#life");
      lifeContainer.empty();
      for(var i = 0; i< N_LIFE-1; i++){
        var ship_life = $('<img />', {
                           class: 'ship-avatar',
                           src: 'img/fighter.png',
                           height: 10
                         });
        lifeContainer.append(ship_life);
        if (i!==(N_LIFE -2))  lifeContainer.append("</br>");
      }
    },
    explosion : function(){
      var ex = $('<img />',{
            class : "explosion",
            src : 'img/explosion.png',
            height:50
          });
          ex.css('z-index', 100);
          ex.css('position','relative');
          ex.css('left',-60+"px");
          ship.append(ex);
          setTimeout(function(){
            //console.log(ex);
            $(".explosion").remove();
          },1000);
    }
  }
})($,N_LIFE);

var splashHandler = (function($){
  return {
    init : function(){
      $('#start-bt').click(function(){
        //console.log("hello");
        stateHandler();
      })
    }
  }
})($);

var gobackHandler = (function($){
  return{
    init : function(){
      $('#gobackBt').click(function(){
        stateHandler()
      });
    }
  }
})($);

//state handler
function stateHandler(){
  switch (State) {
    case GAME_START:
      lifeHandler.draw();
      lifeHandler.setShip();
      settingPanelHAndler.start();
      settingPanelHAndler.spawnAsteroid();
      gwhSplash.hide();
      life.show();
      State = GAME_RUNNING;
      //console.log(State);
      break;
    case GAME_RUNNING:
      break;
    case GAME_OVER:
      gwhOver.hide();
      gwhGame.show();
      gwhSplash.show();
      ship.show();
      lifeHandler.setShip();
      lifeHandler.reSetLife();
      gwhScore.text("0");
      rateHandler.restart();
      $('.rocket').remove();  // remove all rockets
      $('.asteroid').remove();  // remove all asteroids
      rocketIdx = 1;
      asteroidIdx=1;
      destroyedasteroidIdx=0;
      State = GAME_START;
      M = gup("itemRate") || 10;
      soundHandler.play_introSound();
      break;

  }
}

//sound handler

var soundHandler = (function($){
  var rocketSound   = new Audio('audio/rocket.wav'),
      explodeSound  = new Audio('audio/explode.wav'),
      gameoverSound = new Audio('audio/gameover.wav'),
      introSound    = new Audio('audio/intro.mp3');
  return {
    play_rocketSound : function(){
      if(!checked){
        rocketSound.play();
      }
    },
    play_explodeSound : function(){
      if(!checked){
          explodeSound.play();
      }
    },
    play_gameoverSound:function(){
      if(!checked){
          gameoverSound.play();
      }
    },
    play_introSound : function(){
      if(!checked){
          introSound.play();
      }
    }
  }
})($);
