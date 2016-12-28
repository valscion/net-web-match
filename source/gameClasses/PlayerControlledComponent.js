/**
 * Adds keyboard and mouse control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerControlledComponent = IgeClass.extend({
  classId: 'PlayerControlledComponent',
  componentId: 'playerControl',

  init: function (entity, options) {
    // Store the entity that this component has been added to
    this._entity = entity;

    this._options = options;

    this.controls = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    this.nextRotateTo = null;

    this._speed = 5;

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
        fixedRotation: false,
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

      ige.client.gameScene.mouseMove(this._onMouseMove);
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
    /* CEXCLUDE */
    if (ige.isServer) {
      var b2dBody = this._box2dBody;
      var b2dVel = new ige.box2d.b2Vec2(0, 0);

      if (this.playerControl.controls.left) {
        b2dVel.x = -this.playerControl._speed;
      } else if (this.playerControl.controls.right) {
        b2dVel.x = this.playerControl._speed;
      }

      if (this.playerControl.controls.up) {
        b2dVel.y = -this.playerControl._speed;
      } else if (this.playerControl.controls.down) {
        b2dVel.y = this.playerControl._speed;
      }

      b2dBody.SetLinearVelocity(b2dVel);

      if (this.playerControl.nextRotateTo) {
        this.rotateToPoint(this.playerControl.nextRotateTo);
      }
    }
    /* CEXCLUDE */

    if (ige.isClient) {
      if (ige.input.actionState('left')) {
        if (!this.playerControl.controls.left) {
          // Record the new state
          this.playerControl.controls.left = true;

          // Tell the server about our control change
          ige.network.send('playerControlLeftDown');
        }
      } else {
        if (this.playerControl.controls.left) {
          // Record the new state
          this.playerControl.controls.left = false;

          // Tell the server about our control change
          ige.network.send('playerControlLeftUp');
        }
      }

      if (ige.input.actionState('right')) {
        if (!this.playerControl.controls.right) {
          // Record the new state
          this.playerControl.controls.right = true;

          // Tell the server about our control change
          ige.network.send('playerControlRightDown');
        }
      } else {
        if (this.playerControl.controls.right) {
          // Record the new state
          this.playerControl.controls.right = false;

          // Tell the server about our control change
          ige.network.send('playerControlRightUp');
        }
      }

      if (ige.input.actionState('up')) {
        if (!this.playerControl.controls.up) {
          // Record the new state
          this.playerControl.controls.up = true;

          // Tell the server about our control change
          ige.network.send('playerControlUpDown');
        }
      } else {
        if (this.playerControl.controls.up) {
          // Record the new state
          this.playerControl.controls.up = false;

          // Tell the server about our control change
          ige.network.send('playerControlUpUp');
        }
      }

      if (ige.input.actionState('down')) {
        if (!this.playerControl.controls.down) {
          // Record the new state
          this.playerControl.controls.down = true;

          // Tell the server about our control change
          ige.network.send('playerControlDownDown');
        }
      } else {
        if (this.playerControl.controls.down) {
          // Record the new state
          this.playerControl.controls.down = false;

          // Tell the server about our control change
          ige.network.send('playerControlDownUp');
        }
      }
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerControlledComponent; }
