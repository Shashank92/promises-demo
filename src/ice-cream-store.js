const EventEmitter = require('events')

const promises = [],
      flavors = ['chocolate', 'strawberry', 'vanilla'],
      errChance = 0.1,
      maxIceCreamDelay = 6000,
      maxNumOrders = 5,
      orderInterval = 500

function pickRandomFlavor() {
  return flavors[Math.floor(Math.random() * flavors.length)]
}

// Proxy for asynchronous Node I/O
function distributeOrder(flavor1, flavor2, callback) {
  if (Math.random() > errChance) {
    // Simulate success.
    setTimeout(callback, Math.random() * maxIceCreamDelay, 
      // arguments passed to callback.
      null, flavor1, flavor2)
    console.log('Your ice cream will be ready shortly.')
  } else {
    // Simulate error.
    const err = new Error('Sorry, the ice cream is on fire. ' +
      'We are now closed. :)')
    callback(err)
  }
}

// Proxy for synchronous callback upon I/O completion.
function giveIceCream(err, flavor1, flavor2) {
  if (err) {
    throw err
  } else {
    const v = `Here is your ${flavor1} ${flavor2} ice cream.`
    console.log(v)
    return v
  }
}

// Proxy for events
const iceCreamStoreManager = new EventEmitter()

iceCreamStoreManager.on('order', () => {
  const [flavor1, flavor2] = [pickRandomFlavor(), pickRandomFlavor()]
  console.log(`I want some ${flavor1} ${flavor2} ice cream.`)
  
  promises.push(
    new Promise((resolve, reject) => {
      distributeOrder(flavor1, flavor2, (err, ...args) => {
        if (err)
          reject(err)
        else
          resolve(giveIceCream(err, ...args))
      })
    })
  )
})

iceCreamStoreManager.on('close', () => {
  console.log('We are closing soon. No more orders will be taken.')
  Promise.all(promises).then(
    (values) => {
      promises.length = 0
      console.log('Busy day over. Closing store.')
    }, 
    (reason) => {
      promises.length = 0
      console.log(reason.stack)
      process.exit()
    }
  )
})

// Mock events
let numOrders = maxNumOrders
const iid = setInterval(()=> {
  iceCreamStoreManager.emit('order')
  if (--numOrders < 1) {
    clearInterval(iid)
    iceCreamStoreManager.emit('close')
  }
}, orderInterval)