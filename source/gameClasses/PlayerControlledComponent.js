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

    // Setup the control system
    ige.input.mapAction('left', ige.input.key.a);
    ige.input.mapAction('right', ige.input.key.d);
    ige.input.mapAction('up', ige.input.key.w);
    ige.input.mapAction('down', ige.input.key.s);

    // Add the playerControlledComponent behaviours to the entity
    this._entity
      .addBehaviour('playerControlledComponent_keyboardBehaviour', this._keyboardBehaviour)
      .addBehaviour('playerControlledComponent_mouseBehaviour', this._mouseBehaviour);
  },

  _mouseBehaviour: function () {
    this.rotateToPoint(ige._currentViewport.mousePos());
  },

  _keyboardBehaviour: function () {
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
