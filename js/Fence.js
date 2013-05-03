define([], function() {


  /**
   * Fence class
   * @param length
   * @param i
   * @constructor
   */
  function Fence(length, i) {

    THREE.Object3D.call(this);

    // rotate fence to its axis
    this.rotation.y = Math.PI * (i/2);

    this.length = length;
    this.height = 4;

    // move fence from center towards it's position
    var axis = i % 2 === 0 ? 'z' : 'x';
    if(axis == 'x') i -= 1;
    this.position[axis] = (i-1) * (length/2);

    this.material = new THREE.MeshBasicMaterial({color: 'brown'});

    this.createPoles().concat(this.createCrossbars()).forEach(function(mesh) {
      this.add(mesh);
    },this);

  }
  Fence.prototype = new THREE.Object3D();
  Fence.prototype.constructor = Fence;

  /**
   * Create vertical poles
   * @returns {Array}
   */
  Fence.prototype.createPoles = function() {
    var geometry = new THREE.CubeGeometry(0.3, this.height, 0.3);

    var poles = [];
    // create vertical poles
    var pole;
    [0, this.length/2].forEach(function(x) {
      pole = new THREE.Mesh(geometry, this.material);
      pole.position.x = x;
      pole.position.y = 2.5;
      poles.push(pole);
    },this);

    return poles;
  };

  /**
   * Create horizontal crossbars
   * @returns {Array}
   */
  Fence.prototype.createCrossbars = function() {
    var geometry = new THREE.CubeGeometry(this.length, 0.3, 0.3);
    // create crossbar
    var crossbars = [];

    var crossbar;
    [1, 3].forEach(function(y) {
      crossbar = new THREE.Mesh(geometry, this.material);
      crossbar.position.y = y;
      crossbars.push(crossbar);
    },this);

    return crossbars;
  };

  return Fence;

});