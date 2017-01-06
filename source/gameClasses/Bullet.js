var Bullet = IgeEntityBox2d.extend({
  classId: 'Bullet',

  init: function (weaponType) {
    IgeEntityBox2d.prototype.init.call(this);

    // Store the weapon type
    this._type = weaponType;

    // Setup size
    this.width(4).height(4);

    // Setup the category
    this.category('Bullet');

    if (ige.isServer) {
      this._setupPhysics();
    }

    // Add the bullet texture
    if (ige.isClient) {
      this.texture(ige.weapon.getProp(this._type, 'bullet'));
    }
  },

  // Stream the `init` parameter on creation so that client gets it, too
  streamCreateData: function () {
    return this._type;
  },

  _setupPhysics: function () {
    this.box2dBody({
      type: 'dynamic',
      linearDamping: 0.0,
      angularDamping: 0.0,
      allowSleep: true,
      bullet: true,
      gravitic: false,
      fixedRotation: true,
      fixtures: [{
        density: 0.05,
        shape: {
          type: 'rectangle'
        }
      }]
    });

    return this;
  },

  fireAtWill: function () {
    var physicsUpdateRate = 60.0;
    var speed = ige.weapon.getProp(this._type, 'bulletspeed') / physicsUpdateRate;
    var rot = this.rotate().z();
    var b2dBody = this._box2dBody;
    var b2dVel = new ige.box2d.b2Vec2(speed * Math.cos(rot), speed * Math.sin(rot));
    b2dBody.SetLinearVelocity(b2dVel);

    return this;
  },

  /**
   * Called when this entity collides with another entity
   */
  handleContactWith: function (otherEntity, contact) {
    // Handle different kind of damage based on the bullet type
    // TODO: Use weapon properties and range, not like this :D
    switch (this._type) {
      case 'pistol':
        if (otherEntity.category() === 'Character') {
          otherEntity.reduceHealth(ige.weapon.getProp('pistol', 'damage'));
        }
        break;
      default:
        this.log("Can't handle collision for weapon type " + this._type, 'warning');
    }
    this.destroy();
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bullet; }
