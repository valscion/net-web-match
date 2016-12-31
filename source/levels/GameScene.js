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
    var player = new Character()
      .id(clientId)
      .addComponent(PlayerControlledComponent)
      .translateTo(120, 120, 0)
      .mount(this);

    return player;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameScene; }
