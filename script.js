function Media(deviceConditions = {}, callback = false) {
  if (Media._instance) return Media._instance;

  // Validating
  if (typeof deviceConditions !== 'object')
    throw new TypeError('Conditions must be an object containing mediaQuaries as a strings');
  if (callback && typeof callback !== 'function')
    throw new TypeError('Callback must be a function');

  var self = this;
  self.callback = callback;

  // Bulding condition variables
  var _build = function(e) {
    if (e && e.matches && e.target.type || !Media._instance) {

      // Bulding
      if (e && e.target.type) var oldValue = self[e.target.type].current;
      var setUpProps = function(target) {
        return Object.keys(target).reduce(function(result, deviceName) {
          result[deviceName] = target[deviceName].matches;
          return result;
        }, {})
      }

      var selectCurrent = function(object) {
        var coincidence = Object.keys(object).filter(function(key) {
          return object[key]
        })
        // If something goes wrong
        if (coincidence.length > 1)
          throw new TypeError('Conditions musn\'t cross each other');
        if (coincidence.length == 0)
          throw new TypeError('Condition couldn\'t be detected');
        return coincidence[0];
      }
      
      Array.from(['devices', 'orientation']).forEach(function(prop) {
        self[prop] = setUpProps(matches[prop]);
        self[prop].current = selectCurrent(self[prop]);
      });

      // Preparing event
      if (Media._instance) {
        var event = new CustomEvent(e.target.type, {
          detail: {
            oldValue: oldValue,
            newValue: self[e.target.type].current
          }
        });

        // Firing callback
        if (event.detail.oldValue !== event.detail.newValue){
           if (callback) self.callback(event);
           else document.dispatchEvent(event);
        }
      }
    }
  }

  // Initalization
  var orientationInit = function(type) {
    return (function() {
      var orientation = window.matchMedia(`(orientation: ${type})`)
      orientation.onchange = _build.bind(self);
      orientation.type = 'orientation';
      return orientation;
    }())
  }
  var matches = {
    devices: (function(){
      var result = {},
          keys = Object.keys(deviceConditions),
          key,
          queryString,
          min,
          max;
      for (var i = 0; i < keys.length + 1; i++) {
        key = keys[i] || 'nosupport';
        // Query string
        min = (i > 0 && i <= keys.length) ? `(min-width: ${deviceConditions[keys[i - 1]]}px)` : '';
        max = (i < keys.length) ? `(max-width: ${deviceConditions[keys[i]] - 1}px)` : '';
        queryString = (min !== '' && max !== '') ? Array.from([min, max]).join(' and ') : min + max;
        // Making matchMedias
        result[key] = window.matchMedia(queryString);
        result[key].type = 'devices';
        result[key].onchange = _build.bind(self);
      }
      console.log(result);
      return result;
    })(),
    orientation: {
      landscape: orientationInit('landscape'),
      portrait: orientationInit('portrait')
    }
  }

  _build();

  return Media._instance = this;
}
