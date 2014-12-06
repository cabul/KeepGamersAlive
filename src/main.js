var tween = require('tween');
var pixi = require('pixi');
var Gui = require('gui');

var gui = new Gui();

var stage = new pixi.Stage(0x66FF99);
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var texture = pixi.Texture.fromImage('img/background.png');

var background = new pixi.Sprite(texture);

background.anchor.x = 0;
background.anchor.y = 0;
background.position.x = 0;
background.position.y = 0;

pixelateFilter = new pixi.PixelateFilter();
var pixelate = true;
var pixelateFolder = gui.addFolder('Pixelate');
pixelateFolder.add(pixelate).name('Enable');
pixelateFolder.add(pixelateFilter.size,'x',1,32).name('PixelSizeX');
pixelateFolder.add(pixelateFilter.size,'y',1,32).name('PixelSizeY');

container = new pixi.DisplayObjectContainer();

stage.addChild(background);

requestAnimFrame( function render(){

  requestAnimFrame(render);

  renderer.render(stage);

});
