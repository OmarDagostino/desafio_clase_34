export class ErrorDictionary {
    constructor() {
      this.errors = {
        aaa: "mensaje de prueba de error fatal",
        bbb: "mensaje de prueba de error",
        ccc: "mensaje de prueba de warning",
        ddd: "mensaje de prueba de info",
        eee: "mensaje de prueba de http",
        fff: "mensaje de prueba de debug",
        200: "operación exitosa",
        201: "documento actualizado",
        400: "Solicitud no válida",
        401: "No autorizado",
        403: "Acceso prohibido",
        404: "Recurso no encontrado",
        451: "Identificador de carrito invalido",
        452: "Identificador de producto invalido",
        453: "Faltan datos o datos erroneos",
        454: "Producto existente",
        455: "Identificador de ticket invalido",
        500: "Error interno del servidor",
        551: "Error en el servidor al enviar un correo",
        552: "Error en el servidor al tratar de recuperar mensajes guardados",
        553: "Error en el servidor al tratar de guardar mensajes del chat"
        
      
      };
    }
    getErrorMessage(code) {
        return this.errors[code] || "Error desconocido";
      }
    
    }

    export class levelError {
      constructor() {
        this.level = {
          aaa: "fatal",
          bbb: "error",
          ccc: "warning",
          ddd: "info",
          eee: "http",
          fff: "debug",
          200: "info",
          201: "info",
          400: "error",
          401: "error",
          403: "error",
          404: "error",
          451: "error",
          452: "error",
          453: "error",
          454: "error",
          455: "error",
          500: "fatal",
          551: "fatal",
          552: "fatal",
          553: "fatal"
        
        };
      }
      getLevelError(code) {
          return this.level[code] || "Error desconocido";
        }
      
      }

      