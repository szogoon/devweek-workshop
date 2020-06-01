import apiKey from './config.js';

var SanFrancisco = 'San Francisco, California'

var categories = {
    Italian: '7315025',
    Thai: '7315048',
    French: '7315017'
}

var map = tt.map({
    key: apiKey,
    container: 'map',
    style: 'tomtom://vector/1/basic-main'
});

var markers = [];
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

map.on('load', function() {
    tt.services.fuzzySearch({
        key: apiKey,
        idxSet: "Geo",
        query: SanFrancisco
    })
    .go()
    .then(response => moveMapToFirstResult(response))
})

var buttons = document.querySelectorAll('.searchBtn')
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        markers.forEach((marker) => {
            marker.remove();
        })
        markers = [];
        tt.services.fuzzySearch({
            key: apiKey,
            center: map.getCenter(),
            query: 'restaurant',
            categorySet: categories[event.target.value]
        })
        .go()
        .then(response => createMarkersFromSearch(response)
        )
    })
})
function moveMapToFirstResult(response) {
    map.flyTo(
       {center: response.results[0].position,
       zoom: 12}
    )
}
function createMarkersFromSearch(response) {
    response.results.forEach(result => {
        var popup = new tt.Popup({offset: 30}).setHTML(createPopupContent(result));
        markers.push(new tt.Marker()
                .setLngLat(result.position)
                .setPopup(popup)
                .addTo(map));
    })
}
function createPopupContent(result) {
    return '<strong>' + result.poi.name + '</strong><br>' + 
        ifDefined(result.address.streetNumber) + ' ' + ifDefined(result.address.streetName) + ' ' + result.address.municipality + '<br>' +
        ((result.poi.phone != undefined) ? 'Phone:' + result.poi.phone + '<br>' : '') +
        ((result.poi.url != undefined) ? '<a href="http://' + result.poi.url + '" target="_blank">Website</a><br>': '');
}
function ifDefined(tmp) {
    return (tmp != undefined) ? tmp : '';
}