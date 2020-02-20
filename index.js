const express = require("express")
const app = express()
const lowdb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const db = lowdb(new FileSync("Data.json"))
const DataParser = require("./DataParser")

app.get('/', function (req, res) {
	res.send('Hello')
});

app.get('/availableType', function (req, res) {
	res.send(DataParser.getAllValueOfSpecificField("data", "type"))
})

const port = 3001
app.listen(port, () => {
	console.log("Dataportalbackend Started On " + port)
});

