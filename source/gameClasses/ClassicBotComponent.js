/**
 * Definition for a bot that has similar AI as in the CoolBasic version
 * of NetMatch. Adding this component to a Character entity will make
 * the character act on its own based on the behaviour logic of this
 * component.
 */
var ClassicBotComponent = IgeClass.extend({
  classId: 'ClassicBotComponent',
  componentId: 'botControl',

  init: function (entity, options) {
    // Store the entity that this component has been added to
    this._entity = entity;

    this._options = options;

    // Add the behaviour to the entity
    this._entity.addBehaviour('classicBotComponent_behaviour', this._behaviour);
  },

  _behaviour: function () {
    this.rotateBy(0, 0, 0.05);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClassicBotComponent; }
