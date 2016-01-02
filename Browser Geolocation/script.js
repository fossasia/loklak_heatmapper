var 	errorAlert 	= document.getElementById('errorAlert'),
	resultBox	= document.getElementById('resultBox');

function geolocSuccess(position) {
	errorAlert.style.display = 'none';	// Hide the error box

	resultBox.style.display = 'block';	// Display the result box

	var latDeg = ((position.coords.latitude > 0) ? Math.floor(position.coords.latitude) : Math.ceil(position.coords.latitude));
	var latMin = Math.floor(Math.abs(position.coords.latitude) % 1 * 60);
	var latSec = Math.abs(position.coords.latitude) % 1 * 60 % 1 * 60;

	var lonDeg = ((position.coords.longitude > 0) ? Math.floor(position.coords.longitude) : Math.ceil(position.coords.longitude));
	var lonMin = Math.floor(Math.abs(position.coords.longitude) % 1 * 60);
	var lonSec = Math.abs(position.coords.longitude) % 1 * 60 % 1 * 60;

	document.getElementById('latitude').innerHTML = position.coords.latitude + '°N (' + latDeg + '° ' + latMin + '\' ' + latSec + '")';
	document.getElementById('longitude').innerHTML = position.coords.longitude + '°E (' + lonDeg + '° ' + lonMin + '\' ' + lonSec + '")';
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
