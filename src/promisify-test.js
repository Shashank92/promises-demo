const promisify = require('es6-promisify')

// Proxy for Node Async I/O.
function asyncTask(arg1, arg2, callback) {
  if (Math.random() < .05) {
    setTimeout(() => callback(new Error('not enough cats')), 2500)
  } else {
    setTimeout(() => callback(null, arg1, arg2), Math.random()*5000)
  }
}

asyncTask = promisify(asyncTask)

const promises = [];

for (let i = 0; i < 10; i++) {
  promises.push(
    asyncTask(7, 6).then((args) => {
      // on success.
      const [a, b] = args;
      console.log(a * b)
    }).catch((err) => {
      // on failure.
      throw err;
    })
  )
}

Promise.all(promises).then(
  (values) => {
    promises.length = 0;
    console.log('successful exit')
  }, 
  (err) => {
    console.error(err)
    process.exit()
  }
)