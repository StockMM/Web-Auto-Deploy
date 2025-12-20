const path = require('path')
const https = require('https')
const querystring = require('querystring')

module.exports = function (config) {
  return {
    cleanCache: function () {
      return new Promise((resolve, reject) => {
        const postData = querystring.stringify({
          url: '3http://stockmmm.com/, 3https://stockmmm.com/, 3http://www.stockmmm.com/, 3https://www.stockmmm.com/, 3http://www.stockmmm.com/,'
        })
        const postDataV2 = querystring.stringify({
          url: 'http://stockmmm.com/, https://stockmmm.com/, http://www.stockmmm.com/, https://www.stockmmm.com/, http://www.stockmmm.com/'
        })

        const options = {
          protocol: 'https:',
          host: 'cp.huyuncdn.com',
          path: '/vhost/?c=cacheclean&a=cacheclean',
          method: 'POST',
          headers: {
            // Use correct content type for form data
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        }

        const req = https.request(options, res => {
          res.on('data', d => {
            process.stdout.write(d)
          })
          res.on('end', () => {
            resolve('cdn缓存清除成功')
          })
        })
        req.on('error', error => {
          console.error(error)
          reject('cdn缓存清除失败')
        })

        req.write(postData)
        req.end()

        const reqV2 = https.request(options, res => {
          res.on('data', d => {
            // process.stdout.write(d)
          })
          res.on('end', () => {
            // resolve('cdn缓存清除成功')
          })
        })
        reqV2.on('error', error => {
          console.error(error)
          // reject('cdn缓存清除失败')
        })

        reqV2.write(postDataV2)
        reqV2.end()
      })
    }
  }
}
