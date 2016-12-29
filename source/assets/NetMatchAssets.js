var NetMatchAssets = IgeClass.extend({
  classId: 'NetMatchAssets',
  componentId: 'assets',

  init: function () {
    var self = this;

    self.backgroundPattern =
      new IgeTexture('./assets/textures/background/backgroundPattern.png');
  }
});
