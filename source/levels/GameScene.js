var GameScene = IgeSceneGraph.extend({
  classId: 'GameScene',

  /**
   * Called when loading the graph data via ige.addGraph().
   * @param options
   */
  addGraph: function (options) {
    var self = ige.isClient ? ige.client : ige.server;

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
    if (ige.isClient) {
      self.backgroundScene = new IgeScene2d()
        .id('backgroundScene')
        .depth(-1)
        .ignoreCamera(true)
        .backgroundPattern(ige.client.assets.backgroundPattern, 'repeat', true, true)
        .mount(self.gameScene);
    }
  },

  /**
   * The method called when the graph items are to be removed from the
   * active graph.
   */
  removeGraph: function () {
    // Destroy the viewport
    ige.$('vp1').destroy();

    // Since all our objects in addGraph() were mounted to the
    // 'gameScene' entity, destroying it will remove everything we
    // added to it.
    ige.$('gameScene').destroy();
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameScene; }
