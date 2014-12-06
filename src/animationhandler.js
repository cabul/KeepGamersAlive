var TWEEN = require('tween');
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
