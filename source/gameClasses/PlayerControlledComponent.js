/**
 * Adds keyboard control to the entity this component is added to.
 * @type {IgeClass}
 */
var PlayerControlledComponent = IgeClass.extend({
  classId: 'PlayerControlledComponent',
  componentId: 'player',

  init: function (entity) {
    // Store the entity that this component has been added to
    this._entity = entity;

    // Setup the control system
    ige.input.mapAction('walkLeft', ige.input.key.left);
    ige.input.mapAction('walkRight', ige.input.key.right);
    ige.input.mapAction('walkUp', ige.input.key.up);
    ige.input.mapAction('walkDown', ige.input.key.down);

    // Add the playerControlledComponent behaviour to the entity
    this._entity.addBehaviour('playerControlledComponent_behaviour', this._behaviour);
  },

  _behaviour: function (ctx) {
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
