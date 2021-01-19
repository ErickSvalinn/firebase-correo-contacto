# Función de Google Firebase

## Para envío de correos

### Creación

A través de [Firebase CLI](https://firebase.google.com/docs/cli)
Utilizando los comandos

`firebase init`
Con las siguientes configuraciones:

- Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices.
  - (\*) Functions: Configure and deploy Cloud Functions (Solo configura functions)
- Use an existing project
  - Proyecto Personal (Si no tienes un proyecto lo puedes crear en [Firebase](https://firebase.google.com/))
- What language would you like to use to write Cloud Functions?
  - TypeScript
- Do you want to use ESLint to catch probable bugs and enforce style? (Y/n)
  - n
- Do you want to install dependencies with npm now? (Y/n)
- y (Puedes instalarlas posteriormente con `npm install`)

# Firebase Función `correoContacto`

La función cuenta con 3 variables que se asignan de la siguiente forma:

1. `firebase functions:config:set remitente.correo="DIRECCION_CORREO_ENVIO" remitente.contrasena="CLAVE_CORREO_ENVIO"`
2. `firebase functions:config:set destinatario.correo="CORREO_DESTINO"`
3. `firebase functions:config:set sitioweb ="TU_SITIO_WEB"`

Donde:

- DIRECCION_CORREO_ENVIO: Debe ser un correo de gmail, ejemplo "jhondoe@gmail.com".
- CLAVE_CORREO_ENVIO: Debe ser la contraseña que se utiliza para ese correo en Gmail ejemplo "contraseña123".
- CORREO_DESTINO: Es el correo donde deseas recibir el correo de contacto "micorreo@gmail.com".
- TU_SITIO_WEB: La dirección del sitio donde habilitas el correo de contacto.

Nota: Antes de utilizar este codigo debes recordar o tener en consideración lo siguiente.

- Es posible que debas habilitar el Billing en Google Functions para poder utilizarlo.
- Para enviar correos debes habilitar el uso de aplicaciones menos seguras [Aquí](https://support.google.com/accounts/answer/6010255?hl=en).
