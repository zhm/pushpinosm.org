window.onload = function() {
  var map = mapbox.map('map');
  map.addLayer(mapbox.layer().id('base.live-land-tr,base.live-landuse-tr,base.live-water,base.live-streets'));
  map.centerzoom({lat: 34, lon: 0}, 3);
  map.ui.zoomer.add();
  map.ui.zoombox.add();

  var query = "[out:json];(node[source='Pushpin for iOS'];);(node[source='Fulcrum OSM for iOS'];);out;";
  var url = "http://www.overpass-api.de/api/interpreter?data=" + window.encodeURIComponent(query);

  $.get(url, function(json) {
    if (json) {
      $('.page-title').html('Pushpin OSM - ' + json.elements.length + ' points');
      var features = [];
      _.each(json.elements, function(element) {
        features.push({
          geometry: { type: 'Point', coordinates: [ element.lon, element.lat ] },
          properties: { 'marker-color': '#c70000', element: element }
        });
      });
      var markerLayer = mapbox.markers.layer().features(features);
      var interaction = mapbox.markers.interaction(markerLayer);
      interaction.formatter(function(feature) {
        var html = '';
        for (prop in feature.properties.element.tags) {
          if (prop != 'source')
            html += prop + ': ' + feature.properties.element.tags[prop] + '<br />';
        }
        return html;
      });
      map.addLayer(markerLayer);
    }
  });
}
