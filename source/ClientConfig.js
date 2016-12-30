var igeClientConfig = {
  include: [
    /* Some external libraries if you want */

    /* Your custom game JS scripts */
    './levels/GameScene.js',
    './maps/test.js',

    './gameClasses/BulletPistol.js',
    './gameClasses/Weapon.js',
    './gameClasses/ClientNetworkEvents.js',
    './gameClasses/Character.js',
    './gameClasses/PlayerControlledComponent.js',

    /* Standard game scripts */
    './client.js',
    './index.js'
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
