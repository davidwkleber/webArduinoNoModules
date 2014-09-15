//
// module for setting Pitch Angle of the wind turbine blades
//

var PAserialListener = require('../lib/serialListener');

PAserialListener('COM9');

var express = require('express');
var router = express.Router();


var lastPitchAngle = '0';

// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('pitchAngle Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('pitchAngle get');
 	res.redirect('/');
})

router.post('/', function(req, res, next){
console.log('pitchAngle post');
	var forwardOrBack = 'B';
	var diffAngle = 0;
	var pitchAngleValue = parseInt(req.param('pitchAngleValue', null));
	if ( pitchAngleValue < lastPitchAngle ) {
		diffAngle = lastPitchAngle - pitchAngleValue;
		forwardOrBack = 'F';
		console.log('F by '+diffAngle);
	} else {
		diffAngle = pitchAngleValue - lastPitchAngle;
		console.log('B by '+diffAngle);
	}
	console.log('lastPitchAngle in PA.js '+lastPitchAngle);
	console.log('pitchAngleValue in PA.js '+pitchAngleValue);
	console.log('diff angle: '+diffAngle);
	var serialValue = Math.floor(diffAngle * 13.3);
	console.log('Set the value to in PA.js '+serialValue);

	// var spinnerValue = req.body.pitchAngleSliderValue;
	// This is for the real wind tower
	var setPAValue = forwardOrBack+serialValue;
		

	// test the Pitch Control, 3 times.
// var setPAValue = 'T3';
	
	// this is for the test rig board, y for the yellow light.
	// PAserialListener.write('y', spinnerValue + serialListener.delimiter);
	
	PAserialListener.write('PA', setPAValue);
	lastPitchAngle = pitchAngleValue;
	// res.body.PAcurrentAngle = PAcurrentAngle;
	// res.render('index', {title: 'Wind Lab', PAcurrentAngle: lastPitchAngle });
})

router.put('/', function(req, res, next){
	var spinnerValue = req.body.value;
	res.seeValue = req.body.value;
	res.redirect('/');
})

router.get('/about', function(req, res){
	res.send('About page');
})

module.exports = router;

	