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

    self.PROPERTIES = {
      character: 'texture',  // Pelihahmon objekti
      reloadtime: 'scalar',  // Aseen latausaika
      bullet: 'texture',     // Ammusobjekti
      shootsound: 'scalar',  // Ampumisen ääni
      hitsound: 'scalar',    // Osuman ääni
      bulletspeed: 'scalar', // Ammuksen lentonopeus
      bulletForth: 'scalar', // Ammuksen lähtöpaikka pelaajan etupuolella
      bulletYaw: 'scalar',   // Ammuksen lähtöpaikka sivusuunnassa
      damage: 'scalar',      // Ammuksen aiheuttama tuho
      damagerange: 'scalar', // Tuhoalueen laajuus
      spread: 'scalar',      // Hajonta asteina
      animImage: 'texture',  // Animaatiokuva kun osuu
      animLength: 'scalar',  // Animaation pituus
      animDelay: 'scalar',   // Animaation viive
      image: 'texture',      // Aseen infokuva
      ammo: 'scalar',        // Aseessa olevat ammukset
      ammoMax: 'scalar',     // Ammusten maksimimäärä
      fire: 'texture',       // Suuliekkianimaatio
      firepos: 'scalar',     // Missä kohdassa suuliekki näytetään (pituussuunnassa)
      icon: 'texture',       // Pieni ikoni tappoviesteihin
      pickcount: 'scalar',   // Kuinka paljon tavaraa saa poimittaessa
      key: 'scalar',         // Näppäin jolla tämä ase valitaan
      saferange: 'scalar',   // Etäisyys jonka alle kohteesta oleva botti ei ammu
      shootrange: 'scalar',  // Etäisyys jonka alle kohteesta oleva botti ampuu
      character2: 'texture', // Pelihahmon objekti (tiimi 2)
      weight: 'scalar'       // Aseen paino, vaikuttaa liikkumisen nopeuteen. 100=normaali
    };

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
      image: './assets/textures/sprites/pistol.png',
      bullet: './assets/textures/sprites/pistol_bullet.png',
      character: './assets/textures/sprites/player1.png',
      character2: './assets/textures/sprites/player1_2.png',
      // TODO: Sounds
      // shootsound: SND_SHOOT1,
      // hitsound: SND_BULLETHIT1,
      fire: './assets/textures/sprites/fire1.png',
      firepos: 33,
      icon: './assets/textures/sprites/pistol_small.png',
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

    Object.keys(PROPERTIES).map(function (prop) {
      var value;
      var propType = PROPERTIES[prop];

      if (properties[prop] === undefined) {
        value = null;
      } else {
        switch (propType) {
          case 'scalar':
            value = properties[prop];
            break;
          case 'texture':
            value = new IgeTexture(properties[prop]);
            break;
          default:
            this.log('Unknown property type ' + propType, 'error');
        }
      }

      data[prop] = value;
    });
  },

  /**
   * Get a property for a weapon
   */
  getProp: function (weaponName, propName) {
    var data = this._data[weaponName];

    if (!data) {
      this.log(weaponName + ' is not a recognized weapon', 'error');
      return;
    }

    if (data[propName] === undefined) {
      this.log(propName + ' is not a recognized property for a weapon', 'error');
      return;
    }

    return data[propName];
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Weapon; }
