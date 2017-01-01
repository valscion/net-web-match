var igeClientConfig = {
  include: [
    /* Some external libraries if you want */

    /* Your custom game JS scripts */
    './levels/WorldScene.js',
    './levels/GameScene.js',
    './maps/TiledTestMap/TiledTestMap.js',

    './gameClasses/Bullet.js',
    './gameClasses/Circle.js',
    './gameClasses/Weapon.js',
    './gameClasses/ClientNetworkEvents.js',
    './gameClasses/Character.js',
    './gameClasses/PlayerComponent.js',

    /* Standard game scripts */
    './client.js',
    './index.js'
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
