import apiKey from './config.js';

var SanFrancisco = 'San Francisco, California'

var map = tt.map({
    key: apiKey,
    container: 'map',
    style: 'tomtom://vector/1/basic-main'
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

map.on('load', function() {
    tt.services.fuzzySearch({
        key: apiKey,
        query: SanFrancisco
    })
    .go()
    .then(response => moveMapToFirstResult(response))
})

document.querySelector('#searchButton').addEventListener('click', function() {
    tt.services.poiSearch({
        key: apiKey,
        center: map.getCenter(),
        query: document.querySelector('#searchFieldText').value
    })
    .go()
    .then(response => createMarkersFromSearch(response)
    )
})
function moveMapToFirstResult(response) {
    map.flyTo(
        {center: response.results[0].position,
        zoom: 13}
    )
}
function createMarkersFromSearch(response) {
    response.results.forEach(result => {
        var popup = new tt.Popup({offset: 30}).setHTML(createPopupContent(result));
        new tt.Marker()
                .setLngLat(result.position)
                .setPopup(popup)
                .addTo(map);
    })
}
function createPopupContent(result) {
    return result.poi.name + '<br>' + ifDefined(result.address.streetNumber) + ' ' + 
        ifDefined(result.address.streetName) + ' ' + result.address.municipality;
}
function ifDefined(tmp) {
    return (tmp != undefined) ? tmp : '';
}