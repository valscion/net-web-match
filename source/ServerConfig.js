var igeConfig = {
  include: [
    {name: 'WorldScene', path: './levels/WorldScene'},
    {name: 'GameScene', path: './levels/GameScene'},
    {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'Weapon', path: './gameClasses/Weapon'},
    {name: 'Circle', path: './gameClasses/Circle'},
    {name: 'BulletPistol', path: './gameClasses/BulletPistol'},
    {name: 'Character', path: './gameClasses/Character'},
    {name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},
    {name: 'ClassicBotComponent', path: './gameClasses/ClassicBotComponent'},

    {name: 'TiledTestMap', path: './maps/TiledTestMap/TiledTestMap'}
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeConfig; }
