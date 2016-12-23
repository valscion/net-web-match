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

    // Wait for our textures to load before continuing
    ige.on('texturesLoaded', function () {
      // Create the HTML canvas
      ige.createFrontBuffer(true);

      // Start the engine
      ige.start(function (success) {
        // Check if the engine started successfully
        if (success) {
          // Load the base scene data
          ige.addGraph('IgeBaseScene');

          // Add all the items in Scene1 to the scenegraph
          // (see gameClasses/Scene1.js :: addGraph() to see
          // the method being called by the engine and how
          // the items are added to the scenegraph)
          ige.addGraph('Scene1');
        }
      });
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }