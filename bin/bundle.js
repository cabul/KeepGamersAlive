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

},{}],"/Users/cabul/github/KeepGamersAlive/src/arms.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Animation = require('./animation');

var leftArm = pixi.Sprite.fromImage('img/left_arm.png');
leftArm.anchor.x = 0.5;
leftArm.anchor.y = 1;

var rightArm = pixi.Sprite.fromImage('img/right_arm.png');
rightArm.anchor.x = 0.5;
rightArm.anchor.y = 1;

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

exports.addTo = function(stage){

  stage.addChild(leftArm);
  stage.addChild(rightArm);

};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":"/Users/cabul/github/KeepGamersAlive/src/animation.js","./animations/leftarm":"/Users/cabul/github/KeepGamersAlive/src/animations/leftarm.js","./animations/rightarm":"/Users/cabul/github/KeepGamersAlive/src/animations/rightarm.js"}],"/Users/cabul/github/KeepGamersAlive/src/background.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);

var bg = pixi.Sprite.fromImage('img/background.png');

bg.anchor.x = 0;
bg.anchor.y = 0;
bg.position.x = 0;
bg.position.y = 0;

exports.addTo = function(stage){
  stage.addChild(bg);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/debug.js":[function(require,module,exports){
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
var Timer = require('./timer');
var Terminal = require('./terminal');
var Progress = require('./progress');
var Stats = require('./stats');
var snow = require('./snow');

var timer = new Timer({msph:1500});
var terminal = new Terminal();

var score = {
  points: 0,
}

var progress = new Progress(score,'points');
progress.setSize(310,10).setLimit(1000).build();

var seconds = 0;

var boost = function(amnt){
  score.points += amnt;
  score.points = Math.min( Math.max( score.points + amnt, 0 ),1000 );
};

var stats = [
  'creativity',
  'sleep',
  'drink',
  'eat',
  'shower'
];

timer.onUpdate(function(time){
  var sec = Math.floor(time);
  if( sec !== seconds ){
    stats.forEach(function(stat){
      boost( Stats.get(stat).influence() );
    });
    snow.setSize( (1000 - score.points) / 100  );
    Progress.update();
  }
});

exports.addTo = function(stage){
  timer.position.x = 620;
  timer.position.y = 40;
  stage.addChild(timer);
  terminal.position.x = 150;
  terminal.position.y = 495;
  stage.addChild(terminal);
  progress.position.x = 230;
  progress.position.y = 56;
  stage.addChild(progress);
  var stat = new Stats('creativity',0xffcc55,-0.5);
  stat.position.x = 580;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('sleep',0xde87cd,3);
  stat.position.x = 620;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('drink',0x37c871,10);
  stat.position.x = 660;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('eat',0xd3575f,6);
  stat.position.x = 700;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('shower',0x5f8dd3,2);
  stat.position.x = 740;
  stat.position.y = 300;
  stage.addChild(stat);
};

var initStats = function(){
  Stats.get('sleep').value = 100;
  Stats.get('creativity').value = 10;
  Stats.get('eat').value = 80;
  Stats.get('drink').value = 70;
  Stats.get('shower').value = 70;
  Stats.enable = true;
};

exports.play = function(){
  score.points = 0;
  initStats();
  timer.reset().onComplete(function(){
    Stats.enable = false;
    terminal.println('Time is up! Your score: '+Math.round(score.points));
  }).start();
};

exports.boost = boost;

exports.fastForward = function(dt){
  // timer.time = Math.min(timer.time-dt,0);
  timer.fastForward(dt);
};


},{"./progress":"/Users/cabul/github/KeepGamersAlive/src/progress.js","./snow":"/Users/cabul/github/KeepGamersAlive/src/snow.js","./stats":"/Users/cabul/github/KeepGamersAlive/src/stats.js","./terminal":"/Users/cabul/github/KeepGamersAlive/src/terminal.js","./timer":"/Users/cabul/github/KeepGamersAlive/src/timer.js"}],"/Users/cabul/github/KeepGamersAlive/src/progress.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;

var all = [];

var Progress = function(obj,key){
  DOC.apply(this);
  this.obj = obj;
  this.key = key;
  this.from = obj[key];
  this.to = 1;
  this.border = 4;
  this.length = 100;
  this.dim = 20;
  this.colors = {
    main: 0x0000ff,
    fill: 0xffffff,
    border: 0x000000
  };
  this.orientation = 'h';
  this.bar = new pixi.Graphics();
  this.addChild(this.bar);
  return this;
};

Progress.prototype = Object.create(DOC.prototype);

Progress.prototype.setLimit = function(value){
  this.to = value;
  return this;
};
Progress.prototype.setBorder = function(value){
  this.border = value;
  return this;
};
Progress.prototype.setColors = function(value){
  var colors = this.colors;
  this.colors = {
    main: value.main || colors.main,
    fill: value.fill || colors.fill,
    border: value.border || colors.border
  };
  return this;
};
Progress.prototype.setSize = function(length,dim){
  this.length = length || this.length;
  this.dim = dim || this.dim;
  return this;
};
Progress.prototype.setOrientation = function(value){
  this.orientation = value;
  return this;
};

Progress.prototype.update = function(){
  this.bar.beginFill(this.colors.fill);
  this.bar.drawRect(0,0,this.length,this.dim);
  this.bar.endFill();
  this.bar.beginFill(this.colors.main);
  var progress = Math.min( 1, (this.obj[this.key]-this.from)/(this.to-this.from) );
  this.bar.drawRect(0,0,this.length*progress,this.dim);
  this.bar.endFill();
  return this;
};

Progress.prototype.build = function(){

  var index = all.indexOf(this);
  if( index !== -1 ) {
    all.splice(index,1);
  }

  if( this.orientation === 'v' ) {
    this.bar.rotation = -0.5 * Math.PI;
  }

  this.bar.lineStyle(this.border,this.colors.border);

  this.update();

  all.push(this);
  return this;
};

Progress.update = function(){
  all.forEach(function(prog){
    prog.update();
  });
};

module.exports = Progress;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/repl.js":[function(require,module,exports){
var game = require('./game');
var topics = require('./topics');
var Stats = require('./stats');

module.exports = function(text){

  text = text.toLowerCase();
  var args = text.split(' ');

  var com = commands[args[0]||''];
  if(!com){
    return 'Try help/list';
  }

  var inp = args[1] || '';
  var opt = com.options;
  if( !opt ) {
    return com.action(inp);
  } else {
    if( opt.indexOf(inp) === - 1 ) {
      return 'Option doesn\'t exist';
    } else {
      return com.action(inp);
    }
  }

};

var selectRandom = function(arr){
  return arr[ Math.floor(arr.length*Math.random()) ];
};

var commands = {

  help: {
    info: [ 'I am HELP', 'rtfm', 'Helpcetion' ],
    action: function(arg){
      if( arg === '' ) {
        return 'Type two words';
      }
      var com = commands[arg];
      if( !com ) {
        return 'Command doesn\'t exist';
      }
      var info = com.info || ['Contact Admin'];
      return selectRandom(com.info);
    }
  },
  list: {
    info: ['Show options'],
    action: function(arg){
      if( arg === '' ) {
        return 'Use your imagination ;)';
      }
      var com = commands[arg];
      if( !com ) {
        return 'Command doesn\'t exist';
      }
      var options = com.options || ['EVERYTHING'];
      return arg+' '+options.join(',');
    }
  },
  'goto': {
    info: [ 'Go somewhere', 'Don\'t just sit there' ],
    options: ['shop','bed','bathroom'],
    action: function(arg){
      if( arg === 'shop' ) {
        return 'On weekends the shop is closed';
      }
      if( arg === 'bed' ) {
        Stats.get('sleep').value = 80 + 20 * Math.random();
        game.fastForward( 5 + Math.random()*2 );
        return 'You awake well rested';
      }
      if( arg == 'bathroom' ) {
        Stats.get('shower').addValue( 10 + Math.random() *10 );
        return 'Flush!!';
      }
      return 'Not implemented';
    }
  },

  eat: {
    info: [ 'Eat something', 'Are you hungry?', 'Mmmmhm!!' ],
    options: ['sandwich','cake','pizza'],
    action: function(arg){
      Stats.get('eat').addValue( 30 * Math.random()*30 );
      game.fastForward(0.2);
      return 'Yummy ... '+arg;
    }
  },
  'new' : {
    info: [ 'Start a new game'],
    options: ['game'],
    action: function(arg){
      game.play();
      return 'Topic: '+topics[Math.floor(topics.length*Math.random())];
    }
  },
  drink : {
    info: ['Drink something','Don\'t dehydrate','Gulp!'],
    options: ['coffee','coke','water','beer'],
    action: function(arg){
      Stats.get('drink').addValue( 30 * Math.random()*30 );
      if( arg === 'coffee' || arg == 'coke' ) {
        Stats.get('sleep').addValue( Math.random()*20 );
      }
      game.fastForward(0.1);
      return 'Schlurp!';
    }
  },
  write : {
    info: ['Write something','Lorem Ipsum Dolor Sit Amet'],
    options: ['code','todo'],
    action: function(arg){
      Stats.get('creativity').addValue(20*Math.random());
      game.fastForward( 6 * Math.random());
      if( arg === 'code' && Math.random() > 0.7 ) {
        game.boost(100);
        return 'Good work!';
      } else {
        if( Math.random() > 0.6 ) {
          game.boost(-40);
          return 'Ups, a bug!';
        }
      }
      return 'Don\'t panic!';
    }
  },
  speak : {
    info: ['Speak with somebody','Bla bla bla'],
    options: ['gf','mum','mentor'],
    action: function(arg){
      return 'Not implemented';
    }
  },
  get : {
    info: ['Getter/Setter'],
    options: ['gf','supplies','framework'],
    action: function(arg){
      return 'Not implemented';
    }
  },
  improve : {
    info: ['Nobody is perfect'],
    options: ['graphics','gameplay'],
    action: function(arg){
      game.boost( 50 + 80 * Math.random() );
      game.fastForward(2);
      return 'Getting there!';
    }
  },
  take : {
    info: ['Take me on...','...take on me'],
    options: ['shower','break'],
    action: function(arg){
      Stats.get('creativity').addValue(20);
      if( arg === 'shower' ) {
        Stats.get('shower').value = 80 + Math.random()*20;
        game.fastForward(0.5);
        return 'clean body = clean mind';
      } else {
        Stats.get('sleep').addValue(30);
        return 'Breaking bad ;)';
      }
    }
  }
};

},{"./game":"/Users/cabul/github/KeepGamersAlive/src/game.js","./stats":"/Users/cabul/github/KeepGamersAlive/src/stats.js","./topics":"/Users/cabul/github/KeepGamersAlive/src/topics.js"}],"/Users/cabul/github/KeepGamersAlive/src/setup.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var Progress = require('./progress');
var Stats = require('./stats');

var stage = new pixi.Stage(0x66ff44);
var renderer,quit;

module.exports = {

assets: [
'img/background.png',
'img/left_arm.png',
'img/right_arm.png',
'img/icons/sleep.png',
'img/icons/creativity.png',
'img/icons/eat.png',
'img/icons/drink.png',
'img/icons/shower.png',
'img/snowman.png'
],

oninit: function(context) {
  renderer = context.renderer;
  quit = context.quit;

  require('./snow').addTo(stage);
  require('./background').addTo(stage);
  require('./arms').addTo(stage);
  require('./game').addTo(stage);

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

},
onframe: function(time,dt){

  renderer.render(stage);
  tween.update();
  Stats.update(dt);
  // Progress.update();

},
onquit: function(){
  console.log('Exit game');
}

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./arms":"/Users/cabul/github/KeepGamersAlive/src/arms.js","./background":"/Users/cabul/github/KeepGamersAlive/src/background.js","./game":"/Users/cabul/github/KeepGamersAlive/src/game.js","./progress":"/Users/cabul/github/KeepGamersAlive/src/progress.js","./snow":"/Users/cabul/github/KeepGamersAlive/src/snow.js","./stats":"/Users/cabul/github/KeepGamersAlive/src/stats.js"}],"/Users/cabul/github/KeepGamersAlive/src/snow.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);

var filter = new pixi.PixelateFilter();
filter.size.x = 20;
filter.size.y = 20;

var container = new pixi.DisplayObjectContainer();
container.filters = [ filter ];

var sprite = pixi.Sprite.fromImage('img/snowman.png');
sprite.anchor.x = 0;
sprite.anchor.y = 0;
sprite.position.x = 0;
sprite.position.y = 0;
container.addChild(sprite);

exports.addTo = function(stage){

  stage.addChild(container);

};

exports.setSize = function(x){
  filter.size.x = x;
  filter.size.y = x;
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/stats.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Progress = require('./progress');
var DOC = pixi.DisplayObjectContainer;

var all = {};

var list = [];

var Stats = function(name,color,speed,factor){
  DOC.apply(this);
  this.value = 0;
  this.speed = speed;
  this.factor = factor || 1;
  var bar = new Progress(this,'value')
    .setLimit(100)
    .setSize(150,20)
    .setOrientation('v')
    .setBorder(1)
    .setColors({main:color})
    .build();

  var icon = pixi.Sprite.fromImage('img/icons/'+name+'.png');
  bar.position.x = 5;
  bar.position.y = -10;
  this.addChild(bar);
  this.addChild(icon);
  all[name] = this;
  list.push(this);
}

Stats.prototype = Object.create(DOC.prototype);

Stats.prototype.addValue = function(value){
  this.value = Math.min(Math.max(this.value+value,0),100);
}

Stats.prototype.influence = function(){
  return (this.value)/1000 * this.factor;
};

Stats.get = function(name){
  return all[name];
}

Stats.enable = false;

Stats.update = function(dt){
  if(Stats.enable){
    list.forEach(function(stat){
      stat.value = Math.max(stat.value - dt/1000 * stat.speed, 0);
    });
  }
}

module.exports = Stats;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./progress":"/Users/cabul/github/KeepGamersAlive/src/progress.js"}],"/Users/cabul/github/KeepGamersAlive/src/terminal.js":[function(require,module,exports){
(function (global){
var gui = require('./debug');
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;
var repl = require('./repl');

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
  return ( k>=65 && k<=90 ) || k === Alias.space;
};

var Terminal = function(){
  DOC.apply(this);
  this.enabled = false;
  var bg = new pixi.Graphics();
  this.addChild(bg);
  bg.lineStyle(4,0x000000);
  bg.beginFill(0xffffff);
  bg.drawRect(0,0,496,96);
  this.prefix = '>';
  this.lines = [];
  this.lineno = 0;
  this.buffer = 'NEW GAME';
  this.lastLine = '';
  this.cursor = 8;
  this.min = 0;
  this.output = new pixi.Text('Type something',{font: 'bold 32px VT323'});
  this.output.position.x = 12;
  this.output.position.y = 12;
  this.addChild(this.output);
  this.line = new pixi.Text('>',{font: 'bold 32px VT323'});
  this.line.position.x = 12;
  this.line.position.y = 52;
  this.addChild(this.line);
  this.online = [];
  var _this = this;
  this.renderText();

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

Terminal.prototype = Object.create(DOC.prototype);

Terminal.prototype.renderText = function(){
  this.min = Math.max( this.cursor-32,0 );
  this.line.setText(this.prefix+this.buffer.substr(this.min,32));
  return this;
};

Terminal.prototype.removeChar = function(){
  var buffer = this.buffer;
  var len = buffer.length;
  var cursor = this.cursor;
  if( cursor > 0 ) {
    this.buffer = buffer.substring(0,cursor-1)+buffer.substring(cursor,len);
    this.cursor -= 1;
  }
  return this;
};

Terminal.prototype.pushChar = function(c){
  var cursor = this.cursor;
  var buffer = this.buffer;
  this.buffer = buffer.substring(0,cursor) + c + buffer.substring(cursor,buffer.length);
  this.cursor += 1;
  return this;
};

Terminal.prototype.moveCursor = function(d){
  var cursor = this.cursor + d;
  var len = this.buffer.length;
  if( cursor >= 0 && cursor <= len ) {
    this.cursor = cursor;
  }
  return this;
};

Terminal.prototype.pushLine = function(){
  this.lineno = this.lines.push( this.buffer );
  this.println( repl(this.buffer) );
  this.buffer = '';
  this.cursor = 0;
  return this;
};

Terminal.prototype.moveHistory = function(d){
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
  return this;
};

Terminal.prototype.println = function(text){
  this.output.setText(text);
  return this;
};

module.exports = Terminal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./debug":"/Users/cabul/github/KeepGamersAlive/src/debug.js","./repl":"/Users/cabul/github/KeepGamersAlive/src/repl.js"}],"/Users/cabul/github/KeepGamersAlive/src/timer.js":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var Tween = TWEEN.Tween;
var curve = TWEEN.Easing.Linear.None;

var max = 48;
var msph = 2200;

var Timer = function(options){
  DOC.apply(this);
  this.time = max;
  this.max = options.max || max;
  this.msph = options.msph || msph;
  var color = options.color || 0x000000;
  this.seconds = new pixi.Text('48:00',{font: 'bold 64px VT323',fill: color});
  this.addChild(this.seconds);
  this.extra = 0;
};

Timer.prototype = Object.create(DOC.prototype);

Timer.prototype.fastForward = function(dt){
  this.extra += dt;
};

Timer.prototype.update = function(time){
  var h = Math.floor(time) + '';
  var m = Math.floor((time-h)*60) + '';
  if( h.length === 1 ) {
    h = '0'+h;
  }
  if( m.length === 1 ){
    m = '0'+m;
  }
  this.time = time;
  this.seconds.setText( h+':'+m );
  if(this.onupdate){
    this.onupdate(time);
  }
};
Timer.prototype.reset = function(){
  this.time = this.max;
  return this;
};
Timer.prototype.onComplete = function(fun){
  this.oncomplete = fun;
  return this;
};
Timer.prototype.onUpdate = function(fun){
  this.onupdate = fun;
  return this;
}

Timer.prototype.start = function(){
  var duration = this.time * this.msph;
  var _this = this;
  this.tween = new Tween(this)
  .to({time: 0},duration)
  .easing(curve).onUpdate(function(){
    if( _this.extra ) {
      this.time += _this.extra;
      _this.extra = 0;
    }
    _this.update(this.time);
  }).onComplete(function(){
    if(_this.oncomplete){
      _this.oncomplete();
    }
  }).start();
  return this;
};

Timer.prototype.stop = function(){
  if(this.tween){
    this.tween.stop();
  }
  return this;
}

module.exports = Timer;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/KeepGamersAlive/src/topics.js":[function(require,module,exports){
module.exports = [
'Entire Game on One Screen',
'Artificial Life',
'Snowman',
'After the End',
'Death is Useful',
'One Rule',
'Generation',
'Avoid the Light',
'Deep Space',
'You Are Not Sup. 2 Be Here',
'Everything Falls Apart',
'End Where You Started',
'Isolation',
'Machines',
'You Can’t Stop',
'Color is Everything',
'Playing Both Sides',
'Borders',
'Chaos',
'Deja vu'
];
},{}],"/Users/cabul/github/KeepGamersAlive":[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Fonts = require('./fonts');
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

window.audio = new Audio('mp3/typing.mp3');
window.audio.loop = true;
window.audio.play();

var game = require('./setup');

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
},{"./fonts":"/Users/cabul/github/KeepGamersAlive/src/fonts.js","./setup":"/Users/cabul/github/KeepGamersAlive/src/setup.js"}]},{},["/Users/cabul/github/KeepGamersAlive"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uLmpzIiwic3JjL2FuaW1hdGlvbnMvbGVmdGFybS5qcyIsInNyYy9hbmltYXRpb25zL3JpZ2h0YXJtLmpzIiwic3JjL2FybXMuanMiLCJzcmMvYmFja2dyb3VuZC5qcyIsInNyYy9kZWJ1Zy5qcyIsInNyYy9mb250cy5qcyIsInNyYy9nYW1lLmpzIiwic3JjL3Byb2dyZXNzLmpzIiwic3JjL3JlcGwuanMiLCJzcmMvc2V0dXAuanMiLCJzcmMvc25vdy5qcyIsInNyYy9zdGF0cy5qcyIsInNyYy90ZXJtaW5hbC5qcyIsInNyYy90aW1lci5qcyIsInNyYy90b3BpY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIFRXRUVOID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgVHdlZW4gPSBUV0VFTi5Ud2VlbjtcbnZhciBjdXJ2ZSA9IFRXRUVOLkVhc2luZy5TaW51c29pZGFsLkluT3V0O1xudmFyIGR0b3IgPSBNYXRoLlBJIC8gMTgwO1xudmFyIHJ0b2QgPSAxODAgLyBNYXRoLlBJO1xuXG52YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24oc3ByaXRlLGZyYW1lcyl7XG5cbiAgdGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgW107XG4gIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnggPSB0aGlzLnBvc3g7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSB0aGlzLnBvc3k7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gdGhpcy5yb3Q7XG4gIH07XG4gIHRoaXMuY3Vyc29yID0gMDtcbiAgdGhpcy5sb29wID0gZmFsc2U7XG5cbn07XG5cbnZhciBmb3JtYXQgPSBmdW5jdGlvbiggZnJhbWUgKXtcbiAgcmV0dXJuIHtcbiAgICBwb3N4OiBmcmFtZS5wb3NpdGlvbi54IHx8IDAsXG4gICAgcG9zeTogZnJhbWUucG9zaXRpb24ueSB8fCAwLFxuICAgIHJvdDogKGZyYW1lLnJvdGF0aW9ufHwwKSAqIGR0b3JcbiAgfTtcbn07XG5cbkFuaW1hdGlvbi5wcm90b3R5cGUgPSB7XG5cbiAgY29uc3RydWN0b3I6IEFuaW1hdGlvbixcbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8wqB7fTtcbiAgICB0aGlzLmxvb3AgPSBvcHRpb25zLmxvb3AgfHwgdGhpcy5sb29wO1xuICAgIHRoaXMuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3IgfHwgdGhpcy5jdXJzb3I7XG4gICAgdmFyIGZyYW1lcyA9IHRoaXMuZnJhbWVzO1xuICAgIHZhciBsZW4gPSBmcmFtZXMubGVuZ3RoO1xuICAgIHZhciBkb0xvb3AgPSB0aGlzLmxvb3A7XG4gICAgdmFyIG9mZnNldCA9IHRoaXMuY3Vyc29yO1xuICAgIHZhciBpID0gb2Zmc2V0O1xuICAgIHZhciBvbmZyYW1lID0gdGhpcy5vbmZyYW1lO1xuXG4gICAgdmFyIGxhc3QsIGZpcnN0LCB0d2VlbiwgZnJhbWU7XG5cbiAgICB2YXIgbWF4ID0gaSArIGxlbjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbihmKXtcbiAgICAgIHZhciBmb3JtID0gZm9ybWF0KGZyYW1lc1tmXSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5wb3N4ID0gZm9ybS5wb3N4O1xuICAgICAgICB0aGlzLnBvc3kgPSBmb3JtLnBvc3k7XG4gICAgICAgIHRoaXMucm90ID0gZm9ybS5yb3Q7XG4gICAgICAgIGlmKF90aGlzLm9uZnJhbWUpIHtcbiAgICAgICAgICBvbmZyYW1lLmNhbGwoZnJhbWVzLGYpO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLmN1cnNvciA9IChmKzEpICUgbGVuO1xuICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICB3aGlsZSggaSA8IG1heCkge1xuICAgICAgZnJhbWUgPSBmcmFtZXNbaSVsZW5dO1xuICAgICAgdHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KGZyYW1lKSk7XG4gICAgICB2YXIgb25jb21wbGV0ZSA9IGNvbXBsZXRlKGklbGVuKTtcbiAgICAgIHZhciBvbnN0b3AgPSBzdG9wKGklbGVuKTtcbiAgICAgIGkgPSBpICsgMTtcbiAgICAgIHZhciBuZXh0ID0gZnJhbWVzW2klbGVuXTtcbiAgICAgIHR3ZWVuLnRvKGZvcm1hdChuZXh0KSxuZXh0LmR1cmF0aW9ufHwxMDAwKVxuICAgICAgLmRlbGF5KG5leHQuZGVsYXl8fDApXG4gICAgICAuZWFzaW5nKGN1cnZlKVxuICAgICAgLm9uVXBkYXRlKHRoaXMudXBkYXRlKS5vbkNvbXBsZXRlKG9uY29tcGxldGUpO1xuICAgICAgaWYoICEhbGFzdCApIHtcbiAgICAgICAgbGFzdC5jaGFpbih0d2Vlbik7XG4gICAgICB9XG4gICAgICBpZiggIWZpcnN0ICkge1xuICAgICAgICBmaXJzdCA9IHR3ZWVuO1xuICAgICAgfVxuICAgICAgbGFzdCA9IHR3ZWVuO1xuICAgIH1cblxuICAgIGlmKCBkb0xvb3AgKSB7XG4gICAgICBsYXN0LmNoYWluKGZpcnN0KTtcbiAgICB9XG5cbiAgICB0aGlzLnR3ZWVuID0gZmlyc3Q7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcGxheTogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5idWlsZChvcHRpb25zKTtcbiAgICB2YXIgZmlyc3QgPSB0aGlzLnR3ZWVuO1xuICAgIHZhciB0aW1lID0gb3B0aW9ucy50cmFuc2l0aW9uO1xuICAgIGlmKCB0aW1lICkge1xuICAgICAgZHQgPSBkdCB8fCAwO1xuICAgICAgdmFyIGZyYW1lID0gdGhpcy5mcmFtZXNbIHRoaXMuY3Vyc29yICUgdGhpcy5mcmFtZXMubGVuZ3RoIF07XG4gICAgICB2YXIgc3RhdHVzID0gdGhpcy5zcHJpdGVTdGF0dXMoKTtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnR3ZWVuID0gbmV3IFR3ZWVuKGZvcm1hdChzdGF0dXMpKVxuICAgICAgLnRvKGZvcm1hdChmcmFtZSksdGltZSlcbiAgICAgIC5kZWxheShvcHRpb25zLmRlbGF5fHwwKVxuICAgICAgLmVhc2luZyhjdXJ2ZSlcbiAgICAgIC5vblVwZGF0ZSh0aGlzLnVwZGF0ZSlcbiAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgICAgIF90aGlzLnR3ZWVuID0gZmlyc3Q7XG4gICAgICAgIGZpcnN0LnN0YXJ0KCk7XG4gICAgICB9KS5vblN0b3AoZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMudHdlZW4gPSBmaXJzdDtcbiAgICAgIH0pLnN0YXJ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0LnN0YXJ0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnR3ZWVuLnN0b3AoKTtcbiAgICB0aGlzLnR3ZWVuLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG4gICAgdGhpcy5jdXJzb3IgPSAodGhpcy5jdXJzb3IrMSkldGhpcy5mcmFtZXMubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBzcHJpdGVTdGF0dXM6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnNwcml0ZS5wb3NpdGlvbixcbiAgICAgIHJvdGF0aW9uOiB0aGlzLnNwcml0ZS5yb3RhdGlvbiAqIHJ0b2RcbiAgICB9O1xuICB9LFxuICBvbkZyYW1lOiBmdW5jdGlvbihjYil7XG4gICAgdGhpcy5vbmZyYW1lID0gY2I7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGp1bXBUbzogZnVuY3Rpb24oaSl7XG4gICAgaSA9IGkgfHwgMDtcbiAgICB2YXIgZnJhbWUgPSB0aGlzLmZyYW1lc1tpXTtcbiAgICB0aGlzLmN1cnNvciA9IChpKzEpICUgdGhpcy5mcmFtZXMubGVuZ3RoO1xuICAgIHZhciBzcHJpdGUgPSB0aGlzLnNwcml0ZTtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IGZyYW1lLnBvc2l0aW9uLng7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnkgPSBmcmFtZS5wb3NpdGlvbi55O1xuICAgIHNwcml0ZS5yb3RhdGlvbiA9IGZyYW1lLnJvdGF0aW9uICogZHRvcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcmVwZWF0OiBmdW5jdGlvbih0aW1lcyl7XG4gICAgdmFyIGZyYW1lcyA9IFtdLmNvbmNhdCh0aGlzLmZyYW1lcyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpICs9IDEgKXtcbiAgICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KGZyYW1lcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjaGFpbjogZnVuY3Rpb24ob3RoZXIpe1xuICAgIHRoaXMuZnJhbWVzID0gdGhpcy5mcmFtZXMuY29uY2F0KG90aGVyLmZyYW1lcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKHRoaXMuc3ByaXRlLFtdLmNvbmNhdCh0aGlzLmZyYW1lcykpO1xuICB9XG59O1xuXG5BbmltYXRpb24ubG9hZEFsbCA9IGZ1bmN0aW9uKHNwcml0ZSxzaGVldCl7XG4gIHZhciBhbmltcyA9IHt9O1xuICBPYmplY3Qua2V5cyhzaGVldCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICBhbmltc1tuYW1lXSA9IG5ldyBBbmltYXRpb24oc3ByaXRlLHNoZWV0W25hbWVdKTtcbiAgfSk7XG4gIHJldHVybiBhbmltcztcbn07XG5cbkFuaW1hdGlvbi5saW5rID0gZnVuY3Rpb24obGlzdCl7XG4gIHZhciBsaW5rID0gbmV3IEFuaW1hdGlvbihsaXN0WzBdLnNwcml0ZSk7XG4gIGxpc3QuZm9yRWFjaChmdW5jdGlvbihhbmltKXtcbiAgICBsaW5rLmZyYW1lcyA9IGxpbmsuZnJhbWVzLmNvbmNhdChhbmltLmZyYW1lcyk7XG4gIH0pO1xuICByZXR1cm4gbGluaztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjQwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTIsXG4gICAgZHVyYXRpb246IDMwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI2MCxcbiAgICAgIHk6IDY1MFxuICAgIH0sXG4gICAgcm90YXRpb246IDYsXG4gICAgZHVyYXRpb246IDMwMFxuICB9XG4gIF0sXG4gIHJlc3Q6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNTAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxNyxcbiAgICBkdXJhdGlvbjogNzAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjUwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTcsXG4gICAgZHVyYXRpb246IDEwMDBcbiAgfSxcblxuICBdXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgdHlwaW5nOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNDg4LFxuICAgICAgeTogNjczXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzUwLFxuICAgIGR1cmF0aW9uOiAyMDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOsKge1xuICAgICAgeDogNDY4LFxuICAgICAgeTogNjY4XG4gICAgfSxcbiAgICByb3RhdGlvbjogMzU1LFxuICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgZGVsYXk6IDE1MFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246wqB7XG4gICAgICB4OiA1MDAsXG4gICAgICB5OiA2NjBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNDMsXG4gICAgZHVyYXRpb246IDM1MFxuICB9LFxuICBdLFxuXG4gIG1vdXNlOiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNTU0LFxuICAgICAgeTogNjczXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzY4LFxuICAgIGR1cmF0aW9uOiA0MDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA1NTYsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNjgsXG4gICAgZHVyYXRpb246IDUwMFxuICB9XG4gIF1cblxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uJyk7XG5cbnZhciBsZWZ0QXJtID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvbGVmdF9hcm0ucG5nJyk7XG5sZWZ0QXJtLmFuY2hvci54ID0gMC41O1xubGVmdEFybS5hbmNob3IueSA9IDE7XG5cbnZhciByaWdodEFybSA9IHBpeGkuU3ByaXRlLmZyb21JbWFnZSgnaW1nL3JpZ2h0X2FybS5wbmcnKTtcbnJpZ2h0QXJtLmFuY2hvci54ID0gMC41O1xucmlnaHRBcm0uYW5jaG9yLnkgPSAxO1xuXG52YXIgbGVmdFNoZWV0ID0gQW5pbWF0aW9uLmxvYWRBbGwobGVmdEFybSxyZXF1aXJlKCcuL2FuaW1hdGlvbnMvbGVmdGFybScpKTtcbnZhciByaWdodFNoZWV0ID0gQW5pbWF0aW9uLmxvYWRBbGwocmlnaHRBcm0scmVxdWlyZSgnLi9hbmltYXRpb25zL3JpZ2h0YXJtJykpO1xuXG52YXIgbGVmdEFuaW0gPSBBbmltYXRpb24ubGluayhbXG4gIGxlZnRTaGVldC50eXBpbmcuY2xvbmUoKS5yZXBlYXQoNCksXG4gIGxlZnRTaGVldC5yZXN0XG5dKS5qdW1wVG8oMCkucGxheSh7bG9vcDogdHJ1ZX0pO1xuXG52YXIgcmlnaHRBbmltID0gQW5pbWF0aW9uLmxpbmsoW1xuICByaWdodFNoZWV0LnR5cGluZy5jbG9uZSgpLnJlcGVhdCgyKSxcbiAgcmlnaHRTaGVldC5tb3VzZSxcbiAgcmlnaHRTaGVldC50eXBpbmddKVxuICAuanVtcFRvKDApLnBsYXkoe2xvb3A6dHJ1ZX0pO1xuXG5leHBvcnRzLmFkZFRvID0gZnVuY3Rpb24oc3RhZ2Upe1xuXG4gIHN0YWdlLmFkZENoaWxkKGxlZnRBcm0pO1xuICBzdGFnZS5hZGRDaGlsZChyaWdodEFybSk7XG5cbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcblxudmFyIGJnID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvYmFja2dyb3VuZC5wbmcnKTtcblxuYmcuYW5jaG9yLnggPSAwO1xuYmcuYW5jaG9yLnkgPSAwO1xuYmcucG9zaXRpb24ueCA9IDA7XG5iZy5wb3NpdGlvbi55ID0gMDtcblxuZXhwb3J0cy5hZGRUbyA9IGZ1bmN0aW9uKHN0YWdlKXtcbiAgc3RhZ2UuYWRkQ2hpbGQoYmcpO1xufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIEd1aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LmRhdC5HVUkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLmRhdC5HVUkgOiBudWxsKTtcbnZhciBndWkgPSBuZXcgR3VpKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGd1aTtcbmd1aS5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsImV4cG9ydHMubG9hZCA9IGZ1bmN0aW9uKGZhbWlsaWVzLGNhbGxiYWNrKXtcblxuICB3aW5kb3cuV2ViRm9udENvbmZpZyA9IHtcbiAgICBnb29nbGU6IHtcbiAgICAgIGZhbWlsaWVzOiBmYW1pbGllc1xuICAgIH0sXG4gICAgYWN0aXZlOiBjYWxsYmFja1xuICB9O1xuICAoZnVuY3Rpb24oKXtcbiAgICB2YXIgd2YgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB3Zi5zcmMgPSAoJ2h0dHBzOicgPT09IGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID8gJ2h0dHBzJyA6ICdodHRwJykgK1xuICAgICc6Ly9hamF4Lmdvb2dsZWFwaXMuY29tL2FqYXgvbGlicy93ZWJmb250LzEvd2ViZm9udC5qcyc7XG4gICAgd2YudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIHdmLmFzeW5jID0gJ3RydWUnO1xuICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod2YsIHMpO1xuICB9KSgpO1xufTtcbiIsInZhciBUaW1lciA9IHJlcXVpcmUoJy4vdGltZXInKTtcbnZhciBUZXJtaW5hbCA9IHJlcXVpcmUoJy4vdGVybWluYWwnKTtcbnZhciBQcm9ncmVzcyA9IHJlcXVpcmUoJy4vcHJvZ3Jlc3MnKTtcbnZhciBTdGF0cyA9IHJlcXVpcmUoJy4vc3RhdHMnKTtcbnZhciBzbm93ID0gcmVxdWlyZSgnLi9zbm93Jyk7XG5cbnZhciB0aW1lciA9IG5ldyBUaW1lcih7bXNwaDoxNTAwfSk7XG52YXIgdGVybWluYWwgPSBuZXcgVGVybWluYWwoKTtcblxudmFyIHNjb3JlID0ge1xuICBwb2ludHM6IDAsXG59XG5cbnZhciBwcm9ncmVzcyA9IG5ldyBQcm9ncmVzcyhzY29yZSwncG9pbnRzJyk7XG5wcm9ncmVzcy5zZXRTaXplKDMxMCwxMCkuc2V0TGltaXQoMTAwMCkuYnVpbGQoKTtcblxudmFyIHNlY29uZHMgPSAwO1xuXG52YXIgYm9vc3QgPSBmdW5jdGlvbihhbW50KXtcbiAgc2NvcmUucG9pbnRzICs9IGFtbnQ7XG4gIHNjb3JlLnBvaW50cyA9IE1hdGgubWluKCBNYXRoLm1heCggc2NvcmUucG9pbnRzICsgYW1udCwgMCApLDEwMDAgKTtcbn07XG5cbnZhciBzdGF0cyA9IFtcbiAgJ2NyZWF0aXZpdHknLFxuICAnc2xlZXAnLFxuICAnZHJpbmsnLFxuICAnZWF0JyxcbiAgJ3Nob3dlcidcbl07XG5cbnRpbWVyLm9uVXBkYXRlKGZ1bmN0aW9uKHRpbWUpe1xuICB2YXIgc2VjID0gTWF0aC5mbG9vcih0aW1lKTtcbiAgaWYoIHNlYyAhPT0gc2Vjb25kcyApe1xuICAgIHN0YXRzLmZvckVhY2goZnVuY3Rpb24oc3RhdCl7XG4gICAgICBib29zdCggU3RhdHMuZ2V0KHN0YXQpLmluZmx1ZW5jZSgpICk7XG4gICAgfSk7XG4gICAgc25vdy5zZXRTaXplKCAoMTAwMCAtIHNjb3JlLnBvaW50cykgLyAxMDAgICk7XG4gICAgUHJvZ3Jlc3MudXBkYXRlKCk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmFkZFRvID0gZnVuY3Rpb24oc3RhZ2Upe1xuICB0aW1lci5wb3NpdGlvbi54ID0gNjIwO1xuICB0aW1lci5wb3NpdGlvbi55ID0gNDA7XG4gIHN0YWdlLmFkZENoaWxkKHRpbWVyKTtcbiAgdGVybWluYWwucG9zaXRpb24ueCA9IDE1MDtcbiAgdGVybWluYWwucG9zaXRpb24ueSA9IDQ5NTtcbiAgc3RhZ2UuYWRkQ2hpbGQodGVybWluYWwpO1xuICBwcm9ncmVzcy5wb3NpdGlvbi54ID0gMjMwO1xuICBwcm9ncmVzcy5wb3NpdGlvbi55ID0gNTY7XG4gIHN0YWdlLmFkZENoaWxkKHByb2dyZXNzKTtcbiAgdmFyIHN0YXQgPSBuZXcgU3RhdHMoJ2NyZWF0aXZpdHknLDB4ZmZjYzU1LC0wLjUpO1xuICBzdGF0LnBvc2l0aW9uLnggPSA1ODA7XG4gIHN0YXQucG9zaXRpb24ueSA9IDMwMDtcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhdCk7XG4gIHN0YXQgPSBuZXcgU3RhdHMoJ3NsZWVwJywweGRlODdjZCwzKTtcbiAgc3RhdC5wb3NpdGlvbi54ID0gNjIwO1xuICBzdGF0LnBvc2l0aW9uLnkgPSAzMDA7XG4gIHN0YWdlLmFkZENoaWxkKHN0YXQpO1xuICBzdGF0ID0gbmV3IFN0YXRzKCdkcmluaycsMHgzN2M4NzEsMTApO1xuICBzdGF0LnBvc2l0aW9uLnggPSA2NjA7XG4gIHN0YXQucG9zaXRpb24ueSA9IDMwMDtcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhdCk7XG4gIHN0YXQgPSBuZXcgU3RhdHMoJ2VhdCcsMHhkMzU3NWYsNik7XG4gIHN0YXQucG9zaXRpb24ueCA9IDcwMDtcbiAgc3RhdC5wb3NpdGlvbi55ID0gMzAwO1xuICBzdGFnZS5hZGRDaGlsZChzdGF0KTtcbiAgc3RhdCA9IG5ldyBTdGF0cygnc2hvd2VyJywweDVmOGRkMywyKTtcbiAgc3RhdC5wb3NpdGlvbi54ID0gNzQwO1xuICBzdGF0LnBvc2l0aW9uLnkgPSAzMDA7XG4gIHN0YWdlLmFkZENoaWxkKHN0YXQpO1xufTtcblxudmFyIGluaXRTdGF0cyA9IGZ1bmN0aW9uKCl7XG4gIFN0YXRzLmdldCgnc2xlZXAnKS52YWx1ZSA9IDEwMDtcbiAgU3RhdHMuZ2V0KCdjcmVhdGl2aXR5JykudmFsdWUgPSAxMDtcbiAgU3RhdHMuZ2V0KCdlYXQnKS52YWx1ZSA9IDgwO1xuICBTdGF0cy5nZXQoJ2RyaW5rJykudmFsdWUgPSA3MDtcbiAgU3RhdHMuZ2V0KCdzaG93ZXInKS52YWx1ZSA9IDcwO1xuICBTdGF0cy5lbmFibGUgPSB0cnVlO1xufTtcblxuZXhwb3J0cy5wbGF5ID0gZnVuY3Rpb24oKXtcbiAgc2NvcmUucG9pbnRzID0gMDtcbiAgaW5pdFN0YXRzKCk7XG4gIHRpbWVyLnJlc2V0KCkub25Db21wbGV0ZShmdW5jdGlvbigpe1xuICAgIFN0YXRzLmVuYWJsZSA9IGZhbHNlO1xuICAgIHRlcm1pbmFsLnByaW50bG4oJ1RpbWUgaXMgdXAhIFlvdXIgc2NvcmU6ICcrTWF0aC5yb3VuZChzY29yZS5wb2ludHMpKTtcbiAgfSkuc3RhcnQoKTtcbn07XG5cbmV4cG9ydHMuYm9vc3QgPSBib29zdDtcblxuZXhwb3J0cy5mYXN0Rm9yd2FyZCA9IGZ1bmN0aW9uKGR0KXtcbiAgLy8gdGltZXIudGltZSA9IE1hdGgubWluKHRpbWVyLnRpbWUtZHQsMCk7XG4gIHRpbWVyLmZhc3RGb3J3YXJkKGR0KTtcbn07XG5cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIERPQyA9IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcjtcblxudmFyIGFsbCA9IFtdO1xuXG52YXIgUHJvZ3Jlc3MgPSBmdW5jdGlvbihvYmosa2V5KXtcbiAgRE9DLmFwcGx5KHRoaXMpO1xuICB0aGlzLm9iaiA9IG9iajtcbiAgdGhpcy5rZXkgPSBrZXk7XG4gIHRoaXMuZnJvbSA9IG9ialtrZXldO1xuICB0aGlzLnRvID0gMTtcbiAgdGhpcy5ib3JkZXIgPSA0O1xuICB0aGlzLmxlbmd0aCA9IDEwMDtcbiAgdGhpcy5kaW0gPSAyMDtcbiAgdGhpcy5jb2xvcnMgPSB7XG4gICAgbWFpbjogMHgwMDAwZmYsXG4gICAgZmlsbDogMHhmZmZmZmYsXG4gICAgYm9yZGVyOiAweDAwMDAwMFxuICB9O1xuICB0aGlzLm9yaWVudGF0aW9uID0gJ2gnO1xuICB0aGlzLmJhciA9IG5ldyBwaXhpLkdyYXBoaWNzKCk7XG4gIHRoaXMuYWRkQ2hpbGQodGhpcy5iYXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblByb2dyZXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRE9DLnByb3RvdHlwZSk7XG5cblByb2dyZXNzLnByb3RvdHlwZS5zZXRMaW1pdCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdGhpcy50byA9IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn07XG5Qcm9ncmVzcy5wcm90b3R5cGUuc2V0Qm9yZGVyID0gZnVuY3Rpb24odmFsdWUpe1xuICB0aGlzLmJvcmRlciA9IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn07XG5Qcm9ncmVzcy5wcm90b3R5cGUuc2V0Q29sb3JzID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gIHRoaXMuY29sb3JzID0ge1xuICAgIG1haW46IHZhbHVlLm1haW4gfHwgY29sb3JzLm1haW4sXG4gICAgZmlsbDogdmFsdWUuZmlsbCB8fCBjb2xvcnMuZmlsbCxcbiAgICBib3JkZXI6IHZhbHVlLmJvcmRlciB8fCBjb2xvcnMuYm9yZGVyXG4gIH07XG4gIHJldHVybiB0aGlzO1xufTtcblByb2dyZXNzLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24obGVuZ3RoLGRpbSl7XG4gIHRoaXMubGVuZ3RoID0gbGVuZ3RoIHx8IHRoaXMubGVuZ3RoO1xuICB0aGlzLmRpbSA9IGRpbSB8fMKgdGhpcy5kaW07XG4gIHJldHVybiB0aGlzO1xufTtcblByb2dyZXNzLnByb3RvdHlwZS5zZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdGhpcy5vcmllbnRhdGlvbiA9IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cblByb2dyZXNzLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpe1xuICB0aGlzLmJhci5iZWdpbkZpbGwodGhpcy5jb2xvcnMuZmlsbCk7XG4gIHRoaXMuYmFyLmRyYXdSZWN0KDAsMCx0aGlzLmxlbmd0aCx0aGlzLmRpbSk7XG4gIHRoaXMuYmFyLmVuZEZpbGwoKTtcbiAgdGhpcy5iYXIuYmVnaW5GaWxsKHRoaXMuY29sb3JzLm1haW4pO1xuICB2YXIgcHJvZ3Jlc3MgPSBNYXRoLm1pbiggMSwgKHRoaXMub2JqW3RoaXMua2V5XS10aGlzLmZyb20pLyh0aGlzLnRvLXRoaXMuZnJvbSkgKTtcbiAgdGhpcy5iYXIuZHJhd1JlY3QoMCwwLHRoaXMubGVuZ3RoKnByb2dyZXNzLHRoaXMuZGltKTtcbiAgdGhpcy5iYXIuZW5kRmlsbCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblByb2dyZXNzLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGluZGV4ID0gYWxsLmluZGV4T2YodGhpcyk7XG4gIGlmKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgYWxsLnNwbGljZShpbmRleCwxKTtcbiAgfVxuXG4gIGlmKCB0aGlzLm9yaWVudGF0aW9uID09PSAndicgKSB7XG4gICAgdGhpcy5iYXIucm90YXRpb24gPSAtMC41ICogTWF0aC5QSTtcbiAgfVxuXG4gIHRoaXMuYmFyLmxpbmVTdHlsZSh0aGlzLmJvcmRlcix0aGlzLmNvbG9ycy5ib3JkZXIpO1xuXG4gIHRoaXMudXBkYXRlKCk7XG5cbiAgYWxsLnB1c2godGhpcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUHJvZ3Jlc3MudXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgYWxsLmZvckVhY2goZnVuY3Rpb24ocHJvZyl7XG4gICAgcHJvZy51cGRhdGUoKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2dyZXNzO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xudmFyIHRvcGljcyA9IHJlcXVpcmUoJy4vdG9waWNzJyk7XG52YXIgU3RhdHMgPSByZXF1aXJlKCcuL3N0YXRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCl7XG5cbiAgdGV4dCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgdmFyIGFyZ3MgPSB0ZXh0LnNwbGl0KCcgJyk7XG5cbiAgdmFyIGNvbSA9IGNvbW1hbmRzW2FyZ3NbMF18fCcnXTtcbiAgaWYoIWNvbSl7XG4gICAgcmV0dXJuICdUcnkgaGVscC9saXN0JztcbiAgfVxuXG4gIHZhciBpbnAgPSBhcmdzWzFdIHx8ICcnO1xuICB2YXIgb3B0ID0gY29tLm9wdGlvbnM7XG4gIGlmKCAhb3B0ICkge1xuICAgIHJldHVybiBjb20uYWN0aW9uKGlucCk7XG4gIH0gZWxzZSB7XG4gICAgaWYoIG9wdC5pbmRleE9mKGlucCkgPT09IC0gMSApIHtcbiAgICAgIHJldHVybiAnT3B0aW9uIGRvZXNuXFwndCBleGlzdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb20uYWN0aW9uKGlucCk7XG4gICAgfVxuICB9XG5cbn07XG5cbnZhciBzZWxlY3RSYW5kb20gPSBmdW5jdGlvbihhcnIpe1xuICByZXR1cm4gYXJyWyBNYXRoLmZsb29yKGFyci5sZW5ndGgqTWF0aC5yYW5kb20oKSkgXTtcbn07XG5cbnZhciBjb21tYW5kcyA9IHtcblxuICBoZWxwOiB7XG4gICAgaW5mbzogWyAnSSBhbSBIRUxQJywgJ3J0Zm0nLCAnSGVscGNldGlvbicgXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICBpZiggYXJnID09PSAnJyApIHtcbiAgICAgICAgcmV0dXJuICdUeXBlIHR3byB3b3Jkcyc7XG4gICAgICB9XG4gICAgICB2YXIgY29tID0gY29tbWFuZHNbYXJnXTtcbiAgICAgIGlmKCAhY29tICkge1xuICAgICAgICByZXR1cm4gJ0NvbW1hbmQgZG9lc25cXCd0IGV4aXN0JztcbiAgICAgIH1cbiAgICAgIHZhciBpbmZvID0gY29tLmluZm8gfHwgWydDb250YWN0IEFkbWluJ107XG4gICAgICByZXR1cm4gc2VsZWN0UmFuZG9tKGNvbS5pbmZvKTtcbiAgICB9XG4gIH0sXG4gIGxpc3Q6IHtcbiAgICBpbmZvOiBbJ1Nob3cgb3B0aW9ucyddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIGlmKCBhcmcgPT09ICcnICkge1xuICAgICAgICByZXR1cm4gJ1VzZSB5b3VyIGltYWdpbmF0aW9uIDspJztcbiAgICAgIH1cbiAgICAgIHZhciBjb20gPSBjb21tYW5kc1thcmddO1xuICAgICAgaWYoICFjb20gKSB7XG4gICAgICAgIHJldHVybiAnQ29tbWFuZCBkb2VzblxcJ3QgZXhpc3QnO1xuICAgICAgfVxuICAgICAgdmFyIG9wdGlvbnMgPSBjb20ub3B0aW9ucyB8fCBbJ0VWRVJZVEhJTkcnXTtcbiAgICAgIHJldHVybiBhcmcrJyAnK29wdGlvbnMuam9pbignLCcpO1xuICAgIH1cbiAgfSxcbiAgJ2dvdG8nOiB7XG4gICAgaW5mbzogWyAnR28gc29tZXdoZXJlJywgJ0RvblxcJ3QganVzdCBzaXQgdGhlcmUnIF0sXG4gICAgb3B0aW9uczogWydzaG9wJywnYmVkJywnYmF0aHJvb20nXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICBpZiggYXJnID09PSAnc2hvcCcgKSB7XG4gICAgICAgIHJldHVybiAnT24gd2Vla2VuZHMgdGhlIHNob3AgaXMgY2xvc2VkJztcbiAgICAgIH1cbiAgICAgIGlmKCBhcmcgPT09ICdiZWQnICkge1xuICAgICAgICBTdGF0cy5nZXQoJ3NsZWVwJykudmFsdWUgPSA4MCArIDIwICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgZ2FtZS5mYXN0Rm9yd2FyZCggNSArIE1hdGgucmFuZG9tKCkqMiApO1xuICAgICAgICByZXR1cm4gJ1lvdSBhd2FrZSB3ZWxsIHJlc3RlZCc7XG4gICAgICB9XG4gICAgICBpZiggYXJnID09ICdiYXRocm9vbScgKSB7XG4gICAgICAgIFN0YXRzLmdldCgnc2hvd2VyJykuYWRkVmFsdWUoIDEwICsgTWF0aC5yYW5kb20oKSAqMTAgKTtcbiAgICAgICAgcmV0dXJuICdGbHVzaCEhJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnTm90IGltcGxlbWVudGVkJztcbiAgICB9XG4gIH0sXG5cbiAgZWF0OiB7XG4gICAgaW5mbzogWyAnRWF0IHNvbWV0aGluZycsICdBcmUgeW91IGh1bmdyeT8nLCAnTW1tbWhtISEnIF0sXG4gICAgb3B0aW9uczogWydzYW5kd2ljaCcsJ2Nha2UnLCdwaXp6YSddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIFN0YXRzLmdldCgnZWF0JykuYWRkVmFsdWUoIDMwICogTWF0aC5yYW5kb20oKSozMCApO1xuICAgICAgZ2FtZS5mYXN0Rm9yd2FyZCgwLjIpO1xuICAgICAgcmV0dXJuICdZdW1teSAuLi4gJythcmc7XG4gICAgfVxuICB9LFxuICAnbmV3JyA6IHtcbiAgICBpbmZvOiBbICdTdGFydCBhIG5ldyBnYW1lJ10sXG4gICAgb3B0aW9uczogWydnYW1lJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgZ2FtZS5wbGF5KCk7XG4gICAgICByZXR1cm4gJ1RvcGljOiAnK3RvcGljc1tNYXRoLmZsb29yKHRvcGljcy5sZW5ndGgqTWF0aC5yYW5kb20oKSldO1xuICAgIH1cbiAgfSxcbiAgZHJpbmsgOiB7XG4gICAgaW5mbzogWydEcmluayBzb21ldGhpbmcnLCdEb25cXCd0IGRlaHlkcmF0ZScsJ0d1bHAhJ10sXG4gICAgb3B0aW9uczogWydjb2ZmZWUnLCdjb2tlJywnd2F0ZXInLCdiZWVyJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgU3RhdHMuZ2V0KCdkcmluaycpLmFkZFZhbHVlKCAzMCAqIE1hdGgucmFuZG9tKCkqMzAgKTtcbiAgICAgIGlmKCBhcmcgPT09ICdjb2ZmZWUnIHx8IGFyZyA9PSAnY29rZScgKSB7XG4gICAgICAgIFN0YXRzLmdldCgnc2xlZXAnKS5hZGRWYWx1ZSggTWF0aC5yYW5kb20oKSoyMCApO1xuICAgICAgfVxuICAgICAgZ2FtZS5mYXN0Rm9yd2FyZCgwLjEpO1xuICAgICAgcmV0dXJuICdTY2hsdXJwISc7XG4gICAgfVxuICB9LFxuICB3cml0ZSA6IHtcbiAgICBpbmZvOiBbJ1dyaXRlIHNvbWV0aGluZycsJ0xvcmVtIElwc3VtIERvbG9yIFNpdCBBbWV0J10sXG4gICAgb3B0aW9uczogWydjb2RlJywndG9kbyddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIFN0YXRzLmdldCgnY3JlYXRpdml0eScpLmFkZFZhbHVlKDIwKk1hdGgucmFuZG9tKCkpO1xuICAgICAgZ2FtZS5mYXN0Rm9yd2FyZCggNiAqIE1hdGgucmFuZG9tKCkpO1xuICAgICAgaWYoIGFyZyA9PT0gJ2NvZGUnICYmIE1hdGgucmFuZG9tKCkgPiAwLjcgKSB7XG4gICAgICAgIGdhbWUuYm9vc3QoMTAwKTtcbiAgICAgICAgcmV0dXJuICdHb29kIHdvcmshJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCBNYXRoLnJhbmRvbSgpID4gMC42ICkge1xuICAgICAgICAgIGdhbWUuYm9vc3QoLTQwKTtcbiAgICAgICAgICByZXR1cm4gJ1VwcywgYSBidWchJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICdEb25cXCd0IHBhbmljISc7XG4gICAgfVxuICB9LFxuICBzcGVhayA6IHtcbiAgICBpbmZvOiBbJ1NwZWFrIHdpdGggc29tZWJvZHknLCdCbGEgYmxhIGJsYSddLFxuICAgIG9wdGlvbnM6IFsnZ2YnLCdtdW0nLCdtZW50b3InXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICByZXR1cm4gJ05vdCBpbXBsZW1lbnRlZCc7XG4gICAgfVxuICB9LFxuICBnZXQgOiB7XG4gICAgaW5mbzogWydHZXR0ZXIvU2V0dGVyJ10sXG4gICAgb3B0aW9uczogWydnZicsJ3N1cHBsaWVzJywnZnJhbWV3b3JrJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgcmV0dXJuICdOb3QgaW1wbGVtZW50ZWQnO1xuICAgIH1cbiAgfSxcbiAgaW1wcm92ZSA6IHtcbiAgICBpbmZvOiBbJ05vYm9keSBpcyBwZXJmZWN0J10sXG4gICAgb3B0aW9uczogWydncmFwaGljcycsJ2dhbWVwbGF5J10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgZ2FtZS5ib29zdCggNTAgKyA4MCAqIE1hdGgucmFuZG9tKCkgKTtcbiAgICAgIGdhbWUuZmFzdEZvcndhcmQoMik7XG4gICAgICByZXR1cm4gJ0dldHRpbmcgdGhlcmUhJztcbiAgICB9XG4gIH0sXG4gIHRha2UgOiB7XG4gICAgaW5mbzogWydUYWtlIG1lIG9uLi4uJywnLi4udGFrZSBvbiBtZSddLFxuICAgIG9wdGlvbnM6IFsnc2hvd2VyJywnYnJlYWsnXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICBTdGF0cy5nZXQoJ2NyZWF0aXZpdHknKS5hZGRWYWx1ZSgyMCk7XG4gICAgICBpZiggYXJnID09PSAnc2hvd2VyJyApIHtcbiAgICAgICAgU3RhdHMuZ2V0KCdzaG93ZXInKS52YWx1ZSA9IDgwICsgTWF0aC5yYW5kb20oKSoyMDtcbiAgICAgICAgZ2FtZS5mYXN0Rm9yd2FyZCgwLjUpO1xuICAgICAgICByZXR1cm4gJ2NsZWFuIGJvZHkgPSBjbGVhbiBtaW5kJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0YXRzLmdldCgnc2xlZXAnKS5hZGRWYWx1ZSgzMCk7XG4gICAgICAgIHJldHVybiAnQnJlYWtpbmcgYmFkIDspJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcbnZhciB0d2VlbiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRXRUVOIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5UV0VFTiA6IG51bGwpO1xudmFyIFByb2dyZXNzID0gcmVxdWlyZSgnLi9wcm9ncmVzcycpO1xudmFyIFN0YXRzID0gcmVxdWlyZSgnLi9zdGF0cycpO1xuXG52YXIgc3RhZ2UgPSBuZXcgcGl4aS5TdGFnZSgweDY2ZmY0NCk7XG52YXIgcmVuZGVyZXIscXVpdDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbmFzc2V0czogW1xuJ2ltZy9iYWNrZ3JvdW5kLnBuZycsXG4naW1nL2xlZnRfYXJtLnBuZycsXG4naW1nL3JpZ2h0X2FybS5wbmcnLFxuJ2ltZy9pY29ucy9zbGVlcC5wbmcnLFxuJ2ltZy9pY29ucy9jcmVhdGl2aXR5LnBuZycsXG4naW1nL2ljb25zL2VhdC5wbmcnLFxuJ2ltZy9pY29ucy9kcmluay5wbmcnLFxuJ2ltZy9pY29ucy9zaG93ZXIucG5nJyxcbidpbWcvc25vd21hbi5wbmcnXG5dLFxuXG5vbmluaXQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgcmVuZGVyZXIgPSBjb250ZXh0LnJlbmRlcmVyO1xuICBxdWl0ID0gY29udGV4dC5xdWl0O1xuXG4gIHJlcXVpcmUoJy4vc25vdycpLmFkZFRvKHN0YWdlKTtcbiAgcmVxdWlyZSgnLi9iYWNrZ3JvdW5kJykuYWRkVG8oc3RhZ2UpO1xuICByZXF1aXJlKCcuL2FybXMnKS5hZGRUbyhzdGFnZSk7XG4gIHJlcXVpcmUoJy4vZ2FtZScpLmFkZFRvKHN0YWdlKTtcblxuICAvLyB2YXIgcGl4ZWxhdGVGaWx0ZXIgPSBuZXcgcGl4aS5QaXhlbGF0ZUZpbHRlcigpO1xuICAvLyB2YXIgcGl4ZWxhdGVGb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdQaXhlbGF0ZScpO1xuICAvLyBwaXhlbGF0ZUZvbGRlci5hZGQocGl4ZWxhdGVGaWx0ZXIuc2l6ZSwneCcsMSwzMikubmFtZSgnUGl4ZWxTaXplWCcpO1xuICAvLyBwaXhlbGF0ZUZvbGRlci5hZGQocGl4ZWxhdGVGaWx0ZXIuc2l6ZSwneScsMSwzMikubmFtZSgnUGl4ZWxTaXplWScpO1xuICAvL1xuICAvLyB2YXIgY29udGFpbmVyID0gbmV3IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICAvLyBjb250YWluZXIuZmlsdGVycyA9IFsgcGl4ZWxhdGVGaWx0ZXIgXTtcbiAgLy9cbiAgLy8gY29udGFpbmVyLmFkZENoaWxkKGJhY2tncm91bmQpO1xuICAvLyBzdGFnZS5hZGRDaGlsZChjb250YWluZXIpO1xuXG59LFxub25mcmFtZTogZnVuY3Rpb24odGltZSxkdCl7XG5cbiAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcbiAgdHdlZW4udXBkYXRlKCk7XG4gIFN0YXRzLnVwZGF0ZShkdCk7XG4gIC8vIFByb2dyZXNzLnVwZGF0ZSgpO1xuXG59LFxub25xdWl0OiBmdW5jdGlvbigpe1xuICBjb25zb2xlLmxvZygnRXhpdCBnYW1lJyk7XG59XG5cbn07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xuXG52YXIgZmlsdGVyID0gbmV3IHBpeGkuUGl4ZWxhdGVGaWx0ZXIoKTtcbmZpbHRlci5zaXplLnggPSAyMDtcbmZpbHRlci5zaXplLnkgPSAyMDtcblxudmFyIGNvbnRhaW5lciA9IG5ldyBwaXhpLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbmNvbnRhaW5lci5maWx0ZXJzID0gWyBmaWx0ZXIgXTtcblxudmFyIHNwcml0ZSA9IHBpeGkuU3ByaXRlLmZyb21JbWFnZSgnaW1nL3Nub3dtYW4ucG5nJyk7XG5zcHJpdGUuYW5jaG9yLnggPSAwO1xuc3ByaXRlLmFuY2hvci55ID0gMDtcbnNwcml0ZS5wb3NpdGlvbi54ID0gMDtcbnNwcml0ZS5wb3NpdGlvbi55ID0gMDtcbmNvbnRhaW5lci5hZGRDaGlsZChzcHJpdGUpO1xuXG5leHBvcnRzLmFkZFRvID0gZnVuY3Rpb24oc3RhZ2Upe1xuXG4gIHN0YWdlLmFkZENoaWxkKGNvbnRhaW5lcik7XG5cbn07XG5cbmV4cG9ydHMuc2V0U2l6ZSA9IGZ1bmN0aW9uKHgpe1xuICBmaWx0ZXIuc2l6ZS54ID0geDtcbiAgZmlsdGVyLnNpemUueSA9IHg7XG59XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcbnZhciBQcm9ncmVzcyA9IHJlcXVpcmUoJy4vcHJvZ3Jlc3MnKTtcbnZhciBET0MgPSBwaXhpLkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cbnZhciBhbGwgPSB7fTtcblxudmFyIGxpc3QgPSBbXTtcblxudmFyIFN0YXRzID0gZnVuY3Rpb24obmFtZSxjb2xvcixzcGVlZCxmYWN0b3Ipe1xuICBET0MuYXBwbHkodGhpcyk7XG4gIHRoaXMudmFsdWUgPSAwO1xuICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gIHRoaXMuZmFjdG9yID0gZmFjdG9yIHx8IDE7XG4gIHZhciBiYXIgPSBuZXcgUHJvZ3Jlc3ModGhpcywndmFsdWUnKVxuICAgIC5zZXRMaW1pdCgxMDApXG4gICAgLnNldFNpemUoMTUwLDIwKVxuICAgIC5zZXRPcmllbnRhdGlvbigndicpXG4gICAgLnNldEJvcmRlcigxKVxuICAgIC5zZXRDb2xvcnMoe21haW46Y29sb3J9KVxuICAgIC5idWlsZCgpO1xuXG4gIHZhciBpY29uID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvaWNvbnMvJytuYW1lKycucG5nJyk7XG4gIGJhci5wb3NpdGlvbi54ID0gNTtcbiAgYmFyLnBvc2l0aW9uLnkgPSAtMTA7XG4gIHRoaXMuYWRkQ2hpbGQoYmFyKTtcbiAgdGhpcy5hZGRDaGlsZChpY29uKTtcbiAgYWxsW25hbWVdID0gdGhpcztcbiAgbGlzdC5wdXNoKHRoaXMpO1xufVxuXG5TdGF0cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERPQy5wcm90b3R5cGUpO1xuXG5TdGF0cy5wcm90b3R5cGUuYWRkVmFsdWUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHRoaXMudmFsdWUgPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLnZhbHVlK3ZhbHVlLDApLDEwMCk7XG59XG5cblN0YXRzLnByb3RvdHlwZS5pbmZsdWVuY2UgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gKHRoaXMudmFsdWUpLzEwMDAgKiB0aGlzLmZhY3Rvcjtcbn07XG5cblN0YXRzLmdldCA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gYWxsW25hbWVdO1xufVxuXG5TdGF0cy5lbmFibGUgPSBmYWxzZTtcblxuU3RhdHMudXBkYXRlID0gZnVuY3Rpb24oZHQpe1xuICBpZihTdGF0cy5lbmFibGUpe1xuICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihzdGF0KXtcbiAgICAgIHN0YXQudmFsdWUgPSBNYXRoLm1heChzdGF0LnZhbHVlIC0gZHQvMTAwMCAqIHN0YXQuc3BlZWQsIDApO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHM7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgZ3VpID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xudmFyIHBpeGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5QSVhJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5QSVhJIDogbnVsbCk7XG52YXIgRE9DID0gcGl4aS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xudmFyIHJlcGwgPSByZXF1aXJlKCcuL3JlcGwnKTtcblxudmFyIEFsaWFzID0ge1xuICBsZWZ0ICAgICAgOiAzNyxcbiAgdXAgICAgICAgIDogMzgsXG4gIHJpZ2h0ICAgICA6IDM5LFxuICBkb3duICAgICAgOiA0MCxcbiAgc3BhY2UgICAgIDogMzIsXG4gIHRhYiAgICAgICA6IDksXG4gIHBhZ2V1cCAgICA6IDMzLFxuICBwYWdlZG93biAgOiAzNCxcbiAgZXNjYXBlICAgIDogMjcsXG4gIGJhY2tzcGFjZSA6IDgsXG4gIG1ldGEgICAgICA6IDkxLFxuICBhbHQgICAgICAgOiAxOCxcbiAgY3RybCAgICAgIDogMTcsXG4gIHNoaWZ0ICAgICA6IDE2LFxuICBlbnRlciAgICAgOiAxMyxcbiAgZjEgICAgICAgIDogMTEyLFxuICBmMiAgICAgICAgOiAxMTMsXG4gIGYzICAgICAgICA6IDExNCxcbiAgZjQgICAgICAgIDogMTE1LFxuICBmNSAgICAgICAgOiAxMTYsXG4gIGY2ICAgICAgICA6IDExNyxcbiAgZjcgICAgICAgIDogMTE4LFxuICBmOCAgICAgICAgOiAxMTksXG4gIGY5ICAgICAgICA6IDEyMCxcbiAgZjEwICAgICAgIDogMTIxLFxuICBmMTEgICAgICAgOiAxMjIsXG4gIGYxMiAgICAgICA6IDEyM1xufTtcblxudmFyIGlzVmFsaWRLZXkgPSBmdW5jdGlvbihrKXtcbiAgcmV0dXJuICggaz49NjUgJiYgazw9OTAgKSB8fCBrID09PSBBbGlhcy5zcGFjZTtcbn07XG5cbnZhciBUZXJtaW5hbCA9IGZ1bmN0aW9uKCl7XG4gIERPQy5hcHBseSh0aGlzKTtcbiAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gIHZhciBiZyA9IG5ldyBwaXhpLkdyYXBoaWNzKCk7XG4gIHRoaXMuYWRkQ2hpbGQoYmcpO1xuICBiZy5saW5lU3R5bGUoNCwweDAwMDAwMCk7XG4gIGJnLmJlZ2luRmlsbCgweGZmZmZmZik7XG4gIGJnLmRyYXdSZWN0KDAsMCw0OTYsOTYpO1xuICB0aGlzLnByZWZpeCA9ICc+JztcbiAgdGhpcy5saW5lcyA9IFtdO1xuICB0aGlzLmxpbmVubyA9IDA7XG4gIHRoaXMuYnVmZmVyID0gJ05FVyBHQU1FJztcbiAgdGhpcy5sYXN0TGluZSA9ICcnO1xuICB0aGlzLmN1cnNvciA9IDg7XG4gIHRoaXMubWluID0gMDtcbiAgdGhpcy5vdXRwdXQgPSBuZXcgcGl4aS5UZXh0KCdUeXBlIHNvbWV0aGluZycse2ZvbnQ6ICdib2xkIDMycHggVlQzMjMnfSk7XG4gIHRoaXMub3V0cHV0LnBvc2l0aW9uLnggPSAxMjtcbiAgdGhpcy5vdXRwdXQucG9zaXRpb24ueSA9IDEyO1xuICB0aGlzLmFkZENoaWxkKHRoaXMub3V0cHV0KTtcbiAgdGhpcy5saW5lID0gbmV3IHBpeGkuVGV4dCgnPicse2ZvbnQ6ICdib2xkIDMycHggVlQzMjMnfSk7XG4gIHRoaXMubGluZS5wb3NpdGlvbi54ID0gMTI7XG4gIHRoaXMubGluZS5wb3NpdGlvbi55ID0gNTI7XG4gIHRoaXMuYWRkQ2hpbGQodGhpcy5saW5lKTtcbiAgdGhpcy5vbmxpbmUgPSBbXTtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdGhpcy5yZW5kZXJUZXh0KCk7XG5cbiAgdmFyIGFjdGlvbnMgPSB7fTtcbiAgYWN0aW9uc1tBbGlhcy5lbnRlcl0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgX3RoaXMucHVzaExpbmUoKTtcbiAgfTtcbiAgYWN0aW9uc1tBbGlhcy5iYWNrc3BhY2VdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMucmVtb3ZlQ2hhcigpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcbiAgYWN0aW9uc1tBbGlhcy5sZWZ0XSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLm1vdmVDdXJzb3IoLTEpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcblxuICBhY3Rpb25zW0FsaWFzLnJpZ2h0XSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLm1vdmVDdXJzb3IoMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGFjdGlvbnNbQWxpYXMudXBdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUhpc3RvcnkoLTEpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcblxuICBhY3Rpb25zW0FsaWFzLmRvd25dID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUhpc3RvcnkoMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsZnVuY3Rpb24oZXZlbnQpe1xuICAgIHZhciBrZXkgPSBldmVudC5rZXlDb2RlIHx8wqBldmVudC53aGljaDtcbiAgICBpZiggaXNWYWxpZEtleShrZXkpICkge1xuICAgICAgX3RoaXMucHVzaENoYXIoU3RyaW5nLmZyb21DaGFyQ29kZShrZXkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZ1biA9IGFjdGlvbnNba2V5XTtcbiAgICAgIGlmKCEhZnVuKSB7XG4gICAgICAgIGZ1bi5jYWxsKF90aGlzLGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9KTtcblxufTtcblxuVGVybWluYWwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShET0MucHJvdG90eXBlKTtcblxuVGVybWluYWwucHJvdG90eXBlLnJlbmRlclRleHQgPSBmdW5jdGlvbigpe1xuICB0aGlzLm1pbiA9IE1hdGgubWF4KCB0aGlzLmN1cnNvci0zMiwwICk7XG4gIHRoaXMubGluZS5zZXRUZXh0KHRoaXMucHJlZml4K3RoaXMuYnVmZmVyLnN1YnN0cih0aGlzLm1pbiwzMikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblRlcm1pbmFsLnByb3RvdHlwZS5yZW1vdmVDaGFyID0gZnVuY3Rpb24oKXtcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICB2YXIgbGVuID0gYnVmZmVyLmxlbmd0aDtcbiAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yO1xuICBpZiggY3Vyc29yID4gMCApIHtcbiAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCxjdXJzb3ItMSkrYnVmZmVyLnN1YnN0cmluZyhjdXJzb3IsbGVuKTtcbiAgICB0aGlzLmN1cnNvciAtPSAxO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGVybWluYWwucHJvdG90eXBlLnB1c2hDaGFyID0gZnVuY3Rpb24oYyl7XG4gIHZhciBjdXJzb3IgPSB0aGlzLmN1cnNvcjtcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCxjdXJzb3IpICsgYyArIGJ1ZmZlci5zdWJzdHJpbmcoY3Vyc29yLGJ1ZmZlci5sZW5ndGgpO1xuICB0aGlzLmN1cnNvciArPSAxO1xuICByZXR1cm4gdGhpcztcbn07XG5cblRlcm1pbmFsLnByb3RvdHlwZS5tb3ZlQ3Vyc29yID0gZnVuY3Rpb24oZCl7XG4gIHZhciBjdXJzb3IgPSB0aGlzLmN1cnNvciArIGQ7XG4gIHZhciBsZW4gPSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gIGlmKCBjdXJzb3IgPj0gMCAmJiBjdXJzb3IgPD0gbGVuICkge1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGVybWluYWwucHJvdG90eXBlLnB1c2hMaW5lID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5saW5lbm8gPSB0aGlzLmxpbmVzLnB1c2goIHRoaXMuYnVmZmVyICk7XG4gIHRoaXMucHJpbnRsbiggcmVwbCh0aGlzLmJ1ZmZlcikgKTtcbiAgdGhpcy5idWZmZXIgPSAnJztcbiAgdGhpcy5jdXJzb3IgPSAwO1xuICByZXR1cm4gdGhpcztcbn07XG5cblRlcm1pbmFsLnByb3RvdHlwZS5tb3ZlSGlzdG9yeSA9IGZ1bmN0aW9uKGQpe1xuICB2YXIgbGluZW5vID0gdGhpcy5saW5lbm8gKyBkO1xuICB2YXIgY291bnQgPSB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgaWYoIGxpbmVubyA9PT0gY291bnQgKSB7XG4gICAgdGhpcy5idWZmZXIgPSAnJztcbiAgICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgICB0aGlzLmN1cnNvciA9IDA7XG4gIH1cbiAgaWYoIGxpbmVubyA+PSAwICYmIGxpbmVubyA8IGNvdW50ICkge1xuICAgIHRoaXMuYnVmZmVyID0gdGhpcy5saW5lc1tsaW5lbm9dO1xuICAgIHRoaXMubGluZW5vID0gbGluZW5vO1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGVybWluYWwucHJvdG90eXBlLnByaW50bG4gPSBmdW5jdGlvbih0ZXh0KXtcbiAgdGhpcy5vdXRwdXQuc2V0VGV4dCh0ZXh0KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlcm1pbmFsO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcbnZhciBET0MgPSBwaXhpLkRpc3BsYXlPYmplY3RDb250YWluZXI7XG52YXIgVFdFRU4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKTtcbnZhciBUd2VlbiA9IFRXRUVOLlR3ZWVuO1xudmFyIGN1cnZlID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xuXG52YXIgbWF4ID0gNDg7XG52YXIgbXNwaCA9IDIyMDA7XG5cbnZhciBUaW1lciA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICBET0MuYXBwbHkodGhpcyk7XG4gIHRoaXMudGltZSA9IG1heDtcbiAgdGhpcy5tYXggPSBvcHRpb25zLm1heCB8fCBtYXg7XG4gIHRoaXMubXNwaCA9IG9wdGlvbnMubXNwaCB8fCBtc3BoO1xuICB2YXIgY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8IDB4MDAwMDAwO1xuICB0aGlzLnNlY29uZHMgPSBuZXcgcGl4aS5UZXh0KCc0ODowMCcse2ZvbnQ6ICdib2xkIDY0cHggVlQzMjMnLGZpbGw6IGNvbG9yfSk7XG4gIHRoaXMuYWRkQ2hpbGQodGhpcy5zZWNvbmRzKTtcbiAgdGhpcy5leHRyYSA9IDA7XG59O1xuXG5UaW1lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERPQy5wcm90b3R5cGUpO1xuXG5UaW1lci5wcm90b3R5cGUuZmFzdEZvcndhcmQgPSBmdW5jdGlvbihkdCl7XG4gIHRoaXMuZXh0cmEgKz0gZHQ7XG59O1xuXG5UaW1lci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSl7XG4gIHZhciBoID0gTWF0aC5mbG9vcih0aW1lKSArICcnO1xuICB2YXIgbSA9IE1hdGguZmxvb3IoKHRpbWUtaCkqNjApICsgJyc7XG4gIGlmKCBoLmxlbmd0aCA9PT0gMSApIHtcbiAgICBoID0gJzAnK2g7XG4gIH1cbiAgaWYoIG0ubGVuZ3RoID09PSAxICl7XG4gICAgbSA9ICcwJyttO1xuICB9XG4gIHRoaXMudGltZSA9IHRpbWU7XG4gIHRoaXMuc2Vjb25kcy5zZXRUZXh0KCBoKyc6JyttICk7XG4gIGlmKHRoaXMub251cGRhdGUpe1xuICAgIHRoaXMub251cGRhdGUodGltZSk7XG4gIH1cbn07XG5UaW1lci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpe1xuICB0aGlzLnRpbWUgPSB0aGlzLm1heDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuVGltZXIucHJvdG90eXBlLm9uQ29tcGxldGUgPSBmdW5jdGlvbihmdW4pe1xuICB0aGlzLm9uY29tcGxldGUgPSBmdW47XG4gIHJldHVybiB0aGlzO1xufTtcblRpbWVyLnByb3RvdHlwZS5vblVwZGF0ZSA9IGZ1bmN0aW9uKGZ1bil7XG4gIHRoaXMub251cGRhdGUgPSBmdW47XG4gIHJldHVybiB0aGlzO1xufVxuXG5UaW1lci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpe1xuICB2YXIgZHVyYXRpb24gPSB0aGlzLnRpbWUgKiB0aGlzLm1zcGg7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIHRoaXMudHdlZW4gPSBuZXcgVHdlZW4odGhpcylcbiAgLnRvKHt0aW1lOiAwfSxkdXJhdGlvbilcbiAgLmVhc2luZyhjdXJ2ZSkub25VcGRhdGUoZnVuY3Rpb24oKXtcbiAgICBpZiggX3RoaXMuZXh0cmEgKSB7XG4gICAgICB0aGlzLnRpbWUgKz0gX3RoaXMuZXh0cmE7XG4gICAgICBfdGhpcy5leHRyYSA9IDA7XG4gICAgfVxuICAgIF90aGlzLnVwZGF0ZSh0aGlzLnRpbWUpO1xuICB9KS5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgaWYoX3RoaXMub25jb21wbGV0ZSl7XG4gICAgICBfdGhpcy5vbmNvbXBsZXRlKCk7XG4gICAgfVxuICB9KS5zdGFydCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblRpbWVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKXtcbiAgaWYodGhpcy50d2Vlbil7XG4gICAgdGhpcy50d2Vlbi5zdG9wKCk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbidFbnRpcmUgR2FtZSBvbiBPbmUgU2NyZWVuJyxcbidBcnRpZmljaWFsIExpZmUnLFxuJ1Nub3dtYW4nLFxuJ0FmdGVyIHRoZSBFbmQnLFxuJ0RlYXRoIGlzIFVzZWZ1bCcsXG4nT25lIFJ1bGUnLFxuJ0dlbmVyYXRpb24nLFxuJ0F2b2lkIHRoZSBMaWdodCcsXG4nRGVlcCBTcGFjZScsXG4nWW91IEFyZSBOb3QgU3VwLiAyIEJlIEhlcmUnLFxuJ0V2ZXJ5dGhpbmcgRmFsbHMgQXBhcnQnLFxuJ0VuZCBXaGVyZSBZb3UgU3RhcnRlZCcsXG4nSXNvbGF0aW9uJyxcbidNYWNoaW5lcycsXG4nWW91IENhbuKAmXQgU3RvcCcsXG4nQ29sb3IgaXMgRXZlcnl0aGluZycsXG4nUGxheWluZyBCb3RoIFNpZGVzJyxcbidCb3JkZXJzJyxcbidDaGFvcycsXG4nRGVqYSB2dSdcbl07Il19
