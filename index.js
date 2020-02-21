const express = require("express")
const app = express()
const lowdb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const db = lowdb(new FileSync("Data.json"))
const DataParser = require("./DataParser")
const path = require("path")
const fs = require("fs")

app.get('/', function (req, res) {
	res.send('Hello')
});

app.get('/availableType', function (req, res) {
	res.send(DataParser.getAllValueOfSpecificField("data", "type"))
})

app.get('/getNameOfTypes', function (req, res) {
	if (!req.query.type)
		res.send([])
	else { 
		var queryResult = db.get("data").find({type : req.query.type}).value()
		if (queryResult) {
			res.send(Object.keys(queryResult["namesOfType"]))
		}
		else
			res.send([])
	}
})

app.get('/getFile', function (req, res) { 
	if (!req.query.type || !req.query.nameOfType) 
		res.send("")
	var queryResult = db.get("data").find({ type : req.query.type }).get("namesOfType").value()
	if (Object.keys(queryResult).includes(req.query.nameOfType)) {
		const fileStream = fs.createReadStream(path.join(__dirname, "Data", queryResult[req.query.nameOfType])).pipe(res)
		fileStream.on('finish', () => res.end())
	}
	else
		res.send("")
})

const port = 3001
app.listen(port, () => {
	console.log("Dataportalbackend Started On " + port)
});
