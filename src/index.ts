import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// Función para enviar correo
export const correoContacto = functions.https.onRequest((req, res) => {
  // Instancia usuario y contraseña de correo desde configuración de firebase
  const remitenteCorreo = functions.config().remitente.correo;
  const remitenteContrasena = functions.config().remitente.contrasena;
  const destinatarioCorreo = functions.config().destinatario.correo;
  const sitioWeb = functions.config().web.url;

  // Control de CORS
  // Considerar que CORS consiste en dos solicitudes
  // - Una solicitud de comprobación previa de OPTIONS
  // - Una solicitud principal que sigue a la solicitud de OPTIONS
  // Documentación: https://cloud.google.com/functions/docs/writing/http#handling_cors_requests

  // Configura CORS Base
  res.set('Access-Control-Allow-Origin', sitioWeb);
  res.set('Access-Control-Allow-Credentials', 'true');

  // CORS de OPTION (Primera solicitud)
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }

  // Ejecución normal (Segunda solicitud) - Valida que sea un JSON Body y una petición POST
  else if (req.get('content-type') === 'application/json' && req.method === 'POST') {
    // Valida parámetros
    if (req.body.nombre && req.body.correo && req.body.asunto && req.body.mensaje) {
      // Obtiene información desde formulario
      const contactoNombre = req.body.nombre;
      const contactoCorreo = req.body.correo;
      const contactoAsunto = req.body.asunto;
      const contactoMensaje = req.body.mensaje;

      // Configura credenciales de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: remitenteCorreo,
          pass: remitenteContrasena,
        },
      });

      // Configura opciones de correo
      const mailOptions = {
        from: remitenteCorreo, // Quien envía el correo
        to: destinatarioCorreo, // Destinatario, sería la cuenta
        subject: contactoAsunto, // Asunto del correo
        html: `<p>Nombre de contacto: ${contactoNombre}</p>
             <br />
             <p>Correo de contacto: ${contactoCorreo}</p>
             <br />
             <p>Mensaje: ${contactoMensaje}</p>`, // Contenido del mensaje
      };

      // Intenta envío de correo
      return transporter.sendMail(mailOptions, (error, info) => {
        // Verifica si existe un error
        if (error) {
          res.status(200).send({ codigo: 1, mensaje: 'Ha ocurrido un error al envíar el correo de contacto.' });
        } else {
          res.status(200).send({ codigo: 0, mensaje: 'El correo se ha enviado correctamente.' });
        }
      });
    }
    // No se enviaron todos los parámetros
    else {
      res.status(200).send({ codigo: 1, mensaje: 'Falta uno o más parámetros.' });
    }
  }
  // Petición erronea
  else {
    res.status(403).send({ codigo: 1, mensaje: 'Acceso denegado.' });
  }
});
