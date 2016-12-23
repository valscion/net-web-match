var Character = IgeEntity.extend({
  classId: 'Character',

  init: function () {
    IgeEntity.prototype.init.call(this);
  },

  /**
   * Called every frame by the engine when this entity is mounted to the scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {
    // Call the IgeEntity (super-class) tick() method
    IgeEntity.prototype.tick.call(this, ctx);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Character; }
