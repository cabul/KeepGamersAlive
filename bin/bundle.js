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

},{}],"/Users/cabul/github/KeepGamersAlive/src/console.js":[function(require,module,exports){
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
},{"./debug":"/Users/cabul/github/KeepGamersAlive/src/debug.js"}],"/Users/cabul/github/KeepGamersAlive/src/debug.js":[function(require,module,exports){
(function (global){
var Gui = (typeof window !== "undefined" ? window.dat.GUI : typeof global !== "undefined" ? global.dat.GUI : null);
var gui = new Gui();
module.exports = gui;
gui.domElement.style.display = 'none';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/fonts.js":[function(require,module,exports){
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

},{}],"/Users/cabul/github/KeepGamersAlive/src/game.js":[function(require,module,exports){
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
},{"./animation":"/Users/cabul/github/KeepGamersAlive/src/animation.js","./animations/leftarm":"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js","./animations/rightarm":"/Users/cabul/github/KeepGamersAlive/src/animations/rightarm.js","./console":"/Users/cabul/github/KeepGamersAlive/src/console.js","./debug":"/Users/cabul/github/KeepGamersAlive/src/debug.js","./keydoc":"/Users/cabul/github/KeepGamersAlive/src/keydoc.js"}],"/Users/cabul/github/KeepGamersAlive/src/keydoc.js":[function(require,module,exports){
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

},{}],"/Users/cabul/github/KeepGamersAlive":[function(require,module,exports){
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
},{"./fonts":"/Users/cabul/github/KeepGamersAlive/src/fonts.js","./game":"/Users/cabul/github/KeepGamersAlive/src/game.js"}]},{},["/Users/cabul/github/KeepGamersAlive"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2FuaW1hdGlvbi5qcyIsInNyYy9hbmltYXRpb25zL2xlZnRhcm0uanMiLCJzcmMvYW5pbWF0aW9ucy9yaWdodGFybS5qcyIsInNyYy9jb25zb2xlLmpzIiwic3JjL2RlYnVnLmpzIiwic3JjL2ZvbnRzLmpzIiwic3JjL2dhbWUuanMiLCJzcmMva2V5ZG9jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIFRXRUVOID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgVHdlZW4gPSBUV0VFTi5Ud2VlbjtcbnZhciBjdXJ2ZSA9IFRXRUVOLkVhc2luZy5TaW51c29pZGFsLkluT3V0O1xudmFyIGR0b3IgPSBNYXRoLlBJIC8gMTgwO1xudmFyIHJ0b2QgPSAxODAgLyBNYXRoLlBJO1xuXG52YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24oc3ByaXRlLGZyYW1lcyl7XG5cbiAgdGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgW107XG4gIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnggPSB0aGlzLnBvc3g7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSB0aGlzLnBvc3k7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gdGhpcy5yb3Q7XG4gIH07XG4gIHRoaXMuY3Vyc29yID0gMDtcbiAgdGhpcy5sb29wID0gZmFsc2U7XG5cbn07XG5cbnZhciBmb3JtYXQgPSBmdW5jdGlvbiggZnJhbWUgKXtcbiAgcmV0dXJuIHtcbiAgICBwb3N4OiBmcmFtZS5wb3NpdGlvbi54IHx8IDAsXG4gICAgcG9zeTogZnJhbWUucG9zaXRpb24ueSB8fCAwLFxuICAgIHJvdDogKGZyYW1lLnJvdGF0aW9ufHwwKSAqIGR0b3JcbiAgfTtcbn07XG5cbkFuaW1hdGlvbi5wcm90b3R5cGUgPSB7XG5cbiAgY29uc3RydWN0b3I6IEFuaW1hdGlvbixcbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8wqB7fTtcbiAgICB0aGlzLmxvb3AgPSBvcHRpb25zLmxvb3AgfHwgdGhpcy5sb29wO1xuICAgIHRoaXMuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3IgfHwgdGhpcy5jdXJzb3I7XG4gICAgdmFyIGZyYW1lcyA9IHRoaXMuZnJhbWVzO1xuICAgIHZhciBsZW4gPSBmcmFtZXMubGVuZ3RoO1xuICAgIHZhciBkb0xvb3AgPSB0aGlzLmxvb3A7XG4gICAgdmFyIG9mZnNldCA9IHRoaXMuY3Vyc29yO1xuICAgIHZhciBpID0gb2Zmc2V0O1xuICAgIHZhciBvbmZyYW1lID0gdGhpcy5vbmZyYW1lO1xuXG4gICAgdmFyIGxhc3QsIGZpcnN0LCB0d2VlbiwgZnJhbWU7XG5cbiAgICB2YXIgbWF4ID0gaSArIGxlbjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbihmKXtcbiAgICAgIHZhciBmb3JtID0gZm9ybWF0KGZyYW1lc1tmXSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5wb3N4ID0gZm9ybS5wb3N4O1xuICAgICAgICB0aGlzLnBvc3kgPSBmb3JtLnBvc3k7XG4gICAgICAgIHRoaXMucm90ID0gZm9ybS5yb3Q7XG4gICAgICAgIGlmKF90aGlzLm9uZnJhbWUpIHtcbiAgICAgICAgICBvbmZyYW1lLmNhbGwoZnJhbWVzLGYpO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLmN1cnNvciA9IChmKzEpICUgbGVuO1xuICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICB3aGlsZSggaSA8IG1heCkge1xuICAgICAgZnJhbWUgPSBmcmFtZXNbaSVsZW5dO1xuICAgICAgdHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KGZyYW1lKSk7XG4gICAgICB2YXIgb25jb21wbGV0ZSA9IGNvbXBsZXRlKGklbGVuKTtcbiAgICAgIHZhciBvbnN0b3AgPSBzdG9wKGklbGVuKTtcbiAgICAgIGkgPSBpICsgMTtcbiAgICAgIHZhciBuZXh0ID0gZnJhbWVzW2klbGVuXTtcbiAgICAgIHR3ZWVuLnRvKGZvcm1hdChuZXh0KSxuZXh0LmR1cmF0aW9ufHwxMDAwKVxuICAgICAgLmRlbGF5KG5leHQuZGVsYXl8fDApXG4gICAgICAuZWFzaW5nKGN1cnZlKVxuICAgICAgLm9uVXBkYXRlKHRoaXMudXBkYXRlKS5vbkNvbXBsZXRlKG9uY29tcGxldGUpO1xuICAgICAgaWYoICEhbGFzdCApIHtcbiAgICAgICAgbGFzdC5jaGFpbih0d2Vlbik7XG4gICAgICB9XG4gICAgICBpZiggIWZpcnN0ICkge1xuICAgICAgICBmaXJzdCA9IHR3ZWVuO1xuICAgICAgfVxuICAgICAgbGFzdCA9IHR3ZWVuO1xuICAgIH1cblxuICAgIGlmKCBkb0xvb3AgKSB7XG4gICAgICBsYXN0LmNoYWluKGZpcnN0KTtcbiAgICB9XG5cbiAgICB0aGlzLnR3ZWVuID0gZmlyc3Q7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcGxheTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5idWlsZChvcHRpb25zKTtcbiAgICB2YXIgZmlyc3QgPSB0aGlzLnR3ZWVuO1xuICAgIHZhciB0aW1lID0gb3B0aW9ucy50cmFuc2l0aW9uO1xuICAgIGlmKCB0aW1lICkge1xuICAgICAgZHQgPSBkdCB8fCAwO1xuICAgICAgdmFyIGZyYW1lID0gdGhpcy5mcmFtZXNbIHRoaXMuY3Vyc29yICUgdGhpcy5mcmFtZXMubGVuZ3RoIF07XG4gICAgICB2YXIgc3RhdHVzID0gdGhpcy5zcHJpdGVTdGF0dXMoKTtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnR3ZWVuID0gbmV3IFR3ZWVuKGZvcm1hdChzdGF0dXMpKVxuICAgICAgLnRvKGZvcm1hdChmcmFtZSksdGltZSlcbiAgICAgIC5kZWxheShvcHRpb25zLmRlbGF5fHwwKVxuICAgICAgLmVhc2luZyhjdXJ2ZSlcbiAgICAgIC5vblVwZGF0ZSh0aGlzLnVwZGF0ZSlcbiAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgICAgIF90aGlzLnR3ZWVuID0gZmlyc3Q7XG4gICAgICAgIGZpcnN0LnN0YXJ0KCk7XG4gICAgICB9KS5vblN0b3AoZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMudHdlZW4gPSBmaXJzdDtcbiAgICAgIH0pLnN0YXJ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0LnN0YXJ0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnR3ZWVuLnN0b3AoKTtcbiAgICB0aGlzLnR3ZWVuLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG4gICAgdGhpcy5jdXJzb3IgPSAodGhpcy5jdXJzb3IrMSkldGhpcy5mcmFtZXMubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBzcHJpdGVTdGF0dXM6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnNwcml0ZS5wb3NpdGlvbixcbiAgICAgIHJvdGF0aW9uOiB0aGlzLnNwcml0ZS5yb3RhdGlvbiAqIHJ0b2RcbiAgICB9O1xuICB9LFxuICBvbkZyYW1lOiBmdW5jdGlvbihjYil7XG4gICAgdGhpcy5vbmZyYW1lID0gY2I7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGp1bXBUbzogZnVuY3Rpb24oaSl7XG4gICAgaSA9IGkgfHwgMDtcbiAgICB2YXIgZnJhbWUgPSB0aGlzLmZyYW1lc1tpXTtcbiAgICB0aGlzLmN1cnNvciA9IChpKzEpICUgdGhpcy5mcmFtZXMubGVuZ3RoO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IGZyYW1lLnBvc2l0aW9uLng7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSBmcmFtZS5wb3NpdGlvbi55O1xuICAgIHNwcml0ZS5yb3RhdGlvbiA9IGZyYW1lLnJvdGF0aW9uICogZHRvcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVwZWF0OiBmdW5jdGlvbih0aW1lcyl7XG4gICAgdmFyIGZyYW1lcyA9IFtdLmNvbmNhdCh0aGlzLmZyYW1lcyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpICs9IDEgKXtcbiAgICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KGZyYW1lcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjaGFpbjogZnVuY3Rpb24ob3RoZXIpe1xuICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KG90aGVyLmZyYW1lcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKHRoaXMuc3ByaXRlLFtdLmNvbmNhdCh0aGlzLmZyYW1lcykpO1xuICB9XG59O1xuXG5BbmltYXRpb24ubG9hZEFsbCA9IGZ1bmN0aW9uKHNwcml0ZSxzaGVldCl7XG4gIHZhciBhbmltcyA9IHt9O1xuICBPYmplY3Qua2V5cyhzaGVldCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICBhbmltc1tuYW1lXSA9IG5ldyBBbmltYXRpb24oc3ByaXRlLHNoZWV0W25hbWVdKTtcbiAgfSk7XG4gIHJldHVybiBhbmltcztcbn07XG5cbkFuaW1hdGlvbi5saW5rID0gZnVuY3Rpb24obGlzdCl7XG4gIHZhciBsaW5rID0gbmV3IEFuaW1hdGlvbihsaXN0WzBdLnNwcml0ZSk7XG4gIGxpc3QuZm9yRWFjaChmdW5jdGlvbihhbmltKXtcbiAgICBsaW5rLmZyYW1lcyA9IGxpbmsuZnJhbWVzLmNvbmNhdChhbmltLmZyYW1lcyk7XG4gIH0pO1xuICByZXR1cm4gbGluaztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjQwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTIsXG4gICAgZHVyYXRpb246IDMwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI2MCxcbiAgICAgIHk6IDY1MFxuICAgIH0sXG4gICAgcm90YXRpb246IDYsXG4gICAgZHVyYXRpb246IDMwMFxuICB9XG4gIF0sXG4gIHJlc3Q6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNTAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxNyxcbiAgICBkdXJhdGlvbjogNzAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjUwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTcsXG4gICAgZHVyYXRpb246IDEwMDBcbiAgfSxcblxuICBdXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNDg4LFxuICAgICAgeTogNjczXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzUwLFxuICAgIGR1cmF0aW9uOiAyMDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOsKge1xuICAgICAgeDogNDY4LFxuICAgICAgeTogNjY4XG4gICAgfSxcbiAgICByb3RhdGlvbjogMzU1LFxuICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgZGVsYXk6IDE1MFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246wqB7XG4gICAgICB4OiA1MDAsXG4gICAgICB5OiA2NjBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNDMsXG4gICAgZHVyYXRpb246IDM1MFxuICB9LFxuICBdLFxuXG4gIG1vdXNlOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNTU0LFxuICAgICAgeTogNjczXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzY4LFxuICAgIGR1cmF0aW9uOiA0MDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA1NTYsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNjgsXG4gICAgZHVyYXRpb246IDUwMFxuICB9XG4gIF1cblxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBndWkgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcbnZhciBET0MgPSBwaXhpLkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cbnZhciBBbGlhcyA9IHtcbiAgbGVmdCAgICAgIDogMzcsXG4gIHVwICAgICAgICA6IDM4LFxuICByaWdodCAgICAgOiAzOSxcbiAgZG93biAgICAgIDogNDAsXG4gIHNwYWNlICAgICA6IDMyLFxuICB0YWIgICAgICAgOiA5LFxuICBwYWdldXAgICAgOiAzMyxcbiAgcGFnZWRvd24gIDogMzQsXG4gIGVzY2FwZSAgICA6IDI3LFxuICBiYWNrc3BhY2UgOiA4LFxuICBtZXRhICAgICAgOiA5MSxcbiAgYWx0ICAgICAgIDogMTgsXG4gIGN0cmwgICAgICA6IDE3LFxuICBzaGlmdCAgICAgOiAxNixcbiAgZW50ZXIgICAgIDogMTMsXG4gIGYxICAgICAgICA6IDExMixcbiAgZjIgICAgICAgIDogMTEzLFxuICBmMyAgICAgICAgOiAxMTQsXG4gIGY0ICAgICAgICA6IDExNSxcbiAgZjUgICAgICAgIDogMTE2LFxuICBmNiAgICAgICAgOiAxMTcsXG4gIGY3ICAgICAgICA6IDExOCxcbiAgZjggICAgICAgIDogMTE5LFxuICBmOSAgICAgICAgOiAxMjAsXG4gIGYxMCAgICAgICA6IDEyMSxcbiAgZjExICAgICAgIDogMTIyLFxuICBmMTIgICAgICAgOiAxMjNcbn07XG5cbnZhciBpc1ZhbGlkS2V5ID0gZnVuY3Rpb24oayl7XG4gIHJldHVybiAoIGs+PTQ4ICYmIGs8PTU3ICkgfHwgKCBrPj02NSAmJiBrPD05MCApIHx8IGsgPT09IEFsaWFzLnNwYWNlO1xufTtcblxudmFyIENvbnNvbGUgPSBmdW5jdGlvbigpe1xuICBET0MuYXBwbHkodGhpcyk7XG4gIHZhciBiZyA9IG5ldyBwaXhpLkdyYXBoaWNzKCk7XG4gIHRoaXMuYWRkQ2hpbGQoYmcpO1xuICBiZy5saW5lU3R5bGUoNCwweDAwMDAwMCk7XG4gIGJnLmJlZ2luRmlsbCgweGZmZmZmZik7XG4gIGJnLmRyYXdSZWN0KDAsMCw0OTYsNDYpO1xuICB0aGlzLnByZWZpeCA9ICc+JztcbiAgdGhpcy5saW5lcyA9IFtdO1xuICB0aGlzLmxpbmVubyA9IDA7XG4gIHRoaXMuYnVmZmVyID0gJyc7XG4gIHRoaXMubGFzdExpbmUgPSAnJztcbiAgdGhpcy5jdXJzb3IgPSAwO1xuICB0aGlzLm1pbiA9IDA7XG4gIHRoaXMubGluZSA9IG5ldyBwaXhpLlRleHQoJz4nLHtmb250OiAnYm9sZCAzMnB4IFZUMzIzJ30pO1xuICB0aGlzLmxpbmUucG9zaXRpb24ueCA9IDEyO1xuICB0aGlzLmxpbmUucG9zaXRpb24ueSA9IDEyO1xuICB0aGlzLmFkZENoaWxkKHRoaXMubGluZSk7XG4gIHRoaXMub25saW5lID0gW107XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdmFyIGFjdGlvbnMgPSB7fTtcbiAgYWN0aW9uc1tBbGlhcy5lbnRlcl0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgX3RoaXMucHVzaExpbmUoKTtcbiAgfTtcbiAgYWN0aW9uc1tBbGlhcy5iYWNrc3BhY2VdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMucmVtb3ZlQ2hhcigpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcbiAgYWN0aW9uc1tBbGlhcy5sZWZ0XSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLm1vdmVDdXJzb3IoLTEpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcblxuICBhY3Rpb25zW0FsaWFzLnJpZ2h0XSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLm1vdmVDdXJzb3IoMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGFjdGlvbnNbQWxpYXMudXBdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUhpc3RvcnkoLTEpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcblxuICBhY3Rpb25zW0FsaWFzLmRvd25dID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUhpc3RvcnkoMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsZnVuY3Rpb24oZXZlbnQpe1xuICAgIHZhciBrZXkgPSBldmVudC5rZXlDb2RlIHx8wqBldmVudC53aGljaDtcbiAgICBpZiggaXNWYWxpZEtleShrZXkpICkge1xuICAgICAgX3RoaXMucHVzaENoYXIoU3RyaW5nLmZyb21DaGFyQ29kZShrZXkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZ1biA9IGFjdGlvbnNba2V5XTtcbiAgICAgIGlmKCEhZnVuKSB7XG4gICAgICAgIGZ1bi5jYWxsKF90aGlzLGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9KTtcblxufTtcblxuQ29uc29sZS5wcm90b3R5cGUgPSBET0MucHJvdG90eXBlO1xuXG5Db25zb2xlLnByb3RvdHlwZS5yZW5kZXJUZXh0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5taW4gPSBNYXRoLm1heCggdGhpcy5jdXJzb3ItMzIsMCApO1xuICB0aGlzLmxpbmUuc2V0VGV4dCh0aGlzLnByZWZpeCt0aGlzLmJ1ZmZlci5zdWJzdHIodGhpcy5taW4sMzIpKTtcbiAgY29uc29sZS5sb2codGhpcyk7XG4gIGNvbnNvbGUubG9nKHRoaXMuYnVmZmVyKTtcbn07XG5cbkNvbnNvbGUucHJvdG90eXBlLnJlbW92ZUNoYXIgPSBmdW5jdGlvbigpe1xuICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gIHZhciBsZW4gPSBidWZmZXIubGVuZ3RoO1xuICB2YXIgY3Vyc29yID0gdGhpcy5jdXJzb3I7XG4gIGlmKCBjdXJzb3IgPiAwICkge1xuICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLGN1cnNvci0xKStidWZmZXIuc3Vic3RyaW5nKGN1cnNvcixsZW4pO1xuICAgIHRoaXMuY3Vyc29yIC09IDE7XG4gIH1cbn07XG5cbkNvbnNvbGUucHJvdG90eXBlLnB1c2hDaGFyID0gZnVuY3Rpb24oYyl7XG4gIHZhciBjdXJzb3IgPSB0aGlzLmN1cnNvcjtcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICBjb25zb2xlLmxvZygnQnVmZmVyJyxidWZmZXIpO1xuICBjb25zb2xlLmxvZygnQ2hhcicsYyk7XG4gIHRoaXMuYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLGN1cnNvcikgKyBjICsgYnVmZmVyLnN1YnN0cmluZyhjdXJzb3IsYnVmZmVyLmxlbmd0aCk7XG4gIHRoaXMuY3Vyc29yICs9IDE7XG59O1xuXG5Db25zb2xlLnByb3RvdHlwZS5tb3ZlQ3Vyc29yID0gZnVuY3Rpb24oZCl7XG4gIHZhciBjdXJzb3IgPSB0aGlzLmN1cnNvciArIGQ7XG4gIHZhciBsZW4gPSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gIGlmKCBjdXJzb3IgPj0gMCAmJiBjdXJzb3IgPD0gbGVuICkge1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICB9XG59O1xuXG5Db25zb2xlLnByb3RvdHlwZS5wdXNoTGluZSA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMubGluZW5vID0gdGhpcy5saW5lcy5wdXNoKCB0aGlzLmJ1ZmZlciApO1xuICB0aGlzLmJ1ZmZlciA9ICcnO1xuICB0aGlzLmN1cnNvciA9IDA7XG59O1xuXG5Db25zb2xlLnByb3RvdHlwZS5tb3ZlSGlzdG9yeSA9IGZ1bmN0aW9uKGQpe1xuICB2YXIgbGluZW5vID0gdGhpcy5saW5lbm8gKyBkO1xuICB2YXIgY291bnQgPSB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgaWYoIGxpbmVubyA9PT0gY291bnQgKSB7XG4gICAgdGhpcy5idWZmZXIgPSAnJztcbiAgICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgICB0aGlzLmN1cnNvciA9IDA7XG4gIH1cbiAgaWYoIGxpbmVubyA+PSAwICYmIGxpbmVubyA8IGNvdW50ICkge1xuICAgIHRoaXMuYnVmZmVyID0gdGhpcy5saW5lc1tsaW5lbm9dO1xuICAgIHRoaXMubGluZW5vID0gbGluZW5vO1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnNvbGU7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBHdWkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5kYXQuR1VJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5kYXQuR1VJIDogbnVsbCk7XG52YXIgZ3VpID0gbmV3IEd1aSgpO1xubW9kdWxlLmV4cG9ydHMgPSBndWk7XG5ndWkuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJleHBvcnRzLmxvYWQgPSBmdW5jdGlvbihmYW1pbGllcyxjYWxsYmFjayl7XG5cbiAgd2luZG93LldlYkZvbnRDb25maWcgPSB7XG4gICAgZ29vZ2xlOiB7XG4gICAgICBmYW1pbGllczogZmFtaWxpZXNcbiAgICB9LFxuICAgIGFjdGl2ZTogY2FsbGJhY2tcbiAgfTtcbiAgKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHdmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgd2Yuc3JjID0gKCdodHRwczonID09PSBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA/ICdodHRwcycgOiAnaHR0cCcpICtcbiAgICAnOi8vYWpheC5nb29nbGVhcGlzLmNvbS9hamF4L2xpYnMvd2ViZm9udC8xL3dlYmZvbnQuanMnO1xuICAgIHdmLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICB3Zi5hc3luYyA9ICd0cnVlJztcbiAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdmLCBzKTtcbiAgfSkoKTtcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgZ3VpID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xudmFyIHR3ZWVuID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcbnZhciBLZXlkb2MgPSByZXF1aXJlKCcuL2tleWRvYycpO1xudmFyIEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uJyk7XG5cbnZhciBzdGFnZSA9IG5ldyBwaXhpLlN0YWdlKDB4NjZmZjQ0KTtcbnZhciByZW5kZXJlcixxdWl0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuYXNzZXRzOiBbXG4naW1nL2JhY2tncm91bmQucG5nJyxcbidpbWcvbGVmdF9hcm0ucG5nJyxcbidpbWcvcmlnaHRfYXJtLnBuZydcbl0sXG5cbm9uaW5pdDogZnVuY3Rpb24oY29udGV4dCkge1xuICByZW5kZXJlciA9IGNvbnRleHQucmVuZGVyZXI7XG4gIHF1aXQgPSBjb250ZXh0LnF1aXQ7XG5cbiAgdmFyIGJhY2tncm91bmQgPSBwaXhpLlNwcml0ZS5mcm9tSW1hZ2UoJ2ltZy9iYWNrZ3JvdW5kLnBuZycpO1xuXG4gIGJhY2tncm91bmQuYW5jaG9yLnggPSAwO1xuICBiYWNrZ3JvdW5kLmFuY2hvci55ID0gMDtcbiAgYmFja2dyb3VuZC5wb3NpdGlvbi54ID0gMDtcbiAgYmFja2dyb3VuZC5wb3NpdGlvbi55ID0gMDtcblxuICAvLyB2YXIgcGl4ZWxhdGVGaWx0ZXIgPSBuZXcgcGl4aS5QaXhlbGF0ZUZpbHRlcigpO1xuICAvLyB2YXIgcGl4ZWxhdGVGb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdQaXhlbGF0ZScpO1xuICAvLyBwaXhlbGF0ZUZvbGRlci5hZGQocGl4ZWxhdGVGaWx0ZXIuc2l6ZSwneCcsMSwzMikubmFtZSgnUGl4ZWxTaXplWCcpO1xuICAvLyBwaXhlbGF0ZUZvbGRlci5hZGQocGl4ZWxhdGVGaWx0ZXIuc2l6ZSwneScsMSwzMikubmFtZSgnUGl4ZWxTaXplWScpO1xuICAvL1xuICAvLyB2YXIgY29udGFpbmVyID0gbmV3IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICAvLyBjb250YWluZXIuZmlsdGVycyA9IFsgcGl4ZWxhdGVGaWx0ZXIgXTtcbiAgLy9cbiAgLy8gY29udGFpbmVyLmFkZENoaWxkKGJhY2tncm91bmQpO1xuICAvLyBzdGFnZS5hZGRDaGlsZChjb250YWluZXIpO1xuXG4gIHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG4gIHZhciBsZWZ0QXJtID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvbGVmdF9hcm0ucG5nJyk7XG4gIGxlZnRBcm0uYW5jaG9yLnggPSAwLjU7XG4gIGxlZnRBcm0uYW5jaG9yLnkgPSAxO1xuXG4gIHZhciByaWdodEFybSA9IHBpeGkuU3ByaXRlLmZyb21JbWFnZSgnaW1nL3JpZ2h0X2FybS5wbmcnKTtcbiAgcmlnaHRBcm0uYW5jaG9yLnggPSAwLjU7XG4gIHJpZ2h0QXJtLmFuY2hvci55ID0gMTtcblxuICB2YXIgcm90YXRpb24gPSB7XG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMFxuICB9O1xuXG4gIHZhciBsZWZ0U2hlZXQgPSBBbmltYXRpb24ubG9hZEFsbChsZWZ0QXJtLHJlcXVpcmUoJy4vYW5pbWF0aW9ucy9sZWZ0YXJtJykpO1xuICB2YXIgcmlnaHRTaGVldCA9IEFuaW1hdGlvbi5sb2FkQWxsKHJpZ2h0QXJtLHJlcXVpcmUoJy4vYW5pbWF0aW9ucy9yaWdodGFybScpKTtcblxuICB2YXIgbGVmdEFuaW0gPSBBbmltYXRpb24ubGluayhbXG4gICAgbGVmdFNoZWV0LnR5cGluZy5jbG9uZSgpLnJlcGVhdCg0KSxcbiAgICBsZWZ0U2hlZXQucmVzdFxuICBdKS5qdW1wVG8oMCkucGxheSh7bG9vcDogdHJ1ZX0pO1xuXG4gIHZhciByaWdodEFuaW0gPSBBbmltYXRpb24ubGluayhbXG4gICAgcmlnaHRTaGVldC50eXBpbmcuY2xvbmUoKS5yZXBlYXQoMiksXG4gICAgcmlnaHRTaGVldC5tb3VzZSxcbiAgICByaWdodFNoZWV0LnR5cGluZ10pXG4gICAgLmp1bXBUbygwKS5wbGF5KHtsb29wOnRydWV9KTtcblxuXG4gIHZhciBkb0FuaW1hdGUgPSB7IGxlZnQ6IHRydWUsIHJpZ2h0OiB0cnVlIH07XG5cbiAgdmFyIGFybUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ0xlZnQgQXJtJyk7XG4gIHZhciBvcHRpb247XG4gIGFybUZvbGRlci5hZGQobGVmdEFybS5wb3NpdGlvbiwneCcsLTIwMCwxMDAwKS5uYW1lKCdQb3NpdGlvbiBYJyk7XG4gIGFybUZvbGRlci5hZGQobGVmdEFybS5wb3NpdGlvbiwneScsLTIwMCwxMDAwKS5uYW1lKCdQb3NpdGlvbiBZJyk7XG4gIG9wdGlvbiA9IGFybUZvbGRlci5hZGQocm90YXRpb24sJ3JpZ2h0JywwLDM2MCkubmFtZSgnUm90YXRpb24nKTtcbiAgb3B0aW9uLm9uQ2hhbmdlKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICBsZWZ0QXJtLnJvdGF0aW9uID0gdmFsdWUgKiBNYXRoLlBJIC8gMTgwO1xuICB9KTtcbiAgb3B0aW9uID0gYXJtRm9sZGVyLmFkZChkb0FuaW1hdGUsJ2xlZnQnKS5uYW1lKCdBbmltYXRlJyk7XG4gIG9wdGlvbi5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSl7XG4gICAgaWYoIHZhbHVlICkge1xuICAgICAgbGVmdEFuaW0ucGxheSh7dHJhbnNpdGlvbjogMjAwfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnRBbmltLnBhdXNlKCk7XG4gICAgfVxuICB9KTtcblxuICBhcm1Gb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdSaWdodCBBcm0nKTtcbiAgYXJtRm9sZGVyLmFkZChyaWdodEFybS5wb3NpdGlvbiwneCcsLTIwMCwxMDAwKS5uYW1lKCdQb3NpdGlvbiBYJyk7XG4gIGFybUZvbGRlci5hZGQocmlnaHRBcm0ucG9zaXRpb24sJ3knLC0yMDAsMTAwMCkubmFtZSgnUG9zaXRpb24gWScpO1xuICBhcm1Gb2xkZXIuYWRkKHJvdGF0aW9uLCdyaWdodCcsMCwzNjApLm5hbWUoJ1JvdGF0aW9uJyk7XG4gIG9wdGlvbiA9IGFybUZvbGRlci5hZGQocm90YXRpb24sJ2xlZnQnLDAsMzYwKS5uYW1lKCdSb3RhdGlvbicpO1xuICBvcHRpb24ub25DaGFuZ2UoZnVuY3Rpb24odmFsdWUpe1xuICAgIHJpZ2h0QXJtLnJvdGF0aW9uID0gdmFsdWUgKiBNYXRoLlBJIC8gMTgwO1xuICB9KTtcbiAgb3B0aW9uID0gYXJtRm9sZGVyLmFkZChkb0FuaW1hdGUsJ3JpZ2h0JykubmFtZSgnQW5pbWF0ZScpO1xuICBvcHRpb24ub25DaGFuZ2UoZnVuY3Rpb24odmFsdWUpe1xuICAgIGlmKCB2YWx1ZSApIHtcbiAgICAgIHJpZ2h0QW5pbS5wbGF5KHt0cmFuc2l0aW9uOiAyMDB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHRBbmltLnBhdXNlKCk7XG4gICAgfVxuICB9KTtcblxuICBzdGFnZS5hZGRDaGlsZCggbGVmdEFybSApO1xuICBzdGFnZS5hZGRDaGlsZCggcmlnaHRBcm0gKTtcblxuICBLZXlkb2MuYWRkRXZlbnRMaXN0ZW5lcignZXNjYXBlJyxmdW5jdGlvbigpe1xuICAgIHF1aXQoKTtcbiAgfSk7XG5cbiAgdmFyIENvbnNvbGUgPSByZXF1aXJlKCcuL2NvbnNvbGUnKTtcblxuICB2YXIgdGVybSA9IG5ldyBDb25zb2xlKCk7XG4gIHRlcm0ucG9zaXRpb24ueCA9IDE1MDtcbiAgdGVybS5wb3NpdGlvbi55ID0gNTMwO1xuICBzdGFnZS5hZGRDaGlsZCh0ZXJtKTtcblxufSxcbm9uZnJhbWU6IGZ1bmN0aW9uKHRpbWUsZHQpe1xuXG4gIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG4gIHR3ZWVuLnVwZGF0ZSgpO1xuXG59LFxub25xdWl0OiBmdW5jdGlvbigpe1xuICBjb25zb2xlLmxvZygnRXhpdCBnYW1lJyk7XG59XG5cbn07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBhbGlhcyA9IHtcbiAgJ2xlZnQnICA6IDM3LFxuICAndXAnICAgIDogMzgsXG4gICdyaWdodCcgOiAzOSxcbiAgJ2Rvd24nICA6IDQwLFxuICAnc3BhY2UnIDogMzIsXG4gICd0YWInICAgOiA5LFxuICAncGFnZXVwJyAgICA6IDMzLFxuICAncGFnZWRvd24nICA6IDM0LFxuICAnZXNjYXBlJyAgICA6IDI3LFxuICAnYmFja3NwYWNlJyA6IDgsXG4gICdtZXRhJyAgOiA5MSxcbiAgJ2FsdCcgICA6IDE4LFxuICAnY3RybCcgIDogMTcsXG4gICdzaGlmdCcgOiAxNixcbiAgJ2VudGVyJyA6IDEzLFxuICAnZjEnICA6IDExMixcbiAgJ2YyJyAgOiAxMTMsXG4gICdmMycgIDogMTE0LFxuICAnZjQnICA6IDExNSxcbiAgJ2Y1JyAgOiAxMTYsXG4gICdmNicgIDogMTE3LFxuICAnZjcnICA6IDExOCxcbiAgJ2Y4JyAgOiAxMTksXG4gICdmOScgIDogMTIwLFxuICAnZjEwJyA6IDEyMSxcbiAgJ2YxMScgOiAxMjIsXG4gICdmMTInIDogMTIzXG59O1xuXG52YXIgbGlzdGVuZXJzID0ge307XG5cbnZhciBwcmVzc2VkID0ge307XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLGZ1bmN0aW9uKGV2ZW50KXtcbiAgLy8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgdmFyIGtleUNvZGUgPSBldmVudC5rZXlDb2RlIHx8wqBldmVudC53aGljaDtcbiAgcHJlc3NlZFtrZXlDb2RlXSA9IGZhbHNlO1xufSxmYWxzZSk7XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsZnVuY3Rpb24oZXZlbnQpe1xuICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhldmVudCk7XG4gIHZhciBrZXlDb2RlID0gZXZlbnQua2V5Q29kZSB8fMKgZXZlbnQud2hpY2g7XG4gIHByZXNzZWRba2V5Q29kZV0gPSB0cnVlO1xuICBPYmplY3Qua2V5cyhsaXN0ZW5lcnMpLmZvckVhY2goZnVuY3Rpb24oa2V5cyl7XG4gICAgdmFyIGksbGVuO1xuICAgIHZhciBhcnIgPSBrZXlzLnNwbGl0KCcrJyk7XG4gICAgZm9yKCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxICkge1xuICAgICAga2V5ID0gYXJyW2ldO1xuICAgICAga2V5Q29kZSA9IGFsaWFzW2tleV0gfHwga2V5LnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgICAgIGlmKCAhcHJlc3NlZFtrZXlDb2RlXSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgcHJvcCA9IHRydWU7XG4gICAgYXJyID0gbGlzdGVuZXJzW2tleXNdO1xuICAgIGZvciggaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW4gJiYgcHJvcDsgaSArPSAxICnCoHtcbiAgICAgIGFycltpXS5jYWxsKG51bGwsZXZlbnQpO1xuICAgIH1cbiAgfSk7XG59LGZhbHNlKTtcblxuZXhwb3J0cy5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICl7XG4gIHZhciBrZXlzID0gdHlwZS5zcGxpdCgnKycpLnNvcnQoKS5qb2luKCcrJyk7XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10gPT09IHVuZGVmaW5lZCApIHtcbiAgICBsaXN0ZW5lcnNba2V5c10gPSBbXTtcbiAgfVxuICBpZiggbGlzdGVuZXJzW2tleXNdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSApIHtcbiAgICBsaXN0ZW5lcnNba2V5c10ucHVzaChsaXN0ZW5lcik7XG4gIH1cbn07XG5cbmV4cG9ydHMucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApe1xuICB2YXIga2V5cyA9IHR5cGUuc3BsaXQoJysnKS5zb3J0KCkuam9pbignKycpO1xuICBpZiggbGlzdGVuZXJzW2tleXNdICE9PSB1bmRlZmluZWQgKSB7XG4gICAgdmFyIGluZGV4ID0gbGlzdGVuZXJzW2tleXNdLmluZGV4T2YobGlzdGVuZXIpO1xuICAgIGlmKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgICBsaXN0ZW5lcnNba2V5c10uc3BsaWNlKGluZGV4LDEpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5oYXNFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICl7XG4gIHZhciBrZXlzID0gdHlwZS5zcGxpdCgnKycpLnNvcnQoKS5qb2luKCcrJyk7XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10gPT09IHVuZGVmaW5lZCApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYoIGxpc3RlbmVyc1trZXlzXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiggZXZlbnQgKXtcbiAgdmFyIHR5cGUgPSBldmVudC50eXBlO1xuICBpZiggbGlzdGVuZXJzW3R5cGVdID09PSB1bmRlZmluZWQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RlbmVyc1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICBsaXN0ZW5lci5jYWxsKGV2ZW50KTtcbiAgfSk7XG59O1xuIl19
