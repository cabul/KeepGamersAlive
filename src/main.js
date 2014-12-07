var pixi = require('pixi');

var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var game = require('./game');

var init_time = 0;

var running = true;

var context = {
  renderer: renderer,
  quit: function(){
    running = false;
  }
};

game.oninit(context);

requestAnimFrame( function render(tick){

  if(running){
    requestAnimFrame(render);
    tick = tick || init_time;
    var dt = tick - init_time;
    init_time = tick;

    game.onframe(tick,dt);
  }

});
