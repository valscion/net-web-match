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

    // Create the background scene for tilemap
    self.backgroundScene = new IgeScene2d()
      .id('backgroundScene')
      .depth(-1)
      .mount(self.gameScene);

    // Load the tiled map data and handle the return data
    self.addComponent(IgeTiledComponent);
    self.tiled.loadJson(tiledTestMap, function (layerArray, layersById) {
      if (ige.isServer) {
        // Create static box2d objects from the collision layer
        ige.box2d.staticsFromMap(layersById.WallLayer);
      }

      if (ige.isClient) {
        // We can add all our layers to our main scene by looping the
        // array or we can pick a particular layer via the layersById
        // object.
        var i;

        for (i = 0; i < layerArray.length; i++) {
          layerArray[i]
            .tileWidth(40)
            .tileHeight(40)
            .autoSection(20)
            //.isometricMounts(false)
            .drawBounds(true)
            .drawBoundsData(false)
            .mount(self.backgroundScene);
        }
      }
    });
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
