Proyecto base para API-REST monolíticas con manejo de usuarios.

General del proyecto:

- Cuenta con un docker compose para inicializar un contenedor con base de datos postgresql.
- Utiliza prisma como ORM para las consultas a la base de datos.

Caracteristicas globales:

CONFIG:

- Variables de entorno validadas con JOI

ENUMS:

- Enum de los niveles disponibles de logs utilizado como tipo en el parámetro opcional recibido en los métodos para generar un log en CustomLogger. También es requerido si se quiere asignar un nivel que no sea el por defecto.

EXCEPTIONS:

Interfaces:

- ExceptionStrategy tiene como tipo generico T para asignar el tipo de exception dependiendo de la strategy en dónde se utilice y cuenta con un atributo logger de tipo CustomLogger y un método handle que recibe tanto la exception como la request de tipo Request y devuelve la exception formateada como tipo FormattedException

Strategies:

- CustomExceptionStrategy maneja las excepciones generadas por throw new CustomError(status, message, logLevel?) mediante la utilización del método handle que establece el url obtenido de la request, el status y el message de la exception, y el momento de ejecución. También cuenta con un método privado setLogger para asignar una instacia de CustomLogger en caso de que el status sea >=500 y lanzar un log utilizando el logLevel recibido de la exception y el contexto como el method de la request.
- HttpExceptionStrategy tiene un funcionamiento muy similar a CustomExceptionStrategy, con la diferencia que el status se obtiene de exception.getStatus() y en caso de que este sea >=500 el logLevel siempre va a ser FATAL porque indica un error de manejo de excepciones o una falla grave.
- ErrorExceptionStrategy asigna el logger al instanciar la clase porque siempre amerita generar un log en el caso de ser una excepción generada por throw new Error(message) y el log va a ser de nivel FATAL indicando que no se debe utilizar la clase Error o es un error no manejado. El mensaje es extraído de exception y el status siempre será 500.
- DefaultExceptionStrategy maneja las exceptions de igual manera que ErrorExceptionStrategy, pero como la exception se mantiene de tipo unknown no se puede extraer nada de ella y el mensaje será siempre "Internal Server Error".

Types:

- FormattedException es el tipo estándarizado para devolver todas las excepciones indistintamente de la strategy utilizada para manejarla.

UTILS:

errors:

- Clase CustomError utilizada para extender la clase Error agregandolé un parámetro timestamp asignado automáticamente en el momento que se instancia la clase y el status de forma obligatoria en el constructor previo al message. También se agrega el logLevel como atributo por default en FATAL y como parámetro opcional del constructor para, por ejemplo, utilizar en caso de lanzar un status 500 que esté contemplado y el log generado en la strategy no sea FATAL.

logger:

- Clase CustomLogger extiende la clase Logger de Nest.js para estandarizar los mensajes enviados en los logs, teniendo el método setName para asignar el nombre de la instancia del logger, el método setContext para asignar el contexto de ejecución dónde se va a lanzar el log, el método setLevel para asignar el nivel del log a lanzar y el método generateLog que recibe el mensaje para lanzar el log de forma estándarizada con el momento de lanzamiento del log, el mensaje y el contexto de ejecución.
  NOTA: Requiere hacer un análisis del funcionamiento del Logger de Nest.js para mejorar esta implementación.
  NOTA: Analizar la utilización de CustomLogger en otros módulos mediante @Injectable

NOTA GENERAL: Analizar la utilización de un módulo Global para manejar el acceso desde otros módulos al logger, a la futura clase abstracta BaseService y a las futuras clases de validaciones .
