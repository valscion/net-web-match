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

    // Create an entity and mount it to the scene
    self.obj[0] = new Rotator(0.1)
      .id('player1')
      .depth(1)
      .width(70)
      .height(38)
      .texture(ige.client.gameTexture.player1)
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
