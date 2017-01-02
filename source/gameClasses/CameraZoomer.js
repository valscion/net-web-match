var CameraZoomer = IgeClass.extend({
  classId: 'CameraZoomer',

  init: function () {
    this._isZooming = false;
    ige.input.on('keyDown', this._onKeyDown.bind(this));
  },

  _onKeyDown: function (_event, keyCode) {
    if (keyCode === ige.input.key.z) {
      if (this._isZooming) {
        ige.client.vp1.camera._scale.tween()
          .stopAll()
          .properties({x: 1, y: 1})
          .duration(500)
          .start();
      } else {
        ige.client.vp1.camera._scale.tween()
          .stopAll()
          .properties({x: 0.25, y: 0.25})
          .duration(500)
          .start();
      }

      this._isZooming = !this._isZooming;
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CameraZoomer; }
