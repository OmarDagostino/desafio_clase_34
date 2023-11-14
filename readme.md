# Desafío de la clase 34
# Comisión 55565  de CoderHouse

## Autor : Omar D'Agostino

## Funcionalidades agregadas 
    * Se implementó el modulo de winston logger creando un script logger.js con todas las definiciones requeridas (por consola en los modos de desarrollo y staging, y por archivo "errors.log" para el modo de producción). 
    * Se imprimen mensajes con colores asignados segun nivel (para los mensajes en consola) y se informa la fecha y horario del mensaje 
    * Se modificaron las impresiones de los mensajes del proyecto utilizando el logger (cuyo nivel se obtiene del diccionario de errors al igual que el mensaje a imprimir a traves del código de error)
    * Se creo la ruta api/loggerTest para ejemplificar las impresiones
    * Se debe levantar el servidor utilizando npm run dev (para probar el entorno de desarrollo) y npm run start (para probar el entorno de producción)


## Tecnologías utilizadas : 
- Node JS : v18.16.1
- Motor de plantillas : Handlebars
- Estrategias de autenticación : Passport local y Passport con Git Hub
- Hasheo de password : Bcrypt
- Websocket : socket.io
- Mongo DB Atlas usado con Mongoose
    -base de datos : ecommerce1
    -colecciones : products1 / carts1 / messages1 /sessions / users1 / lasttickets1
- Dependencias 
    "@faker-js/faker": "^8.2.0",
    "bcrypt": "^5.1.1",
    "commander": "^11.1.0",
    "connect-mongo": "^5.0.0",
    "crypto": "^1.0.1",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-handlebars": "^7.1.2",
    "express-session": "^1.17.3",
    "express-validator": "^7.0.1",
    "mongoose": "^7.5.1",
    "mongoose-paginate-v2": "^1.7.4",
    "nodemailer": "^6.9.7",
    "nodemon": "^3.0.1",
    "passport": "^0.6.0",
    "passport-github2": "^0.1.12",
    "passport-local": "^1.0.0",
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2",
    "winston": "^3.11.0"



   
   

   

   Nota : Se desconecto el manejador de rutas de File System , pero no se eliminó (quedo en un manager separado y se comento en el código de app.js)
