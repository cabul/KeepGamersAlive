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
  basic: [
  {
    position: {
      x: 220,
      y: 670
    },
    rotation: 20,
    duration: 1000
  },
  {
    position: {
      x: 220,
      y: 670
    },
    rotation: 20,
    duration: 1000
  },
  {
    position: {
      x: 200,
      y: 640
    },
    rotation: 40,
    duration: 1000,
    delay: 2000
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

var armFolder = gui.addFolder('Left Arm');
armFolder.add(leftArm.position,'x',-200,1000).name('Position X');
armFolder.add(leftArm.position,'y',-200,1000).name('Position Y');

// var rightArm = pixi.Sprite.fromImage('img/right_arm.png');

stage.addChild( leftArm );
// container.addChild( leftArm );

var Animation = require('./animation');

var anim = new Animation(leftArm,require('./animations/leftarm').basic);


anim.build({
  loop: true,
  onframe: function(i){
    console.log(i+' finished');
  },
  mode: Animation.Delta
}).start();

requestAnimFrame( function render(){

  requestAnimFrame(render);

  renderer.render(stage);
  tween.update();

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":"/Users/cabul/github/KeepGamersAlive/src/animation.js","./animations/leftarm":"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js"}]},{},["/Users/cabul/github/KeepGamersAlive"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uLmpzIiwic3JjL2FuaW1hdGlvbnMvbGVmdGFybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBUV0VFTiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRXRUVOIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5UV0VFTiA6IG51bGwpO1xudmFyIFR3ZWVuID0gVFdFRU4uVHdlZW47XG52YXIgY3VydmUgPSBUV0VFTi5FYXNpbmcuU2ludXNvaWRhbC5Jbk91dDtcbnZhciBkdG9yID0gTWF0aC5QSSAvIDE4MDtcbnZhciBydG9kID0gMTgwIC8gTWF0aC5QSTtcblxudmFyIEFuaW1hdGlvbiA9IGZ1bmN0aW9uKHNwcml0ZSxmcmFtZXMpe1xuXG4gIHRoaXMuZnJhbWVzID0gZnJhbWVzIHx8IFtdO1xuICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgIHNwcml0ZS5wb3NpdGlvbi54ID0gdGhpcy5wb3N4O1xuICAgIHNwcml0ZS5wb3NpdGlvbi55ID0gdGhpcy5wb3N5O1xuICAgIHNwcml0ZS5yb3RhdGlvbiA9IHRoaXMucm90O1xuICB9O1xuXG59O1xuXG52YXIgZm9ybWF0ID0gZnVuY3Rpb24oIGZyYW1lICl7XG4gIHJldHVybiB7XG4gICAgcG9zeDogZnJhbWUucG9zaXRpb24ueCB8fCAwLFxuICAgIHBvc3k6IGZyYW1lLnBvc2l0aW9uLnkgfHwgMCxcbiAgICByb3Q6IChmcmFtZS5yb3RhdGlvbnx8MCkgKiBkdG9yXG4gIH07XG59O1xuXG5BbmltYXRpb24ucHJvdG90eXBlID0ge1xuXG4gIGNvbnN0cnVjdG9yOiBBbmltYXRpb24sXG4gIGJ1aWxkOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZnJhbWVzID0gdGhpcy5mcmFtZXM7XG4gICAgdmFyIGxlbiA9IGZyYW1lcy5sZW5ndGg7XG4gICAgdmFyIGRvTG9vcCA9IG9wdGlvbnMubG9vcCB8fCBmYWxzZTtcbiAgICBvcHRpb25zLm9mZnNldCA9IG9wdGlvbnMub2Zmc2V0IHx8IDA7XG4gICAgdmFyIGkgPSBvcHRpb25zLm9mZnNldDtcbiAgICB2YXIgdHJhbnMgPSBvcHRpb25zLnRyYW5zaXRpb247XG4gICAgdmFyIG9uZnJhbWUgPSBvcHRpb25zLm9uZnJhbWUgfHwgZnVuY3Rpb24oKXt9O1xuXG4gICAgdmFyIGxhc3QsIGZpcnN0LCB0d2VlbiwgZnJhbWU7XG5cbiAgICB2YXIgbWF4ID0gaSArIGxlbjtcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uKGYpe1xuICAgICAgdmFyIGZvcm0gPSBmb3JtYXQoZnJhbWVzW2ZdKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnBvc3ggPSBmb3JtLnBvc3g7XG4gICAgICAgIHRoaXMucG9zeSA9IGZvcm0ucG9zeTtcbiAgICAgICAgdGhpcy5yb3QgPSBmb3JtLnJvdDtcbiAgICAgICAgb25mcmFtZS5jYWxsKGZyYW1lcyxmKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHdoaWxlKCBpIDwgbWF4KSB7XG4gICAgICBmcmFtZSA9IGZyYW1lc1tpJWxlbl07XG4gICAgICB0d2VlbiA9IG5ldyBUd2Vlbihmb3JtYXQoZnJhbWUpKTtcbiAgICAgIHZhciBvbmNvbXBsZXRlID0gY29tcGxldGUoaSVsZW4pO1xuICAgICAgaSA9IGkgKyAxO1xuICAgICAgdmFyIG5leHQgPSBmcmFtZXNbaSVsZW5dO1xuICAgICAgdHdlZW4udG8oZm9ybWF0KG5leHQpLG5leHQuZHVyYXRpb258fDEwMDApXG4gICAgICAuZGVsYXkobmV4dC5kZWxheXx8MClcbiAgICAgIC5lYXNpbmcoY3VydmUpXG4gICAgICAub25VcGRhdGUodGhpcy51cGRhdGUpLm9uQ29tcGxldGUob25jb21wbGV0ZSk7XG4gICAgICBpZiggISFsYXN0ICkge1xuICAgICAgICBsYXN0LmNoYWluKHR3ZWVuKTtcbiAgICAgIH1cbiAgICAgIGlmKCAhZmlyc3QgKSB7XG4gICAgICAgIGZpcnN0ID0gdHdlZW47XG4gICAgICB9XG4gICAgICBsYXN0ID0gdHdlZW47XG4gICAgfVxuXG4gICAgaWYoIGRvTG9vcCApIHtcbiAgICAgIGxhc3QuY2hhaW4oZmlyc3QpO1xuICAgIH1cblxuICAgIGlmKCAhIXRyYW5zICkge1xuICAgICAgZnJhbWUgPSBmcmFtZXNbIG9wdGlvbnMub2Zmc2V0ICUgbGVuIF07XG4gICAgICB2YXIgc3RhdHVzID0gdGhpcy5zcHJpdGVTdGF0dXMoKTtcbiAgICAgIHR3ZWVuID0gbmV3IFR3ZWVuKGZvcm1hdChzdGF0dXMpKTtcbiAgICAgIHR3ZWVuLnRvKGZvcm1hdChmcmFtZSksdHJhbnMuZHVyYXRpb258fDEwMDApXG4gICAgICAuZGVsYXkodHJhbnMuZGVsYXl8fDApXG4gICAgICAuZWFzaW5nKGN1cnZlKVxuICAgICAgLm9uVXBkYXRlKHRoaXMudXBkYXRlKVxuICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXtcbiAgICAgICAgZmlyc3Quc3RhcnQoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0d2VlbiA9IGZpcnN0O1xuICAgIH1cblxuICAgIHJldHVybiB0d2VlbjtcbiAgfSxcbiAgc3ByaXRlU3RhdHVzOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogdGhpcy5zcHJpdGUucG9zaXRpb24sXG4gICAgICByb3RhdGlvbjogdGhpcy5zcHJpdGUucm90YXRpb24gKiBydG9kXG4gICAgfTtcbiAgfSxcbiAganVtcFRvOiBmdW5jdGlvbihpKXtcbiAgICBpID0gaSB8fCAwO1xuICAgIHZhciBmcmFtZSA9IHRoaXMuZnJhbWVzW2ldO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IGZyYW1lLnBvc2l0aW9uLng7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSBmcmFtZS5wb3NpdGlvbi55O1xuICAgIHNwcml0ZS5yb3RhdGlvbiA9IGZyYW1lLnJvdGF0aW9uICogZHRvcjtcbiAgfVxufTtcblxuQW5pbWF0aW9uLmxvYWRBbGwgPSBmdW5jdGlvbihzcHJpdGUsc2hlZXQpe1xuICB2YXIgYW5pbXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoc2hlZXQpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgYW5pbXNbbmFtZV0gPSBuZXcgQW5pbWF0aW9uKHNwcml0ZSxzaGVldFtuYW1lXSk7XG4gIH0pO1xuICByZXR1cm4gYW5pbXM7XG59O1xuXG5BbmltYXRpb24ubGluayA9IGZ1bmN0aW9uKGxpc3Qpe1xuICB2YXIgbGluayA9IG5ldyBBbmltYXRpb24obGlzdFswXS5zcHJpdGUpO1xuICBsaXN0LmZvckVhY2goZnVuY3Rpb24oYW5pbSl7XG4gICAgbGluay5mcmFtZXMgPSBsaW5rLmZyYW1lcy5jb25jYXQoYW5pbS5mcmFtZXMpO1xuICB9KTtcbiAgcmV0dXJuIGxpbms7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJhc2ljOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjIwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMjAsXG4gICAgZHVyYXRpb246IDEwMDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyMjAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAyMCxcbiAgICBkdXJhdGlvbjogMTAwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDIwMCxcbiAgICAgIHk6IDY0MFxuICAgIH0sXG4gICAgcm90YXRpb246IDQwLFxuICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgIGRlbGF5OiAyMDAwXG4gIH1cbiAgXVxufTtcbiJdfQ==
