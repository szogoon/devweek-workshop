import apiKey from './config.js';

var SanFrancisco = 'Łódź, Polska'

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
    .then((response) => {
        map.flyTo(
            {center: response.results[0].position,
            zoom: 18}
        )
    })
})