var igeConfig = {
  include: [
    {name: 'GameScene', path: './levels/GameScene'},
    {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'Character', path: './gameClasses/Character'},
    {name: 'PlayerControlledComponent', path: './gameClasses/PlayerControlledComponent'}
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeConfig; }
