var CameraZoomer = IgeClass.extend({
  classId: 'CameraZoomer',

  init: function () {
    this._isZooming = false;
    ige.input.on('keyDown', this._onKeyDown.bind(this));
  },

  _onKeyDown: function (_event, keyCode) {
    if (keyCode === ige.input.key.z) {
      if (this._isZooming) {
        ige.client.vp1.camera.scaleTo(1, 1, 0);
      } else {
        ige.client.vp1.camera.scaleTo(0.25, 0.25, 0);
      }

      this._isZooming = !this._isZooming;
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CameraZoomer; }
