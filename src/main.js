var tween = require('tween');
var pixi = require('pixi');

var stage = new pixi.Stage(0x66FF99);
var renderer = pixi.autoDetectRenderer( 600,400 );
document.body.appendChild(renderer.view);

var texture = pixi.Texture.fromImage('img/bunny.png');

var bunny = new pixi.Sprite(texture);

bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

bunny.position.x = 200;
bunny.position.y = 150;

stage.addChild(bunny);

requestAnimFrame( function render(){

  requestAnimFrame(render);

  bunny.rotation += 0.1;

  renderer.render(stage);

});
