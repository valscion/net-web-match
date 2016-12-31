var GameScene = IgeScene2d.extend({
  classId: 'GameScene',
  componentId: 'gameScene',

  init: function () {
    IgeScene2d.prototype.init.call(this);

    this.id('gameScene');

    // Store loaded maps here
    this._maps = {};

    // Store the current map name here
    this._currentMap = null;

    // Next unoccupied tile position in the shuffled array
    this._nextUnoccupiedTileIndex = 0;
  },

  /**
   * Adds a map to the scene and changes to it
   */
  addMap: function (mapName, layerArray, layersById) {
    this._maps[mapName] = {
      layerArray: layerArray,
      layersById: layersById,
      collisionLayer: layersById.WallLayer,
      width: layersById.WallLayer.map.mapData()[0].length,
      height: layersById.WallLayer.map.mapData().length
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

    if (!this._currentMap) {
      this._currentMap = mapName;
    }
  },

  /**
   * Adds a new player character to the scene
   */
  addPlayerToScene: function (clientId) {
    var freePos = this._nextUnoccupiedPosition();

    var player = new Character()
      .id(clientId)
      .addComponent(PlayerComponent)
      .translateTo(freePos.x, freePos.y, 0)
      .mount(this);

    return player;
  },

  /**
   * Adds a new bot character to the scene
   */
  addBotToScene: function (botName) {
    var freePos = this._nextUnoccupiedPosition();

    var bot = new Character()
      .id(botName)
      .addComponent(ClassicBotComponent)
      .translateTo(freePos.x, freePos.y, 0)
      .mount(this);

    return bot;
  },

  /**
   * Finds the next free position from the game
   */
  _nextUnoccupiedPosition: function () {
    var map = this._maps[this._currentMap];
    var freeTiles = this._freeTilesForMap(map);
    var tilePosition = freeTiles[this._nextUnoccupiedTileIndex];

    this._nextUnoccupiedTileIndex++;
    if (this._nextUnoccupiedTileIndex > freeTiles.length) {
      this._nextUnoccupiedPosition = 0;
    }

    return tilePosition.multiply(
      map.collisionLayer.tileWidth(),
      map.collisionLayer.tileHeight()
    );
  },

  /**
   * Gets the free tiles for a map, using lazy processing
   */
  _freeTilesForMap: function (map) {
    if (map.freeTiles) {
      // We've already calculated these once, so just return the memoized value
      return map.freeTiles;
    }

    map.freeTiles = this._shuffle(this._calculateFreeTiles(map));

    return map.freeTiles;
  },

  /**
   * Calculates an array of tiles that are unoccupied for the collision layer
   */
  _calculateFreeTiles: function (map) {
    var collisionMap = map.collisionLayer.map;
    var freeTiles = [];
    var maxX = map.width;
    var maxY = map.height;
    var x, y;

    for (x = 0; x < maxX; x++) {
      for (y = 0; y < maxY; y++) {
        if (!collisionMap.collision(x, y)) {
          freeTiles.push(new IgePoint2d(x, y));
        }
      }
    }

    return freeTiles;
  },

  /**
   * A helper to shuffle an array, using Fisher-Yates Shuffle
   *
   * http://stackoverflow.com/a/6274398/1152564
   */
  _shuffle: function (array) {
    var index, temp;
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameScene; }
