var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var teslams = require('teslams');

tesla = new Object();

router.get('/', function(req, res) {
    res.json(tesla);
});
router.get('/honk', function(req, res) {
    //honk();
});
router.get('/blink', function(req, res) {
    //blink();
});
try {
	var jsonString = fs.readFileSync("./config.json").toString();
	var config = JSON.parse(jsonString);
	var creds = { 
		email: config.username, 
		password: config.password 
	};
} catch (err) {
	console.warn("The file 'config.json' does not exist or contains invalid arguments! Exiting...");
	process.exit(1);
}

function pr( stuff ) {
	console.log(stuff);
}
function get_drive_state(data) {
	console.log(data);
	tesla.speed = data.speed;
	tesla.lat = data.latitude;
	tesla.long = data.longitude;
	tesla.state = data.shift_state;
}

function honk() {
	console.log("honked!!!");
	teslams.get_vid( { email: creds.email, password: creds.password }, function ( vid ) {
	if (vid == undefined) {
		console.log("Error: Undefined vehicle id");
	} else {
		teslams.honk( vid, pr ); 
	}
  }
)}
function blink() {
	console.log("blinked!!!");
	teslams.get_vid( { email: creds.email, password: creds.password }, function ( vid ) {
	if (vid == undefined) {
		console.log("Error: Undefined vehicle id");
	} else {
		teslams.flash( vid, pr ); 
	}
  }
)}

setInterval(function() {
  
	teslams.get_vid( { email: creds.email, password: creds.password }, function ( vid ) {
	if (vid == undefined) {
		console.log("Error: Undefined vehicle id");
	} else {
		//teslams.wake_up( vid, pr );
		//
		// get some info
		//
		//teslams.mobile_enabled( vid, pr );
		//teslams.get_charge_state( vid, pr );
		// teslams.get_climate_state( vid, pr );
		teslams.get_drive_state( vid, get_drive_state );
		//teslams.get_vehicle_state( vid, pr );
		//teslams.get_gui_settings( vid, pr );
		//
		// cute but annoying stuff while debugging
		//
		// teslams.flash( vid, pr ); 
		//teslams.honk( vid, pr ); 
		// teslams.open_charge_port( vid, pr ) 
		//
		// control some stuff
		//
		// teslams.door_lock( { id: vid, lock: "lock" }, pr );
		// teslams.sun_roof( { id: vid, roof: "close" }, pr );
		// teslams.auto_conditioning( { id: vid, climate: "off" }, pr ); 
		// teslams.charge_range( { id: vid, range: "standard" }, pr ); 
		// teslams.charge_state( { id: vid, charge: "on" }, pr ); 
		// teslams.set_temperature( { id: vid, dtemp: 20 }, pr ); 
	}
  }
)}, 10000);


//console.log ('calling teslams.vehicles()');
// teslams.vehicles( { email: creds.email, password: creds.password }, function ( vehicles ) {
//     console.log( 'got vehicles data');
//     if (typeof vehicles === "undefined") {
//         console.log("Error: Undefined vehicle");
//     } else if (vehicles.tokens === undefined) {
//         console.log("Error: Undefined token, car might be sleeping, call wakeup first using 'teslacmd -w'");
//     } else {
// 	console.log('Calling Streaming API using token from vehicles response, expect to wait up to 2 minutes for full response...');
// 	var params = { email: creds.email, password: vehicles.tokens[0], vehicle_id: vehicles.vehicle_id };
//         teslams.stream( params, function (error, response, body) { 
// 			console.log(body); 
// 		});
//     }
// });
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;