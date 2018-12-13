const fetch = require('node-fetch')
class Http {
  constructor (http) {
    this.http = http
    this.ID = 'http'
  }
  to (recipient, channel, action, parameters, response) {
    fetch(recipient + channel + '/' + action, {
      method: 'post',
      body: JSON.stringify({
        action: action,
        parameters: parameters
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
      .then(data => {
        if (response) {
          if (data.channel === response.channel && data.action === response.action) {
            response.callback(this.ID, recipient, data)
          }
        }
      })
  }
  // I don't know if it actually works, we should also check that the host passed on the request matches the ip for security reasons.
  getHostFromRequest (req) {
    return req.headers.host.replace(/(^\w+:|^)\/\//, '')
  }
  on (channel, action, resource, callback, response) {
    resource.onGet('/' + channel + '/' + action, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      callback(
        this.ID,
        this.getHostFromRequest(req),
        req.params,
        (parameters) => res.end(JSON.stringify({
          channel: response.channel,
          action: response.action,
          parameters: parameters
        }))
      )
    })
  }
  disconnect () {}
}

exports['default'] = Http
module.exports = exports['default']
