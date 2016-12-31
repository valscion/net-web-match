var GameScene = IgeScene2d.extend({
  classId: 'GameScene',
  componentId: 'gameScene',

  init: function () {
    IgeScene2d.prototype.init.call(this);

    this.id('gameScene');
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
