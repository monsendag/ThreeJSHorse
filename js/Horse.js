define(['underscore', 'LegPart', 'HorseControls'], function (_, LegPart, HorseControls) {

  /**
   * Horse
   * @param {number} length
   * @param {number} width
   * @constructor
   */
  function Horse(length, width) {
    THREE.Object3D.call(this);

    // use the same material for all body parts
    var material = new THREE.MeshBasicMaterial({
      color: 'brown'
    });

    // body
    var body = new THREE.Mesh(new THREE.CubeGeometry(length, 2, width), material);
    body.position.y += 4;

    this.add(body);

    // neck
    var neck = new THREE.Mesh(new THREE.CubeGeometry(2, 1, width), material);
    neck.position.x += length/2;
    neck.position.y += 1;
    neck.rotation.z += Math.PI/4;
    body.add(neck);

    // head
    var head = new THREE.Mesh(new THREE.CubeGeometry(1.5, 1, width), material);
    head.position.x += 1;
    head.position.y += -0.5;
    head.rotation.z -= Math.PI/4;
    neck.add(head);

    // geometry for legs
    var legGeometry = new THREE.CubeGeometry(0.5, 1, 0.5);

    // legs
    this.legs = {
      backLeftLeg: new LegPart(legGeometry, material, 'backLeftLeg', length, width),
      backRightLeg: new LegPart(legGeometry, material, 'backRightLeg', length, width),
      frontLeftLeg: new LegPart(legGeometry, material, 'frontLeftLeg', length, width),
      frontRightLeg: new LegPart(legGeometry, material, 'frontRightLeg',length, width)
    };

    this.controls = new HorseControls(this);

    // make sure we re-render the scene when Horse is moved
    this.controls.bind('change', _.bind(function() {
      this.parent.parent.render();
    },this));

    _.each(this.legs, this.add, this);
  }

  Horse.prototype = new THREE.Object3D();
  Horse.prototype.constructor = Horse;

  /**
   * @param {string} direction = 'left, right, forward, backward'
   */
  Horse.prototype.move = function(direction) {
    var turnRate = Math.PI / 16;
    var forwardSpeed = 0.2;
    var backwardSpeed = 0.05;

    switch(direction) {
      case 'left': this.rotation.y += turnRate; break;
      case 'right': this.rotation.y -= turnRate; break;
      case 'forward': this.translateX(forwardSpeed); break;
      case 'backward': this.translateX(-backwardSpeed); break;
    }
  };

  /**
   * Update controls
   */
  Horse.prototype.update = function() {
    this.controls.update();
  };

  return Horse;

});