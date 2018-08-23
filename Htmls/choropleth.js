
var MyMap = L.map("map").setView([37.8, -96], 3);

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }).addTo(MyMap);

L.geoJson(CombinedData).addTo(MyMap); //, {filter: variety} to filter the geoJson




// function style(feature) {
//     return {
//         fillColor: "blue", //getColor(varietyCount),
//         weight: 2,
//         opacity: 1,
//         color: 'blue',
//         dashArray: "3",
//         fillOpacity: 0.7
//     }
// }


// function highlightFeature(e) {
//     var layer = e.target;

//     layer.setStyle({
//         weight: 5,
//         color: "#666",
//         dashArray: '',
//         fillOpacity: 0.7
//     });

//     if (!L.Browser.ie && !L.Browser.opera && L.Browser.edge) {
//         layer.bringToFront();
//     }
// }

// function resetHighlight(e) {
//     geojson.resetStyle(e.target);
// }