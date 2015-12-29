// script.js - by Yago González, for the Open Source community
//  Google Code-in 2015

/*  calculateDistance
 *    Returns the distance between two points on Earth (considering it as an
 *    uniform, perfect sphere with 6,371km of radius), in kilometers.
 *      @param latA {Float} Latitude of the point A in degrees
 *      @param lonA {Float} Longitude of the point A in degrees
 *      @param latB {Float} Latitude of the point B in degrees
 *      @param lonB {Float} Longitude of the point B in degrees
 */
function calculateDistance(latA, lonA, latB, lonB) {
  var earthRadius = 6371; // In kilometers

  // Conversion to radians of all the input parameters
  latA = (latA * Math.PI / 180) || 0;
  lonA = (lonA * Math.PI / 180) || 0;
  latB = (latB * Math.PI / 180) || 0;
  lonB = (lonB * Math.PI / 180) || 0;

  // Apply Haversine formula, and return the result (which is in km)
  return 2 * earthRadius * Math.asin(Math.sqrt(Math.pow(Math.sin((latB - latA) / 2), 2) + Math.cos(latA) * Math.cos(latB) * Math.pow(Math.sin((lonB - lonA) / 2), 2)));
}
/*  getTimeDifference
 *    Returns the sun time difference (not the time zone one) between two
 *    meridians as a string with format "Hh, Mmin, Ss".
 *      @param lonA {Float} Longitude of the point A in degrees
 *      @param lonB {Float} Longitude of the point B in degrees
 */
function getTimeDifference(lonA, lonB) {
  var lonDiff = lonA - lonB;  // Difference between both longitudes
  var totalS = Math.abs(lonDiff * 240);  // Calculate the time sun takes to get from A to B, in seconds
  var ba = (lonDiff < 0) ? "before" : "after";  // Deduce if the Sun passes over A or over B first, depending on the difference's symbol

  // Conversion to hours, minutes and seconds
  var dH = Math.floor(totalS / 3600);
  var dM = Math.floor((totalS % 3600) / 60);
  var dS = Math.floor((totalS % 3600) % 60);

  return dH + "h, " + dM + "min, " + dS + "s " + ba; // Return the time difference in a string
}
/*  updateResult
 *    Function called every time an input changes. It updates the final result
 *    with the new values.
 */
function updateResult() {
  var coordinates = [/* Google Codeplex */ [37.422213, -122.084058],
                     /* FOSSASIA '14, Phnom Penh */ [11.55, 104.914447],
                     /* FOSSASIA '15, Singapore */ [1.283333, 103.833333]]

  var Aexamples = document.getElementsByName("exampleA");
  for(var i = 0; i < Aexamples.length - 1; i++) {
    if(Aexamples[i].checked) {
      document.getElementById("latitudeA").value = coordinates[i][0];
      document.getElementById("longitudeA").value = coordinates[i][1];
    }
  }
  var Bexamples = document.getElementsByName("exampleB");
  for(i = 0; i < Bexamples.length - 1; i++) {
    if(Bexamples[i].checked) {
      document.getElementById("latitudeB").value = coordinates[i][0];
      document.getElementById("longitudeB").value = coordinates[i][1];
    }
  }
  // Read all inputs' values
  latA = document.getElementById("latitudeA").value;
  lonA = document.getElementById("longitudeA").value;
  latB = document.getElementById("latitudeB").value;
  lonB = document.getElementById("longitudeB").value;

  var distanceKM = calculateDistance(latA, lonA, latB, lonB); // Calculate the distance with the data on the inputs
  document.getElementById("distanceKM").innerHTML = distanceKM; // Display the distance in km
  document.getElementById("distanceMI").innerHTML = distanceKM * 0.621371192; // Display the distance in mi, with the conversion factor
  var timeDifference = getTimeDifference(lonA, lonB); // Calculate the sun time difference
  document.getElementById("timeDifference").innerHTML = timeDifference; // Display the difference with the already set format
}
