mapboxgl.accessToken = mapAccessToken;
const map = new mapboxgl.Map({
    container: 'map',   //container ID
    style: 'mapbox://styles/mapbox/streets-v12', //mapbox style
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    center: [75.8577, 22.7196], //satrting position [lng, lat]
    zoom: 10,  //starting zoom
});

console.log(coordinates);
const marker = new mapboxgl.Marker({color: 'darkred'})
.setLngLat(coordinates)  //listing.location.coordinates (lat, lng)
.addTo(map);
