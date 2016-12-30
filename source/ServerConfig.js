var igeConfig = {
  include: [
    {name: 'GameScene', path: './levels/GameScene'},
    {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'Weapon', path: './gameClasses/Weapon'},
    {name: 'BulletPistol', path: './gameClasses/BulletPistol'},
    {name: 'Character', path: './gameClasses/Character'},
    {name: 'PlayerControlledComponent', path: './gameClasses/PlayerControlledComponent'},

    {name: 'tiledTestMap', path: './maps/test'}
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeConfig; }
