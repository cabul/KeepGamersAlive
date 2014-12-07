var gui = require('./debug');
var pixi = require('pixi');
var DOC = pixi.DisplayObjectContainer;

var Console = function(options){
  DOC.apply(this);
  options = options || {};
  var fontsize = (options.fontsize===undefined)?32:options.fontsize;
  var padding = (options.padding===undefined)?0:options.padding;
  var color = (options.color===undefined)?0x000000:options.color;
  var background = (options.background===undefined)?0xffffff:options.background;
  var lines = (options.lines===undefined)?4:options.lines;
  var columns = (options.columns===undefined)?16:options.columns;
  this.style = {
    font: fontsize+'px VT323',
    fill: color
  };

  var width = padding*4 + columns * fontsize;
  var height = padding*4 + lines * fontsize;

  var bg = new pixi.Graphics();
  this.addChild(bg);

  bg.lineStyle(padding,color);
  bg.beginFill(background);
  bg.drawRect(0,0,width,height);
  bg.endFill();

  bg.lineStyle(0);
  var str = '>';
  for(var i = 0; i < columns; i += 1) {
    str += 'Bp';
  }
  for(i = 0; i < lines; i += 1 ) {
    var text = new pixi.Text(str,this.style);
    text.position.x = padding*2;
    text.position.y = i * fontsize + padding*2 + fontsize/8;
    this.addChild(text);
    // bg.beginFill((color+background) * Math.random());
    // bg.drawRect( padding, i * fontsize + padding, fontsize*columns, fontsize );
    // bg.endFill();
  }


};

Console.prototype = DOC.prototype;

module.exports = Console;
