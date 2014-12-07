(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cabul/github/KeepGamersAlive/src/animation.js":[function(require,module,exports){
(function (global){
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var Tween = TWEEN.Tween;
var curve = TWEEN.Easing.Sinusoidal.InOut;
var dtor = Math.PI / 180;
var rtod = 180 / Math.PI;

var Animation = function(sprite,frames){

  this.frames = frames || [];
  this.sprite = sprite;
  this.update = function(){
    sprite.position.x = this.posx;
    sprite.position.y = this.posy;
    sprite.rotation = this.rot;
  };
  this.cursor = 0;
  this.loop = false;

};

var format = function( frame ){
  return {
    posx: frame.position.x || 0,
    posy: frame.position.y || 0,
    rot: (frame.rotation||0) * dtor
  };
};

Animation.prototype = {

  constructor: Animation,
  build: function(options){
    options = options || {};
    this.loop = options.loop || this.loop;
    this.cursor = options.cursor || this.cursor;
    var frames = this.frames;
    var len = frames.length;
    var doLoop = this.loop;
    var offset = this.cursor;
    var i = offset;
    var onframe = this.onframe;

    var last, first, tween, frame;

    var max = i + len;

    var _this = this;

    var complete = function(f){
      var form = format(frames[f]);
      return function(){
        this.posx = form.posx;
        this.posy = form.posy;
        this.rot = form.rot;
        if(_this.onframe) {
          onframe.call(frames,f);
        }
        _this.cursor = (f+1) % len;
      };
    };


    while( i < max) {
      frame = frames[i%len];
      tween = new Tween(format(frame));
      var oncomplete = complete(i%len);
      var onstop = stop(i%len);
      i = i + 1;
      var next = frames[i%len];
      tween.to(format(next),next.duration||1000)
      .delay(next.delay||0)
      .easing(curve)
      .onUpdate(this.update).onComplete(oncomplete);
      if( !!last ) {
        last.chain(tween);
      }
      if( !first ) {
        first = tween;
      }
      last = tween;
    }

    if( doLoop ) {
      last.chain(first);
    }

    this.tween = first;

    return this;
  },
  play: function(options){
    options = options || {};
    this.build(options);
    var first = this.tween;
    var time = options.transition;
    if( time ) {
      dt = dt || 0;
      var frame = this.frames[ this.cursor % this.frames.length ];
      var status = this.spriteStatus();
      var _this = this;
      this.tween = new Tween(format(status))
      .to(format(frame),time)
      .delay(options.delay||0)
      .easing(curve)
      .onUpdate(this.update)
      .onComplete(function(){
        _this.tween = first;
        first.start();
      }).onStop(function(){
        _this.tween = first;
      }).start();
    } else {
      first.start();
    }
    return this;
  },
  pause: function(){
    this.tween.stop();
    this.tween.stopChainedTweens();
    this.cursor = (this.cursor+1)%this.frames.length;
    return this;
  },
  spriteStatus: function(){
    return {
      position: this.sprite.position,
      rotation: this.sprite.rotation * rtod
    };
  },
  onFrame: function(cb){
    this.onframe = cb;
    return this;
  },
  jumpTo: function(i){
    i = i || 0;
    var frame = this.frames[i];
    this.cursor = (i+1) % this.frames.length;
    var sprite = this.sprite;
    sprite.position.x = frame.position.x;
    sprite.position.y = frame.position.y;
    sprite.rotation = frame.rotation * dtor;
    return this;
  },
  repeat: function(times){
    var frames = [].concat(this.frames);
    for(var i = 0; i < times; i += 1 ){
      this.frames = this.frames.concat(frames);
    }
    return this;
  },
  chain: function(other){
    this.frames = this.frames.concat(other.frames);
    return this;
  },
  clone: function(){
    return new Animation(this.sprite,[].concat(this.frames));
  }
};

Animation.loadAll = function(sprite,sheet){
  var anims = {};
  Object.keys(sheet).forEach(function(name){
    anims[name] = new Animation(sprite,sheet[name]);
  });
  return anims;
};

Animation.link = function(list){
  var link = new Animation(list[0].sprite);
  list.forEach(function(anim){
    link.frames = link.frames.concat(anim.frames);
  });
  return link;
};

module.exports = Animation;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js":[function(require,module,exports){
module.exports = {
  typing: [
  {
    position: {
      x: 240,
      y: 670
    },
    rotation: 12,
    duration: 300
  },
  {
    position: {
      x: 260,
      y: 650
    },
    rotation: 6,
    duration: 300
  }
  ],
  rest: [
  {
    position: {
      x: 250,
      y: 670
    },
    rotation: 17,
    duration: 700
  },
  {
    position: {
      x: 250,
      y: 670
    },
    rotation: 17,
    duration: 1000
  },

  ]
};

},{}],"/Users/cabul/github/KeepGamersAlive/src/animations/rightarm.js":[function(require,module,exports){
module.exports = {

  typing: [
  {
    position: {
      x: 488,
      y: 673
    },
    rotation: 350,
    duration: 200
  },
  {
    position: {
      x: 468,
      y: 668
    },
    rotation: 355,
    duration: 300,
    delay: 150
  },
  {
    position: {
      x: 500,
      y: 660
    },
    rotation: 343,
    duration: 350
  },
  ],

  mouse: [
  {
    position: {
      x: 554,
      y: 673
    },
    rotation: 368,
    duration: 400
  },
  {
    position: {
      x: 556,
      y: 670
    },
    rotation: 368,
    duration: 500
  }
  ]

};

},{}],"/Users/cabul/github/KeepGamersAlive":[function(require,module,exports){
(function (global){
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Gui = (typeof window !== "undefined" ? window.dat.GUI : typeof global !== "undefined" ? global.dat.GUI : null);

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

var rightArm = pixi.Sprite.fromImage('img/right_arm.png');
rightArm.anchor.x = 0.5;
rightArm.anchor.y = 1;

var rotation = {
  left: 0,
  right: 0
};

var Animation = require('./animation');

var leftSheet = Animation.loadAll(leftArm,require('./animations/leftarm'));
var rightSheet = Animation.loadAll(rightArm,require('./animations/rightarm'));

var leftAnim = Animation.link([
  leftSheet.typing.clone().repeat(4),
  leftSheet.rest
]).jumpTo(0).play({loop: true});

var rightAnim = Animation.link([
  rightSheet.typing.clone().repeat(2),
  rightSheet.mouse,
  rightSheet.typing
]).jumpTo(0).play({loop:true});

var doAnimate = { left: true, right: true };

var armFolder = gui.addFolder('Left Arm');
var option;
armFolder.add(leftArm.position,'x',-200,1000).name('Position X');
armFolder.add(leftArm.position,'y',-200,1000).name('Position Y');
option = armFolder.add(rotation,'right',0,360).name('Rotation');
option.onChange(function(value){
  leftArm.rotation = value * Math.PI / 180;
});
option = armFolder.add(doAnimate,'left').name('Animate');
option.onChange(function(value){
  if( value ) {
    leftAnim.play({transition: 200});
  } else {
    leftAnim.pause();
  }
});

armFolder = gui.addFolder('Right Arm');
armFolder.add(rightArm.position,'x',-200,1000).name('Position X');
armFolder.add(rightArm.position,'y',-200,1000).name('Position Y');
armFolder.add(rotation,'right',0,360).name('Rotation');
option = armFolder.add(rotation,'left',0,360).name('Rotation');
option.onChange(function(value){
  rightArm.rotation = value * Math.PI / 180;
});
option = armFolder.add(doAnimate,'right').name('Animate');
option.onChange(function(value){
  if( value ) {
    rightAnim.play({transition: 200});
  } else {
    rightAnim.pause();
  }
});


stage.addChild( leftArm );
stage.addChild( rightArm );

requestAnimFrame( function render(){

  requestAnimFrame(render);

  renderer.render(stage);
  tween.update();

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":"/Users/cabul/github/KeepGamersAlive/src/animation.js","./animations/leftarm":"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js","./animations/rightarm":"/Users/cabul/github/KeepGamersAlive/src/animations/rightarm.js"}]},{},["/Users/cabul/github/KeepGamersAlive"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uLmpzIiwic3JjL2FuaW1hdGlvbnMvbGVmdGFybS5qcyIsInNyYy9hbmltYXRpb25zL3JpZ2h0YXJtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIFRXRUVOID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgVHdlZW4gPSBUV0VFTi5Ud2VlbjtcbnZhciBjdXJ2ZSA9IFRXRUVOLkVhc2luZy5TaW51c29pZGFsLkluT3V0O1xudmFyIGR0b3IgPSBNYXRoLlBJIC8gMTgwO1xudmFyIHJ0b2QgPSAxODAgLyBNYXRoLlBJO1xuXG52YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24oc3ByaXRlLGZyYW1lcyl7XG5cbiAgdGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgW107XG4gIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnggPSB0aGlzLnBvc3g7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSB0aGlzLnBvc3k7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gdGhpcy5yb3Q7XG4gIH07XG4gIHRoaXMuY3Vyc29yID0gMDtcbiAgdGhpcy5sb29wID0gZmFsc2U7XG5cbn07XG5cbnZhciBmb3JtYXQgPSBmdW5jdGlvbiggZnJhbWUgKXtcbiAgcmV0dXJuIHtcbiAgICBwb3N4OiBmcmFtZS5wb3NpdGlvbi54IHx8IDAsXG4gICAgcG9zeTogZnJhbWUucG9zaXRpb24ueSB8fCAwLFxuICAgIHJvdDogKGZyYW1lLnJvdGF0aW9ufHwwKSAqIGR0b3JcbiAgfTtcbn07XG5cbkFuaW1hdGlvbi5wcm90b3R5cGUgPSB7XG5cbiAgY29uc3RydWN0b3I6IEFuaW1hdGlvbixcbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8wqB7fTtcbiAgICB0aGlzLmxvb3AgPSBvcHRpb25zLmxvb3AgfHwgdGhpcy5sb29wO1xuICAgIHRoaXMuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3IgfHwgdGhpcy5jdXJzb3I7XG4gICAgdmFyIGZyYW1lcyA9IHRoaXMuZnJhbWVzO1xuICAgIHZhciBsZW4gPSBmcmFtZXMubGVuZ3RoO1xuICAgIHZhciBkb0xvb3AgPSB0aGlzLmxvb3A7XG4gICAgdmFyIG9mZnNldCA9IHRoaXMuY3Vyc29yO1xuICAgIHZhciBpID0gb2Zmc2V0O1xuICAgIHZhciBvbmZyYW1lID0gdGhpcy5vbmZyYW1lO1xuXG4gICAgdmFyIGxhc3QsIGZpcnN0LCB0d2VlbiwgZnJhbWU7XG5cbiAgICB2YXIgbWF4ID0gaSArIGxlbjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbihmKXtcbiAgICAgIHZhciBmb3JtID0gZm9ybWF0KGZyYW1lc1tmXSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5wb3N4ID0gZm9ybS5wb3N4O1xuICAgICAgICB0aGlzLnBvc3kgPSBmb3JtLnBvc3k7XG4gICAgICAgIHRoaXMucm90ID0gZm9ybS5yb3Q7XG4gICAgICAgIGlmKF90aGlzLm9uZnJhbWUpIHtcbiAgICAgICAgICBvbmZyYW1lLmNhbGwoZnJhbWVzLGYpO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLmN1cnNvciA9IChmKzEpICUgbGVuO1xuICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICB3aGlsZSggaSA8IG1heCkge1xuICAgICAgZnJhbWUgPSBmcmFtZXNbaSVsZW5dO1xuICAgICAgdHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KGZyYW1lKSk7XG4gICAgICB2YXIgb25jb21wbGV0ZSA9IGNvbXBsZXRlKGklbGVuKTtcbiAgICAgIHZhciBvbnN0b3AgPSBzdG9wKGklbGVuKTtcbiAgICAgIGkgPSBpICsgMTtcbiAgICAgIHZhciBuZXh0ID0gZnJhbWVzW2klbGVuXTtcbiAgICAgIHR3ZWVuLnRvKGZvcm1hdChuZXh0KSxuZXh0LmR1cmF0aW9ufHwxMDAwKVxuICAgICAgLmRlbGF5KG5leHQuZGVsYXl8fDApXG4gICAgICAuZWFzaW5nKGN1cnZlKVxuICAgICAgLm9uVXBkYXRlKHRoaXMudXBkYXRlKS5vbkNvbXBsZXRlKG9uY29tcGxldGUpO1xuICAgICAgaWYoICEhbGFzdCApIHtcbiAgICAgICAgbGFzdC5jaGFpbih0d2Vlbik7XG4gICAgICB9XG4gICAgICBpZiggIWZpcnN0ICkge1xuICAgICAgICBmaXJzdCA9IHR3ZWVuO1xuICAgICAgfVxuICAgICAgbGFzdCA9IHR3ZWVuO1xuICAgIH1cblxuICAgIGlmKCBkb0xvb3AgKSB7XG4gICAgICBsYXN0LmNoYWluKGZpcnN0KTtcbiAgICB9XG5cbiAgICB0aGlzLnR3ZWVuID0gZmlyc3Q7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcGxheTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5idWlsZChvcHRpb25zKTtcbiAgICB2YXIgZmlyc3QgPSB0aGlzLnR3ZWVuO1xuICAgIHZhciB0aW1lID0gb3B0aW9ucy50cmFuc2l0aW9uO1xuICAgIGlmKCB0aW1lICkge1xuICAgICAgZHQgPSBkdCB8fCAwO1xuICAgICAgdmFyIGZyYW1lID0gdGhpcy5mcmFtZXNbIHRoaXMuY3Vyc29yICUgdGhpcy5mcmFtZXMubGVuZ3RoIF07XG4gICAgICB2YXIgc3RhdHVzID0gdGhpcy5zcHJpdGVTdGF0dXMoKTtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnR3ZWVuID0gbmV3IFR3ZWVuKGZvcm1hdChzdGF0dXMpKVxuICAgICAgLnRvKGZvcm1hdChmcmFtZSksdGltZSlcbiAgICAgIC5kZWxheShvcHRpb25zLmRlbGF5fHwwKVxuICAgICAgLmVhc2luZyhjdXJ2ZSlcbiAgICAgIC5vblVwZGF0ZSh0aGlzLnVwZGF0ZSlcbiAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgICAgIF90aGlzLnR3ZWVuID0gZmlyc3Q7XG4gICAgICAgIGZpcnN0LnN0YXJ0KCk7XG4gICAgICB9KS5vblN0b3AoZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMudHdlZW4gPSBmaXJzdDtcbiAgICAgIH0pLnN0YXJ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0LnN0YXJ0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnR3ZWVuLnN0b3AoKTtcbiAgICB0aGlzLnR3ZWVuLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG4gICAgdGhpcy5jdXJzb3IgPSAodGhpcy5jdXJzb3IrMSkldGhpcy5mcmFtZXMubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBzcHJpdGVTdGF0dXM6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnNwcml0ZS5wb3NpdGlvbixcbiAgICAgIHJvdGF0aW9uOiB0aGlzLnNwcml0ZS5yb3RhdGlvbiAqIHJ0b2RcbiAgICB9O1xuICB9LFxuICBvbkZyYW1lOiBmdW5jdGlvbihjYil7XG4gICAgdGhpcy5vbmZyYW1lID0gY2I7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGp1bXBUbzogZnVuY3Rpb24oaSl7XG4gICAgaSA9IGkgfHwgMDtcbiAgICB2YXIgZnJhbWUgPSB0aGlzLmZyYW1lc1tpXTtcbiAgICB0aGlzLmN1cnNvciA9IChpKzEpICUgdGhpcy5mcmFtZXMubGVuZ3RoO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IGZyYW1lLnBvc2l0aW9uLng7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSBmcmFtZS5wb3NpdGlvbi55O1xuICAgIHNwcml0ZS5yb3RhdGlvbiA9IGZyYW1lLnJvdGF0aW9uICogZHRvcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVwZWF0OiBmdW5jdGlvbih0aW1lcyl7XG4gICAgdmFyIGZyYW1lcyA9IFtdLmNvbmNhdCh0aGlzLmZyYW1lcyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpICs9IDEgKXtcbiAgICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KGZyYW1lcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjaGFpbjogZnVuY3Rpb24ob3RoZXIpe1xuICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KG90aGVyLmZyYW1lcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKHRoaXMuc3ByaXRlLFtdLmNvbmNhdCh0aGlzLmZyYW1lcykpO1xuICB9XG59O1xuXG5BbmltYXRpb24ubG9hZEFsbCA9IGZ1bmN0aW9uKHNwcml0ZSxzaGVldCl7XG4gIHZhciBhbmltcyA9IHt9O1xuICBPYmplY3Qua2V5cyhzaGVldCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICBhbmltc1tuYW1lXSA9IG5ldyBBbmltYXRpb24oc3ByaXRlLHNoZWV0W25hbWVdKTtcbiAgfSk7XG4gIHJldHVybiBhbmltcztcbn07XG5cbkFuaW1hdGlvbi5saW5rID0gZnVuY3Rpb24obGlzdCl7XG4gIHZhciBsaW5rID0gbmV3IEFuaW1hdGlvbihsaXN0WzBdLnNwcml0ZSk7XG4gIGxpc3QuZm9yRWFjaChmdW5jdGlvbihhbmltKXtcbiAgICBsaW5rLmZyYW1lcyA9IGxpbmsuZnJhbWVzLmNvbmNhdChhbmltLmZyYW1lcyk7XG4gIH0pO1xuICByZXR1cm4gbGluaztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjQwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTIsXG4gICAgZHVyYXRpb246IDMwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI2MCxcbiAgICAgIHk6IDY1MFxuICAgIH0sXG4gICAgcm90YXRpb246IDYsXG4gICAgZHVyYXRpb246IDMwMFxuICB9XG4gIF0sXG4gIHJlc3Q6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNTAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxNyxcbiAgICBkdXJhdGlvbjogNzAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjUwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTcsXG4gICAgZHVyYXRpb246IDEwMDBcbiAgfSxcblxuICBdXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNDg4LFxuICAgICAgeTogNjczXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzUwLFxuICAgIGR1cmF0aW9uOiAyMDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOsKge1xuICAgICAgeDogNDY4LFxuICAgICAgeTogNjY4XG4gICAgfSxcbiAgICByb3RhdGlvbjogMzU1LFxuICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgZGVsYXk6IDE1MFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246wqB7XG4gICAgICB4OiA1MDAsXG4gICAgICB5OiA2NjBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNDMsXG4gICAgZHVyYXRpb246IDM1MFxuICB9LFxuICBdLFxuXG4gIG1vdXNlOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNTU0LFxuICAgICAgeTogNjczXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzY4LFxuICAgIGR1cmF0aW9uOiA0MDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA1NTYsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNjgsXG4gICAgZHVyYXRpb246IDUwMFxuICB9XG4gIF1cblxufTtcbiJdfQ==
