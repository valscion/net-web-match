var Client = IgeClass.extend({
  classId: 'Client',

  init: function () {
    var self = this;
    ige.showStats(1);
    ige.input.debug(true);

    // Enable networking
    ige.addComponent(IgeNetIoComponent);

    // Implement our game methods
    this.implement(ClientNetworkEvents);

    // Add physics and setup physics world
    ige.addComponent(IgeBox2dComponent)
      .box2d.sleep(true)
      .box2d.createWorld()
      .box2d.start();

    // Load the media for the game
    self.addComponent(NetMatchAssets);

    self._addEditor();

    // Wait for our textures to load before continuing
    ige.on('texturesLoaded', function () {
      // Create the HTML canvas
      ige.createFrontBuffer(true);

      // Start the engine
      ige.start(function (success) {
        // Check if the engine started successfully
        if (success) {
          // Start the networking (you can do this elsewhere if it
          // makes sense to connect to the server later on rather
          // than before the scene etc are created... maybe you want
          // a splash screen or a menu first? Then connect after you've
          // got a username or something?
          ige.network.start('http://localhost:2000', function () {
            ige.network.addComponent(IgeStreamComponent)
              // Create a listener that will fire whenever an entity
              // is created because of the incoming stream data
              .stream.on('entityCreated', function (entity) {
                console.log('Stream entity created with ID: ' + entity.id());
              });

            ige.addGraph('IgeBaseScene');
          });
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
