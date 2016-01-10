var	errorAlert 	= document.getElementById('errorAlert'),
		resultBox		= document.getElementById('resultBox');

var map, marker, lastCoords;

function initializeMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 18
	});
}

function updateMap(coords) {
	var mapBox = document.getElementById('map');
	if(mapBox.style.display == 'none') {	// The map box hasn't been shown before
		mapBox.style.display = 'block';	// Display the map
		google.maps.event.trigger(map, 'resize');	// Make the map print itself again (to avoid grey box)
		document.getElementById('loading').style.display = 'none';	// Hide 'loading' progress bar
	}

	var pos = new google.maps.LatLng(coords.latitude, coords.longitude);	// Save coords as a LatLng object

	if(!lastCoords || (coords.latitude !== lastCoords.latitude) && (coords.longitude !== lastCoords.longitude)) {	// Set new map's center just if the coordinates have changed or if it's the first time loading it (lastCoords don't exist)
			map.setCenter(pos);

			if(!marker) {	// The marker doesn't exist
				marker = new google.maps.Marker({
					map: map,
					animation: google.maps.Animation.DROP,
					position: pos,
					title: 'Your position'
				});
			} else {	// The marker exists
				marker.setPosition(pos);	// Update the marker's position
			}
	}

	lastCoords = coords;	// Store these coordinates as the last ones
}

function geolocSuccess(position) {
	errorAlert.style.display = 'none';	// Hide the error box

	resultBox.style.display = 'block';	// Display the result box

	// Calculate degrees, minutes and seconds equivalent for the latitude and the longitude
	var latDeg = ((position.coords.latitude > 0) ? Math.floor(position.coords.latitude) : Math.ceil(position.coords.latitude));
	var latMin = Math.floor(Math.abs(position.coords.latitude) % 1 * 60);
	var latSec = Math.abs(position.coords.latitude) % 1 * 60 % 1 * 60;

	var lonDeg = ((position.coords.longitude > 0) ? Math.floor(position.coords.longitude) : Math.ceil(position.coords.longitude));
	var lonMin = Math.floor(Math.abs(position.coords.longitude) % 1 * 60);
	var lonSec = Math.abs(position.coords.longitude) % 1 * 60 % 1 * 60;

	document.getElementById('latitude').innerHTML = position.coords.latitude + '°N (' + latDeg + '° ' + latMin + '\' ' + latSec + '")';
	document.getElementById('longitude').innerHTML = position.coords.longitude + '°E (' + lonDeg + '° ' + lonMin + '\' ' + lonSec + '")';

	updateMap(position.coords);	// Update the map marker
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
