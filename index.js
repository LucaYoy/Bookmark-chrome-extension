const express = require('express')
const app = express()
const cors = require('cors')
const Datastore = require('nedb')

const PORT = 3000

app.use(express.static('public'))
app.use(express.json())
app.use(cors())
db.loadDatabase()

//listen for GET requests and send leads from Db
app.get('/api/start', (req,res) => {
	console.log('I got a GET request')
	db.find({}).sort({_id:1}).exec( (err,leedsArr) => {
		if (leedsArr.length !== 0) {
			//console.log(leedsArr)
			res.json(JSON.stringify(leedsArr[leedsArr.length-1]))
		} else {
			res.end('null')
		}
	})
})

app.get('/api/clear', (req,res) => {
	console.log('I got a GET request')
	db.remove({}, {multi: true}, (err) => console.error(err))
	res.end()
})

//Listen for POST requests and save leeds to Db
app.post('/api/update', (req,res) => {
	console.log('I got a POST request!')
	//console.log(req.body)
	const data = req.body
	db.insert(data, (err, data) => console.log(data))
	res.end()
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))