define(['underscore', 'asevented', 'mousetrap'], function (_, asEvented, Mousetrap) {

  /**
   * A controller for moving a Horse.
   *
   * Listens for user input, then sets a variable which denotes an active movement.
   * Its update callback gets called on every tick, where it in turn calls the movement method needed.
   *
   * Use a separate controller to detach the event listeners from the Horse object.
   *
   * @param {Horse} horse
   * @param {HTMLElement} domElement
   * @constructor
   */
  var HorseControls = function (horse, domElement) {

    this.horse = horse;
    this.domElement = domElement || document;

    // map keys to directions
    this.move = {
      up: ['forward', false],
      down: ['backward', false],
      left: ['left', false],
      right: ['right', false]
    };

    // Activate Horse movement
    Mousetrap.bind(['up', 'down', 'left', 'right'], _.bind(function (e, keyname) {
      this.move[keyname][1] = true;
    },this), 'keydown');

    // Deactivate Horse movement
    Mousetrap.bind(['up', 'down', 'right', 'left'], _.bind(function (e, keyname) {
      this.move[keyname][1] = false;
    },this), 'keyup');

    // leg bending
    var legs = this.legs = {
      'frontRightLeg': {
        //       +   -  direction
        'leg': ['q', 'w', 0],
        'knee': ['a', 's', 0],
        'hoof': ['z', 'x', 0]
      },
      'frontLeftLeg': {
        'leg': ['e', 'r', 0],
        'knee': ['d', 'f', 0],
        'hoof': ['c', 'v', 0]
      }
    };

    // attach listener to each key
    _.each(legs, function (legParts, legName) {

      _.each(legParts, function (keys, legPart) {

        Mousetrap.bind(keys[0], function () {
          legs[legName][legPart][2] = 1;
        }, 'keypress');

        Mousetrap.bind(keys[1], function () {
          legs[legName][legPart][2] = -1;
        }, 'keypress');

        Mousetrap.bind([keys[0], keys[1]], function () {
          legs[legName][legPart][2] = 0;
        }, 'keyup');

      }, this);
    }, this);

  };

  /**
   * This update method is called on every tick
   * Does the transforming method on the horse object
   */
  HorseControls.prototype.update = function () {
    // move horse
    this.moveHorse();
    this.moveLegs();
  };

  /**
   * Move horse if key is pressed
   */
  HorseControls.prototype.moveHorse = function () {

    var change = false;

    _.each(this.move, function(data) {
      if(data[1]) {
        change = true;
       this.horse.move(data[0]);
      }
    },this);

    if(change) {
      this.trigger('change');
    }

  };

  /**
   * Move each leg if key is pressed
   */
  HorseControls.prototype.moveLegs = function () {
    var change = false;
    _.each(this.legs, function (legParts, legName) {

      _.each(legParts, function (keys, legpart) {

        var direction = this.legs[legName][legpart][2];
        var obj;
        switch (legpart) {
          case 'leg':
            obj = this.horse.legs[legName];
            break;
          case 'knee':
            obj = this.horse.legs[legName].knee;
            break;
          case 'hoof':
            obj = this.horse.legs[legName].knee.hoof;
            break;
        }

        obj.bend(direction);

        // let listeners know we changed something
        if (Math.abs(direction) > 0) {
          this.trigger('change');
        }

      }, this);
    }, this);
  }

  // attach a nifty event library
  asEvented.call(HorseControls.prototype);

  return HorseControls;
});