/**
 * The definition for a game character. This entity is the one that
 * is rendered and has physics applied, but for moving it one must
 * add a control component, such as {PlayerComponent}, to the entity
 * so that the character would start moving.
 */
var Character = IgeEntityBox2d.extend({
  classId: 'Character',

  init: function () {
    IgeEntityBox2d.prototype.init.call(this);

    // Setup the entity
    this.addComponent(IgeVelocityComponent);

    // Set the category
    this.category('Character');

    // Setup size
    this.width(38).height(70);

    // Start with pistol
    this.changeWeapon('pistol');

    // Debug AI sight
    this._rayCasts = [];
    this.streamProperty();
    this.streamSectionsPush('props');

    // Setup physics, but only for the server
    if (ige.isServer) {
      this.box2dBody({
        type: 'dynamic',
        // Velocity is always set manually and unset when needed, so
        // we don't want the physics engine to slow the player down
        // unnecessarily. This way we will get similar velocity no
        // matter what FPS the game is currently running on.
        linearDamping: 0.0,
        angularDamping: 0.0,
        allowSleep: true,
        bullet: false,
        gravitic: false,
        fixedRotation: true,
        fixtures: [{
          density: 1.0,
          friction: 0.5,
          restitution: 0,
          shape: {
            type: 'circle'
          }
        }]
      });
    }
  },

  /**
   * Called every frame by the engine when this entity is mounted to the scenegraph.
   * @param ctx The canvas context to render to.
   */
  tick: function (ctx) {
    // Call the IgeEntity (super-class) tick() method
    IgeEntity.prototype.tick.call(this, ctx);

    if (ige.isClient) {
      this._transformContext(ctx, true);

      var rayCasts = this.streamProperty('debugRayCasts');
      if (rayCasts) {
        ctx.strokeStyle = 'rgba(255, 128, 128, 0.5)';

        rayCasts.forEach(function (rayCast) {
          var startPoint = new IgePoint2d(rayCast.startX, rayCast.startY);
          var hitPoint = new IgePoint2d(rayCast.hitX, rayCast.hitY);
          var endPoint = new IgePoint2d(rayCast.endX, rayCast.endY);

          ctx.lineWidth = 10;
          ctx.strokeStyle = 'rgba(255, 64, 64, 0.5)';
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(hitPoint.x, hitPoint.y);
          ctx.stroke();
        });
      }

      this._transformContext(ctx, true);
    }

    if (ige.isServer) {
      this.streamProperty('debugRayCasts', this._rayCasts.slice());
      this._rayCasts.length = 0;
    }
  },

  /**
   * Adds a ray cast to the debug raycasts array
   */
  debugRayCastResult: function (rayCast) {
    if (!rayCast) return;

    this._rayCasts.push({
      startX: rayCast.startPoint.x,
      startY: rayCast.startPoint.y,
      hitX: rayCast.hitPoint.x,
      hitY: rayCast.hitPoint.y,
      endX: rayCast.endPoint.x,
      endY: rayCast.endPoint.y
    });
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
  },

  /**
   * Translates the character by applying a physical force to the box2d body
   */
  translateCharacter: function (speedX, speedY) {
    var b2dBody = this._box2dBody;
    var b2dVel = new ige.box2d.b2Vec2(speedX, speedY);

    b2dBody.SetLinearVelocity(b2dVel);
    b2dBody.SetAwake(true);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Character; }
