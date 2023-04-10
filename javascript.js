var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    accessToken: 'pk.eyJ1IjoidGJyYWRlIiwiYSI6ImNrd2I1cXludDQ5c3EycHBha2NoZ2N4cG8ifQ.ln6Vd8jgvY4IZ58Ppd0dAA',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    accessToken: 'pk.eyJ1IjoidGJyYWRlIiwiYSI6ImNrd2I1cXludDQ5c3EycHBha2NoZ2N4cG8ifQ.ln6Vd8jgvY4IZ58Ppd0dAA',
    tileSize: 512,
    zoomOffset: -1,
});

alert("This website will ask permission to use your location information if you click the location button under the zoom controls.  The website uses this information to identify your current location and to determine the basemap style based on your local sunset and sunrise times.  This information will not be stored or shared with anyone.")

var map = L.map('map', {layers:[light]}).fitWorld();

var baseMaps = {"Light Basemap": light, "Dark Basemap": dark};

var myControl = L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;

   L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup();

    if (radius <= 100) {
          L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
      }
      else {
          L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
      }
  var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
  var sunrise = times.sunrise.getHours();
  var sunset = times.sunset.getHours();

  var currentTime = new Date().getHours();
      if (sunrise < currentTime && currentTime < sunset){
        map.removeLayer(dark);
        map.addLayer(light);
      }
      else {
        map.removeLayer(light);
        map.addLayer(dark);
      }
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);

function locate(){map.locate({setView: true, maxZoom: 16})};

L.easyButton('<img src="location-point-svgrepo-com.svg"/>', locate
).addTo(map);
//image source URL: https://www.svgrepo.com/svg/59066/location-point
