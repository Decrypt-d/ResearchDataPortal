const lowdb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const db = lowdb(new FileSync("Data.json"))
const fs = require("fs")
const path = require("path")

//File name should have the format filler_type_nameOfType (unitType).csv
//Example: emissions_GHG_CH4 (Gt CO2-eq).csv
function parseFileTitleToDB(fileName) {
	const fileTitle = fileName.split("(")[0].trim();
	const tokens = fileTitle.split("_");
	const handle = db.defaults({"data" : []}).get("data");
	if (!handle.find({ "type" : tokens[1]}).value()) 
		handle.push({"type" : tokens[1], "namesOfTypes" : []}).write();
	if (tokens[2] !== undefined && !handle.find({"type" : tokens[1]}).get("namesOfTypes").value().includes(tokens[2])) {
		handle.find({"type" : tokens[1]}).get("namesOfTypes").value().push(tokens[2]);
		handle.write()
	}
}

function getAllValueOfSpecificField(collection, field) {
	const result = [];
	const collectionVals = db.get(collection).value()
	for (var i = 0; i < collectionVals.length; ++i)
		result.push(collectionVals[i][field])
	return result;	
}

function loadFileNameToDatabase(dir) {
	const directory = path.join(__dirname, dir)
	fs.readdir(directory, function (err, files) {
		files.forEach( function (file) { 
			parseFileTitleToDB(file)
		})
	})
}

loadFileNameToDatabase("Data")
module.exports.loadFileNameToDatabase = loadFileNameToDatabase
module.exports.getAllValueOfSpecificField = getAllValueOfSpecificField

