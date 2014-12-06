(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cabul/github/KeepGamersAlive":[function(require,module,exports){
(function (global){
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Gui = (typeof window !== "undefined" ? window.dat.GUI : typeof global !== "undefined" ? global.dat.GUI : null);

var gui = new Gui();

var stage = new pixi.Stage(0x66FF99);
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var texture = pixi.Texture.fromImage('img/background.png');

var background = new pixi.Sprite(texture);

background.anchor.x = 0;
background.anchor.y = 0;
background.position.x = 0;
background.position.y = 0;

pixelateFilter = new pixi.PixelateFilter();
var pixelate = true;
var pixelateFolder = gui.addFolder('Pixelate');
pixelateFolder.add(pixelate).name('Enable');
pixelateFolder.add(pixelateFilter.size,'x',1,32).name('PixelSizeX');
pixelateFolder.add(pixelateFilter.size,'y',1,32).name('PixelSizeY');

container = new pixi.DisplayObjectContainer();

stage.addChild(background);

requestAnimFrame( function render(){

  requestAnimFrame(render);

  renderer.render(stage);

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},["/Users/cabul/github/KeepGamersAlive"]);
