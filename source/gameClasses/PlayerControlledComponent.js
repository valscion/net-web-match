/**
 * Adds keyboard and mouse control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerControlledComponent = IgeClass.extend({
  classId: 'PlayerControlledComponent',
  componentId: 'player',

  init: function (entity) {
    // Store the entity that this component has been added to
    this._entity = entity;

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
    var vel = 0.15,
      direction = '';

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
        this.velocity.x(0)
          .velocity.y(-vel);
        break;

      case 'S':
        this.velocity.x(0)
          .velocity.y(vel);
        break;

      case 'E':
        this.velocity.x(vel)
          .velocity.y(0);
        break;

      case 'W':
        this.velocity.x(-vel)
          .velocity.y(0);
        break;

      case 'NE':
        this.velocity.x(vel)
          .velocity.y(-vel);
        break;

      case 'NW':
        this.velocity.x(-vel)
          .velocity.y(-vel);
        break;

      case 'SE':
        this.velocity.x(vel)
          .velocity.y(vel);
        break;

      case 'SW':
        this.velocity.x(-vel)
          .velocity.y(vel);
        break;

      default:
        this.velocity.x(0)
          .velocity.y(0);
        break;
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerControlledComponent; }
