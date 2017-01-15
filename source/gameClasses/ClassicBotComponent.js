/**
 * Definition for a bot that has similar AI as in the CoolBasic version
 * of NetMatch. Adding this component to a Character entity will make
 * the character act on its own based on the behaviour logic of this
 * component.
 */
var ClassicBotComponent = IgeClass.extend({
  classId: 'ClassicBotComponent',
  componentId: 'botControl',

  init: function (entity, options) {
    // Store the entity that this component has been added to
    this._entity = entity;

    this._options = options;

    // AI state variables
    this._tooClose = false;
    this._nextAction = 0;
    this._rotation = 0;
    this._sideStep = 0;
    this._tooClose = false;
    this._nextAngle = 0;
    this._lastAngle = 0;
    this._spawnTime = ige.currentTime();
    this._lastShoot = 0;

    // AI skill variables
    const skill = 20;
    const botOrdinal = 1;
    this._fightRotate = 1.5 + (20 / 1.5);
    this._shootingAngle = 4.0 + (botOrdinal * 1.5);

    // Random start rotation
    this._entity.rotateBy(0, 0, Math.radians(this.randFloat(0, 360)));

    // Add the behaviour to the entity
    this._entity.addBehaviour('classicBotComponent_behaviour', this._behaviour);
  },

  // Random integer from <low, high> interval
  randInt: function (low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
  },

  // Random float from <low, high> interval
  randFloat: function (low, high) {
    return low + Math.random() * (high - low);
  },

  _behaviour: function (_ctx, delta) {
    var minNextAction = 500;  // Koska aikaisintaan arvotaan botille uusi suunta
    var maxNextAction = 1000; // Koska viimeistään arvotaan botille uusi suunta
    var rndRotation = 90;     // Kun botille arvotaan uusi kääntyminen niin tämä on maksimi.
    var minSpeed = 80;        // Botin nopeus kun se on havainnut esteen
    var maxSpeed = 200;       // Botin nopeus kun tie on vapaa
    var wakeupDist = 100;     // Jos matkaa esteeseen on vähemmän kuin tämä niin aletaan etsiä uutta suuntaa
    var exploreAngle = 50;    // Kun pitää päätellä uusi suunta niin se tehdään katselemalla
                              // näin monta astetta molempiin suuntiin
    var dodgeRotation = 0.2;  // Kun botti on lähellä estettä niin tällä määrätään kuinka
                              // jyrkällä käännöksellä yritetään väistää.
                              // Pienempi arvo on jyrkempi käännös.

    var bot = this.botControl;
    var currentRot = this.rotate().z() - Math.radians(90);
    var currentPos = this.worldPosition();

    // Mikäli botti ei ole liian lähellä seinää ja on aika arpoa sille uusi suunta
    // niin tehdään se nyt.
    if (!bot._tooClose && bot._nextAction < ige.currentTime()) {
      // Arvotaan seuraavan käännöksen ajankohta eli koska tähän iffiin
      // tullaan seuraavaksi
      bot._nextAction = bot.randInt(minNextAction, maxNextAction) + ige.currentTime();
      // Arvotaan botille uusi kääntyminen
      bot._rotation = Math.radians(bot.randFloat(-rndRotation, rndRotation));

      if (bot._sideStep) {
        bot._sideStep = bot.randFloat(-1, 1);
      }
    }

    // Käännetään bottia
    this.rotateBy(0, 0, (bot._rotation / 1000.0) * delta);

    // Seuraavaksi alkaa varsinainen tekoäly jossa tutkitaan ympäristöä.
    // Tämä tehdää kuitenkin vain mikäli botti ei ole liian lähellä jotakin estettä.
    if (!bot._tooClose) {
      // Nyt lasketaan etäisyys edessä olevaan esteeseen.
      // Etäisyys lasketaan objektin keskeltä sekä reunoista eli objektin koko leveydeltä.
      const closestAhead = bot._getClosestObjectByRotation(currentPos, currentRot);
      const closestFromLeft = bot._getClosestObjectByRotation(currentPos.addPoint({
        x: 15 * Math.cos(currentRot + (Math.PI / 2)),
        y: 15 * Math.sin(currentRot + (Math.PI / 2))
      }), currentRot);
      const closestFromRight = bot._getClosestObjectByRotation(currentPos.addPoint({
        x: 15 * Math.cos(currentRot - (Math.PI / 2)),
        y: 15 * Math.sin(currentRot - (Math.PI / 2))
      }), currentRot);

      const minDist = Math.min(
        closestAhead !== undefined ? closestAhead.distance : Infinity,
        closestFromLeft !== undefined ? closestFromLeft.distance : Infinity,
        closestFromRight !== undefined ? closestFromRight.distance : Infinity
      );

      this.debugRayCastResult(closestAhead);
      this.debugRayCastResult(closestFromLeft);
      this.debugRayCastResult(closestFromRight);

      // Jos este on niin lähellä että siihen pitää reagoida niin tutkitaan se nyt.
      if (minDist < wakeupDist) {
        const checkLeft = bot._getClosestObjectByRotation(currentPos, currentRot - Math.radians(exploreAngle));
        const checkRight = bot._getClosestObjectByRotation(currentPos, currentRot + Math.radians(exploreAngle));

        this.debugRayCastResult(checkLeft);
        this.debugRayCastResult(checkRight);

        // Tutkitaan kumpaan suuntaan on pidempi matka seuraavaan esteeseen
        // ja suunnataan sinne.
        // Kääntymisen jyrkkyyteen vaikuttaa vielä etäisyys esteeseen eli
        // mitä lähempänä ollaan niin sitä jyrkemmin käännytään
        let d = 0;
        if (!checkRight || (checkLeft && checkLeft.distance > checkRight.distance)) {
            d = -(wakeupDist - minDist);
        } else {
            d = (wakeupDist - minDist);
        }

        // Asetetaan kääntymisnopeus
        bot._rotation = Math.radians(d / dodgeRotation);
        // Asetetaan tavoitekulma
        bot._nextAngle = Math.degrees(currentRot) + d;
        // Asetetaan vielä tooClose-muuttuja päälle eli tekoälyä ei päivitetä
        // ennen kuin objekti on kääntynyt tavoitekulmaan.
        // Samalla myös objektin nopeutta vähennetään.
        bot._tooClose = true

        bot._lastAngle = Math.degrees(currentRot) - bot._nextAngle;
      }
    } else {
      // Botti on liian lähellä jotain estettä.
      // tooClose-muuttuja nollataan vain jos tekoälyn asettama tavoitekulma on saavutettu.
      let diffToTarget = Math.degrees(currentRot) - bot._nextAngle;

      if (Math.abs(diffToTarget) < 5) {
        // Objektin kulma on nyt riittävän lähellä tavoitekulmaa joten
        // kääntäminen voidaan lopettaa.
        bot._rotation = 0;
        bot._tooClose = false;
      }
      bot._lastAngle = 0;
    }

    // Taisteluäly
    let moveDirection = 1;
    let pickedPlayer = null;
    let pickedDist = 999;
    let pickedDirection = 0;
    let __tempRayCast;
    // Käydään läpi kaikki muut pelaajat
    ige.$$('Character').forEach(char => {
      if (char === this) return;
      const charPos = char.worldPosition();

      const distance = Math.sqrt(
        Math.pow(charPos.x - currentPos.x, 2) +
        Math.pow(charPos.y - currentPos.y, 2)
      );

      if (distance >= 500) return;

      const visiblePlayer = bot._getClosestObjectBetweenTwoPoints(currentPos, charPos);

      if (visiblePlayer && visiblePlayer.entity.category() === 'Character') {
        const botToCharAngle = bot._angleBetweenEntities(this, visiblePlayer.entity);
        // Jos pelaaja on näkyvissä ja lähimpänä niin talletetaan tiedot muuttujiin
        if ((distance < pickedDist) && Math.abs(botToCharAngle) < 70) {
          pickedDist = distance;
          pickedPlayer = char;
          pickedDirection = botToCharAngle;
          __tempRayCast = visiblePlayer;
        }
      }
    });

    // Onko joku uhri näkösällä
    if (pickedPlayer) {
      if (bot._sideStep === 0) {
        bot._sideStep = bot.randFloat(-1, 1);
      }

      // Nollataan liikkumistekoäly
      bot._tooClose = false;
      // Asetetaan kääntyminen kohti uhria
      bot._rotation = Math.radians(pickedDirection * bot._fightRotate);
      // Aseesta riippuen etäisyys kohteeseen ei saa olla liian pieni
      if (pickedDist < ige.weapon.getProp(this.weapon(), 'safeRange')) {
        moveDirection = -1;
      }
      // Ammutaan vain jos kulma on riittävän pieni
      let sAngle = bot._shootingAngle;
      if (this.weapon() === 'chainsaw') {
        sAngle *= 2;
      }
      const spawnProtected = false; // TODO: Implement spawn protection
      // protected = (player\spawnTime + SPAWN_PROTECT > Timer())
      if (!spawnProtected && Math.abs(pickedDirection) < sAngle && pickedDist > ige.weapon.getProp(this.weapon(), 'safeRange') / 2 && pickedDist <= ige.weapon.getProp(this.weapon(), 'shootRange')) {
        // Jos botilla on pistooli niin luodaan botille satunnaisuutta liipasunopeuteen
        const rldFc = (this.weapon() === 'pistol') ? bot.randFloat(1.2, 2) : 1.0;

        if ((bot._lastShoot + ige.weapon.getProp(this.weapon(), 'reloadTime') * rldFc) < ige._currentTime) {
          this.fireWeapon();
          this.debugRayCastResult(__tempRayCast);
          bot._lastShoot = ige._currentTime;
        }
      }
    }
/*
Else
    player\sideStep = 0
    // Yhtään sopivaa uhria ei ole näkökentässä.
    // Tutkitaan onko joku ampunut bottia näkökentän ulkopuolelta
    If player\shootedBy > 0 Then
        // Haetaan ampujan tiedot
        plr.PLAYERS = ConvertToType(gPlayers(player\shootedBy))
        // Lasketaan suunta
        PickPlayer(player\obj, plr\obj, True)
        // Asetetaan kääntyminen
        player\rotation = gDirection * 3.0
        player\tooClose = True

        player\nextAngle = gDirection
        player\lastAngle = ObjectAngle(player\obj) - player\nextAngle
        If player\lastAngle > 180 Then player\lastAngle = player\lastAngle - 360
        If player\lastAngle < -180 Then player\lastAngle = player\lastAngle + 360
    EndIf
EndIf
*/

    {
      // Nyt siirretään objektia.
      let speed = maxSpeed;
      // Jos ollaan liian lähellä jotain estettä niin pienemmällä vauhdilla
      if (bot._tooClose) speed = minSpeed;

      this.translateCharacter(
        // TODO: Use the weight of weapon instead of 100, the current denominator
        // TODO: Sidestep? How?!
        (((speed / 1000.0) * delta) * moveDirection * 100.0 / 100) * Math.cos(currentRot),
        (((speed / 1000.0) * delta) * moveDirection * 100.0 / 100) * Math.sin(currentRot)
      )

      // MoveObject player\obj, PxPerSec(speed) * moveDirection * 100.0 / aWeapon( player\weapon, WPNF_WEIGHT ), PxPerSec(SIDESTEP_SPEED * 0.8) * player\sideStep * 100.0 / aWeapon( player\weapon, WPNF_WEIGHT )
    }
  },

  _angleBetweenEntities: function (entA, entB) {
    const posA = entA.worldPosition();
    const posB = entB.worldPosition();

    const rotA = entA.rotate().z() - Math.radians(90);

    const aRad = Math.atan2(posB.y - posA.y, posB.x - posA.x) - rotA;
    let a = this._wrapAngle(Math.degrees(aRad));

    if (a > 180) a -= 360;
    if (a < -180) a += 360;

    return a;
  },

  /**
   * Wraps an angle (in degrees) between 0 and 360
   */
  _wrapAngle: function (angle) {
    return angle - Math.floor(angle / 360) * 360;
  },

  /**
   * Returns the closest raycast result between the two given  points
   */
  _getClosestObjectBetweenTwoPoints: function (startPointWorld, endPointWorld) {
    const scaleRatio = ige.box2d.scaleRatio();

    const startPoint = new ige.box2d.b2Vec2(
      startPointWorld.x / scaleRatio,
      startPointWorld.y / scaleRatio
    );
    const endPoint = new ige.box2d.b2Vec2(
      endPointWorld.x / scaleRatio,
      endPointWorld.y / scaleRatio
    );

    let closestHit = null;

    ige.box2d._world.RayCast((fixture, point, normal, fraction) => {
      const category = fixture.m_body._entity.category();
      if (category === 'Bullet') return -1;
      if (category === 'Debug') return -1;
      // if (category === 'Character') return -1;

      const distSquare = (
        Math.pow(startPoint.x - point.x, 2) +
        Math.pow(startPoint.y - point.y, 2)
      );

      if (!closestHit || closestHit.distSquare > distSquare) {
        closestHit = { fixture, category, point, normal, fraction, distSquare };
      }

      return 1;
    }, startPoint, endPoint);

    if (closestHit) {
      return {
        distance: Math.sqrt(closestHit.distSquare) * scaleRatio,
        startPoint: startPointWorld,
        hitPoint: new IgePoint2d(
          closestHit.point.x * scaleRatio,
          closestHit.point.y * scaleRatio
        ),
        endPoint: new IgePoint2d(
          endPoint.x * scaleRatio,
          endPoint.y * scaleRatio
        ),
        hitNormal: closestHit.normal,
        fixture: closestHit.fixture,
        entity: closestHit.fixture.m_body._entity
      };
    }
  },

  /**
   * Raycast to find the closest hit object using the given rotation
   */
  _getClosestObjectByRotation: function (startPos, rotation) {
    var sightDistance = 1500;  // Kuinka kaukaa etsitään seinää pisimmillään

    const endPoint = new IgePoint2d(
      startPos.x + sightDistance * Math.cos(rotation),
      startPos.y + sightDistance * Math.sin(rotation)
    );

    return this._getClosestObjectBetweenTwoPoints(startPos, endPoint);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClassicBotComponent; }
