var igeConfig = {
  include: [
    {name: 'WorldScene', path: './levels/WorldScene'},
    {name: 'GameScene', path: './levels/GameScene'},
    {name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
    {name: 'Weapon', path: './gameClasses/Weapon'},
    {name: 'Bullet', path: './gameClasses/Bullet'},
    {name: 'Character', path: './gameClasses/Character'},
    {name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},
    {name: 'ClassicBotComponent', path: './gameClasses/ClassicBotComponent'},

    {name: 'TiledTestMap', path: './maps/TiledTestMap/TiledTestMap'}
  ]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeConfig; }
