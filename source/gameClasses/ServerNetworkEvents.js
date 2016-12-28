var ServerNetworkEvents = {
  /**
   * Is called when the network tells us a new client has connected
   * to the server. This is the point we can return true to reject
   * the client connection if we wanted to.
   * @param data The data object that contains any data sent from the client.
   * @param clientId The client id of the client that sent the message.
   * @private
   */
  _onPlayerConnect: function (socket) {
    console.log('_onPlayerConnect', socket);
    // Don't reject the client connection
    return false;
  },

  _onPlayerDisconnect: function (clientId) {
    console.log('_onPlayerDisconnect', clientId);
    if (ige.server.players[clientId]) {
      // Remove the player from the game
      ige.server.players[clientId].destroy();

      // Remove the reference to the player entity
      // so that we don't leak memory
      delete ige.server.players[clientId];
    }
  },

  _onPlayerEntity: function (data, clientId) {
    console.log('_onPlayerEntity', data, clientId);
    if (!ige.server.players[clientId]) {
      ige.server.players[clientId] = new Character()
        .id(clientId)
        .addComponent(PlayerControlledComponent)
        .streamMode(1)
        .mount(ige.server.gameScene);

      // Setup physics for the player
      ige.server.players[clientId]
        .box2dBody({
          type: 'dynamic',
          // Velocity is always set manually and unset when needed, so
          // we don't want the physics engine to slow the player down
          // unnecessarily. This way we will get similar velocity no
          // matter what FPS the game is currently running on.
          linearDamping: 0.0,
          angularDamping: 0.0,
          allowSleep: true,
          bullet: false,
          gravitic: false,
          fixedRotation: false,
          fixtures: [{
            density: 1.0,
            friction: 0.5,
            restitution: 0,
            shape: {
              type: 'circle'
            }
          }]
        });

      // Tell the client to track their player entity
      ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
    }
  },

  _onPlayerLeftDown: function (data, clientId) {
    console.log('_onPlayerLeftDown', data, clientId);
    ige.server.players[clientId].playerControl.controls.left = true;
  },

  _onPlayerLeftUp: function (data, clientId) {
    console.log('_onPlayerLeftUp', data, clientId);
    ige.server.players[clientId].playerControl.controls.left = false;
  },

  _onPlayerRightDown: function (data, clientId) {
    console.log('_onPlayerRightDown', data, clientId);
    ige.server.players[clientId].playerControl.controls.right = true;
  },

  _onPlayerRightUp: function (data, clientId) {
    console.log('_onPlayerRightUp', data, clientId);
    ige.server.players[clientId].playerControl.controls.right = false;
  },

  _onPlayerUpDown: function (data, clientId) {
    console.log('_onPlayerUpDown', data, clientId);
    ige.server.players[clientId].playerControl.controls.up = true;
  },

  _onPlayerUpUp: function (data, clientId) {
    console.log('_onPlayerUpUp', data, clientId);
    ige.server.players[clientId].playerControl.controls.up = false;
  },

  _onPlayerDownDown: function (data, clientId) {
    console.log('_onPlayerDownDown', data, clientId);
    ige.server.players[clientId].playerControl.controls.down = true;
  },

  _onPlayerDownUp: function (data, clientId) {
    console.log('_onPlayerDownUp', data, clientId);
    ige.server.players[clientId].playerControl.controls.down = false;
  },

  _onPlayerRotateTo: function (data, clientId) {
    ige.server.players[clientId].playerControl.nextRotateTo = data;
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
