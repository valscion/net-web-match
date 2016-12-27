var GameScene = IgeSceneGraph.extend({
  classId: 'GameScene',

  /**
   * Called when loading the graph data via ige.addGraph().
   * @param options
   */
  addGraph: function (options) {
    var self = ige.client;

    // Create the scene
    self.gameScene = new IgeScene2d()
      .id('gameScene');

    // Create the main viewport
    self.vp1 = new IgeViewport()
      .id('vp1')
      .autoSize(true)
      .scene(self.gameScene)
      .drawBounds(false)
      .mount(ige);

    // Create the background repeat scene
    self.backgroundScene = new IgeScene2d()
      .id('backgroundScene')
      .depth(0)
      .ignoreCamera(true)
      .backgroundPattern(ige.client.assets.backgroundPattern, 'repeat', true, true)
      .mount(self.gameScene);

    // Create an entity and mount it to the scene
    self.player = new Character()
      .id('player1')
      .addComponent(PlayerControlledComponent)
      .depth(1)
      .translateTo(0, 0, 0)
      .mount(self.gameScene);

    // Setup physics for the player
    self.player
      .box2dBody({
        type: 'dynamic',
        // Velocity is always set manually and unset when needed, so
        // we don't want the physics engine to slow the player down
        // unnecessarily. This way we will get similar velocity no
        // matter what FPS the game is currently running on.
        linearDamping: 0.0,
        angularDamping: 0.0,
        allowSleep: true,
        bullet: false,
        gravitic: false,
        fixedRotation: false,
        fixtures: [{
          density: 1.0,
          friction: 0.5,
          restitution: 0,
          shape: {
            type: 'circle'
          }
        }]
      });

    this._addMap();

    // Tell the main viewport's camera to track the
    // character entity's movement
    self.vp1.camera.trackTranslate(self.player, 0);

    // Add the box2d debug painter entity to the
    // scene to show the box2d body outlines
    ige.box2d.enableDebug(self.gameScene);
  },

  /**
   * The method called when the graph items are to be removed from the
   * active graph.
   */
  removeGraph: function () {
    // Since all our objects in addGraph() were mounted to the
    // 'gameScene' entity, destroying it will remove everything we
    // added to it.
    ige.$('gameScene').destroy();
  },

  _addMap: function () {
    var self = ige.client;
    var bodyDeclaration = {
      type: 'static',
      allowSleep: true,
      fixtures: [{
        shape: {
          type: 'rectangle'
        }
      }]
    };

    [
      new IgeEntityBox2d().translateTo(0, 150, 0).width(500).height(40),
      new IgeEntityBox2d().translateTo(0, -150, 0).width(500).height(40),
      new IgeEntityBox2d().translateTo(230, 0, 0).width(40).height(260),
      new IgeEntityBox2d().translateTo(-230, 0, 0).width(40).height(260),
    ].map(function (box) {
      box
        .drawBounds(true)
        .mount(self.gameScene)
        .box2dBody(bodyDeclaration);
    });
  }
});
