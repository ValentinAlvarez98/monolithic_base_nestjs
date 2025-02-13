Proyecto base para API-REST monolíticas con manejo de usuarios.

General del proyecto:

- Cuenta con un docker compose para inicializar un contenedor con base de datos postgresql.
- Utiliza prisma como ORM para las consultas a la base de datos.

Caracteristicas globales:

config:

- Variables de entorno validadas con JOI

enums:

- Enum de los niveles disponibles de logs utilizado como tipo en el parámetro opcional recibido en los métodos para generar un log en CustomLogger. También es requerido si se quiere asignar un nivel que no sea el por defecto.

utils:

errors:

- Clase CustomError utilizada para extender la clase Error y agregarle el status en el constructor.

logger:

- Clase CustomLogger extiende la clase Logger de Nest.js para estandarizar los mensajes enviados en los logs, teniendo el método generateLog para los logs en general y generateValidationsLog para los logs en las validaciones porque recibe el servicio dónde se lanzó el log y facilita la identificación del error.
  NOTA: Requiere hacer un análisis del funcionamiento del Logger de Nest.js para mejorar esta implementación.
