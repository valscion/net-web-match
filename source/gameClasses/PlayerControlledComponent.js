/**
 * Adds keyboard and mouse control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerControlledComponent = IgeClass.extend({
  classId: 'PlayerControlledComponent',
  componentId: 'player',

  init: function (entity, options) {
    // Store the entity that this component has been added to
    this._entity = entity;

    this._options = options;

    // Setup the control system
    ige.input.mapAction('walkLeft', ige.input.key.a);
    ige.input.mapAction('walkRight', ige.input.key.d);
    ige.input.mapAction('walkUp', ige.input.key.w);
    ige.input.mapAction('walkDown', ige.input.key.s);

    // Add the playerControlledComponent behaviours to the entity
    this._entity
      .addBehaviour('playerControlledComponent_keyboardBehaviour', this._keyboardBehaviour)
      .addBehaviour('playerControlledComponent_mouseBehaviour', this._mouseBehaviour);
  },

  _mouseBehaviour: function () {
    this.rotateToPoint(ige._currentViewport.mousePos());
  },

  _keyboardBehaviour: function () {
    var vel = 5;
    var direction = '';
    var b2dBody = this._box2dBody;
    var b2dVel = new ige.box2d.b2Vec2(0, 0);

    if (ige.input.actionState('walkUp')) {
      direction += 'N';
    }

    if (ige.input.actionState('walkDown')) {
      direction += 'S';
    }

    if (ige.input.actionState('walkLeft')) {
      direction += 'W';
    }

    if (ige.input.actionState('walkRight')) {
      direction += 'E';
    }

    switch (direction) {
      case 'N':
        b2dVel.y = -vel;
        break;

      case 'S':
        b2dVel.y = vel;
        break;

      case 'E':
        b2dVel.x = vel;
        break;

      case 'W':
        b2dVel.x = -vel;
        break;

      case 'NE':
        b2dVel.x = vel;
        b2dVel.y = -vel;
        break;

      case 'NW':
        b2dVel.x = -vel;
        b2dVel.y = -vel;
        break;

      case 'SE':
        b2dVel.x = vel;
        b2dVel.y = vel;
        break;

      case 'SW':
        b2dVel.x = -vel;
        b2dVel.y = vel;
        break;

      default:
        // Velocity default to zero so do nothing
    }

    b2dBody.SetLinearVelocity(b2dVel);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerControlledComponent; }
