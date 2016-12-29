var Character = IgeEntityBox2d.extend({
  classId: 'Character',

  init: function () {
    IgeEntityBox2d.prototype.init.call(this);

    // Setup the entity
    this.addComponent(IgeVelocityComponent);

    // Setup size
    this.width(38).height(70);

    // Start with pistol
    this.changeWeapon('pistol');
  },

  /**
   * Called every frame by the engine when this entity is mounted to the scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {
    // Call the IgeEntity (super-class) tick() method
    IgeEntity.prototype.tick.call(this, ctx);
  },

  /**
   * Change the character wielded weapon the one specified as parameter.
   *
   * @returns {Character} the "this" value, useful for chaining
   */
  changeWeapon: function (weapon) {
    if (this._weapon !== weapon) {
      this.log(`Changing weapon to ${weapon}`);
      this._weapon = weapon;

      if (ige.isClient) {
        this.texture(ige.weapon.getProp(weapon, 'character'));
      }
    }

    return this;
  },

  /**
   * Get the current weapon
   *
   * @returns {String} the type of the current weapon
   */
  weapon: function () {
    return this._weapon;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Character; }
