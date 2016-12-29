var BulletPistol = IgeEntityBox2d.extend({
  classId: 'BulletPistol',

  init: function (options) {
    IgeEntityBox2d.prototype.init.call(this);

    // Setup size
    this.width(4).height(4);

    if (ige.isServer) {
      this._setupPhysics();
    }

    // Add the bullet texture
    if (ige.isClient) {
      this.texture(ige.weapon.getProp('pistol', 'bullet'));
    }
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
    var speed = 20;
    var rot = this.rotate().z();
    var b2dBody = this._box2dBody;
    var b2dVel = new ige.box2d.b2Vec2(speed * Math.cos(rot), speed * Math.sin(rot));
    b2dBody.SetLinearVelocity(b2dVel);

    return this;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BulletPistol; }
