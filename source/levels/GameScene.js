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
      .backgroundPattern(ige.client.gameTexture.backgroundPattern, 'repeat', true, true)
      .mount(self.gameScene);

    // Create an entity and mount it to the scene
    self.player = new Character()
      .id('player1')
      .addComponent(PlayerControlledComponent)
      .depth(1)
      .texture(ige.client.gameTexture.player1)
      .width(ige.client.gameTexture.player1._sizeX)
      .height(ige.client.gameTexture.player1._sizeY)
      .translateTo(0, 0, 0)
      .mount(self.gameScene);

    // Setup physics for the player
    self.player
      .box2dBody({
        type: 'dynamic',
        linearDamping: 20.0,
        angularDamping: 0.1,
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

    // Create a static box to test out physics interaction
    new IgeEntityBox2d()
      .translateTo(0, 50, 0)
      .width(400)
      .height(40)
      .drawBounds(true)
      .mount(self.gameScene)
      .box2dBody({
        type: 'static',
        allowSleep: true,
        fixtures: [{
          shape: {
            type: 'rectangle'
          }
        }]
      });

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
  }
});
