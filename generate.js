const ukPostcodes = require('./ukpostcodes')

const data = {
  "id": 8620,
  "status": "New",
  "name": "Another Halal",
  "logo": "8690.gif",
  "rating": 42,
  "reviews": 1263,
  "cuisines": [],
  "coordinates": {
    "lat": 51.52571692211,
    "lng": -0.1171272876968
  },
  "distance": 2510,
  "recommended": 999994,
  "avg_price": 7,
  "opening_hours": {
    "slot_1": {
      "start": "2016-07-20T07:00:00+01:00",
      "end": "2016-07-20T23:00:00+01:00",
      "type": "C,D"
    }
  },
  "min_delivery_value": 0,
  "loyalty_stamps_need": 0,
  "loyalty_stamps_have": 0,
  "delivery_charge": 200,
  "delivery_charge_limit": 1200,
  "address": {
    "city": "Crouch End",
    "address": "66-68 Crouch End Hill",
    "zipcode": "N88AG",
    "phone": 2083416100
  },
  "sponsor": true,
  "payment_methods": {
    "cash": true,
    "card": true,
    "paypal": true
  },
  "Top500": true
}

const cuisines = [
  "All Night Alcohol",
  "American",
  "Balti",
  "Bangladeshi",
  "Breakfast",
  "Burgers & Chicken",
  "Cantonese",
  "Caribbean",
  "Charcoal Chicken",
  "Chinese",
  "Desserts",
  "Dim Sum",
  "Fish & Chips",
  "Gastro",
  "Greek",
  "Halal",
  "Indian",
  "Italian",
  "Japanese",
  "Jerk Chicken",
  "Kebab",
  "Korean",
  "Lebanese",
  "Malaysian",
  "Mexican",
  "Modern British",
  "Moroccan",
  "Nepalese",
  "Oriental",
  "Other",
  "Pakistani",
  "Peking",
  "Persian",
  "Pizza",
  "Russian",
  "Salads",
  "Sandwiches",
  "South Indian",
  "Sushi",
  "Thai",
  "Turkish",
  "Vegetarian",
  "Vietnamese"
]

const coordinates = {
  "lng": -0.222812184852696,
  "lat": 51.4808482449117
}

const rand = (i = 32) => (Math.random() * i)|0

const getPostcodes = () => {
  const startIdx = rand(ukPostcodes.length - 10000)
  const endIdx = startIdx + rand(10000)
  return ukPostcodes.slice(startIdx, endIdx)
}

const generate = (db, n) => {
  console.time('work:')

  const rests = Array.apply(null, {length: n}).map((v, i) =>
    Object.assign({}, data, {
      id: i,
      name: i + ' name',
      avg_price: i / 2,
      coordinates: {
        lat: data.coordinates.lat + (i / 1000),
        lng: data.coordinates.lng - (i / 1000)
      },
      distance: rand(1000),
      rating: i + rand(),
      cuisines: [
        cuisines[rand()],
        cuisines[rand()]
      ],
      min_delivery_value: i / 100,
      Top500: !(i % 2),
      postcodes: getPostcodes()
    }))

  db.collection('rests').insertMany(rests, (err, result) => {
    console.timeEnd('work:')
    err && console.log(err)
    db.close()
  })
}

require('mongodb').MongoClient
  .connect('mongodb://mongo:27017/search', (err, db) => {
    err ? console.log(err) : generate(db, 10000)
  })
