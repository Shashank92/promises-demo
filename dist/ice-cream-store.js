'use strict';

var EventEmitter = require('events');

var promises = [],
    flavors = ['chocolate', 'strawberry', 'vanilla'],
    errChance = 0.1,
    maxIceCreamDelay = 6000,
    maxNumOrders = 5,
    orderInterval = 500;

function pickRandomFlavor() {
  return flavors[Math.floor(Math.random() * flavors.length)];
}

// Proxy for asynchronous Node I/O
function distributeOrder(flavor1, flavor2, callback) {
  if (Math.random() > errChance) {
    // Simulate success.
    setTimeout(callback, Math.random() * maxIceCreamDelay,
    // arguments passed to callback.
    null, flavor1, flavor2);
    console.log('Your ice cream will be ready shortly.');
  } else {
    // Simulate error.
    var err = new Error('Sorry, the ice cream is on fire. ' + 'We are now closed. :)');
    callback(err);
  }
}

// Proxy for synchronous callback upon I/O completion.
function giveIceCream(err, flavor1, flavor2) {
  if (err) {
    throw err;
  } else {
    var v = 'Here is your ' + flavor1 + ' ' + flavor2 + ' ice cream.';
    console.log(v);
    return v;
  }
}

// Proxy for events
var iceCreamStoreManager = new EventEmitter();

iceCreamStoreManager.on('order', function () {
  var flavor1 = pickRandomFlavor();
  var flavor2 = pickRandomFlavor();

  console.log('I want some ' + flavor1 + ' ' + flavor2 + ' ice cream.');

  promises.push(new Promise(function (resolve, reject) {
    distributeOrder(flavor1, flavor2, function (err) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (err) reject(err);else resolve(giveIceCream.apply(undefined, [err].concat(args)));
    });
  }));
});

iceCreamStoreManager.on('close', function () {
  console.log('We are closing soon. No more orders will be taken.');
  Promise.all(promises).then(function (values) {
    promises.length = 0;
    console.log('Busy day over. Closing store.');
  }, function (reason) {
    promises.length = 0;
    console.log(reason.stack);
    process.exit();
  });
});

// Mock events
var numOrders = maxNumOrders;
var iid = setInterval(function () {
  iceCreamStoreManager.emit('order');
  if (--numOrders < 1) {
    clearInterval(iid);
    iceCreamStoreManager.emit('close');
  }
}, orderInterval);