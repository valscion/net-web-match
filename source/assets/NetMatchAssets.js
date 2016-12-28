var NetMatchAssets = IgeClass.extend({
  classId: 'NetMatchAssets',
  componentId: 'assets',

  init: function () {
    var self = this;

    // Load the player textures
    self.player1 = {
      pistol: new IgeTexture('./assets/textures/sprites/player1.png'),
      machinegun: new IgeTexture('./assets/textures/sprites/player2.png'),
      bazooka: new IgeTexture('./assets/textures/sprites/player3.png'),
      chainsaw: new IgeTexture('./assets/textures/sprites/player4.png'),
      shotgun: new IgeTexture('./assets/textures/sprites/player5.png'),
      launcher: new IgeTexture('./assets/textures/sprites/player6.png')
    };
    self.player2 = {
      pistol: new IgeTexture('./assets/textures/sprites/player1_2.png'),
      machinegun: new IgeTexture('./assets/textures/sprites/player2_2.png'),
      bazooka: new IgeTexture('./assets/textures/sprites/player3_2.png'),
      chainsaw: new IgeTexture('./assets/textures/sprites/player4_2.png'),
      shotgun: new IgeTexture('./assets/textures/sprites/player5_2.png'),
      launcher: new IgeTexture('./assets/textures/sprites/player6_2.png')
    };

    // Load the bullets
    self.bullets = {
      pistol: new IgeTexture('./assets/textures/sprites/pistol_bullet.png')
    };

    self.backgroundPattern =
      new IgeTexture('./assets/textures/background/backgroundPattern.png');
  }
});
