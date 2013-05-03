define([], function () {

  /**
   * A part of a leg. It could be a leg, a knee or a hoof.
   * Will consider splitting these into separate classes later, but this is good for now.
   * @param {THREE.CubeGeometry} geometry
   * @param {THREE.MeshBasicMaterial} material
   * @param {string} name
   * @param {number} [length]
   * @param {number} [width]
   * @constructor
   */
  function LegPart(geometry, material, name, length, width) {
    THREE.Mesh.call(this, geometry, material);

    this.name = name;

    // if leg, move into correct position and add knee
    if(/leg/i.test(name)) {

      var deltaX = length/2 - 1/4;
      var deltaZ = width/2 - 1/4;

      var z = /left/i.test(name) ? -deltaZ : deltaZ;
      var x = /front/i.test(name) ? deltaX : -deltaX;

      this.position.z = z;
      this.position.x = x-0.2;
      this.position.y += 3;
      var knee = this.knee = new LegPart(geometry, material, 'knee');
      this.add(knee);
    }

    // if knee, but lower than the leg, and add hoof
    if(name === 'knee') {
      this.position.y -= 1;
      var hoof = this.hoof = new LegPart(geometry, new THREE.MeshBasicMaterial({color: 'black'}), 'hoof');
      this.add(hoof);
    }

    // put the hoof lower than the knee
    if(name === 'hoof') {
      this.position.y -= 1;
    }

  }

  // extend mesh
  LegPart.prototype = new THREE.Mesh();
  LegPart.prototype.constructor = LegPart;

  /**
   * Bends the leg part in a given direction +-1
   * @param {number} dir -1, 0 or -1, the direction of the bending
   */
  LegPart.prototype.bend = function(dir) {

    if(dir === 0) return;

    var delta = Math.PI/64;

    var max = Math.PI/8;
    var min = -Math.PI/4;

    var newValue = this.rotation.z + dir * delta;

    if(newValue > max || newValue < min) {
      return;
    }

    this.rotation.z = newValue;
  };
  
  return LegPart;

});