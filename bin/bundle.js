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
    options = options || {};
    var frames = this.frames;
    var len = frames.length;
    var doLoop = options.loop || false;
    options.offset = options.offset || 0;
    var i = options.offset;
    var trans = options.transition;
    var onframe = options.onframe || function(){};

    var last, first, tween, frame;

    var max = i + len;

    var complete = function(f){
      var form = format(frames[f]);
      return function(){
        this.posx = form.posx;
        this.posy = form.posy;
        this.rot = form.rot;
        onframe.call(frames,f);
      };
    };

    while( i < max) {
      frame = frames[i%len];
      tween = new Tween(format(frame));
      var oncomplete = complete(i%len);
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

    if( !!trans ) {
      frame = frames[ options.offset % len ];
      var status = this.spriteStatus();
      tween = new Tween(format(status));
      tween.to(format(frame),trans.duration||1000)
      .delay(trans.delay||0)
      .easing(curve)
      .onUpdate(this.update)
      .onComplete(function(){
        first.start();
      });
    } else {
      tween = first;
    }

    return tween;
  },
  spriteStatus: function(){
    return {
      position: this.sprite.position,
      rotation: this.sprite.rotation * rtod
    };
  },
  jumpTo: function(i){
    i = i || 0;
    var frame = this.frames[i];
    var sprite = this.sprite;
    sprite.position.x = frame.position.x;
    sprite.position.y = frame.position.y;
    sprite.rotation = frame.rotation * dtor;
    return frame;
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":"/Users/cabul/github/KeepGamersAlive/src/animation.js","./animations/leftarm":"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js"}]},{},["/Users/cabul/github/KeepGamersAlive"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uLmpzIiwic3JjL2FuaW1hdGlvbnMvbGVmdGFybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIFRXRUVOID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgVHdlZW4gPSBUV0VFTi5Ud2VlbjtcbnZhciBjdXJ2ZSA9IFRXRUVOLkVhc2luZy5TaW51c29pZGFsLkluT3V0O1xudmFyIGR0b3IgPSBNYXRoLlBJIC8gMTgwO1xudmFyIHJ0b2QgPSAxODAgLyBNYXRoLlBJO1xuXG52YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24oc3ByaXRlLGZyYW1lcyl7XG5cbiAgdGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgW107XG4gIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnggPSB0aGlzLnBvc3g7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSB0aGlzLnBvc3k7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gdGhpcy5yb3Q7XG4gIH07XG5cbn07XG5cbnZhciBmb3JtYXQgPSBmdW5jdGlvbiggZnJhbWUgKXtcbiAgcmV0dXJuIHtcbiAgICBwb3N4OiBmcmFtZS5wb3NpdGlvbi54IHx8IDAsXG4gICAgcG9zeTogZnJhbWUucG9zaXRpb24ueSB8fCAwLFxuICAgIHJvdDogKGZyYW1lLnJvdGF0aW9ufHwwKSAqIGR0b3JcbiAgfTtcbn07XG5cbkFuaW1hdGlvbi5wcm90b3R5cGUgPSB7XG5cbiAgY29uc3RydWN0b3I6IEFuaW1hdGlvbixcbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBmcmFtZXMgPSB0aGlzLmZyYW1lcztcbiAgICB2YXIgbGVuID0gZnJhbWVzLmxlbmd0aDtcbiAgICB2YXIgZG9Mb29wID0gb3B0aW9ucy5sb29wIHx8IGZhbHNlO1xuICAgIG9wdGlvbnMub2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQgfHwgMDtcbiAgICB2YXIgaSA9IG9wdGlvbnMub2Zmc2V0O1xuICAgIHZhciB0cmFucyA9IG9wdGlvbnMudHJhbnNpdGlvbjtcbiAgICB2YXIgb25mcmFtZSA9IG9wdGlvbnMub25mcmFtZSB8fCBmdW5jdGlvbigpe307XG5cbiAgICB2YXIgbGFzdCwgZmlyc3QsIHR3ZWVuLCBmcmFtZTtcblxuICAgIHZhciBtYXggPSBpICsgbGVuO1xuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24oZil7XG4gICAgICB2YXIgZm9ybSA9IGZvcm1hdChmcmFtZXNbZl0pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMucG9zeCA9IGZvcm0ucG9zeDtcbiAgICAgICAgdGhpcy5wb3N5ID0gZm9ybS5wb3N5O1xuICAgICAgICB0aGlzLnJvdCA9IGZvcm0ucm90O1xuICAgICAgICBvbmZyYW1lLmNhbGwoZnJhbWVzLGYpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2hpbGUoIGkgPCBtYXgpIHtcbiAgICAgIGZyYW1lID0gZnJhbWVzW2klbGVuXTtcbiAgICAgIHR3ZWVuID0gbmV3IFR3ZWVuKGZvcm1hdChmcmFtZSkpO1xuICAgICAgdmFyIG9uY29tcGxldGUgPSBjb21wbGV0ZShpJWxlbik7XG4gICAgICBpID0gaSArIDE7XG4gICAgICB2YXIgbmV4dCA9IGZyYW1lc1tpJWxlbl07XG4gICAgICB0d2Vlbi50byhmb3JtYXQobmV4dCksbmV4dC5kdXJhdGlvbnx8MTAwMClcbiAgICAgIC5kZWxheShuZXh0LmRlbGF5fHwwKVxuICAgICAgLmVhc2luZyhjdXJ2ZSlcbiAgICAgIC5vblVwZGF0ZSh0aGlzLnVwZGF0ZSkub25Db21wbGV0ZShvbmNvbXBsZXRlKTtcbiAgICAgIGlmKCAhIWxhc3QgKSB7XG4gICAgICAgIGxhc3QuY2hhaW4odHdlZW4pO1xuICAgICAgfVxuICAgICAgaWYoICFmaXJzdCApIHtcbiAgICAgICAgZmlyc3QgPSB0d2VlbjtcbiAgICAgIH1cbiAgICAgIGxhc3QgPSB0d2VlbjtcbiAgICB9XG5cbiAgICBpZiggZG9Mb29wICkge1xuICAgICAgbGFzdC5jaGFpbihmaXJzdCk7XG4gICAgfVxuXG4gICAgaWYoICEhdHJhbnMgKSB7XG4gICAgICBmcmFtZSA9IGZyYW1lc1sgb3B0aW9ucy5vZmZzZXQgJSBsZW4gXTtcbiAgICAgIHZhciBzdGF0dXMgPSB0aGlzLnNwcml0ZVN0YXR1cygpO1xuICAgICAgdHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KHN0YXR1cykpO1xuICAgICAgdHdlZW4udG8oZm9ybWF0KGZyYW1lKSx0cmFucy5kdXJhdGlvbnx8MTAwMClcbiAgICAgIC5kZWxheSh0cmFucy5kZWxheXx8MClcbiAgICAgIC5lYXNpbmcoY3VydmUpXG4gICAgICAub25VcGRhdGUodGhpcy51cGRhdGUpXG4gICAgICAub25Db21wbGV0ZShmdW5jdGlvbigpe1xuICAgICAgICBmaXJzdC5zdGFydCgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR3ZWVuID0gZmlyc3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR3ZWVuO1xuICB9LFxuICBzcHJpdGVTdGF0dXM6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnNwcml0ZS5wb3NpdGlvbixcbiAgICAgIHJvdGF0aW9uOiB0aGlzLnNwcml0ZS5yb3RhdGlvbiAqIHJ0b2RcbiAgICB9O1xuICB9LFxuICBqdW1wVG86IGZ1bmN0aW9uKGkpe1xuICAgIGkgPSBpIHx8IDA7XG4gICAgdmFyIGZyYW1lID0gdGhpcy5mcmFtZXNbaV07XG4gICAgdmFyIHNwcml0ZSA9IHRoaXMuc3ByaXRlO1xuICAgIHNwcml0ZS5wb3NpdGlvbi54ID0gZnJhbWUucG9zaXRpb24ueDtcbiAgICBzcHJpdGUucG9zaXRpb24ueSA9IGZyYW1lLnBvc2l0aW9uLnk7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gZnJhbWUucm90YXRpb24gKiBkdG9yO1xuICAgIHJldHVybiBmcmFtZTtcbiAgfSxcbiAgcmVwZWF0OiBmdW5jdGlvbih0aW1lcyl7XG4gICAgdmFyIGZyYW1lcyA9IFtdLmNvbmNhdCh0aGlzLmZyYW1lcyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpICs9IDEgKXtcbiAgICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KGZyYW1lcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjaGFpbjogZnVuY3Rpb24ob3RoZXIpe1xuICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KG90aGVyLmZyYW1lcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKHRoaXMuc3ByaXRlLFtdLmNvbmNhdCh0aGlzLmZyYW1lcykpO1xuICB9XG59O1xuXG5BbmltYXRpb24ubG9hZEFsbCA9IGZ1bmN0aW9uKHNwcml0ZSxzaGVldCl7XG4gIHZhciBhbmltcyA9IHt9O1xuICBPYmplY3Qua2V5cyhzaGVldCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICBhbmltc1tuYW1lXSA9IG5ldyBBbmltYXRpb24oc3ByaXRlLHNoZWV0W25hbWVdKTtcbiAgfSk7XG4gIHJldHVybiBhbmltcztcbn07XG5cbkFuaW1hdGlvbi5saW5rID0gZnVuY3Rpb24obGlzdCl7XG4gIHZhciBsaW5rID0gbmV3IEFuaW1hdGlvbihsaXN0WzBdLnNwcml0ZSk7XG4gIGxpc3QuZm9yRWFjaChmdW5jdGlvbihhbmltKXtcbiAgICBsaW5rLmZyYW1lcyA9IGxpbmsuZnJhbWVzLmNvbmNhdChhbmltLmZyYW1lcyk7XG4gIH0pO1xuICByZXR1cm4gbGluaztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjQwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTIsXG4gICAgZHVyYXRpb246IDMwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI2MCxcbiAgICAgIHk6IDY1MFxuICAgIH0sXG4gICAgcm90YXRpb246IDYsXG4gICAgZHVyYXRpb246IDMwMFxuICB9XG4gIF0sXG4gIHJlc3Q6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNTAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxNyxcbiAgICBkdXJhdGlvbjogNzAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjUwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTcsXG4gICAgZHVyYXRpb246IDEwMDBcbiAgfSxcblxuICBdXG59O1xuIl19
