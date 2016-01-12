var vector = new ol.source.Vector();

var heatMap = new ol.layer.Heatmap({
  source: vector,
  blur: 9,
  radius: 3
});

var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var map = new ol.Map({
  target: 'map',
  layers: [ raster, heatMap ],
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

function emptyVector() {
  var features = vector.getFeatures();

  for(var i = 0; i < features.length; i++) {
    vector.removeFeature(features[i]);
  }
}

function updateMap() {
  if(vector.getFeatures().length > 0) { // Empty the vector, if full
    emptyVector();
  }

  var query = document.getElementById('searchField').value;
  var count = document.getElementById('countField').value;

  // Fetch loklak API data, and fill the vector
  loklakFetcher.getTweets(query, { count: count }, function(tweets) {
    for(var i = 0; i < tweets.statuses.length; i++) {
      if(tweets.statuses[i].location_point !== undefined){
        // Creation of the point with the tweet's coordinates
        //  Coords system swap is required: OpenLayers uses by default
        //  EPSG:3857, while loklak's output is EPSG:4326
        var point = new ol.geom.Point(ol.proj.transform(tweets.statuses[i].location_point, 'EPSG:4326', 'EPSG:3857'));
        vector.addFeature(new ol.Feature({  // Add the point to the data vector
          geometry: point
        }));
      }
    }
  });
}

// Event listeners for updating the map
document.getElementById('searchButton').addEventListener('click', updateMap);
document.getElementById('countField').addEventListener('keyup', function(e) {
  if(e.keyCode === 13) {
    updateMap();
  }
});
document.getElementById('searchField').addEventListener('keyup', function(e) {
  if(e.keyCode === 13) {
    updateMap();
  }
});
