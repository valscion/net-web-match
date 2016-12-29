/**
 * Holds information related to all the weapons in the game
 * @type {IgeClass}
 */
var Weapon = IgeClass.extend({
  classId: 'Weapon',
  componentId: 'weapon',

  init: function (entity, options) {
    var self = this;

    self._data = {};

    self.TYPES = [
      'pistol'
    ];

    self.PROPERTIES = [
      'character',   // Pelihahmon objekti
      'reloadtime',  // Aseen latausaika
      'bullet',      // Ammusobjekti
      'shootsound',  // Ampumisen ääni
      'hitsound',    // Osuman ääni
      'bulletspeed', // Ammuksen lentonopeus
      'bulletForth', // Ammuksen lähtöpaikka pelaajan etupuolella
      'bulletYaw',   // Ammuksen lähtöpaikka sivusuunnassa
      'damage',      // Ammuksen aiheuttama tuho
      'damagerange', // Tuhoalueen laajuus
      'spread',      // Hajonta asteina
      'animImage',   // Animaatiokuva kun osuu
      'animLength',  // Animaation pituus
      'animDelay',   // Animaation viive
      'image',       // Aseen infokuva
      'ammo',        // Aseessa olevat ammukset
      'ammoMax',     // Ammusten maksimimäärä
      'fire',        // Suuliekkianimaatio
      'firepos',     // Missä kohdassa suuliekki näytetään (pituussuunnassa)
      'icon',        // Pieni ikoni tappoviesteihin
      'pickcount',   // Kuinka paljon tavaraa saa poimittaessa
      'key',         // Näppäin jolla tämä ase valitaan
      'saferange',   // Etäisyys jonka alle kohteesta oleva botti ei ammu
      'shootrange',  // Etäisyys jonka alle kohteesta oleva botti ampuu
      'character2',  // Pelihahmon objekti (tiimi 2)
      'weight'       // Aseen paino, vaikuttaa liikkumisen nopeuteen. 100=normaali
    ];

    self.defineGun('pistol', {
      reloadtime: 250,
      bulletspeed: 1200,
      bulletForth: 33,
      bulletYaw: 10,
      damage: 19,
      damagerange: 0,
      spread: 0,
      ammo: 0,
      ammoMax: 0,
      image: new IgeTexture('./assets/textures/sprites/pistol.png'),
      bullet: new IgeTexture('./assets/textures/sprites/pistol_bullet.png'),
      character: new IgeTexture('./assets/textures/sprites/player1.png'),
      character2: new IgeTexture('./assets/textures/sprites/player1_2.png'),
      // TODO: Sounds
      // shootsound: SND_SHOOT1,
      // hitsound: SND_BULLETHIT1,
      fire: new IgeTexture('./assets/textures/sprites/fire1.png'),
      firepos: 33,
      icon: new IgeTexture('./assets/textures/sprites/pistol_small.png'),
      // TODO: Input mapping
      // key: cbKey1,
      saferange: 100,
      shootrange: 500,
      weight: 100
    })
  },

  defineGun: function (name, properties) {
    var TYPES = this.TYPES;
    var PROPERTIES = this.PROPERTIES;
    var data;

    if (!TYPES.includes(name)) {
      this.log(name + ' is not a recognized weapon', 'error');
    }

    this._data[name] = data = {};

    Object.keys(properties).map(function (prop) {
      if (!PROPERTIES.includes(prop)) {
        this.log(name + ' is not a valid property for a weapon', 'error');
        return;
      }
      data[prop] = properties[prop];
    });
  },

  /**
   * Get the texture for a character wielding a weapon
   */
  characterFor: function (weaponName, team) {
    var data = this._data[weaponName];
    var accessor = team === 2 ? 'character2' : 'character';

    if (!data) {
      this.log(weaponName + ' is not a recognized weapon', 'error');
      return;
    }

    if (!data[accessor]) {
      this.log(weaponName + ' does not have a character texture', 'error');
      return;
    }

    return data[accessor];
  },

  /**
   * Get the texture for a bullet
   */
  bulletFor: function (weaponName) {
    var data = this._data[weaponName];

    if (!data) {
      this.log(weaponName + ' is not a recognized weapon', 'error');
      return;
    }

    if (!data.bullet) {
      this.log(weaponName + ' does not have a bullet texture', 'error');
      return;
    }

    return data.bullet;
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Weapon; }
