var NetMatchAssets = IgeClass.extend({
  classId: 'NetMatchAssets',
  componentId: 'assets',

  init: function () {
    var self = this;

    // Load the player texture
    self.player1 = new IgeTexture('./assets/textures/sprites/player1.png');
    self.backgroundPattern =
      new IgeTexture('./assets/textures/background/backgroundPattern.png');
  }
});
