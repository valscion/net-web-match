var ContactListener = IgeClass.extend({
  classId: 'ContactListener',

  init: function() {
    // Set the contact listener methods to detect when
    // contacts (collisions) begin and end
    ige.box2d.contactListener(
      this.contactBegin.bind(this),
      this.contactEnd.bind(this)
    );
  },

  contactBegin: function(contact) {
    console.log('Contact begins between', contact.igeEntityA()._id, 'and', contact.igeEntityB()._id);
  },

  contactEnd: function(contact) {
    console.log('Contact ends between', contact.igeEntityA()._id, 'and', contact.igeEntityB()._id);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ContactListener; }
