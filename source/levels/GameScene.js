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
    var map = {
      layerArray: layerArray,
      layersById: layersById,
      collisionLayer: layersById.WallLayer,
      width: layersById.WallLayer.map.mapData()[0].length,
      height: layersById.WallLayer.map.mapData().length
    };

    if (ige.isServer) {
      // Create static box2d objects from the collision layer
      this._setupBox2dForMap(map);
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

    this._maps[mapName] = map;
    if (!this._currentMap) {
      this._currentMap = mapName;
    }
  },

  /**
   * Adds collision layer as box2d objects to the game
   */
  _setupBox2dForMap: function (map) {
    var collisionLayer = map.collisionLayer;
    var tileWidth = collisionLayer.tileWidth();
    var tileHeight = collisionLayer.tileHeight();
    var posX;
    var posY;
    var rectArray;
    var rectCount;
    var rect;

    // Get the array of rectangle bounds based on
    // the map's data
    rectArray = collisionLayer.scanRects();
    rectCount = rectArray.length;

    while (rectCount--) {
      rect = rectArray[rectCount];

      posX = (tileWidth * (rect.width / 2));
      posY = (tileHeight * (rect.height / 2));

      new IgeEntityBox2d()
        .category('Map')
        .translateTo(rect.x * tileWidth + posX, rect.y * tileHeight + posY, 0)
        .width(rect.width * tileWidth)
        .height(rect.height * tileHeight)
        .drawBounds(true)
        .drawBoundsData(false)
        .box2dBody({
          type: 'static',
          allowSleep: true,
          fixtures: [{
            shape: {
              type: 'rectangle'
            }
          }]
        });
    }
  },

  /**
   * Adds a new player character to the scene
   */
  addPlayerToScene: function (clientId) {
    var player = new Character()
      .id(clientId)
      .addComponent(PlayerComponent);

    this.placeCharacterToScene(player);
    player.mount(this);

    return player;
  },

  /**
   * Adds a new bot character to the scene
   */
  addBotToScene: function (botName) {
    var bot = new Character()
      .id(botName)
      .addComponent(ClassicBotComponent);

    this.placeCharacterToScene(bot);
    bot.mount(this);

    return bot;
  },

  /**
   * Places the given character to the scene
   */
  placeCharacterToScene: function (char) {
    // TODO: Calculate freePos by center without duplicating
    //       the radius of a Character here.
    var freePos = this._nextUnoccupiedPosition().addPoint({x: 19, y: 19});
    char.translateTo(freePos.x, freePos.y, 0);
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
