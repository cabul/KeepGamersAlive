var tween = require('tween');
var pixi = require('pixi');
var Gui = require('gui');

var gui = new Gui();

var stage = new pixi.Stage(0x66FF99);
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var background = pixi.Sprite.fromImage('img/background.png');

background.anchor.x = 0;
background.anchor.y = 0;
background.position.x = 0;
background.position.y = 0;

// var pixelateFilter = new pixi.PixelateFilter();
// var pixelateFolder = gui.addFolder('Pixelate');
// pixelateFolder.add(pixelateFilter.size,'x',1,32).name('PixelSizeX');
// pixelateFolder.add(pixelateFilter.size,'y',1,32).name('PixelSizeY');
//
// var container = new pixi.DisplayObjectContainer();
// container.filters = [ pixelateFilter ];
//
// container.addChild(background);
// stage.addChild(container);

stage.addChild(background);

var leftArm = pixi.Sprite.fromImage('img/left_arm.png');
var rightArm = pixi.Sprite.fromImage('img/right_arm.png');

var rotation = {
  degrees: 0
};

var armFolder = gui.addFolder('Left Arm');
armFolder.add( leftArm.position,'x',-200,1000).name('Position X');
armFolder.add( leftArm.position,'y',-200,800).name('Position Y');
armFolder.add( rotation,'degrees',0,360).name('Rotation');

stage.addChild( leftArm );
// container.addChild( leftArm );

var AnimationHandler = require('./animationhandler');

var anim = new AnimationHandler(leftArm,require('./animations/leftarm'));
anim.load('basic');
anim.setFrame(0);
anim.setCursor(1);
anim.play();

requestAnimFrame( function render(){

  requestAnimFrame(render);

  leftArm.rotation = rotation.degrees * Math.PI / 180;

  renderer.render(stage);
  tween.update();

});
