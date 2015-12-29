function getCoords(pcode) {
  var xhr = new XMLHttpRequest();

  var url = "https://nominatim.openstreetmap.org/search?format=json&postalcode=" + pcode;  // Prepare the URL for the request

  var resultsBox = document.getElementById("resultsBox");
  var name, lat, lon; // Variables for creating the different nodes per place

  function dataReady() {
    var r = JSON.parse(this.responseText);

    resultsBox.style.display = "block"; // Make the results box visible

    while(resultsBox.childElementCount > 2) { // Empty the results box, except for the title and the line break
      resultsBox.removeChild(resultsBox.lastChild);
    }

    for(var i = 0; i < r.length; i++) { // Display all places
      name = document.createElement("span");
      name.innerHTML = "<b>PLACE #" + i + ": " + r[i].display_name.toUpperCase() + "</b><br>";
      resultsBox.appendChild(name);
      lat = document.createElement("span");
      lat.innerHTML = "&nbsp;&nbsp;<b>Latitude: </b>" + r[i].lat + "<br>";
      resultsBox.appendChild(lat);
      lon = document.createElement("span");
      lon.innerHTML = "&nbsp;&nbsp;<b>Longitude: </b>" + r[i].lon + "<br><br>";
      resultsBox.appendChild(lon);
    }
  }

  xhr.addEventListener("load", dataReady)
  xhr.open("GET", url);
  xhr.send();
}

function updateResults() {
  getCoords(document.getElementById("postalCode").value);
}
