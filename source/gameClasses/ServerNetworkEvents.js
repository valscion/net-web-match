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
    // If we don't yet have bots, add some.
    if (ige.server.bots.length === 0) {
      const botNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => `Bot_${num}`);
      ige.server.bots = botNames.map((botName) =>
        ige.$('gameScene')
          .addBotToScene(botName)
          .streamMode(1)
      );
    }

    // Don't reject the client connection
    return false;
  },

  _onPlayerDisconnect: function (clientId) {
    if (ige.server.players[clientId]) {
      // Remove the player from the game
      ige.server.players[clientId].destroy();

      // Remove the reference to the player entity
      // so that we don't leak memory
      delete ige.server.players[clientId];
    }

    // If this was the last player, remove all the bots, too
    if (Object.keys(ige.server.players).length === 0) {
      ige.server.bots.forEach(bot => bot.destroy());
      ige.server.bots = [];
    }
  },

  _onPlayerEntity: function (data, clientId) {
    if (!ige.server.players[clientId]) {
      ige.server.players[clientId] = ige.$('gameScene').addPlayerToScene(clientId);
      ige.server.players[clientId].streamMode(1);

      // Tell the client to track their player entity
      ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
    }
  },

  _createOnPlayerControlDown: function (control) {
    return function (data, clientId) {
      var player = ige.server.players[clientId];
      player.log('ServerEvent/Control(' + control + ') DOWN');
      player.playerControl.controls[control] = true;
    }
  },

  _createOnPlayerControlUp: function (control) {
    return function (data, clientId) {
      var player = ige.server.players[clientId];
      player.log('ServerEvent/Control(' + control + ') UP');
      player.playerControl.controls[control] = false;
    }
  },

  _onPlayerRotateTo: function (data, clientId) {
    ige.server.players[clientId].playerControl.nextRotateTo = data;
  }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
