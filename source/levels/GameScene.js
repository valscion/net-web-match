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

    // Tell the main viewport's camera to track the
    // character entity's movement
    self.vp1.camera.trackTranslate(self.player, 0);
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
