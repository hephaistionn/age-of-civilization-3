window.addEventListener('load', () => {

    const ee = require('./services/eventEmitter');
    const App = require('./services/App');
    const ScreenWorldmap = require('./Model/Screen/ScreenWorldmap');
    const ScreenCity = require('./Model/Screen/ScreenCity');
    const stateManager = require('./services/stateManager');
    const app = new App(ScreenWorldmap, ScreenCity);

    ee.on('closeScreen', id => {
        app.closeScreen(id);
    });

    ee.on('openScreen', (id, params) => {
        ee.emit('save', app);
        app.openScreen(id, params);
    });

    ee.on('exit', () => {
        ee.emit('save', app);
    });

    const currentCity = stateManager.getCurrentCity();
    const currentWorldmap = stateManager.getCurrentWorldmap();
    const currentScreen = stateManager.getCurrentScreen();

    if (currentScreen === 'ScreenCity' && currentCity) {
        app.openScreen('ScreenCity', currentCity);
    } else {
        app.openScreen('ScreenWorldmap', currentWorldmap);
    }

});