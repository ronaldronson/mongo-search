const http = require('http')
const url = require('url')
const qs = require('qs')

const MongoClient = require('mongodb').MongoClient

const filtersList = {
  postcode: _ => ({postcodes: _}),
  cuisine: _ => ({cuisines: {$in: _.split(',')}}),
  delivery: _ => ({delivery_charge: 0}),
  top500: _ => ({Top500: true}),
}

const sortList = {
  price: {avg_price: 1},
  rating: {rating: -1},
  alpha: {name: 1},
  min_value: {min_delivery_value: 1},
  distance: {distance: 1},
}

const allowedFilterKeys = Object.keys(filtersList)

const filter = (params = {}) => Object.keys(params)
  .filter(name => !!~allowedFilterKeys.indexOf(name))
  .reduce((res, name) => Object.assign({}, res, filtersList[name](params[name])), {})

const responce = (data = [], url = '') => ({data: {
  type: 'restaurant-search',
  attributes: {total: data.length, restaurants: data},
  links: {self: url}
}})

const webserv = (db) => http.createServer((req, res) => {
  const params = url.parse(req.url)
  const query = qs.parse(params.query)

  if ('/' === params.pathname) {
    db.collection('rests')
      .find(filter(query.filters), {postcodes: 0, _id: 0})
      .sort(sortList[query.sort] || {})
      .skip(query.skip | 0 || 0)
      .limit(query.limit | 0 || 0)
      .toArray((err, resp) => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(responce(resp, req.url)))
      })
  } else {
    res.writeHead(404)
    res.end()
  }
}).listen(8080, () => console.log('listen to port ', 8080))

MongoClient.connect('mongodb://mongo:27017/search', (err, db) => {
  err ? console.log(err) : webserv(db)
})
