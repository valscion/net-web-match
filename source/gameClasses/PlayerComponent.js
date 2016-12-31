/**
 * Adds keyboard and mouse control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerComponent = IgeClass.extend({
  classId: 'PlayerComponent',
  componentId: 'playerControl',

  init: function (entity, options) {
    // Store the entity that this component has been added to
    this._entity = entity;

    this._options = options;

    this.controls = {
      left: false,
      right: false,
      up: false,
      down: false,
      shoot: false
    };

    this.nextRotateTo = null;

    this._speed = 5;

    this._shootedWithLeftHand = false;

    // Setup physics for the player
    if (ige.isServer) {
      this._entity.box2dBody({
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

    // Setup the control system
    if (ige.isClient) {
      ige.input.mapAction('left', ige.input.key.a);
      ige.input.mapAction('right', ige.input.key.d);
      ige.input.mapAction('up', ige.input.key.w);
      ige.input.mapAction('down', ige.input.key.s);
      ige.input.mapAction('shoot', ige.input.key.space);

      ige.$('gameScene').mouseMove(this._onMouseMove);
    }

    // Add the playerControlledComponent behaviours to the entity
    this._entity.addBehaviour('playerControlledComponent_behaviour', this._behaviour);
  },

  _onMouseMove: function () {
    var mp = ige._currentViewport.mousePos();
    var pos = {
      x: mp.x,
      y: mp.y
    };
    ige.network.send('playerControlRotateTo', pos);
  },

  _behaviour: function () {
    var playerControl = this.playerControl;

    /* CEXCLUDE */
    if (ige.isServer) {
      var b2dBody = this._box2dBody;
      var b2dVel = new ige.box2d.b2Vec2(0, 0);

      if (playerControl.controls.left) {
        b2dVel.x = -playerControl._speed;
      } else if (playerControl.controls.right) {
        b2dVel.x = playerControl._speed;
      }

      if (playerControl.controls.up) {
        b2dVel.y = -playerControl._speed;
      } else if (playerControl.controls.down) {
        b2dVel.y = playerControl._speed;
      }

      b2dBody.SetLinearVelocity(b2dVel);
      b2dBody.SetAwake(true);

      if (playerControl.nextRotateTo) {
        this.rotateToPoint(playerControl.nextRotateTo);
        playerControl.nextRotateTo = null;
      }

      if (playerControl.controls.shoot) {
        var char = this;
        var handFactor = playerControl._shootedWithLeftHand ? 1 : -1;
        var pos = char.worldPosition();
        var rot = char.rotate().z() - Math.radians(90);
        var xFact = Math.cos(rot);
        var yFact = Math.sin(rot);
        var x = pos.x + Math.cos(rot) * 33 + Math.cos(rot - Math.radians(90)) * 10 * handFactor;
        var y = pos.y + Math.sin(rot) * 33 + Math.sin(rot - Math.radians(90)) * 10 * handFactor;

        new BulletPistol()
          .translateTo(x, y, 0)
          .rotateTo(0, 0, rot)
          .streamMode(1)
          .lifeSpan(2000)
          .mount(ige.$('gameScene'))
          .fireAtWill();

        playerControl._shootedWithLeftHand = !playerControl._shootedWithLeftHand;
        playerControl.controls.shoot = false;
      }
    }
    /* CEXCLUDE */

    if (ige.isClient) {
      Object.keys(playerControl.controls).map(function(control) {
        if (ige.input.actionState(control)) {
          if (!playerControl.controls[control]) {
            // Record the new state
            playerControl.controls[control] = true;

            // Tell the server about our control change
            ige.network.send('playerControlDown.' + control);
          }
        } else {
          if (playerControl.controls[control]) {
            // Record the new state
            playerControl.controls[control] = false;

            // Tell the server about our control change
            ige.network.send('playerControlUp.' + control);
          }
        }
      });
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerComponent; }
