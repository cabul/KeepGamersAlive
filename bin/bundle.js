(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cabul/github/KeepGamersAlive/src/animationhandler.js":[function(require,module,exports){
(function (global){
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var Tween = TWEEN.Tween;
var default_curve = TWEEN.Easing.Linear.None;
var dtor = Math.PI / 180;
var rtod = 180 / Math.PI;

var AnimationHandler = function(sprite,animations){

  this.sprite = sprite;
  this.animations = animations;
  this.cursor = 0;
  this.frames = [];
};

var format = function( info ){
  return {
    posx: info.position.x || 0,
    posy: info.position.y || 0,
    rot: (info.rotation * dtor)
  };
};

AnimationHandler.prototype = {

  constructor: AnimationHandler,
  makeTween: function(from,next){
    var tween = new Tween(format(from));
    var _this = this;
    var sprite = this.sprite;
    tween.to(format(next),next.duration||1000);
    tween.delay(next.delay||0);
    tween.easing(next.curve || default_curve);
    tween.onUpdate(function(){
      sprite.position.x = this.posx;
      sprite.position.y = this.posy;
      sprite.rotation = this.rot;
    });
    return tween;
  },
  buildFrame: function(i){
    var anim = this.animation;
    var len = anim.length;
    i = i%len;
    var j = (i+1)%len;
    var frame = anim[i];
    var next = anim[j];
    var _this = this;
    var tween = this.makeTween(frame,next);
    tween.onComplete(function(){
      console.log( 'Frame '+i+' finished' );
      _this.cursor = j;
      _this.buildFrame(i);
      _this.frames[j].start();
    });
    this.frames[i] = tween;
    return this;
  },
  load: function(name){
    var anim = this.animations[name];
    if( anim === undefined ) {
      throw 'Animation '+ name +' unknown';
    }
    this.animation = anim;
    var _this = this;
    var len = anim.length;
    var sprite = this.sprite;
    this.setCursor(0);
    return this;
  },
  setCursor: function(cursor){
    var len = this.animation.length;
    this.cursor = cursor % len;
    for( i = cursor; i <= cursor + len; i += 1) {
      this.buildFrame(i);
    }
    return this;
  },
  play: function(){
    var tween = this.tween;
    if( tween ) {
      tween.stop();
    }
    var first = this.animation[ this.cursor ];
    var _this = this;
    var i, len = this.animation.length;
    var sprite = this.sprite;
    tween = this.makeTween({
      position: this.sprite.position,
      rotation: this.sprite.rotation * rtod
    },first);
    var cursor = this.cursor;
    this._cursor = -1;
    tween.onComplete(function(){
      _this.frames[cursor].start();
    });
    this.tween = tween;
    tween.start();
    return this;
  },
  pause: function(){
    var tween = this.tween;
    if( tween ) {
      tween.stop();
      tween = false;
    }
    this.frames[this.cursor].stop();
    this.setCursor((this.cursor+1) % this.animation.length);
    return this;
  },
  setFrame: function(i){
    var frame = this.animation[ i % this.animation.length ];
    var sprite = this.sprite;
    sprite.position.x = frame.position.x || 0;
    sprite.position.y = frame.position.y || 0;
    sprite.rotation = frame.rotation * dtor || 0;
    return this;
  }

};

module.exports = AnimationHandler;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js":[function(require,module,exports){
(function (global){
var easing = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null).Easing;

module.exports = {
  basic: [
  {
    position: {
      x: 245,
      y: 387
    },
    rotation: 34,
    curve: easing.Cubic.InOut,
    duration: 500
  },
  {
    position: {
      x: 250,
      y: 387
    },
    rotation: 30,
    curve: easing.Cubic.InOut,
    duration: 500
  },
  {
    delay: 100,
    position: {
      x: 240,
      y: 380
    },
    rotation: 23,
    curve: easing.Cubic.InOut,
    duration: 500
  },
  {
    position: {
      x: 250,
      y: 387
    },
    rotation: 30,
    curve: easing.Cubic.InOut,
    duration: 500
  }
  ]
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animationhandler":"/Users/cabul/github/KeepGamersAlive/src/animationhandler.js","./animations/leftarm":"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js"}]},{},["/Users/cabul/github/KeepGamersAlive"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uaGFuZGxlci5qcyIsInNyYy9hbmltYXRpb25zL2xlZnRhcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIFRXRUVOID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgVHdlZW4gPSBUV0VFTi5Ud2VlbjtcbnZhciBkZWZhdWx0X2N1cnZlID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xudmFyIGR0b3IgPSBNYXRoLlBJIC8gMTgwO1xudmFyIHJ0b2QgPSAxODAgLyBNYXRoLlBJO1xuXG52YXIgQW5pbWF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKHNwcml0ZSxhbmltYXRpb25zKXtcblxuICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcbiAgdGhpcy5hbmltYXRpb25zID0gYW5pbWF0aW9ucztcbiAgdGhpcy5jdXJzb3IgPSAwO1xuICB0aGlzLmZyYW1lcyA9IFtdO1xufTtcblxudmFyIGZvcm1hdCA9IGZ1bmN0aW9uKCBpbmZvICl7XG4gIHJldHVybiB7XG4gICAgcG9zeDogaW5mby5wb3NpdGlvbi54IHx8wqAwLFxuICAgIHBvc3k6IGluZm8ucG9zaXRpb24ueSB8fCAwLFxuICAgIHJvdDogKGluZm8ucm90YXRpb24gKiBkdG9yKVxuICB9O1xufTtcblxuQW5pbWF0aW9uSGFuZGxlci5wcm90b3R5cGUgPSB7XG5cbiAgY29uc3RydWN0b3I6IEFuaW1hdGlvbkhhbmRsZXIsXG4gIG1ha2VUd2VlbjogZnVuY3Rpb24oZnJvbSxuZXh0KXtcbiAgICB2YXIgdHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KGZyb20pKTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICB0d2Vlbi50byhmb3JtYXQobmV4dCksbmV4dC5kdXJhdGlvbnx8MTAwMCk7XG4gICAgdHdlZW4uZGVsYXkobmV4dC5kZWxheXx8MCk7XG4gICAgdHdlZW4uZWFzaW5nKG5leHQuY3VydmUgfHwgZGVmYXVsdF9jdXJ2ZSk7XG4gICAgdHdlZW4ub25VcGRhdGUoZnVuY3Rpb24oKXtcbiAgICAgIHNwcml0ZS5wb3NpdGlvbi54ID0gdGhpcy5wb3N4O1xuICAgICAgc3ByaXRlLnBvc2l0aW9uLnkgPSB0aGlzLnBvc3k7XG4gICAgICBzcHJpdGUucm90YXRpb24gPSB0aGlzLnJvdDtcbiAgICB9KTtcbiAgICByZXR1cm4gdHdlZW47XG4gIH0sXG4gIGJ1aWxkRnJhbWU6IGZ1bmN0aW9uKGkpe1xuICAgIHZhciBhbmltID0gdGhpcy5hbmltYXRpb247XG4gICAgdmFyIGxlbiA9IGFuaW0ubGVuZ3RoO1xuICAgIGkgPSBpJWxlbjtcbiAgICB2YXIgaiA9IChpKzEpJWxlbjtcbiAgICB2YXIgZnJhbWUgPSBhbmltW2ldO1xuICAgIHZhciBuZXh0ID0gYW5pbVtqXTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciB0d2VlbiA9IHRoaXMubWFrZVR3ZWVuKGZyYW1lLG5leHQpO1xuICAgIHR3ZWVuLm9uQ29tcGxldGUoZnVuY3Rpb24oKXtcbiAgICAgIGNvbnNvbGUubG9nKCAnRnJhbWUgJytpKycgZmluaXNoZWQnICk7XG4gICAgICBfdGhpcy5jdXJzb3IgPSBqO1xuICAgICAgX3RoaXMuYnVpbGRGcmFtZShpKTtcbiAgICAgIF90aGlzLmZyYW1lc1tqXS5zdGFydCgpO1xuICAgIH0pO1xuICAgIHRoaXMuZnJhbWVzW2ldID0gdHdlZW47XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHZhciBhbmltID0gdGhpcy5hbmltYXRpb25zW25hbWVdO1xuICAgIGlmKCBhbmltID09PSB1bmRlZmluZWQgKSB7XG4gICAgICB0aHJvdyAnQW5pbWF0aW9uICcrIG5hbWUgKycgdW5rbm93bic7XG4gICAgfVxuICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBhbmltLmxlbmd0aDtcbiAgICB2YXIgc3ByaXRlID0gdGhpcy5zcHJpdGU7XG4gICAgdGhpcy5zZXRDdXJzb3IoMCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNldEN1cnNvcjogZnVuY3Rpb24oY3Vyc29yKXtcbiAgICB2YXIgbGVuID0gdGhpcy5hbmltYXRpb24ubGVuZ3RoO1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yICUgbGVuO1xuICAgIGZvciggaSA9IGN1cnNvcjsgaSA8PSBjdXJzb3IgKyBsZW47IGkgKz0gMSkge1xuICAgICAgdGhpcy5idWlsZEZyYW1lKGkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcGxheTogZnVuY3Rpb24oKXtcbiAgICB2YXIgdHdlZW4gPSB0aGlzLnR3ZWVuO1xuICAgIGlmKCB0d2VlbiApIHtcbiAgICAgIHR3ZWVuLnN0b3AoKTtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gdGhpcy5hbmltYXRpb25bIHRoaXMuY3Vyc29yIF07XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgaSwgbGVuID0gdGhpcy5hbmltYXRpb24ubGVuZ3RoO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICB0d2VlbiA9IHRoaXMubWFrZVR3ZWVuKHtcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnNwcml0ZS5wb3NpdGlvbixcbiAgICAgIHJvdGF0aW9uOiB0aGlzLnNwcml0ZS5yb3RhdGlvbiAqIHJ0b2RcbiAgICB9LGZpcnN0KTtcbiAgICB2YXIgY3Vyc29yID0gdGhpcy5jdXJzb3I7XG4gICAgdGhpcy5fY3Vyc29yID0gLTE7XG4gICAgdHdlZW4ub25Db21wbGV0ZShmdW5jdGlvbigpe1xuICAgICAgX3RoaXMuZnJhbWVzW2N1cnNvcl0uc3RhcnQoKTtcbiAgICB9KTtcbiAgICB0aGlzLnR3ZWVuID0gdHdlZW47XG4gICAgdHdlZW4uc3RhcnQoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcGF1c2U6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHR3ZWVuID0gdGhpcy50d2VlbjtcbiAgICBpZiggdHdlZW4gKSB7XG4gICAgICB0d2Vlbi5zdG9wKCk7XG4gICAgICB0d2VlbiA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmZyYW1lc1t0aGlzLmN1cnNvcl0uc3RvcCgpO1xuICAgIHRoaXMuc2V0Q3Vyc29yKCh0aGlzLmN1cnNvcisxKSAlIHRoaXMuYW5pbWF0aW9uLmxlbmd0aCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNldEZyYW1lOiBmdW5jdGlvbihpKXtcbiAgICB2YXIgZnJhbWUgPSB0aGlzLmFuaW1hdGlvblsgaSAlIHRoaXMuYW5pbWF0aW9uLmxlbmd0aCBdO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IGZyYW1lLnBvc2l0aW9uLnggfHwgMDtcbiAgICBzcHJpdGUucG9zaXRpb24ueSA9IGZyYW1lLnBvc2l0aW9uLnkgfHwgMDtcbiAgICBzcHJpdGUucm90YXRpb24gPSBmcmFtZS5yb3RhdGlvbiAqIGR0b3IgfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbkhhbmRsZXI7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBlYXNpbmcgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKS5FYXNpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiYXNpYzogW1xuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI0NSxcbiAgICAgIHk6IDM4N1xuICAgIH0sXG4gICAgcm90YXRpb246IDM0LFxuICAgIGN1cnZlOiBlYXNpbmcuQ3ViaWMuSW5PdXQsXG4gICAgZHVyYXRpb246IDUwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI1MCxcbiAgICAgIHk6IDM4N1xuICAgIH0sXG4gICAgcm90YXRpb246IDMwLFxuICAgIGN1cnZlOiBlYXNpbmcuQ3ViaWMuSW5PdXQsXG4gICAgZHVyYXRpb246IDUwMFxuICB9LFxuICB7XG4gICAgZGVsYXk6IDEwMCxcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjQwLFxuICAgICAgeTogMzgwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMjMsXG4gICAgY3VydmU6IGVhc2luZy5DdWJpYy5Jbk91dCxcbiAgICBkdXJhdGlvbjogNTAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjUwLFxuICAgICAgeTogMzg3XG4gICAgfSxcbiAgICByb3RhdGlvbjogMzAsXG4gICAgY3VydmU6IGVhc2luZy5DdWJpYy5Jbk91dCxcbiAgICBkdXJhdGlvbjogNTAwXG4gIH1cbiAgXVxufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIl19
