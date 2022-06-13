import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
require('firebase-functions/lib/logger/compat');

// Función para enviar correo
export const correoContacto = functions.https.onRequest((req, res) => {
  // Obtiene informacion de envio
  const apiKey = functions.config().mail.apikey;
  const sender = functions.config().mail.sender;
  const recipient = functions.config().mail.recipient;
  const cors = functions.config().web.url;

  // Asigna la ApiKey a la libreria
  sgMail.setApiKey(apiKey);

  // Control de CORS
  // Considerar que CORS consiste en dos solicitudes
  // - Una solicitud de comprobación previa de OPTIONS
  // - Una solicitud principal que sigue a la solicitud de OPTIONS
  // Documentación: https://cloud.google.com/functions/docs/writing/http#handling_cors_requests

  // Configura CORS Base
  res.set('Access-Control-Allow-Origin', [cors]);
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
      const contactName = req.body.nombre;
      const contactMail = req.body.correo;
      const contactSubject = req.body.asunto;
      const contactMessage = req.body.mensaje;

      // Crea correo de mensaje
      const mail = {
        to: recipient,
        from: sender,
        subject: `Correo Contacto ${cors}`,
        html: `<table>
                <tr><td>Nombre</td><td>${contactMail}</td></tr>
                <tr><td>Correo</td><td>${contactSubject}</td></tr>
                <tr><td>Asunto</td><td>${contactName}</td></tr>
                <tr><td>Mensaje</td><td>${contactMessage}</td></tr>
              </table>`,
      };

      // Envía correo
      sgMail
        .send(mail)
        .then(() => {
          // Envia respuesta
          res.status(200).send({ codigo: 0, mensaje: 'El correo se ha enviado correctamente.' });

          // Registra evento
          console.info('Correo enviado correctamente.');
        })
        .catch(error => {
          // Envia respuesta
          res.status(200).send({ codigo: 1, mensaje: 'Ha ocurrido un error al envíar el correo de contacto.' });

          // Registra evento
          console.error(error);
        });
    }
    // No se enviaron todos los parámetros
    else {
      // Envia la respuesta
      res.status(200).send({ codigo: 1, mensaje: 'Falta uno o más parámetros.' });

      // Registra la informacion
      console.warn('Falta uno o más parámetros.');
    }
  }
  // Petición erronea
  else {
    // Envia la respuesta
    res.status(403).send({ codigo: 1, mensaje: 'Acceso denegado.' });

    // Registra la informacion
    console.warn('Acceso denegado.');
  }
});
