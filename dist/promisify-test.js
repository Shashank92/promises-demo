'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var promisify = require('es6-promisify');

// Proxy for Node Async I/O.
function asyncTask(arg1, arg2, callback) {
  if (Math.random() < .05) {
    setTimeout(function () {
      return callback(new Error('not enough cats'));
    }, 2500);
  } else {
    setTimeout(function () {
      return callback(null, arg1, arg2);
    }, Math.random() * 5000);
  }
}

asyncTask = promisify(asyncTask);

var promises = [];

for (var i = 0; i < 10; i++) {
  promises.push(asyncTask(7, 6).then(function (args) {
    // on success.

    var _args = _slicedToArray(args, 2);

    var a = _args[0];
    var b = _args[1];

    console.log(a * b);
  }).catch(function (err) {
    // on failure.
    throw err;
  }));
}

Promise.all(promises).then(function (values) {
  promises.length = 0;
  console.log('successful exit');
}, function (err) {
  console.error(err);
  process.exit();
});