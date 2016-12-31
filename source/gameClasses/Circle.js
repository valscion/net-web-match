var Circle = IgeEntityBox2d.extend({
  classId: 'Circle',

  init: function () {
    IgeEntityBox2d.prototype.init.call(this);

    this.category('Debug');

    if (ige.isClient) {
      // Define the texture this entity will use
      this.texture(ige.client.debugCircleTexture)
        .width(4)
        .height(4);
    }
  },

  tick: function (ctx) {
    IgeEntityBox2d.prototype.tick.call(this, ctx);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Circle; }
