var Client = IgeClass.extend({
  classId: 'Client',

  init: function () {
    var self = this;
    ige.showStats(1);
    ige.input.debug(true);

    // Load our textures
    self.obj = [];

    // Load the player textures and store them in the gameTexture object
    self.gameTexture = {};
    self.gameTexture.player1 = new IgeTexture('./assets/textures/sprites/player1.png');
    self.gameTexture.backgroundPattern =
      new IgeTexture('./assets/textures/background/backgroundPattern.png');

    // Wait for our textures to load before continuing
    ige.on('texturesLoaded', function () {
      // Create the HTML canvas
      ige.createFrontBuffer(true);

      // Start the engine
      ige.start(function (success) {
        // Check if the engine started successfully
        if (success) {
          // Add all the items in GameScene to the scenegraph
          // (see gameClasses/GameScene.js :: addGraph() to see
          // the method being called by the engine and how
          // the items are added to the scenegraph)
          ige.addGraph('GameScene');
        }
      });
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
