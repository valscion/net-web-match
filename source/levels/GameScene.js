var GameScene = IgeSceneGraph.extend({
  classId: 'GameScene',

  /**
   * Called when loading the graph data via ige.addGraph().
   * @param options
   */
  addGraph: function (options) {
    var self = ige.isClient ? ige.client : ige.server;

    // Create the scene
    self.gameScene = new IgeScene2d()
      .id('gameScene');

    // Create the main viewport
    self.vp1 = new IgeViewport()
      .id('vp1')
      .autoSize(true)
      .scene(self.gameScene)
      .drawBounds(false)
      .mount(ige);

    // Create the background repeat scene
    if (ige.isClient) {
      self.backgroundScene = new IgeScene2d()
        .id('backgroundScene')
        .depth(-1)
        .ignoreCamera(true)
        .backgroundPattern(ige.client.assets.backgroundPattern, 'repeat', true, true)
        .mount(self.gameScene);

      ige.box2d.enableDebug(self.gameScene);
    }

    // this._addMap();

    // Tell the main viewport's camera to track the
    // character entity's movement
    // self.vp1.camera.trackTranslate(self.player, 0);

    // Add the box2d debug painter entity to the
    // scene to show the box2d body outlines
    // ige.box2d.enableDebug(self.gameScene);
  },

  /**
   * The method called when the graph items are to be removed from the
   * active graph.
   */
  removeGraph: function () {
    // Destroy the viewport
    ige.$('vp1').destroy();

    // Since all our objects in addGraph() were mounted to the
    // 'gameScene' entity, destroying it will remove everything we
    // added to it.
    ige.$('gameScene').destroy();
  },

  _addMap: function () {
    var self = ige;
    var bodyDeclaration = {
      type: 'static',
      allowSleep: true,
      fixtures: [{
        shape: {
          type: 'rectangle'
        }
      }]
    };

    [
      new IgeEntityBox2d().translateTo(0, 150, 0).width(500).height(40),
      new IgeEntityBox2d().translateTo(0, -150, 0).width(500).height(40),
      new IgeEntityBox2d().translateTo(230, 0, 0).width(40).height(260),
      new IgeEntityBox2d().translateTo(-230, 0, 0).width(40).height(260),
    ].map(function (box) {
      box
        .drawBounds(true)
        .mount(self.gameScene)
        .box2dBody(bodyDeclaration);
    });
  }
});
