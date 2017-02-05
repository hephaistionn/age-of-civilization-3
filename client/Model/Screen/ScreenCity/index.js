const isMobile = require('../../../services/mobileDetection')();

const ScreenCityMobile = require('./ScreenCityMobile');
const ScreenCityPC = require('./ScreenCityPC');

if(isMobile) {
    module.exports = ScreenCityMobile;
} else {
    module.exports = ScreenCityPC;
}