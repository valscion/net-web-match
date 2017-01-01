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
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Bullet; }