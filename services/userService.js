const fs = require('fs');
const path = require('path');

const plantillaCorreoCodigRegistro = (nombreUsuario,codigoVerificacion) => { 
    const ruta_plantilla = path.join(__dirname,  '..', 'assets', 'emails_templates','plantilla_correo_registro.html');
    
    let htmlTemplate = fs.readFileSync(ruta_plantilla, 'utf8');

    htmlTemplate = htmlTemplate.replace('{{nombreUsuario}}', nombreUsuario);
    htmlTemplate = htmlTemplate.replace('{{codigoVerificacion}}', codigoVerificacion);
    return htmlTemplate;
    console.log(htmlTemplate);
}

module.exports = {
    plantillaCorreoCodigRegistro,
}