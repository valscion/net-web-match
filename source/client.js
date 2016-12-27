var Client = IgeClass.extend({
  classId: 'Client',

  init: function () {
    var self = this;
    ige.showStats(1);
    ige.input.debug(true);

    // Add physics and setup physics world
    ige.addComponent(IgeBox2dComponent)
      .box2d.sleep(true)
      .box2d.createWorld()
      .box2d.start();

    // Load the player textures and store them in the gameTexture object
    self.gameTexture = {};
    self.gameTexture.player1 = new IgeTexture('./assets/textures/sprites/player1.png');
    // self.gameTexture.backgroundPattern =
    //   new IgeTexture('./assets/textures/background/backgroundPattern.png');

    self._addEditor();

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
  },

  _addEditor: function () {
    ige.addComponent(IgeEditorComponent);
    var editor = ige.editor;

    // Hook the input component's keyUp and check for the = symbol... if there, toggle editor
    this._activateKeyHandleEditor = ige.input.on('keyUp', function (event) {
      if (event.key === "§") {
        // = key pressed, toggle the editor
        editor.toggle();

        // Return true to stop this event from being emitted by the engine to the scenegraph
        return true;
      }
    });

    // Hook the input component's keyUp and check for the - symbol... if there, toggle stats
    this._activateKeyHandleStats = ige.input.on('keyUp', function (event) {
      if (event.key === "+") {
        // Toggle the stats
        editor.toggleStats();

        // Return true to stop this event from being emitted by the engine to the scenegraph
        return true;
      }
    });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
