var Server = IgeClass.extend({
  classId: 'Server',
  Server: true,

  init: function (options) {
    var self = this;
    ige.timeScale(1);

    // Define an object to hold references to our player entities
    this.players = {};

    // Add the server-side game methods / event handlers
    this.implement(ServerNetworkEvents);

    // Add physics and setup physics world
    ige.addComponent(IgeBox2dComponent)
      .box2d.sleep(true)
      .box2d.createWorld()
      .box2d.start();

    // Add the networking component
    ige.addComponent(IgeNetIoComponent)
      // Start the network server
      .network.start(2000, function () {
        // Networking has started so start the game engine
        ige.start(function (success) {
          // Check if the engine started successfully
          if (success) {
            // Create some network commands we will need
            ige.network.define('playerEntity', self._onPlayerEntity);

            ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
            ige.network.define('playerControlRightDown', self._onPlayerRightDown);
            ige.network.define('playerControlUpDown', self._onPlayerUpDown);
            ige.network.define('playerControlDownDown', self._onPlayerDownDown);

            ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
            ige.network.define('playerControlRightUp', self._onPlayerRightUp);
            ige.network.define('playerControlUpUp', self._onPlayerUpUp);
            ige.network.define('playerControlDownUp', self._onPlayerDownUp);

            ige.network.define('playerControlRotateTo', self._onPlayerRotateTo);

            ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
            ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js

            // Add the network stream component
            ige.network.addComponent(IgeStreamComponent)
              .stream.sendInterval(30) // Send a stream update once every 30 milliseconds
              .stream.start(); // Start the stream

            // Accept incoming network connections
            ige.network.acceptConnections(true);

            // Create the scene
            ige.addGraph('GameScene');
          }
        });
      });
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
