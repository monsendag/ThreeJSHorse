define([], function() {

  /**
   * Floor class
   * @constructor
   */
  function Floor() {

    var geometry = new THREE.CubeGeometry(30, 1, 30);
    var material = new THREE.MeshBasicMaterial({color: 'green'});

    THREE.Mesh.call(this, geometry, material);

    this.position.y = 0;

  }

  Floor.prototype = new THREE.Mesh();
  Floor.prototype.constructor = Floor;

  return Floor;

});