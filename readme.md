# Desafío de la clase 34
# Comisión 55565  de CoderHouse

## Autor : Omar D'Agostino

## Funcionalidades agregadas 
    * Se creo un logger para manejar los mensajes con el módulo Winston , con 6 niveles : fatal, error, warning, info, http y debug. A cada código de error del diccionario de errores se le asigno un nivel de gravedad que se utiliza para loggear el mensaje segun corresponda. 
    
    * Se creo la ruta /api/loggerTest para probar los mensajes del logger, si esta en modo de desarrollo o staging, tira todos los mensajes por consola, si esta en modo de produccion graba los mensajes con gravedad fatal o error en el archivo errors.log .


    

## Tecnologías utilizadas : 
- Node JS : v18.16.1
- Motor de plantillas : Handlebars
- Estrategias de autenticación : Passport local y Passport con Git Hub
- Hasheo de password : Bcrypt
- Logger : Winston
- Websocket : socket.io
- Mongo DB Atlas usado con Mongoose
    -base de datos : ecommerce1
    -colecciones : products1 / carts1 / messages1 /sessions / users1 / tickets1
- Dependencias 
    "@faker-js/faker": "^8.3.1",
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

