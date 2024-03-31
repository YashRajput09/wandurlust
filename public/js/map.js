mapboxgl.accessToken = mapAccessToken;
const map = new mapboxgl.Map({
    container: 'map',   //container ID
    style: 'mapbox://styles/mapbox/streets-v9', //mapbox style
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    center: [75.8577, 22.7196], //satrting position [lng, lat]
    zoom: 9,  //starting zoom
});