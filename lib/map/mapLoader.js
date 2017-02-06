'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _loadScript = require('load-script');

var _loadScript2 = _interopRequireDefault(_loadScript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var callbacks = [];
var done = function done(err, map) {
  callbacks.forEach(function (fn) {
    return fn(err, map);
  });
  callbacks.length = 0;
};

var mapLoader = function mapLoader(mapConfig, cb) {
  var url = mapConfig.url,
      version = mapConfig.version,
      key = mapConfig.key;

  callbacks.push(cb);

  if (typeof window === 'undefined') return;
  if (typeof window.map !== 'undefined') {
    done(null, window.map);
  } else if (callbacks.length <= 1) {
    (function () {
      var mapCallback = 'mapCallback' + Date.now();
      window[mapCallback] = function () {
        window.map = _ramda2.default.path(mapConfig.mapInstancePath, window);
        done(null, window.map);
        delete window[mapCallback];
      };
      var src = url + '?v=' + version + '&key=' + key + '&callback=' + mapCallback;
      (0, _loadScript2.default)(src, function (err) {
        if (err) {
          done(err);
        }
      });
    })();
  }
  // AMap === undefined && callbacks.length > 1 Callbacks should wait until AMap is ready
};

exports.default = mapLoader;