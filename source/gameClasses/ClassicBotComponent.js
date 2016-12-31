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
/*
// Seuraavaksi alkaa varsinainen tekoäly jossa tutkitaan ympäristöä.
// Tämä tehdää kuitenkin vain mikäli botti ei ole liian lähellä jotakin estettä.
If player\tooClose = False Then

    // Nyt lasketaan etäisyys edessä olevaan esteeseen.
    // Etäisyys lasketaan objektin keskeltä sekä reunoista eli objektin koko leveydeltä.

    minDist# = 0
    dist# = 0

    // Ensin "silmä" keskelle objektia
    CloneObjectPosition gPicker, player\obj
    CloneObjectOrientation gPicker, player\obj

    // Poimitaan lähin este
    ObjectPick gPicker
    minDist = Distance(ObjectX(gPicker), ObjectY(gPicker), PickedX(), PickedY())

    // Siiretään "silmä" toiseen reunaan ja poimitaan lähin este
    MoveObject gPicker, 0, -15
    ObjectPick gPicker
    minDist = Min(minDist, Distance(ObjectX(gPicker), ObjectY(gPicker), PickedX(), PickedY()))

    // Ja vielä toiseen reunaan ja poimitaan lähin este
    MoveObject gPicker, 0, 30
    ObjectPick gPicker
    minDist = Min(minDist, Distance(ObjectX(gPicker), ObjectY(gPicker), PickedX(), PickedY()))

    // Jos este on niin lähellä että siihen pitää reagoida niin tutkitaan se nyt.
    If minDist < WAKEUP_DIST Then
        // Ensin "silmä" samaan suuntaan kuin zombie
        CloneObjectOrientation gPicker, player\obj
        // Käännetään katsetta toiselle sivulle ja lasketaan etäisyys lähimpään esteeseen
        TurnObject gPicker, -EXPLORE_ANGLE
        ObjectPick gPicker
        d1# = Distance(ObjectX(gPicker), ObjectY(gPicker), PickedX(), PickedY())

        // Ja sitten vielä toiseen suuntaan.
        TurnObject gPicker, EXPLORE_ANGLE * 2
        ObjectPick gPicker
        d2# = Distance(ObjectX(gPicker), ObjectY(gPicker), PickedX(), PickedY())

        // Tutkitaan kumpaan suuntaan on pidempi matka seuraavaan esteeseen
        // ja suunnataan sinne.
        // Kääntymisen jyrkkyyteen vaikuttaa vielä etäisyys esteeseen eli
        // mitä lähempänä ollaan niin sitä jyrkemmin käännytään
        d# = 0
        If d1 > d2 Then
            d = -(WAKEUP_DIST - minDist)
        Else
            d = (WAKEUP_DIST - minDist)
        EndIf
        // Asetetaan kääntymisnopeus
        player\rotation = d / DODGE_ROTATION
        // Asetetaan tavoitekulma
        player\nextAngle = WrapAngle(ObjectAngle(player\obj) + d)
        // Asetetaan vielä tooClose-muuttuja päälle eli tekoälyä ei päivitetä
        // ennen kuin objekti on kääntynyt tavoitekulmaan.
        // Samalla myös objektin nopeutta vähennetään.
        player\tooClose = True

        player\lastAngle = ObjectAngle(player\obj) - player\nextAngle
        If player\lastAngle > 180 Then player\lastAngle = player\lastAngle - 360
        If player\lastAngle < -180 Then player\lastAngle = player\lastAngle + 360
    EndIf
Else
    // Botti on liian lähellä jotain estettä.
    // tooClose-muuttuja nollataan vain jos tekoälyn asettama tavoitekulma on saavutettu.
    //na# = Abs(ObjectAngle(player\obj) - player\nextAngle)
    //If na > 180 Then na = 360 - na
    //If na < 10 Then
    a# = ObjectAngle(player\obj) - player\nextAngle
    If a > 180 Then a = a - 360
    If a < -180 Then a = a + 360
    If (a < 0 And player\lastAngle >= 0) Or (a > 0 And player\lastAngle <= 0) Then
        // Objektin kulma on nyt riittävän lähellä tavoitekulmaa joten
        // kääntäminen voidaan lopettaa.
        player\rotation = 0
        player\tooClose = False
    EndIf
    player\lastAngle = a
EndIf

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

// Nyt siirretään objektia.
speed# = MAX_SPEED
// Jos ollaan liian lähellä jotain estettä niin pienemmällä vauhdilla
If player\tooClose = True Then speed = MIN_SPEED
MoveObject player\obj, PxPerSec(speed) * moveDirection * 100.0 / aWeapon( player\weapon, WPNF_WEIGHT ), PxPerSec(SIDESTEP_SPEED * 0.8) * player\sideStep * 100.0 / aWeapon( player\weapon, WPNF_WEIGHT )
*/
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClassicBotComponent; }
