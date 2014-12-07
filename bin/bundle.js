(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function (global){
var gui = require('./debug');
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;

var Alias = {
  left      : 37,
  up        : 38,
  right     : 39,
  down      : 40,
  space     : 32,
  tab       : 9,
  pageup    : 33,
  pagedown  : 34,
  escape    : 27,
  backspace : 8,
  meta      : 91,
  alt       : 18,
  ctrl      : 17,
  shift     : 16,
  enter     : 13,
  f1        : 112,
  f2        : 113,
  f3        : 114,
  f4        : 115,
  f5        : 116,
  f6        : 117,
  f7        : 118,
  f8        : 119,
  f9        : 120,
  f10       : 121,
  f11       : 122,
  f12       : 123
};

var isValidKey = function(k){
  return ( k>=48 && k<=57 ) || ( k>=65 && k<=90 ) || k === Alias.space;
};

var Console = function(){
  DOC.apply(this);
  var bg = new pixi.Graphics();
  this.addChild(bg);
  bg.lineStyle(4,0x000000);
  bg.beginFill(0xffffff);
  bg.drawRect(0,0,496,46);
  this.prefix = '>';
  this.lines = [];
  this.lineno = 0;
  this.buffer = '';
  this.lastLine = '';
  this.cursor = 0;
  this.min = 0;
  this.line = new pixi.Text('>',{font: 'bold 32px VT323'});
  this.line.position.x = 12;
  this.line.position.y = 12;
  this.addChild(this.line);
  this.online = [];
  var _this = this;

  var actions = {};
  actions[Alias.enter] = function(event){
    _this.pushLine();
  };
  actions[Alias.backspace] = function(event){
    event.preventDefault();
    _this.removeChar();
    _this.renderText();
  };
  actions[Alias.left] = function(event){
    event.preventDefault();
    _this.moveCursor(-1);
    _this.renderText();
  };

  actions[Alias.right] = function(event){
    event.preventDefault();
    _this.moveCursor(1);
    _this.renderText();
  };

  actions[Alias.up] = function(event){
    event.preventDefault();
    _this.moveHistory(-1);
    _this.renderText();
  };

  actions[Alias.down] = function(event){
    event.preventDefault();
    _this.moveHistory(1);
    _this.renderText();
  };

  document.body.addEventListener('keydown',function(event){
    var key = event.keyCode || event.which;
    if( isValidKey(key) ) {
      _this.pushChar(String.fromCharCode(key));
    } else {
      var fun = actions[key];
      if(!!fun) {
        fun.call(_this,event);
      }
    }
    _this.renderText();
  });

};

Console.prototype = DOC.prototype;

Console.prototype.renderText = function(){
  this.min = Math.max( this.cursor-32,0 );
  this.line.setText(this.prefix+this.buffer.substr(this.min,32));
  console.log(this);
  console.log(this.buffer);
};

Console.prototype.removeChar = function(){
  var buffer = this.buffer;
  var len = buffer.length;
  var cursor = this.cursor;
  if( cursor > 0 ) {
    this.buffer = buffer.substring(0,cursor-1)+buffer.substring(cursor,len);
    this.cursor -= 1;
  }
};

Console.prototype.pushChar = function(c){
  var cursor = this.cursor;
  var buffer = this.buffer;
  console.log('Buffer',buffer);
  console.log('Char',c);
  this.buffer = buffer.substring(0,cursor) + c + buffer.substring(cursor,buffer.length);
  this.cursor += 1;
};

Console.prototype.moveCursor = function(d){
  var cursor = this.cursor + d;
  var len = this.buffer.length;
  if( cursor >= 0 && cursor <= len ) {
    this.cursor = cursor;
  }
};

Console.prototype.pushLine = function(){
  this.lineno = this.lines.push( this.buffer );
  this.buffer = '';
  this.cursor = 0;
};

Console.prototype.moveHistory = function(d){
  var lineno = this.lineno + d;
  var count = this.lines.length;
  if( lineno === count ) {
    this.buffer = '';
    this.lineno = lineno;
    this.cursor = 0;
  }
  if( lineno >= 0 && lineno < count ) {
    this.buffer = this.lines[lineno];
    this.lineno = lineno;
    this.cursor = this.buffer.length;
  }
};

module.exports = Console;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./debug":5}],5:[function(require,module,exports){
(function (global){
var Gui = (typeof window !== "undefined" ? window.dat.GUI : typeof global !== "undefined" ? global.dat.GUI : null);
var gui = new Gui();
module.exports = gui;
gui.domElement.style.display = 'none';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
exports.load = function(families,callback){

  window.WebFontConfig = {
    google: {
      families: families
    },
    active: callback
  };
  (function(){
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
};

},{}],7:[function(require,module,exports){
(function (global){
var gui = require('./debug');
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Keydoc = require('./keydoc');
var Animation = require('./animation');

var stage = new pixi.Stage(0x66ff44);
var renderer,quit;

module.exports = {

assets: [
'img/background.png',
'img/left_arm.png',
'img/right_arm.png'
],

oninit: function(context) {
  renderer = context.renderer;
  quit = context.quit;

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

  var leftSheet = Animation.loadAll(leftArm,require('./animations/leftarm'));
  var rightSheet = Animation.loadAll(rightArm,require('./animations/rightarm'));

  var leftAnim = Animation.link([
    leftSheet.typing.clone().repeat(4),
    leftSheet.rest
  ]).jumpTo(0).play({loop: true});

  var rightAnim = Animation.link([
    rightSheet.typing.clone().repeat(2),
    rightSheet.mouse,
    rightSheet.typing])
    .jumpTo(0).play({loop:true});


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

  Keydoc.addEventListener('escape',function(){
    quit();
  });

  var Console = require('./console');

  var term = new Console();
  term.position.x = 150;
  term.position.y = 530;
  stage.addChild(term);

},
onframe: function(time,dt){

  renderer.render(stage);
  tween.update();

},
onquit: function(){
  console.log('Exit game');
}

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":1,"./animations/leftarm":2,"./animations/rightarm":3,"./console":4,"./debug":5,"./keydoc":8}],8:[function(require,module,exports){
var alias = {
  'left'  : 37,
  'up'    : 38,
  'right' : 39,
  'down'  : 40,
  'space' : 32,
  'tab'   : 9,
  'pageup'    : 33,
  'pagedown'  : 34,
  'escape'    : 27,
  'backspace' : 8,
  'meta'  : 91,
  'alt'   : 18,
  'ctrl'  : 17,
  'shift' : 16,
  'enter' : 13,
  'f1'  : 112,
  'f2'  : 113,
  'f3'  : 114,
  'f4'  : 115,
  'f5'  : 116,
  'f6'  : 117,
  'f7'  : 118,
  'f8'  : 119,
  'f9'  : 120,
  'f10' : 121,
  'f11' : 122,
  'f12' : 123
};

var listeners = {};

var pressed = {};

document.body.addEventListener('keyup',function(event){
  // event.preventDefault();
  var keyCode = event.keyCode || event.which;
  pressed[keyCode] = false;
},false);

document.body.addEventListener('keydown',function(event){
  // event.preventDefault();
  console.log(event);
  var keyCode = event.keyCode || event.which;
  pressed[keyCode] = true;
  Object.keys(listeners).forEach(function(keys){
    var i,len;
    var arr = keys.split('+');
    for( i = 0, len = arr.length; i < len; i += 1 ) {
      key = arr[i];
      keyCode = alias[key] || key.toUpperCase().charCodeAt(0);
      if( !pressed[keyCode] ) {
        return;
      }
    }
    var prop = true;
    arr = listeners[keys];
    for( i = 0, len = arr.length; i < len && prop; i += 1 ) {
      arr[i].call(null,event);
    }
  });
},false);

exports.addEventListener = function( type, listener ){
  var keys = type.split('+').sort().join('+');
  if( listeners[keys] === undefined ) {
    listeners[keys] = [];
  }
  if( listeners[keys].indexOf(listener) === -1 ) {
    listeners[keys].push(listener);
  }
};

exports.removeEventListener = function( type, listener ){
  var keys = type.split('+').sort().join('+');
  if( listeners[keys] !== undefined ) {
    var index = listeners[keys].indexOf(listener);
    if( index !== -1 ) {
      listeners[keys].splice(index,1);
    }
  }
};

exports.hasEventListener = function( type, listener ){
  var keys = type.split('+').sort().join('+');
  if( listeners[keys] === undefined ) {
    return false;
  }
  if( listeners[keys].indexOf(listener) === -1 ) {
      return false;
  }
  return true;
};

exports.dispatchEvent = function( event ){
  var type = event.type;
  if( listeners[type] === undefined ) {
    return;
  }
  listeners[type].forEach(function(listener){
    listener.call(event);
  });
};

},{}],9:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Fonts = require('./fonts');
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var game = require('./game');

var assets = game.assets || [];

var loader = new pixi.AssetLoader(assets);

var tile = 400 / assets.length;

var loadingBar = new pixi.Graphics();
var loaded = 0;
loadingBar.lineStyle(10,0xffffff);

loadingBar.drawRect(-5,-5,410,50);

loadingBar.lineStyle(0);

loadingBar.position.x = 200;
loadingBar.position.y = 280;

var loadingScreen = new pixi.Stage(0x000000);
var loading = true;

loadingScreen.addChild(loadingBar);

loader.onProgress = function(){
  loadingBar.beginFill( 0xffffff * Math.random() );
  loadingBar.drawRect(tile*loaded,0,tile,40);
  loadingBar.endFill();
  loaded += 1;
};

loader.onComplete = function(){
  loading = false;
};

var text;

Fonts.load(['VT323'],function(){
  text = new pixi.Text('Loading..',{font: '40px VT323',fill:'white'});
  text.position.x = 190;
  text.position.y = 230;
  window.text = text;
  loadingScreen.addChild(text);
  loader.load();
});

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./fonts":6,"./game":7}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uLmpzIiwic3JjL2FuaW1hdGlvbnMvbGVmdGFybS5qcyIsInNyYy9hbmltYXRpb25zL3JpZ2h0YXJtLmpzIiwic3JjL2NvbnNvbGUuanMiLCJzcmMvZGVidWcuanMiLCJzcmMvZm9udHMuanMiLCJzcmMvZ2FtZS5qcyIsInNyYy9rZXlkb2MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgVFdFRU4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKTtcbnZhciBUd2VlbiA9IFRXRUVOLlR3ZWVuO1xudmFyIGN1cnZlID0gVFdFRU4uRWFzaW5nLlNpbnVzb2lkYWwuSW5PdXQ7XG52YXIgZHRvciA9IE1hdGguUEkgLyAxODA7XG52YXIgcnRvZCA9IDE4MCAvIE1hdGguUEk7XG5cbnZhciBBbmltYXRpb24gPSBmdW5jdGlvbihzcHJpdGUsZnJhbWVzKXtcblxuICB0aGlzLmZyYW1lcyA9IGZyYW1lcyB8fCBbXTtcbiAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IHRoaXMucG9zeDtcbiAgICBzcHJpdGUucG9zaXRpb24ueSA9IHRoaXMucG9zeTtcbiAgICBzcHJpdGUucm90YXRpb24gPSB0aGlzLnJvdDtcbiAgfTtcbiAgdGhpcy5jdXJzb3IgPSAwO1xuICB0aGlzLmxvb3AgPSBmYWxzZTtcblxufTtcblxudmFyIGZvcm1hdCA9IGZ1bmN0aW9uKCBmcmFtZSApe1xuICByZXR1cm4ge1xuICAgIHBvc3g6IGZyYW1lLnBvc2l0aW9uLnggfHwgMCxcbiAgICBwb3N5OiBmcmFtZS5wb3NpdGlvbi55IHx8IDAsXG4gICAgcm90OiAoZnJhbWUucm90YXRpb258fDApICogZHRvclxuICB9O1xufTtcblxuQW5pbWF0aW9uLnByb3RvdHlwZSA9IHtcblxuICBjb25zdHJ1Y3RvcjogQW5pbWF0aW9uLFxuICBidWlsZDogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHzCoHt9O1xuICAgIHRoaXMubG9vcCA9IG9wdGlvbnMubG9vcCB8fCB0aGlzLmxvb3A7XG4gICAgdGhpcy5jdXJzb3IgPSBvcHRpb25zLmN1cnNvciB8fCB0aGlzLmN1cnNvcjtcbiAgICB2YXIgZnJhbWVzID0gdGhpcy5mcmFtZXM7XG4gICAgdmFyIGxlbiA9IGZyYW1lcy5sZW5ndGg7XG4gICAgdmFyIGRvTG9vcCA9IHRoaXMubG9vcDtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5jdXJzb3I7XG4gICAgdmFyIGkgPSBvZmZzZXQ7XG4gICAgdmFyIG9uZnJhbWUgPSB0aGlzLm9uZnJhbWU7XG5cbiAgICB2YXIgbGFzdCwgZmlyc3QsIHR3ZWVuLCBmcmFtZTtcblxuICAgIHZhciBtYXggPSBpICsgbGVuO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uKGYpe1xuICAgICAgdmFyIGZvcm0gPSBmb3JtYXQoZnJhbWVzW2ZdKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnBvc3ggPSBmb3JtLnBvc3g7XG4gICAgICAgIHRoaXMucG9zeSA9IGZvcm0ucG9zeTtcbiAgICAgICAgdGhpcy5yb3QgPSBmb3JtLnJvdDtcbiAgICAgICAgaWYoX3RoaXMub25mcmFtZSkge1xuICAgICAgICAgIG9uZnJhbWUuY2FsbChmcmFtZXMsZik7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuY3Vyc29yID0gKGYrMSkgJSBsZW47XG4gICAgICB9O1xuICAgIH07XG5cblxuICAgIHdoaWxlKCBpIDwgbWF4KSB7XG4gICAgICBmcmFtZSA9IGZyYW1lc1tpJWxlbl07XG4gICAgICB0d2VlbiA9IG5ldyBUd2Vlbihmb3JtYXQoZnJhbWUpKTtcbiAgICAgIHZhciBvbmNvbXBsZXRlID0gY29tcGxldGUoaSVsZW4pO1xuICAgICAgdmFyIG9uc3RvcCA9IHN0b3AoaSVsZW4pO1xuICAgICAgaSA9IGkgKyAxO1xuICAgICAgdmFyIG5leHQgPSBmcmFtZXNbaSVsZW5dO1xuICAgICAgdHdlZW4udG8oZm9ybWF0KG5leHQpLG5leHQuZHVyYXRpb258fDEwMDApXG4gICAgICAuZGVsYXkobmV4dC5kZWxheXx8MClcbiAgICAgIC5lYXNpbmcoY3VydmUpXG4gICAgICAub25VcGRhdGUodGhpcy51cGRhdGUpLm9uQ29tcGxldGUob25jb21wbGV0ZSk7XG4gICAgICBpZiggISFsYXN0ICkge1xuICAgICAgICBsYXN0LmNoYWluKHR3ZWVuKTtcbiAgICAgIH1cbiAgICAgIGlmKCAhZmlyc3QgKSB7XG4gICAgICAgIGZpcnN0ID0gdHdlZW47XG4gICAgICB9XG4gICAgICBsYXN0ID0gdHdlZW47XG4gICAgfVxuXG4gICAgaWYoIGRvTG9vcCApIHtcbiAgICAgIGxhc3QuY2hhaW4oZmlyc3QpO1xuICAgIH1cblxuICAgIHRoaXMudHdlZW4gPSBmaXJzdDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwbGF5OiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmJ1aWxkKG9wdGlvbnMpO1xuICAgIHZhciBmaXJzdCA9IHRoaXMudHdlZW47XG4gICAgdmFyIHRpbWUgPSBvcHRpb25zLnRyYW5zaXRpb247XG4gICAgaWYoIHRpbWUgKSB7XG4gICAgICBkdCA9IGR0IHx8IDA7XG4gICAgICB2YXIgZnJhbWUgPSB0aGlzLmZyYW1lc1sgdGhpcy5jdXJzb3IgJSB0aGlzLmZyYW1lcy5sZW5ndGggXTtcbiAgICAgIHZhciBzdGF0dXMgPSB0aGlzLnNwcml0ZVN0YXR1cygpO1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMudHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KHN0YXR1cykpXG4gICAgICAudG8oZm9ybWF0KGZyYW1lKSx0aW1lKVxuICAgICAgLmRlbGF5KG9wdGlvbnMuZGVsYXl8fDApXG4gICAgICAuZWFzaW5nKGN1cnZlKVxuICAgICAgLm9uVXBkYXRlKHRoaXMudXBkYXRlKVxuICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMudHdlZW4gPSBmaXJzdDtcbiAgICAgICAgZmlyc3Quc3RhcnQoKTtcbiAgICAgIH0pLm9uU3RvcChmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy50d2VlbiA9IGZpcnN0O1xuICAgICAgfSkuc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlyc3Quc3RhcnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHBhdXNlOiBmdW5jdGlvbigpe1xuICAgIHRoaXMudHdlZW4uc3RvcCgpO1xuICAgIHRoaXMudHdlZW4uc3RvcENoYWluZWRUd2VlbnMoKTtcbiAgICB0aGlzLmN1cnNvciA9ICh0aGlzLmN1cnNvcisxKSV0aGlzLmZyYW1lcy5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNwcml0ZVN0YXR1czogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246IHRoaXMuc3ByaXRlLnBvc2l0aW9uLFxuICAgICAgcm90YXRpb246IHRoaXMuc3ByaXRlLnJvdGF0aW9uICogcnRvZFxuICAgIH07XG4gIH0sXG4gIG9uRnJhbWU6IGZ1bmN0aW9uKGNiKXtcbiAgICB0aGlzLm9uZnJhbWUgPSBjYjtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAganVtcFRvOiBmdW5jdGlvbihpKXtcbiAgICBpID0gaSB8fCAwO1xuICAgIHZhciBmcmFtZSA9IHRoaXMuZnJhbWVzW2ldO1xuICAgIHRoaXMuY3Vyc29yID0gKGkrMSkgJSB0aGlzLmZyYW1lcy5sZW5ndGg7XG4gICAgdmFyIHNwcml0ZSA9IHRoaXMuc3ByaXRlO1xuICAgIHNwcml0ZS5wb3NpdGlvbi54ID0gZnJhbWUucG9zaXRpb24ueDtcbiAgICBzcHJpdGUucG9zaXRpb24ueSA9IGZyYW1lLnBvc2l0aW9uLnk7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gZnJhbWUucm90YXRpb24gKiBkdG9yO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICByZXBlYXQ6IGZ1bmN0aW9uKHRpbWVzKXtcbiAgICB2YXIgZnJhbWVzID0gW10uY29uY2F0KHRoaXMuZnJhbWVzKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkgKz0gMSApe1xuICAgICAgdGhpcy5mcmFtZXMgPSB0aGlzLmZyYW1lcy5jb25jYXQoZnJhbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNoYWluOiBmdW5jdGlvbihvdGhlcil7XG4gICAgdGhpcy5mcmFtZXMgPSB0aGlzLmZyYW1lcy5jb25jYXQob3RoZXIuZnJhbWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY2xvbmU6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIG5ldyBBbmltYXRpb24odGhpcy5zcHJpdGUsW10uY29uY2F0KHRoaXMuZnJhbWVzKSk7XG4gIH1cbn07XG5cbkFuaW1hdGlvbi5sb2FkQWxsID0gZnVuY3Rpb24oc3ByaXRlLHNoZWV0KXtcbiAgdmFyIGFuaW1zID0ge307XG4gIE9iamVjdC5rZXlzKHNoZWV0KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgIGFuaW1zW25hbWVdID0gbmV3IEFuaW1hdGlvbihzcHJpdGUsc2hlZXRbbmFtZV0pO1xuICB9KTtcbiAgcmV0dXJuIGFuaW1zO1xufTtcblxuQW5pbWF0aW9uLmxpbmsgPSBmdW5jdGlvbihsaXN0KXtcbiAgdmFyIGxpbmsgPSBuZXcgQW5pbWF0aW9uKGxpc3RbMF0uc3ByaXRlKTtcbiAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGFuaW0pe1xuICAgIGxpbmsuZnJhbWVzID0gbGluay5mcmFtZXMuY29uY2F0KGFuaW0uZnJhbWVzKTtcbiAgfSk7XG4gIHJldHVybiBsaW5rO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb247XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0eXBpbmc6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNDAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxMixcbiAgICBkdXJhdGlvbjogMzAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjYwLFxuICAgICAgeTogNjUwXG4gICAgfSxcbiAgICByb3RhdGlvbjogNixcbiAgICBkdXJhdGlvbjogMzAwXG4gIH1cbiAgXSxcbiAgcmVzdDogW1xuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI1MCxcbiAgICAgIHk6IDY3MFxuICAgIH0sXG4gICAgcm90YXRpb246IDE3LFxuICAgIGR1cmF0aW9uOiA3MDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNTAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxNyxcbiAgICBkdXJhdGlvbjogMTAwMFxuICB9LFxuXG4gIF1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICB0eXBpbmc6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA0ODgsXG4gICAgICB5OiA2NzNcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNTAsXG4gICAgZHVyYXRpb246IDIwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246wqB7XG4gICAgICB4OiA0NjgsXG4gICAgICB5OiA2NjhcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNTUsXG4gICAgZHVyYXRpb246IDMwMCxcbiAgICBkZWxheTogMTUwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjrCoHtcbiAgICAgIHg6IDUwMCxcbiAgICAgIHk6IDY2MFxuICAgIH0sXG4gICAgcm90YXRpb246IDM0MyxcbiAgICBkdXJhdGlvbjogMzUwXG4gIH0sXG4gIF0sXG5cbiAgbW91c2U6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA1NTQsXG4gICAgICB5OiA2NzNcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNjgsXG4gICAgZHVyYXRpb246IDQwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDU1NixcbiAgICAgIHk6IDY3MFxuICAgIH0sXG4gICAgcm90YXRpb246IDM2OCxcbiAgICBkdXJhdGlvbjogNTAwXG4gIH1cbiAgXVxuXG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIGd1aSA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIERPQyA9IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcjtcblxudmFyIEFsaWFzID0ge1xuICBsZWZ0ICAgICAgOiAzNyxcbiAgdXAgICAgICAgIDogMzgsXG4gIHJpZ2h0ICAgICA6IDM5LFxuICBkb3duICAgICAgOiA0MCxcbiAgc3BhY2UgICAgIDogMzIsXG4gIHRhYiAgICAgICA6IDksXG4gIHBhZ2V1cCAgICA6IDMzLFxuICBwYWdlZG93biAgOiAzNCxcbiAgZXNjYXBlICAgIDogMjcsXG4gIGJhY2tzcGFjZSA6IDgsXG4gIG1ldGEgICAgICA6IDkxLFxuICBhbHQgICAgICAgOiAxOCxcbiAgY3RybCAgICAgIDogMTcsXG4gIHNoaWZ0ICAgICA6IDE2LFxuICBlbnRlciAgICAgOiAxMyxcbiAgZjEgICAgICAgIDogMTEyLFxuICBmMiAgICAgICAgOiAxMTMsXG4gIGYzICAgICAgICA6IDExNCxcbiAgZjQgICAgICAgIDogMTE1LFxuICBmNSAgICAgICAgOiAxMTYsXG4gIGY2ICAgICAgICA6IDExNyxcbiAgZjcgICAgICAgIDogMTE4LFxuICBmOCAgICAgICAgOiAxMTksXG4gIGY5ICAgICAgICA6IDEyMCxcbiAgZjEwICAgICAgIDogMTIxLFxuICBmMTEgICAgICAgOiAxMjIsXG4gIGYxMiAgICAgICA6IDEyM1xufTtcblxudmFyIGlzVmFsaWRLZXkgPSBmdW5jdGlvbihrKXtcbiAgcmV0dXJuICggaz49NDggJiYgazw9NTcgKSB8fCAoIGs+PTY1ICYmIGs8PTkwICkgfHwgayA9PT0gQWxpYXMuc3BhY2U7XG59O1xuXG52YXIgQ29uc29sZSA9IGZ1bmN0aW9uKCl7XG4gIERPQy5hcHBseSh0aGlzKTtcbiAgdmFyIGJnID0gbmV3IHBpeGkuR3JhcGhpY3MoKTtcbiAgdGhpcy5hZGRDaGlsZChiZyk7XG4gIGJnLmxpbmVTdHlsZSg0LDB4MDAwMDAwKTtcbiAgYmcuYmVnaW5GaWxsKDB4ZmZmZmZmKTtcbiAgYmcuZHJhd1JlY3QoMCwwLDQ5Niw0Nik7XG4gIHRoaXMucHJlZml4ID0gJz4nO1xuICB0aGlzLmxpbmVzID0gW107XG4gIHRoaXMubGluZW5vID0gMDtcbiAgdGhpcy5idWZmZXIgPSAnJztcbiAgdGhpcy5sYXN0TGluZSA9ICcnO1xuICB0aGlzLmN1cnNvciA9IDA7XG4gIHRoaXMubWluID0gMDtcbiAgdGhpcy5saW5lID0gbmV3IHBpeGkuVGV4dCgnPicse2ZvbnQ6ICdib2xkIDMycHggVlQzMjMnfSk7XG4gIHRoaXMubGluZS5wb3NpdGlvbi54ID0gMTI7XG4gIHRoaXMubGluZS5wb3NpdGlvbi55ID0gMTI7XG4gIHRoaXMuYWRkQ2hpbGQodGhpcy5saW5lKTtcbiAgdGhpcy5vbmxpbmUgPSBbXTtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB2YXIgYWN0aW9ucyA9IHt9O1xuICBhY3Rpb25zW0FsaWFzLmVudGVyXSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBfdGhpcy5wdXNoTGluZSgpO1xuICB9O1xuICBhY3Rpb25zW0FsaWFzLmJhY2tzcGFjZV0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5yZW1vdmVDaGFyKCk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuICBhY3Rpb25zW0FsaWFzLmxlZnRdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUN1cnNvcigtMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGFjdGlvbnNbQWxpYXMucmlnaHRdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUN1cnNvcigxKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG5cbiAgYWN0aW9uc1tBbGlhcy51cF0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5tb3ZlSGlzdG9yeSgtMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGFjdGlvbnNbQWxpYXMuZG93bl0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5tb3ZlSGlzdG9yeSgxKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxmdW5jdGlvbihldmVudCl7XG4gICAgdmFyIGtleSA9IGV2ZW50LmtleUNvZGUgfHzCoGV2ZW50LndoaWNoO1xuICAgIGlmKCBpc1ZhbGlkS2V5KGtleSkgKSB7XG4gICAgICBfdGhpcy5wdXNoQ2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKGtleSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZnVuID0gYWN0aW9uc1trZXldO1xuICAgICAgaWYoISFmdW4pIHtcbiAgICAgICAgZnVuLmNhbGwoX3RoaXMsZXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH0pO1xuXG59O1xuXG5Db25zb2xlLnByb3RvdHlwZSA9IERPQy5wcm90b3R5cGU7XG5cbkNvbnNvbGUucHJvdG90eXBlLnJlbmRlclRleHQgPSBmdW5jdGlvbigpe1xuICB0aGlzLm1pbiA9IE1hdGgubWF4KCB0aGlzLmN1cnNvci0zMiwwICk7XG4gIHRoaXMubGluZS5zZXRUZXh0KHRoaXMucHJlZml4K3RoaXMuYnVmZmVyLnN1YnN0cih0aGlzLm1pbiwzMikpO1xuICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgY29uc29sZS5sb2codGhpcy5idWZmZXIpO1xufTtcblxuQ29uc29sZS5wcm90b3R5cGUucmVtb3ZlQ2hhciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgdmFyIGxlbiA9IGJ1ZmZlci5sZW5ndGg7XG4gIHZhciBjdXJzb3IgPSB0aGlzLmN1cnNvcjtcbiAgaWYoIGN1cnNvciA+IDAgKSB7XG4gICAgdGhpcy5idWZmZXIgPSBidWZmZXIuc3Vic3RyaW5nKDAsY3Vyc29yLTEpK2J1ZmZlci5zdWJzdHJpbmcoY3Vyc29yLGxlbik7XG4gICAgdGhpcy5jdXJzb3IgLT0gMTtcbiAgfVxufTtcblxuQ29uc29sZS5wcm90b3R5cGUucHVzaENoYXIgPSBmdW5jdGlvbihjKXtcbiAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yO1xuICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gIGNvbnNvbGUubG9nKCdCdWZmZXInLGJ1ZmZlcik7XG4gIGNvbnNvbGUubG9nKCdDaGFyJyxjKTtcbiAgdGhpcy5idWZmZXIgPSBidWZmZXIuc3Vic3RyaW5nKDAsY3Vyc29yKSArIGMgKyBidWZmZXIuc3Vic3RyaW5nKGN1cnNvcixidWZmZXIubGVuZ3RoKTtcbiAgdGhpcy5jdXJzb3IgKz0gMTtcbn07XG5cbkNvbnNvbGUucHJvdG90eXBlLm1vdmVDdXJzb3IgPSBmdW5jdGlvbihkKXtcbiAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yICsgZDtcbiAgdmFyIGxlbiA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgaWYoIGN1cnNvciA+PSAwICYmIGN1cnNvciA8PSBsZW4gKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gIH1cbn07XG5cbkNvbnNvbGUucHJvdG90eXBlLnB1c2hMaW5lID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5saW5lbm8gPSB0aGlzLmxpbmVzLnB1c2goIHRoaXMuYnVmZmVyICk7XG4gIHRoaXMuYnVmZmVyID0gJyc7XG4gIHRoaXMuY3Vyc29yID0gMDtcbn07XG5cbkNvbnNvbGUucHJvdG90eXBlLm1vdmVIaXN0b3J5ID0gZnVuY3Rpb24oZCl7XG4gIHZhciBsaW5lbm8gPSB0aGlzLmxpbmVubyArIGQ7XG4gIHZhciBjb3VudCA9IHRoaXMubGluZXMubGVuZ3RoO1xuICBpZiggbGluZW5vID09PSBjb3VudCApIHtcbiAgICB0aGlzLmJ1ZmZlciA9ICcnO1xuICAgIHRoaXMubGluZW5vID0gbGluZW5vO1xuICAgIHRoaXMuY3Vyc29yID0gMDtcbiAgfVxuICBpZiggbGluZW5vID49IDAgJiYgbGluZW5vIDwgY291bnQgKSB7XG4gICAgdGhpcy5idWZmZXIgPSB0aGlzLmxpbmVzW2xpbmVub107XG4gICAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc29sZTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIEd1aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LmRhdC5HVUkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLmRhdC5HVUkgOiBudWxsKTtcbnZhciBndWkgPSBuZXcgR3VpKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGd1aTtcbmd1aS5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsImV4cG9ydHMubG9hZCA9IGZ1bmN0aW9uKGZhbWlsaWVzLGNhbGxiYWNrKXtcblxuICB3aW5kb3cuV2ViRm9udENvbmZpZyA9IHtcbiAgICBnb29nbGU6IHtcbiAgICAgIGZhbWlsaWVzOiBmYW1pbGllc1xuICAgIH0sXG4gICAgYWN0aXZlOiBjYWxsYmFja1xuICB9O1xuICAoZnVuY3Rpb24oKXtcbiAgICB2YXIgd2YgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB3Zi5zcmMgPSAoJ2h0dHBzOicgPT09IGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID8gJ2h0dHBzJyA6ICdodHRwJykgK1xuICAgICc6Ly9hamF4Lmdvb2dsZWFwaXMuY29tL2FqYXgvbGlicy93ZWJmb250LzEvd2ViZm9udC5qcyc7XG4gICAgd2YudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIHdmLmFzeW5jID0gJ3RydWUnO1xuICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod2YsIHMpO1xuICB9KSgpO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBndWkgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG52YXIgdHdlZW4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKTtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIEtleWRvYyA9IHJlcXVpcmUoJy4va2V5ZG9jJyk7XG52YXIgQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24nKTtcblxudmFyIHN0YWdlID0gbmV3IHBpeGkuU3RhZ2UoMHg2NmZmNDQpO1xudmFyIHJlbmRlcmVyLHF1aXQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5hc3NldHM6IFtcbidpbWcvYmFja2dyb3VuZC5wbmcnLFxuJ2ltZy9sZWZ0X2FybS5wbmcnLFxuJ2ltZy9yaWdodF9hcm0ucG5nJ1xuXSxcblxub25pbml0OiBmdW5jdGlvbihjb250ZXh0KSB7XG4gIHJlbmRlcmVyID0gY29udGV4dC5yZW5kZXJlcjtcbiAgcXVpdCA9IGNvbnRleHQucXVpdDtcblxuICB2YXIgYmFja2dyb3VuZCA9IHBpeGkuU3ByaXRlLmZyb21JbWFnZSgnaW1nL2JhY2tncm91bmQucG5nJyk7XG5cbiAgYmFja2dyb3VuZC5hbmNob3IueCA9IDA7XG4gIGJhY2tncm91bmQuYW5jaG9yLnkgPSAwO1xuICBiYWNrZ3JvdW5kLnBvc2l0aW9uLnggPSAwO1xuICBiYWNrZ3JvdW5kLnBvc2l0aW9uLnkgPSAwO1xuXG4gIC8vIHZhciBwaXhlbGF0ZUZpbHRlciA9IG5ldyBwaXhpLlBpeGVsYXRlRmlsdGVyKCk7XG4gIC8vIHZhciBwaXhlbGF0ZUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1BpeGVsYXRlJyk7XG4gIC8vIHBpeGVsYXRlRm9sZGVyLmFkZChwaXhlbGF0ZUZpbHRlci5zaXplLCd4JywxLDMyKS5uYW1lKCdQaXhlbFNpemVYJyk7XG4gIC8vIHBpeGVsYXRlRm9sZGVyLmFkZChwaXhlbGF0ZUZpbHRlci5zaXplLCd5JywxLDMyKS5uYW1lKCdQaXhlbFNpemVZJyk7XG4gIC8vXG4gIC8vIHZhciBjb250YWluZXIgPSBuZXcgcGl4aS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gIC8vIGNvbnRhaW5lci5maWx0ZXJzID0gWyBwaXhlbGF0ZUZpbHRlciBdO1xuICAvL1xuICAvLyBjb250YWluZXIuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG4gIC8vIHN0YWdlLmFkZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgc3RhZ2UuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG5cbiAgdmFyIGxlZnRBcm0gPSBwaXhpLlNwcml0ZS5mcm9tSW1hZ2UoJ2ltZy9sZWZ0X2FybS5wbmcnKTtcbiAgbGVmdEFybS5hbmNob3IueCA9IDAuNTtcbiAgbGVmdEFybS5hbmNob3IueSA9IDE7XG5cbiAgdmFyIHJpZ2h0QXJtID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvcmlnaHRfYXJtLnBuZycpO1xuICByaWdodEFybS5hbmNob3IueCA9IDAuNTtcbiAgcmlnaHRBcm0uYW5jaG9yLnkgPSAxO1xuXG4gIHZhciByb3RhdGlvbiA9IHtcbiAgICBsZWZ0OiAwLFxuICAgIHJpZ2h0OiAwXG4gIH07XG5cbiAgdmFyIGxlZnRTaGVldCA9IEFuaW1hdGlvbi5sb2FkQWxsKGxlZnRBcm0scmVxdWlyZSgnLi9hbmltYXRpb25zL2xlZnRhcm0nKSk7XG4gIHZhciByaWdodFNoZWV0ID0gQW5pbWF0aW9uLmxvYWRBbGwocmlnaHRBcm0scmVxdWlyZSgnLi9hbmltYXRpb25zL3JpZ2h0YXJtJykpO1xuXG4gIHZhciBsZWZ0QW5pbSA9IEFuaW1hdGlvbi5saW5rKFtcbiAgICBsZWZ0U2hlZXQudHlwaW5nLmNsb25lKCkucmVwZWF0KDQpLFxuICAgIGxlZnRTaGVldC5yZXN0XG4gIF0pLmp1bXBUbygwKS5wbGF5KHtsb29wOiB0cnVlfSk7XG5cbiAgdmFyIHJpZ2h0QW5pbSA9IEFuaW1hdGlvbi5saW5rKFtcbiAgICByaWdodFNoZWV0LnR5cGluZy5jbG9uZSgpLnJlcGVhdCgyKSxcbiAgICByaWdodFNoZWV0Lm1vdXNlLFxuICAgIHJpZ2h0U2hlZXQudHlwaW5nXSlcbiAgICAuanVtcFRvKDApLnBsYXkoe2xvb3A6dHJ1ZX0pO1xuXG5cbiAgdmFyIGRvQW5pbWF0ZSA9IHsgbGVmdDogdHJ1ZSwgcmlnaHQ6IHRydWUgfTtcblxuICB2YXIgYXJtRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignTGVmdCBBcm0nKTtcbiAgdmFyIG9wdGlvbjtcbiAgYXJtRm9sZGVyLmFkZChsZWZ0QXJtLnBvc2l0aW9uLCd4JywtMjAwLDEwMDApLm5hbWUoJ1Bvc2l0aW9uIFgnKTtcbiAgYXJtRm9sZGVyLmFkZChsZWZ0QXJtLnBvc2l0aW9uLCd5JywtMjAwLDEwMDApLm5hbWUoJ1Bvc2l0aW9uIFknKTtcbiAgb3B0aW9uID0gYXJtRm9sZGVyLmFkZChyb3RhdGlvbiwncmlnaHQnLDAsMzYwKS5uYW1lKCdSb3RhdGlvbicpO1xuICBvcHRpb24ub25DaGFuZ2UoZnVuY3Rpb24odmFsdWUpe1xuICAgIGxlZnRBcm0ucm90YXRpb24gPSB2YWx1ZSAqIE1hdGguUEkgLyAxODA7XG4gIH0pO1xuICBvcHRpb24gPSBhcm1Gb2xkZXIuYWRkKGRvQW5pbWF0ZSwnbGVmdCcpLm5hbWUoJ0FuaW1hdGUnKTtcbiAgb3B0aW9uLm9uQ2hhbmdlKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICBpZiggdmFsdWUgKSB7XG4gICAgICBsZWZ0QW5pbS5wbGF5KHt0cmFuc2l0aW9uOiAyMDB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdEFuaW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFybUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1JpZ2h0IEFybScpO1xuICBhcm1Gb2xkZXIuYWRkKHJpZ2h0QXJtLnBvc2l0aW9uLCd4JywtMjAwLDEwMDApLm5hbWUoJ1Bvc2l0aW9uIFgnKTtcbiAgYXJtRm9sZGVyLmFkZChyaWdodEFybS5wb3NpdGlvbiwneScsLTIwMCwxMDAwKS5uYW1lKCdQb3NpdGlvbiBZJyk7XG4gIGFybUZvbGRlci5hZGQocm90YXRpb24sJ3JpZ2h0JywwLDM2MCkubmFtZSgnUm90YXRpb24nKTtcbiAgb3B0aW9uID0gYXJtRm9sZGVyLmFkZChyb3RhdGlvbiwnbGVmdCcsMCwzNjApLm5hbWUoJ1JvdGF0aW9uJyk7XG4gIG9wdGlvbi5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSl7XG4gICAgcmlnaHRBcm0ucm90YXRpb24gPSB2YWx1ZSAqIE1hdGguUEkgLyAxODA7XG4gIH0pO1xuICBvcHRpb24gPSBhcm1Gb2xkZXIuYWRkKGRvQW5pbWF0ZSwncmlnaHQnKS5uYW1lKCdBbmltYXRlJyk7XG4gIG9wdGlvbi5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSl7XG4gICAgaWYoIHZhbHVlICkge1xuICAgICAgcmlnaHRBbmltLnBsYXkoe3RyYW5zaXRpb246IDIwMH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodEFuaW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHN0YWdlLmFkZENoaWxkKCBsZWZ0QXJtICk7XG4gIHN0YWdlLmFkZENoaWxkKCByaWdodEFybSApO1xuXG4gIEtleWRvYy5hZGRFdmVudExpc3RlbmVyKCdlc2NhcGUnLGZ1bmN0aW9uKCl7XG4gICAgcXVpdCgpO1xuICB9KTtcblxuICB2YXIgQ29uc29sZSA9IHJlcXVpcmUoJy4vY29uc29sZScpO1xuXG4gIHZhciB0ZXJtID0gbmV3IENvbnNvbGUoKTtcbiAgdGVybS5wb3NpdGlvbi54ID0gMTUwO1xuICB0ZXJtLnBvc2l0aW9uLnkgPSA1MzA7XG4gIHN0YWdlLmFkZENoaWxkKHRlcm0pO1xuXG59LFxub25mcmFtZTogZnVuY3Rpb24odGltZSxkdCl7XG5cbiAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcbiAgdHdlZW4udXBkYXRlKCk7XG5cbn0sXG5vbnF1aXQ6IGZ1bmN0aW9uKCl7XG4gIGNvbnNvbGUubG9nKCdFeGl0IGdhbWUnKTtcbn1cblxufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIGFsaWFzID0ge1xuICAnbGVmdCcgIDogMzcsXG4gICd1cCcgICAgOiAzOCxcbiAgJ3JpZ2h0JyA6IDM5LFxuICAnZG93bicgIDogNDAsXG4gICdzcGFjZScgOiAzMixcbiAgJ3RhYicgICA6IDksXG4gICdwYWdldXAnICAgIDogMzMsXG4gICdwYWdlZG93bicgIDogMzQsXG4gICdlc2NhcGUnICAgIDogMjcsXG4gICdiYWNrc3BhY2UnIDogOCxcbiAgJ21ldGEnICA6IDkxLFxuICAnYWx0JyAgIDogMTgsXG4gICdjdHJsJyAgOiAxNyxcbiAgJ3NoaWZ0JyA6IDE2LFxuICAnZW50ZXInIDogMTMsXG4gICdmMScgIDogMTEyLFxuICAnZjInICA6IDExMyxcbiAgJ2YzJyAgOiAxMTQsXG4gICdmNCcgIDogMTE1LFxuICAnZjUnICA6IDExNixcbiAgJ2Y2JyAgOiAxMTcsXG4gICdmNycgIDogMTE4LFxuICAnZjgnICA6IDExOSxcbiAgJ2Y5JyAgOiAxMjAsXG4gICdmMTAnIDogMTIxLFxuICAnZjExJyA6IDEyMixcbiAgJ2YxMicgOiAxMjNcbn07XG5cbnZhciBsaXN0ZW5lcnMgPSB7fTtcblxudmFyIHByZXNzZWQgPSB7fTtcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsZnVuY3Rpb24oZXZlbnQpe1xuICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB2YXIga2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgfHzCoGV2ZW50LndoaWNoO1xuICBwcmVzc2VkW2tleUNvZGVdID0gZmFsc2U7XG59LGZhbHNlKTtcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxmdW5jdGlvbihldmVudCl7XG4gIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgdmFyIGtleUNvZGUgPSBldmVudC5rZXlDb2RlIHx8wqBldmVudC53aGljaDtcbiAgcHJlc3NlZFtrZXlDb2RlXSA9IHRydWU7XG4gIE9iamVjdC5rZXlzKGxpc3RlbmVycykuZm9yRWFjaChmdW5jdGlvbihrZXlzKXtcbiAgICB2YXIgaSxsZW47XG4gICAgdmFyIGFyciA9IGtleXMuc3BsaXQoJysnKTtcbiAgICBmb3IoIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEgKSB7XG4gICAgICBrZXkgPSBhcnJbaV07XG4gICAgICBrZXlDb2RlID0gYWxpYXNba2V5XSB8fCBrZXkudG9VcHBlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xuICAgICAgaWYoICFwcmVzc2VkW2tleUNvZGVdICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBwcm9wID0gdHJ1ZTtcbiAgICBhcnIgPSBsaXN0ZW5lcnNba2V5c107XG4gICAgZm9yKCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbiAmJiBwcm9wOyBpICs9IDEgKcKge1xuICAgICAgYXJyW2ldLmNhbGwobnVsbCxldmVudCk7XG4gICAgfVxuICB9KTtcbn0sZmFsc2UpO1xuXG5leHBvcnRzLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKXtcbiAgdmFyIGtleXMgPSB0eXBlLnNwbGl0KCcrJykuc29ydCgpLmpvaW4oJysnKTtcbiAgaWYoIGxpc3RlbmVyc1trZXlzXSA9PT0gdW5kZWZpbmVkICkge1xuICAgIGxpc3RlbmVyc1trZXlzXSA9IFtdO1xuICB9XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xICkge1xuICAgIGxpc3RlbmVyc1trZXlzXS5wdXNoKGxpc3RlbmVyKTtcbiAgfVxufTtcblxuZXhwb3J0cy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICl7XG4gIHZhciBrZXlzID0gdHlwZS5zcGxpdCgnKycpLnNvcnQoKS5qb2luKCcrJyk7XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10gIT09IHVuZGVmaW5lZCApIHtcbiAgICB2YXIgaW5kZXggPSBsaXN0ZW5lcnNba2V5c10uaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgaWYoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgIGxpc3RlbmVyc1trZXlzXS5zcGxpY2UoaW5kZXgsMSk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLmhhc0V2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKXtcbiAgdmFyIGtleXMgPSB0eXBlLnNwbGl0KCcrJykuc29ydCgpLmpvaW4oJysnKTtcbiAgaWYoIGxpc3RlbmVyc1trZXlzXSA9PT0gdW5kZWZpbmVkICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiggbGlzdGVuZXJzW2tleXNdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKCBldmVudCApe1xuICB2YXIgdHlwZSA9IGV2ZW50LnR5cGU7XG4gIGlmKCBsaXN0ZW5lcnNbdHlwZV0gPT09IHVuZGVmaW5lZCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdGVuZXJzW3R5cGVdLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpe1xuICAgIGxpc3RlbmVyLmNhbGwoZXZlbnQpO1xuICB9KTtcbn07XG4iXX0=
