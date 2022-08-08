mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
    map.addControl(new mapboxgl.NavigationControl())//add the control panel on top right(default position)
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>` )) // add popup
    .addTo(map);