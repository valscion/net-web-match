var igeClientConfig = {
  include: [
    /* Some external libraries if you want */

    /* Your custom game JS scripts */
    './levels/Scene1.js',

    './gameClasses/ClientNetworkEvents.js',
    './gameClasses/Character.js',

    /* Standard game scripts */
    './client.js',
    './index.js'
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
