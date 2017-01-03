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
    var scaleRatio = ige.box2d.scaleRatio();

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
      const currentPos = this.worldPosition();
      // Nyt lasketaan etäisyys edessä olevaan esteeseen.
      // Etäisyys lasketaan objektin keskeltä sekä reunoista eli objektin koko leveydeltä.
      const closestAhead = bot._getClosestObjectFrom(currentPos, currentRot);
      const closestFromLeft = bot._getClosestObjectFrom(currentPos.addPoint({
        x: 15 * Math.cos(currentRot + (Math.PI / 2)),
        y: 15 * Math.sin(currentRot + (Math.PI / 2))
      }), currentRot);
      const closestFromRight = bot._getClosestObjectFrom(currentPos.addPoint({
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
        const checkLeft = bot._getClosestObjectFrom(currentPos, currentRot - Math.radians(exploreAngle));
        const checkRight = bot._getClosestObjectFrom(currentPos, currentRot + Math.radians(exploreAngle));

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
/*
// Taisteluäly
moveDirection = 1
pickedPlayer = 0
pickedDist = 999
pickedDirection = 0
// Käydään läpi kaikki muut pelaajat
For plr.PLAYERS = Each PLAYERS
    enemy = True
    If gPlayMode <> DM And player\team = plr\team Then enemy = False
    If enemy = True And plr\playerId <> player\playerId And plr\health > 0 And plr\loggedIn = True And Distance2(player\obj, plr\obj) < 500 Then
        If PickPlayer(player\obj, plr\obj) = True Then
            // Jos pelaaja on näkyvissä ja lähimpänä niin talletetaan tiedot muuttujiin
            If gDistance < pickedDist And Abs(gDirection) < 70 Then
                pickedDist = gDistance
                pickedPlayer = player\playerId
                pickedDirection = gDirection
            EndIf
        EndIf
    EndIf
Next plr
// Onko joku uhri näkösällä
If pickedPlayer > 0 Then
    If player\sideStep = 0 Then
        player\sideStep = Rnd(-1, 1)
    EndIf
    // Nollataan liikkumistekoäly
    player\tooClose = False
    // Asetetaan kääntyminen kohti uhria
    player\rotation = pickedDirection * player\fightRotate
    // Aseesta riippuen etäisyys kohteeseen ei saa olla liian pieni
    If pickedDist < aWeapon(player\weapon, WPNF_SAFERANGE) Then moveDirection = -1
    // Ammutaan vain jos kulma on riittävän pieni
    sAngle# = player\shootingAngle
    If player\weapon = WPN_CHAINSAW Then sAngle = sAngle * 2
    protected = (player\spawnTime + SPAWN_PROTECT > Timer())
    If protected = False And Abs(pickedDirection) < sAngle And pickedDist > aWeapon(player\weapon, WPNF_SAFERANGE) / 2 And pickedDist <= aWeapon(player\weapon, WPNF_SHOOTRANGE) Then
        // Jos botilla on pistooli niin luodaan botille satunnaisuutta liipasunopeuteen
        If player\weapon = WPN_PISTOL Then rldFc# = Rnd(1.2,2) Else rldFc# = 1.0

        If (player\lastShoot + aWeapon(player\weapon, WPNF_RELOADTIME)*rldFc#) < Timer() Then
            CreateServerBullet(player\playerId)
            player\lastShoot = Timer()
        EndIf
    EndIf
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
        (((speed / 1000.0) * delta)/* * moveDirection */ * 100.0 / 100) * Math.cos(currentRot),
        (((speed / 1000.0) * delta)/* * moveDirection */ * 100.0 / 100) * Math.sin(currentRot)
      )

      // MoveObject player\obj, PxPerSec(speed) * moveDirection * 100.0 / aWeapon( player\weapon, WPNF_WEIGHT ), PxPerSec(SIDESTEP_SPEED * 0.8) * player\sideStep * 100.0 / aWeapon( player\weapon, WPNF_WEIGHT )
    }
  },

  /**
   * Raycast to find the closest hit object
   */
  _getClosestObjectFrom: function (startPos, rotation) {
    var sightDistance = 1500;  // Kuinka kaukaa etsitään seinää pisimmillään
    const bot = this.botControl;

    let closestHit = null;
    const scaleRatio = ige.box2d.scaleRatio();
    const startPoint = new ige.box2d.b2Vec2(
      startPos.x / scaleRatio,
      startPos.y / scaleRatio
    );
    const endPoint = new ige.box2d.b2Vec2(
      startPoint.x + (sightDistance / scaleRatio) * Math.cos(rotation),
      startPoint.y + (sightDistance / scaleRatio) * Math.sin(rotation)
    );

    ige.box2d._world.RayCast((fixture, point, normal, fraction) => {
      const category = fixture.m_body._entity.category();
      if (category === 'Bullet') return -1;
      if (category === 'Debug') return -1;
      if (category === 'Character') return -1;

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
        startPoint: startPos,
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
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClassicBotComponent; }
