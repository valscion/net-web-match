var GameScene = IgeScene2d.extend({
  classId: 'GameScene',
  componentId: 'gameScene',

  init: function () {
    IgeScene2d.prototype.init.call(this);

    this.id('gameScene');

    // Store loaded maps here
    this._maps = {};
  },

  /**
   * Adds a map to the scene and changes to it
   */
  addMap: function (mapName, layerArray, layersById) {
    this._maps[mapName] = {
      layerArray: layerArray,
      layersById: layersById
    };

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
          .drawBounds(true)
          .drawBoundsData(false)
          .mount(this.$('backgroundScene'));
      }
    }
  },

  /**
   * Adds a new character to the scene
   */
  addPlayerToScene: function (clientId) {
    var freePos = this._unoccupiedTilePosition();

    var player = new Character()
      .id(clientId)
      .addComponent(PlayerControlledComponent)
      .translateTo(freePos.x, freePos.y, 0)
      .mount(this);

    return player;
  },

  /**
   * Finds a free tile from the map
   */
  _unoccupiedTilePosition: function () {
    return new IgePoint2d(120, 120);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameScene; }
