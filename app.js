import apiKey from './config.js';

var map = tt.map({
    key: apiKey,
    container: 'map',
    style: 'tomtom://vector/1/basic-main'
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());