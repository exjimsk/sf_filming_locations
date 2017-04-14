const fs 		= require("fs")
const express 	= require("express")

var app 			= {
	_http: 						express(),
	_initialized: 				0,
	_port: 						process.env.PORT,
	_started: 					-1,
	locations: 					{},
	geoLocationFromGoogle: 	() => {},
	init: 						() => {},
	start: 						() => {},
}

app.init = function() {
	// cache filming locations;
	this.locations = JSON.parse(fs.readFileSync("./assets/geolocations.json"))

	this._initialized = true
}

app.start = function(port) {
	this._http.get("/", (req, res) => {
		res.send(fs.readFileSync("./assets/html/index.html").toString())
	})

	this._http.get("/locations.json", (req, res) => {
		res.send(this.locations)
	})

	this._http.get("/components.js", (req, res) => {
		res.send(fs.readFileSync('./assets/js/components.js').toString())
	})

	this._http.listen(port)
}

module.exports = {
	app: 	app
}

console.log("app initializing...")

app.init()

console.log("app initialized successfully :"+app._port)

app.start(app._port)
