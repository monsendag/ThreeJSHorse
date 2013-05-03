define(['underscore', 'Arena'], function (_, Arena) {

  /**
   * Scene object
   * Sets up the camera, cameraController, sky and ground
   * Then adds our arena and renders
   * - Also handles the animation loop
   * @constructor
   */
  function Scene() {
    THREE.Scene.call(this);

    // create our WEBGL renderer
    var renderer = this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      gammaInput: true,
      physicallyBasedShading: true,
      shadowMapEnabled: true,
      shadowMapCullFace: THREE.CullFaceBack
    });
    renderer.setSize(window.innerWidth, window.innerHeight, true);

    // add rendering element do DOM
    document.body.appendChild(renderer.domElement);

    // set up camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 30;
    this.camera.position.y = 15;

    // allow camera to be controlled by the user
    var cameraControls = this.cameraControls = new THREE.TrackballControls(this.camera);
    // make sure we re-render the scene when a change occurs
    cameraControls.addEventListener('change', _.bind(this.render, this));

    window.addEventListener('resize', _.bind(this.resize, this), false);

    /**
     * Create Sky
     * @type {THREE.SphereGeometry}
     */
    // in its nature its just a big sphere
    var skyGeometry = new THREE.SphereGeometry(400, 30, 20);
    // material
    var skyMaterial = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      uniforms: {
        topColor: { type: "c", value: new THREE.Color(0x0077ff) },
        bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
        offset: { type: "f", value: 33 },
        exponent: { type: "f", value: 0.6 }
      },
      side: THREE.BackSide });

    var sky = new THREE.Mesh(skyGeometry, skyMaterial);

    // add sky
    this.add(sky);

    // add arena
    this.add(new Arena());

    // start animation loop
    this.update();
  }

  Scene.prototype = new THREE.Scene();
  Scene.prototype.constructor = Scene;


  /**
   * If the window is resized we need to change our canvas as well
   */
  Scene.prototype.resize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight, true);
    this.cameraControls.handleResize();

    this.render();
  };

  /**
   * Recursively runs update on every object that has implemented the method
   * Useful for separation of concerns. I.e the horse can do it's own animations
   */
  Scene.prototype.update = function () {
    // call animate on all children if exists
    this.children.forEach(function (child) {
      child.traverse(function (obj) {
        if ('update' in obj && typeof obj.update === "function") {
          obj.update();
        }
      });
    });

    this.cameraControls.update();
    requestAnimationFrame(_.bind(this.update, this));
  };

  /**
   * Re-renders the entire scene
   */
  Scene.prototype.render = function () {
    this.renderer.render(this, this.camera);
  };

  return Scene;
});