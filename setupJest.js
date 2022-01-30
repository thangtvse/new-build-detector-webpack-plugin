require('jest-fetch-mock').enableMocks()

const customSetInterval = setInterval;
const customSetTimeout = setTimeout;

global.waitFor = (fn) => {
  console.log('start wait')

  return new Promise((resolve, reject) => {
    let done = false;
  

    let interval = customSetInterval(async () => {
      console.log('try');

      try {
        const res = await fn();
        clearInterval(interval)
        resolve()
        done = true;
        console.log('done')
      } catch (e) {
        console.log(e)
      }
    }, 100);

    customSetTimeout(() => {
      if (!done) {
        clearInterval();
        reject(new Error('Wait timeout'));
      }
    }, 5000)
  })
}