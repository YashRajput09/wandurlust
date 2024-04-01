mapboxgl.accessToken = mapAccessToken;
const map = new mapboxgl.Map({
    container: 'map',   //container ID
    style: 'mapbox://styles/mapbox/streets-v12', //mapbox style
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    center: listing.geometry.coordinates, //satrting position [lng, lat]
    zoom: 10,  //starting zoom
});

const marker = new mapboxgl.Marker({color: 'darkred'})
.setLngLat(listing.geometry.coordinates)  //listing.location.coordinates (lat, lng)
.setPopup(
    new mapboxgl.Popup({   offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`
    ) // add popups
)
.addTo(map);
