var Scene1 = IgeSceneGraph.extend({
  classId: 'Scene1',

  /**
   * Called when loading the graph data via ige.addGraph().
   * @param options
   */
  addGraph: function (options) {
    var self = ige.client,
      baseScene = ige.$('baseScene');

    // Clear existing graph data
    if (ige.$('scene1')) {
      this.destroyGraph();
    }

    // Create the scene
    self.scene1 = new IgeScene2d()
      .id('scene1')
      .mount(baseScene);

    // Create the background repeat scene
    this.backgroundScene = new IgeScene2d()
      .id('backgroundScene')
      .depth(0)
      .backgroundPattern(ige.client.gameTexture.backgroundPattern, 'repeat', true, true)
      .mount(self.scene1);

    // Create an entity and mount it to the scene
    self.obj[0] = new Character()
      .id('player1')
      .addComponent(PlayerControlledComponent)
      .depth(1)
      .texture(ige.client.gameTexture.player1)
      .width(ige.client.gameTexture.player1._sizeX)
      .height(ige.client.gameTexture.player1._sizeY)
      .translateTo(0, 0, 0)
      .mount(self.scene1);
  },

  /**
   * The method called when the graph items are to be removed from the
   * active graph.
   */
  removeGraph: function () {
    // Since all our objects in addGraph() were mounted to the
    // 'scene1' entity, destroying it will remove everything we
    // added to it.
    ige.$('scene1').destroy();
  }
});
