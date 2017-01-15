var ContactListener = IgeClass.extend({
  classId: 'ContactListener',

  init: function() {
    // Set the contact listener methods to detect when
    // contacts (collisions) begin and end and when to skip them completely
    ige.box2d.contactListener(
      this.contactBegin.bind(this),
      this.contactEnd.bind(this),
      this.presolveContact.bind(this)
    );
  },

  contactBegin: function(contact) {
    const entityA = contact.igeEntityA();
    const entityB = contact.igeEntityB();

    // Hidden entities should never handle collisions
    if (entityA.isHidden() || entityB.isHidden()) return;

    if (entityA.category() === 'Bullet') {
      entityA.handleContactWith(entityB, contact);
    } else if (entityB.category() === 'Bullet') {
      entityB.handleContactWith(entityA, contact);
    }
  },

  contactEnd: function(contact) {
    // console.log('Contact ends between', contact.igeEntityA()._id, 'and', contact.igeEntityB()._id);
  },

  presolveContact: function(contact) {
    // Hidden entities should not collide
    if (contact.igeEntityA().isHidden() || contact.igeEntityB().isHidden()) {
      contact.SetEnabled(false);
    }
    // Bullets shouldn't collide with each other
    if (contact.igeBothCategories('Bullet')) {
      contact.SetEnabled(false);
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ContactListener; }
