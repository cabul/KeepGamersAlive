var easing = require('tween').Easing;

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
