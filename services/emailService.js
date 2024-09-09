const nodemailer = require('nodemailer');

// Configuración del transporte SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  // Cambia esto por tu servidor SMTP
  port: 465,  // Para SSL usa el puerto 465
  secure: true,  // true para conexiones SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, 
  },
});


const enviarCorreoElectronico = (destinatario, asunto, contenido_html) => {
    try {
        // Configuración del correo
        let mailOptions = {
            from: `"FindUS APP" <${process.env.EMAIL_USER}>`,
            to: destinatario,  // Destinatario
            subject: asunto,
            html: contenido_html,  // Si deseas enviar HTML
        };
        
        // Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error != null) {
                console.log(error);
                return false;
            }
        });
        return true;
    } catch (error) {
        return false;
    }

}

module.exports = {  
    enviarCorreoElectronico,
};