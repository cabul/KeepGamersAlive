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
leftArm.anchor.x = 0.5;
leftArm.anchor.y = 1;

var armFolder = gui.addFolder('Left Arm');
armFolder.add(leftArm.position,'x',-200,1000).name('Position X');
armFolder.add(leftArm.position,'y',-200,1000).name('Position Y');
armFolder.add(leftArm,'rotation',0,2*Math.PI).name('Rotation');

// var rightArm = pixi.Sprite.fromImage('img/right_arm.png');

stage.addChild( leftArm );
// container.addChild( leftArm );

var Animation = require('./animation');

var as = Animation.loadAll(leftArm,require('./animations/leftarm'));

var anim = Animation.link([ as.typing.clone().repeat(4),as.rest ]);

anim.jumpTo(0);

anim.build({
  loop: true,
  onframe: function(i){
    console.log(i+' finished');
  },
  mode: Animation.Delta
});

window.anim = anim;

requestAnimFrame( function render(){

  requestAnimFrame(render);

  renderer.render(stage);
  tween.update();

});
