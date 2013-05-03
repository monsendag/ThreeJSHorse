define(['underscore','Floor', 'Fence', 'Horse', 'HorseControls'], function (_, Floor, Fence, Horse, HorseControls) {

  /**
   * Arena
   * Container object for floor, fences and the Horse
   * @constructor
   */
  function Arena() {
    THREE.Object3D.apply(this, arguments);

    var size = 25;

    // add floor
    this.add(new Floor(size));

    // add fences
    [0,1,2,3].forEach(function(i) {
      this.add(new Fence(size, i));
    },this);

    var horse = new Horse(7,3);
    this.add(horse);

  }

  Arena.prototype = new THREE.Object3D();
  Arena.prototype.constructor = Arena;


  return Arena;
});