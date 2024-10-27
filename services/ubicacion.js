const axios = require('axios');

const getLocalidadUbicacion = async (latitud, longitud) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`,
            {
                headers: {
                    'User-Agent': 'findus/1.0 (proyecto educativo) (findusappnr@gmail.com)',
                    'Accept-Language': 'es'  // Opcional: Para respuestas en español
                }
            }
        );        
        let localidad = 'Localidad no encontrada';
        if(response.data.address){
            console.log("ENTREEEEEE A LA FUNCION DE LOCALIDAD")
            // console.log(response.data.address);
            const calle = (response.data.address?.road != undefined && response.data.address?.road != null && response.data.address?.road != "") ? `${response.data.address?.road + ", "}` : ""
            const barrio = (response.data.address?.neighbourhood != undefined && response.data.address?.neighbourhood != null && response.data.address?.neighbourhood != "") ? `${response.data.address?.neighbourhood + " - "}` : ""
            const ciudad = (response.data.address?.city != undefined && response.data.address?.city != null && response.data.address?.city != "") ? `${response.data.address?.city + ", "}` : ""
            const provincia = (response.data.address?.state != undefined && response.data.address?.state != null && response.data.address?.state != "") ? response.data.address?.state : ""
            localidad = calle + barrio + ciudad + provincia;
        }
        return localidad;
    } catch (error) {
        console.error('Error al obtener la localidad de la ubicación:', error.message);
        return "Localidad no encontrada";
    }
}

module.exports = {
    getLocalidadUbicacion
}