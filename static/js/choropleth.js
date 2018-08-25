
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
  return d > 10000 ? '#800000' :
         d > 1000  ? '#BD0026' :
         d > 500  ? '#E31A1C' :
         d > 200  ? '#FC4E2A' :
         d > 100   ? '#FD8D3C' :
         d > 50   ? '#FEB24C' :
         d > 10   ? '#fad6a5' :
                    '#FFEDA0';
}

console.log(CombinedData.features);

d3.csv("../static/Resources/wine_reviews_kaggle.csv").then(function(reviewData) {
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

//   console.log(counts)

  CombinedData.features = CombinedData.features.map(datum => {
      if (!datum.properties) {
          datum.properties = {counts: "0"}
          return datum
      }
      datum.properties.counts = counts[datum.properties.name]
      if(counts[datum.properties.name])
        delete counts[datum.properties.name]
      return datum
  })

  console.log(counts)



  function style(feature) {
    return {
        fillColor: getColor(feature.properties.counts),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: "3",
        fillOpacity: 0.7
    }
  }
  var geojson;

  geojson = L.geoJson(CombinedData, {style: style, onEachFeature: onEachFeature}).addTo(MyMap); //, {filter: chosenVariety} to filter the geoJson
  
  function highlightFeature(e) {
    var layer = e.target;
    info.update(layer.feature.properties);

    layer.setStyle({
        weight: 5,
        color: "#722f37",
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && L.Browser.edge) {
        layer.bringToFront();
    }
}

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    MyMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

var info = L.control();

info.onAdd = function (MyMap) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Amount of Wine Reviews</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.counts + ' Wines Reviewed'
        : 'Hover over a state');
};

info.addTo(MyMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (MyMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 50, 100, 200, 500, 1000, 10000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(MyMap);

});