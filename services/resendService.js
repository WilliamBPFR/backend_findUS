const {Resend} = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, message) => {
  const {data, error} = await resend.emails.send({
    from: "FindUSApp Information <findusinformatio@findus-online.com>",
    to: [email],
    subject: subject,
    html: message
    
  })
    if (error) {
        console.log(error);
        return false;
    }
    console.log(data);
    return true;
}


const correo_desactivar_publicación = async (email, nombre_usuario, nombre_persona_desaparecida) => {
    const subject = "Desactivación de publicación";
    // Abrir archivo assets/correo_desactivar_publicación.html y sustituir los valores de las variables
    const message = `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificación de Correo - FindUS</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                background-color: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                /* max-width: 60vw; */
                                text-align: center;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1DE9B6;
                            }
                            h2 {
                                font-size: 18px;
                                color: #555;
                            }
                            p {
                                font-size: 16px;
                                color: #555;
                            }
                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                margin: 20px 0;
                                color: #045050;
                            }
                            .button {
                                background-color: #3270a3;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            .deactivate {
                                background-color: #914850;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .deactivate:hover {
                                background-color: #c82333;
                            }
                            footer {
                                font-size: 12px;
                                color: #777;
                                margin-top: 20px;
                            }
                            img {
                                max-width: 80px;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                            <h1>Hola de nuevo, <strong>${nombre_usuario}</strong></h1>
                            <p>Le contactamos para informarle que su publicación sobre la desaparición de: <strong>${nombre_persona_desaparecida}</strong> ha sido desactivada, luego de haber sido revisada minuciosamente por nuestros moderadores.</p>
                            <p>Si cree que se ha cometido un error, le sugerimos contactar nuestro correo de servicio para solucionar su caso: <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a></p>
                            <footer>
                                Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                            </footer>
                        </div>
                    </body>
                    </html>
                    `;
    return await sendEmail(email, subject, message);
}

const correo_activar_publicación = async (email, nombre_usuario, nombre_persona_desaparecida) => {
  const subject = "Activación de publicación";
  const message = `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificación de Correo - FindUS</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                background-color: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                /* max-width: 60vw; */
                                text-align: center;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1DE9B6;
                            }
                            h2 {
                                font-size: 18px;
                                color: #555;
                            }
                            p {
                                font-size: 16px;
                                color: #555;
                            }
                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                margin: 20px 0;
                                color: #045050;
                            }
                            .button {
                                background-color: #3270a3;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            .deactivate {
                                background-color: #914850;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .deactivate:hover {
                                background-color: #c82333;
                            }
                            footer {
                                font-size: 12px;
                                color: #777;
                                margin-top: 20px;
                            }
                            img {
                                max-width: 80px;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                            <h1>Hola de nuevo, <strong>${nombre_usuario}</strong></h1>
                            <p>Le contactamos para informarle que su publicación sobre la desaparición de: <strong>${nombre_persona_desaparecida}</strong> ha sido activada, luego de haber sido revisada minuciosamente por nuestros moderadores.</p>
                            <p>Esta volverá a estar disponible y visible en la aplicación, para que toda nuestra comunidad pueda ayudar a encontrar su ser querido.</p>
                            <footer>
                                Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                            </footer>
                        </div>
                    </body>
                    </html>
                    `;
  return await sendEmail(email, subject, message);
}

const correo_activación_usuario = async (email, nombre_usuario) => {
  const subject = "Activación de cuenta";
  const message = `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificación de Correo - FindUS</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                background-color: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                /* max-width: 60vw; */
                                text-align: center;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1DE9B6;
                            }
                            h2 {
                                font-size: 18px;
                                color: #555;
                            }
                            p {
                                font-size: 16px;
                                color: #555;
                            }
                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                margin: 20px 0;
                                color: #045050;
                            }
                            .button {
                                background-color: #3270a3;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            .deactivate {
                                background-color: #914850;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .deactivate:hover {
                                background-color: #c82333;
                            }
                            footer {
                                font-size: 12px;
                                color: #777;
                                margin-top: 20px;
                            }
                            img {
                                max-width: 80px;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                            <h1>Hola de nuevo, <strong>${nombre_usuario}</strong></h1>
                            <p>Le contactamos para informarle que su cuenta ha sido activada correctamente. Ya puede acceder correctamente a nuestra aplicación.</p>
                            <footer>
                                Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                            </footer>
                        </div>
                    </body>
                    </html>
                    `;
  return await sendEmail(email, subject, message);
}

const correo_desactivación_usuario = async (email, nombre_usuario) => {
  const subject = "Desactivación de cuenta";
  const message = `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificación de Correo - FindUS</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                background-color: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                /* max-width: 60vw; */
                                text-align: center;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1DE9B6;
                            }
                            h2 {
                                font-size: 18px;
                                color: #555;
                            }
                            p {
                                font-size: 16px;
                                color: #555;
                            }
                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                margin: 20px 0;
                                color: #045050;
                            }
                            .button {
                                background-color: #3270a3;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            .deactivate {
                                background-color: #914850;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .deactivate:hover {
                                background-color: #c82333;
                            }
                            footer {
                                font-size: 12px;
                                color: #777;
                                margin-top: 20px;
                            }
                            img {
                                max-width: 80px;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                            <h1>Hola de nuevo, <strong>${nombre_usuario}</strong></h1>
                            <p>Le contactamos para informarle que su cuenta ha sido desactivada de nuestra aplicación. A partir de ahora, no podrá ingresas a ninguna de nuestras aplicaciones.</p>
                            <p>Si cree que se ha cometido un error, le sugerimos contactar nuestro correo de servicio para solucionar su caso: <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a></p>
                            <footer>
                                Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                            </footer>
                        </div>
                    </body>
                    </html>
                    `;
  return await sendEmail(email, subject, message);
}

const correo_cambio_roles = async (email, nombre_usuario, nuevo_rol) => {
  const subject = "Su Rol en la Aplicación FindUS ha sido Modificado";
  const message = `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificación de Correo - FindUS</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                background-color: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                /* max-width: 60vw; */
                                text-align: center;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1DE9B6;
                            }
                            h2 {
                                font-size: 18px;
                                color: #555;
                            }
                            p {
                                font-size: 16px;
                                color: #555;
                            }
                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                margin: 20px 0;
                                color: #045050;
                            }
                            .button {
                                background-color: #3270a3;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            .deactivate {
                                background-color: #914850;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .deactivate:hover {
                                background-color: #c82333;
                            }
                            footer {
                                font-size: 12px;
                                color: #777;
                                margin-top: 20px;
                            }
                            img {
                                max-width: 80px;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                            <h1>Hola de nuevo, <strong>${nombre_usuario}</strong></h1>
                            <p>Le contactamos para informarle que su rol en nuestra aplicación ha sido modificado. A partir de ahora, su nuevo rol es de: <strong>${nuevo_rol}</strong></p>
                            <p>Si cree que se ha cometido un error, le sugerimos contactar nuestro correo de servicio para solucionar su caso: <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a></p>
                            <footer>
                                Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                            </footer>
                        </div>
                    </body>
                    </html>
                    `;
  return await sendEmail(email, subject, message);
}

const correo_cerrar_publicacion = async (email, nombre_usuario, nombre_persona_desaparecida) => {
    const subject = "Cierre de publicación";
    const message = `<!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Verificación de Correo - FindUS</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    margin: 0;
                                    padding: 0;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                }
                                .container {
                                    background-color: white;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                    /* max-width: 60vw; */
                                    text-align: center;
                                }
                                h1 {
                                    font-size: 24px;
                                    color: #1DE9B6;
                                }
                                h2 {
                                    font-size: 18px;
                                    color: #555;
                                }
                                p {
                                    font-size: 16px;
                                    color: #555;
                                }
                                .code {
                                    font-size: 36px;
                                    font-weight: bold;
                                    margin: 20px 0;
                                    color: #045050;
                                }
                                .button {
                                    background-color: #3270a3;
                                    color: white;
                                    padding: 10px 20px;
                                    text-decoration: none;
                                    border-radius: 5px;
                                    display: inline-block;
                                    margin: 20px 0;
                                }
                                .button:hover {
                                    background-color: #0056b3;
                                }
                                .deactivate {
                                    background-color: #914850;
                                    color: white;
                                    padding: 10px 20px;
                                    text-decoration: none;
                                    border-radius: 5px;
                                    display: inline-block;
                                    margin: 20px 0;
                                }
                                .deactivate:hover {
                                    background-color: #c82333;
                                }
                                footer {
                                    font-size: 12px;
                                    color: #777;
                                    margin-top: 20px;
                                }
                                img {
                                    max-width: 80px;
                                    margin-bottom: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                                <h1>Hola de nuevo, <strong>${nombre_usuario}</strong></h1>
                                <p>Le contactamos para informarle que la siguiente publicación ha sido cerrada: <strong>${nombre_persona_desaparecida}</strong>. A partir de ahora, su publicación no será visible para nadie, si podrá ser modificada.</p>
                                <p>Si cree que se ha cometido un error, le sugerimos contactar nuestro correo de servicio para solucionar su caso: <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a></p>
                                <footer>
                                    Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                                </footer>
                            </div>
                        </body>
                        </html>
                `;
    return await sendEmail(email, subject, message);
}

const correo_crear_publicacion = async (email, nombre_usuario, nombre_persona_desaparecida) => {
    const subject = "Creación de publicación";
    const message = `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificación de Correo - FindUS</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                background-color: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                /* max-width: 60vw; */
                                text-align: center;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1DE9B6;
                            }
                            h2 {
                                font-size: 18px;
                                color: #555;
                            }
                            p {
                                font-size: 16px;
                                color: #555;
                            }
                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                margin: 20px 0;
                                color: #045050;
                            }
                            .button {
                                background-color: #3270a3;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            .deactivate {
                                background-color: #914850;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 20px 0;
                            }
                            .deactivate:hover {
                                background-color: #c82333;
                            }
                            footer {
                                font-size: 12px;
                                color: #777;
                                margin-top: 20px;
                            }
                            img {
                                max-width: 80px;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="https://rmmjqtigwdgygmsibvuh.supabase.co/storage/v1/object/sign/assets/logo_findus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9nb19maW5kdXMucG5nIiwiaWF0IjoxNzI1MTE4MDg1LCJleHAiOjQ4Nzg3MTgwODV9.vVCQU7Xajg7WcVYrGTzsVqNWEENDJlevkimRI1Fcv5k&t=2024-08-31T15%3A28%3A03.719Z" alt="Logo FindUS"/>
                            <h1>Hola <strong>${nombre_usuario}</strong></h1>
                            <p>Le contactamos para informarle que se ha creado una publicación bajo us usuario. La publicación es sobre la siguiente persona: <strong>${nombre_persona_desaparecida}</strong>.</p>
                            <p>Si cree que se ha cometido un error, puede cerrar la publicación desde su perfil o contactar nuestro correo de servicio para solucionar su caso: <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a></p>
                            <footer>
                                Este correo fue generado automáticamente, por favor no responda. Si necesita asistencia, visite nuestro sitio web o escribanos un correo a <a href="mailto:findusappservice@gmail.com">findusappservice@gmail.com</a>
                            </footer>
                        </div>
                    </body>
                    </html>
                    `;
    return await sendEmail(email, subject, message);
}        
module.exports = {
    correo_desactivar_publicación,
    correo_activar_publicación,
    correo_activación_usuario,
    correo_desactivación_usuario,
    correo_cambio_roles,
    correo_cerrar_publicacion,
    correo_crear_publicacion
}