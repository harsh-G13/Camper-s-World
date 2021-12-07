// const campground = require("../models/campground");

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'showpage-map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${campground.title}</h4><h6>${campground.location}</h6>`
            )
    )
    .addTo(map)
    // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());