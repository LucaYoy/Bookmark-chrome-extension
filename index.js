const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const URL = 'mongodb://localhost:27017'
const myMongoClient = new MongoClient(URL)
const PORT = 3000

async function main() {
	app.use(express.static('public'))
	app.use(express.json())
	app.use(cors())
	
	try {
		const client = await myMongoClient.connect()
		console.log('Connected to Db!')
		const leedsCollection = client.db('ChromeExtension').collection('leedsCollection')
		start(leedsCollection)
	} catch(err) {
		console.error(err)
	}
}

function start(leedsCollection){
	//listen for GET requests and send leads from Db
	app.get('/api/start', async function(req,res) {
		console.log('I got a GET request')
		let leedsArr = await leedsCollection.find().sort({_id:1}).toArray()
		console.log(leedsArr)
		if (leedsArr.length !== 0) {
			//console.log(leedsArr)
			res.json(JSON.stringify(leedsArr[leedsArr.length-1]))
		} else {
			res.end('null')
		}
	})

	app.get('/api/clear', async function(req,res) {
		console.log('I got a GET request')
		await leedsCollection.deleteMany()
		res.end()
	})

	//Listen for POST requests and save leeds to Db
	app.post('/api/update', async function(req,res) {
		console.log('I got a POST request!')
		//console.log(req.body)
		const data = req.body
		await leedsCollection.insertOne(data) //******
		res.end()
	})

	app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}

main()