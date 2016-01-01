var 	errorAlert 	= document.getElementById('errorAlert'),
	resultBox	= document.getElementById('resultBox');

function geolocSuccess(position) {
	errorAlert.style.display = 'none';	// Hide the error box	

	resultBox.style.display = 'block';	// Display the result box
	
	var latDeg = Math.floor(position.coords.latitude);
	var latMin = Math.floor(position.coords.latitude % 1 * 60);
	var latSec = position.coords.latitude % 1 * 60 % 1;

	var lonDeg = Math.floor(position.coords.longitude);
	var lonMin = Math.floor(position.coords.longitude % 1 * 60);
	var lonSec = position.coords.longitude % 1 * 60 % 1;

	document.getElementById('latitude').innerHTML = position.coords.latitude + ' (' + latDeg + 'º ' + latMin + '\' ' + latSec + '")';
	document.getElementById('longitude').innerHTML = position.coords.longitude + ' (' + lonDeg + 'º ' + lonMin + '\' ' + lonSec + '")';
}

function geolocError(err) {	// Something went wrong when asking for the position
	resultBox.style.display = 'none';	// Hide the result box

	errorAlert.innerHTML = 'Unable to retrieve your position (' + err.message + ')';	// Set error message
	errorAlert.style.display = 'block';	// Display the error box
}

if(!navigator.geolocation) {	// Browser doesn't support geolocation
	errorAlert.innerHTML = 'Your browser doesn\'t support geolocation. Please, consider installing a <a href="https://whatbrowser.org/">more modern one</a>.';	// Set error message
	errorAlert.style.display = 'block';	// Display the error box
} else {	// Browser supports geolocation
	navigator.geolocation.watchPosition(geolocSuccess, geolocError, { enableHighAccuracy: true, timeout: 10000 });
}
