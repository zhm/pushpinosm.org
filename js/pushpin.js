window.onload = function() {
  var map = mapbox.map('map');
  map.addLayer(mapbox.layer().id('base.live-land-tr,base.live-landuse-tr,base.live-water,base.live-streets'));
  map.centerzoom({lat: 34, lon: 0}, 3);
  map.ui.zoomer.add();
  map.ui.zoombox.add();

  var query = "[out:json];(node[source~'Pushpin|Fulcrum'];);out meta;";
  var url = "http://www.overpass-api.de/api/interpreter?data=" + window.encodeURIComponent(query);

  console.log(url);

  $.get(url, function(json) {
    if (json) {
      $('.page-title').html('Pushpin OSM - ' + json.elements.length + ' points');
      var features = [];
      json.elements = _.last(json.elements, 300);

      _.each(json.elements, function(element) {
        element.tags['username'] = element.user;
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
            if (prop !== 'username')
              html += prop + ': ' + feature.properties.element.tags[prop] + '<br />';
            else
              html += 'User: <a href="http://www.openstreetmap.org/user/' + feature.properties.element.tags[prop] + '/edits" target="_blank">' + feature.properties.element.tags[prop] + '</a>';
        }
        return html;
      });
      map.addLayer(markerLayer);
    }
  });
}
