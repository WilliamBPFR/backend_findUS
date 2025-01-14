const geolib = require('geolib');

const getLocationsWithinRadius = (latitude, longitude, latitude_bd, longitude_bd) => {
    const radiusInKm = 5;
    const resp = geolib.isPointWithinRadius(
        { latitude: latitude_bd, longitude: longitude_bd },
        { latitude: latitude, longitude: longitude },
        radiusInKm * 1000 // Convertir a metros
    )

    return resp;
};


module.exports = {
    getLocationsWithinRadius,
};