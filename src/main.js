var pixi = require('pixi');

var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var game = require('./game');

var assets = game.assets || [];

var loader = new pixi.AssetLoader(assets);

var tile = 400 / assets.length;

var loadingBar = new pixi.Graphics();
var loaded = 0;

var loadingScreen = new pixi.Stage(0x000000);
var loading = true;

loadingScreen.addChild(loadingBar);

loader.onProgress = function(){
  loadingBar.beginFill( 0xffffff * Math.random() );
  loadingBar.drawRect(200+tile*loaded,280,tile,40);
  loadingBar.endFill();
  loaded += 1;
};

loader.onComplete = function(){
  loading = false;
};

loader.load();

requestAnimFrame( function load(){
  if( loading ) {
    requestAnimFrame(load);
    renderer.render(loadingScreen);
  } else {
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
  }
});
