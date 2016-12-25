var Character = IgeEntityBox2d.extend({
  classId: 'Character',

  init: function () {
    IgeEntityBox2d.prototype.init.call(this);

    // Setup the entity
    this.addComponent(IgeVelocityComponent);
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
