const {Client} = require("@elastic/elasticsearch")
require('dotenv').config()

const esClient = new Client({
  node: process.env.ELASTIC_URL
})

esClient.ping()
  .then(() => console.log('Elasticsearch connected'))
  .catch(err => console.error('Elasticsearch connection failed', err))

module.exports = esClient