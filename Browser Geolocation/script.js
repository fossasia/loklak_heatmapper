var 	errorAlert 	= document.getElementById('errorAlert'),
	resultBox	= document.getElementById('resultBox');

function geolocSuccess(position) {
	errorAlert.style.display = 'none';	// Hide the error box	

	resultBox.style.display = 'block';	// Display the result box

	document.getElementById('latitude').innerHTML = position.coords.latitude;
	document.getElementById('longitude').innerHTML = position.coords.longitude;
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
