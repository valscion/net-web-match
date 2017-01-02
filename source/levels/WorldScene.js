var WorldScene = IgeSceneGraph.extend({
  classId: 'WorldScene',

  /**
   * Called when loading the graph data via ige.addGraph().
   * @param options
   */
  addGraph: function (options) {
    var self = ige.isClient ? ige.client : ige.server;

    // Create the scene
    ige.gameScene = new GameScene();

    // Create the main viewport
    self.vp1 = new IgeViewport()
      .id('vp1')
      .autoSize(true)
      .scene(ige.gameScene)
      .drawBounds(false)
      .mount(ige);

    // Create the background scene for tilemap
    self.backgroundScene = new IgeScene2d()
      .id('backgroundScene')
      .depth(-1)
      .mount(ige.gameScene);

    // Load the tiled map data and handle the return data
    self.addComponent(IgeTiledComponent);
    self.tiled.loadJson(this._tiledMap('TiledTestMap'), function (layerArray, layersById) {
      ige.gameScene.addMap('TiledTestMap', layerArray, layersById);
    });

    // Add a component useful for zooming the map
    if (ige.isClient) {
      self.cameraZoomer = new CameraZoomer();
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
  },

  _tiledMap: function (mapName) {
    var allTiledMaps = ige.isClient ? TileMaps : global;
    var map = allTiledMaps[mapName];

    if (!map) {
      this.log('Map with name "' + mapName + '" was not found!', 'error');
      return null;
    }

    // Fix tileset image paths to be loadable
    return Object.assign({}, map, {
      tilesets: map.tilesets.map(function (tileset) {
        return Object.assign({}, tileset, {
          image: "./maps/" + mapName + "/" + tileset.image
        });
      })
    })
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = WorldScene; }
