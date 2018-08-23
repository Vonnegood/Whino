
var MyMap = L.map("map").setView([37.8, -96], 3);

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }).addTo(MyMap);


// filtering the csv by varietal chosen
var chosenVariety = document.getElementById["variety"]

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

console.log(CombinedData.features);

d3.csv("../Resources/wine_reviews_kaggle.csv").then(function(reviewData) {
  const counts = reviewData.reduce((acc, {
      country,
      province
  }) => {
      if (country === 'US') {
          acc[province] = acc[province] ? acc[province] + 1 : 1
          return acc
      } else {
          acc[country] = acc[country] ? acc[country] + 1 : 1
          return acc
      }

  }, {})

  CombinedData.features = CombinedData.features.map(datum => {
      if (!datum.properties)
          return datum
      datum.properties.counts = counts[datum.properties.name]
      return datum
  })

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.counts),
        weight: 2,
        opacity: 1,
        color: 'blue',
        dashArray: "3",
        fillOpacity: 0.7
    }
  }
  L.geoJson(CombinedData, {style: style}).addTo(MyMap); //, {filter: chosenVariety} to filter the geoJson
  
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && L.Browser.edge) {
        layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);
});