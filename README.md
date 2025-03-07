# Proyecto Base NestJS API REST (Monolítico) con Prisma

Este proyecto es una plantilla base para construir APIs REST monolíticas con NestJS, enfocada en el manejo de usuarios y recursos similares. Incluye una estructura modular organizada, integración con PostgreSQL mediante Docker Compose, y utiliza Prisma como ORM para interactuar con la base de datos. Provee funcionalidades comunes (en la carpeta `common`) como configuración, logging personalizado y manejo centralizado de errores, así como un módulo de ejemplo (`example`) que sirve de referencia para crear nuevos módulos (por ejemplo, un módulo `users` para gestión de usuarios).

---

## Tabla de Contenidos

- [Resumen](#resumen)
- [Carpeta common](#carpeta-common)
  - [Configuración de Entorno](#configuración-de-entorno)
  - [Enum de Niveles de Log (logLevels)](#enum-de-niveles-de-log-loglevels)
  - [CustomLogger (Logger Personalizado)](#customlogger-logger-personalizado)
  - [CustomError (Error Personalizado)](#customerror-error-personalizado)
  - [Estrategias de Excepción](#estrategias-de-excepción)
  - [Clases Base: BaseController & BaseService](#clases-base-bascontroller--baseservice)
- [Módulo Example](#módulo-example)
  - [ExampleController](#examplecontroller)
  - [ExampleService](#exampleservice)
  - [ExampleRepository](#examplerepository)
  - [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
  - [Interfaces](#interfaces)
  - [ExampleModule](#examplemodule)
- [Uso del Proyecto](#uso-del-proyecto)
  - [Revisar el módulo de ejemplo](#revisar-el-módulo-de-ejemplo)
  - [Generación de nuevos módulos](#generación-de-nuevos-módulos)
- [Mejoras Futuras](#mejoras-futuras)
- [Referencias](#referencias)

---

## Resumen

Esta plantilla proporciona una arquitectura estándar para agilizar el desarrollo de nuevas funcionalidades en NestJS. El proyecto está pensado para manejar usuarios (u otras entidades similares) de forma consistente. Entre sus características principales se incluyen:

- **Docker & PostgreSQL**: Configuración lista con Docker Compose para levantar una base de datos PostgreSQL rápidamente para el entorno de desarrollo.
- **Prisma ORM**: Integración de Prisma para realizar consultas a la base de datos con un ORM moderno y tipeado.
- **Estructura Modular**: Separación del código por módulos de dominio (por ejemplo, un módulo de usuarios, módulo de productos, etc.), facilitando la escalabilidad y mantenibilidad.
- **Carpeta common**: Contiene utilidades compartidas y clases base (logger personalizado, manejo de errores, servicios/controladores base, etc.) que pueden ser usadas en todos los módulos.
- **Módulo de Ejemplo (example)**: Implementado como demostración del patrón de diseño del proyecto. Incluye un controlador, servicio, repositorio, DTOs e interfaces. Sirve como guía para crear nuevos módulos (por ejemplo, un módulo `users` para gestión de usuarios).
- **Validación de Configuración**: Las variables de entorno son validadas al iniciar la aplicación usando Joi, asegurando que la configuración (por ejemplo, URL de la base de datos, credenciales, etc.) sea correcta antes de ejecutar la API.
- **Manejo Centralizado de Errores**: Uso de clases de error personalizadas y un estrategia unificada para formatear las excepciones API, de modo que todas las respuestas de error tengan un formato consistente.
- **Logging Personalizado**: Un logger extendido de NestJS para unificar el formato de los logs y soportar niveles de log personalizados (incluyendo un nivel FATAL adicional para errores críticos).

La presencia de un módulo de ejemplo y herramientas de generación permite añadir nuevas funcionalidades de forma rápida. Por ejemplo, se puede crear un módulo `Usuarios` para gestionar cuentas de usuario de manera similar al módulo de ejemplo, utilizando el script de scaffolding proporcionado (ver **Generación de nuevos módulos**). A continuación, se detalla la estructura principal del proyecto y sus componentes.

---

## Carpeta common

La carpeta `common` concentra el código compartido y las abstracciones genéricas utilizadas por los demás módulos de la aplicación. Esto incluye configuración global, enumeraciones, utilidades de logging, manejo de excepciones y clases base para controladores y servicios. A continuación se describen sus componentes clave:

### Configuración de Entorno

En `common/config` (o similar) se definen las variables de entorno necesarias para el funcionamiento del proyecto, junto con su validación mediante Joi. Al iniciar la aplicación, se valida que todas las variables obligatorias estén presentes y con el formato correcto. Esto asegura que la aplicación no arranque con configuraciones inválidas. Ejemplos de variables de entorno pueden incluir credenciales de base de datos (URL de conexión, usuario, contraseña), puertos, etc. Si alguna variable falta o es inválida, la aplicación lo reportará claramente antes de continuar.

### Enum de Niveles de Log (logLevels)

La carpeta `common/enums` incluye el enum `logLevels` que define los niveles de severidad para el logging en la aplicación. Este enum puede contener valores como `DEBUG`, `INFO`, `WARN`, `ERROR` y `FATAL`, utilizados para clasificar la importancia de los mensajes de log. Por defecto, el nivel `FATAL` se utiliza para errores críticos (por ejemplo, excepciones no manejadas adecuadamente). Este enum se usa en el `CustomLogger` y en las excepciones personalizadas para especificar el nivel de log deseado al registrar eventos o errores. Gracias a esta enumeración, es fácil cambiar o agregar nuevos niveles de log de forma centralizada.

### CustomLogger (Logger Personalizado)

La clase `CustomLogger` (en `common/logger`) extiende la clase base `Logger` de NestJS. Su objetivo es estandarizar el formato y manejo de logs en toda la aplicación. Algunas características de `CustomLogger`:

- **Nombre de Logger**: Usa `setName(name: string)` para asignar un nombre o contexto general al logger (por ejemplo, el nombre de la clase que instancia el logger). Esto aparece en los logs para identificar la fuente del mensaje.
- **Contexto de Ejecución**: Con `setContext(context: string)` se puede establecer un contexto específico (por ejemplo, el método o módulo desde donde se registra el log). Este contexto se incluirá en el mensaje, facilitando el rastreo del origen del log.
- **Nivel de Log**: El método `setLevel(level: logLevels)` permite definir el nivel de severidad (usando el enum mencionado) para el próximo mensaje a registrar.
- **Generación de Log**: El método principal `generateLog(message: string, level?: logLevels)` crea la entrada de log formateada incluyendo la fecha/hora del evento, el mensaje provisto y el contexto actual. Internamente, invoca al método correspondiente de la clase `Logger` de NestJS (por ejemplo, `this.log()`, `this.error()`, etc.) según el nivel establecido.

Con `CustomLogger`, todos los módulos pueden producir logs consistentes. Por ejemplo, un repositorio o servicio puede instanciar `new CustomLogger(NombreClase)` y utilizarlo para registrar eventos importantes.  
**Nota**: Actualmente `CustomLogger` se inicializa manualmente en cada clase que lo usa; una mejora futura propuesta es convertirlo en un servicio inyectable de NestJS para evitar instancias duplicadas (ver **Mejoras Futuras**).

### CustomError (Error Personalizado)

En `common/utils/errors` se define la clase `CustomError`, que extiende la clase nativa `Error` de JavaScript para adaptarla al contexto de la API:

- **Timestamp**: Al instanciar `CustomError`, automáticamente se asigna una marca de tiempo (timestamp) que indica cuándo se creó el error. Esto ayuda a incluir información temporal en las respuestas de error.
- **Código de Estado (HTTP)**: El constructor de `CustomError` requiere un `status` (número HTTP, p. ej. 400, 404, 500) que representa el código de respuesta HTTP que debe tener este error. De este modo, cada error personalizado lleva consigo el código de estado apropiado.
- **Nivel de Log**: Opcionalmente, se puede indicar un nivel de log (usando `logLevels`) para sugerir con qué severidad debe registrarse este error cuando sea manejado. Si no se provee, el nivel por defecto es `FATAL` (asumiendo que, por defecto, un `CustomError` representa algo serio). En casos específicos, el desarrollador puede lanzar un `CustomError` con un nivel menos severo. Por ejemplo, si se lanza un `CustomError` con status 500 que está controlado y no es crítico, se podría asignar `logLevels.ERROR` en lugar de `FATAL` para que el logger lo registre como error no fatal.
- **Mensaje**: Como cualquier `Error`, `CustomError` incluye un mensaje descriptivo del problema.

La clase `CustomError` se usa en los repositorios y servicios para lanzar errores controlados dentro del flujo de la aplicación, en lugar de usar directamente excepciones de NestJS u errores genéricos. Estos errores personalizados luego son formateados por las estrategias de excepción descritas a continuación.

### Estrategias de Excepción

El manejo de excepciones en el proyecto sigue un patrón **Strategy**, definido en `common/exceptions`. En lugar de manejar cada tipo de error por separado en un único bloque, se definen estrategias específicas para distintos tipos de excepciones. Todas las estrategias implementan una interfaz genérica común `ExceptionStrategy<T>`:

- **Interface ExceptionStrategy<T>**: Declara un método `handle(exception: T, request: Request): FormattedException` y un atributo `logger: CustomLogger`. Cada implementación de esta interfaz procesa un tipo de excepción (T) y devuelve un objeto `FormattedException` estandarizado que se enviará al cliente. El logger permite que la estrategia registre información del error si es necesario (usando el `CustomLogger`).

Las principales implementaciones de estrategias de excepción son:

- **CustomExceptionStrategy**: Maneja excepciones de tipo `CustomError` (nuestras excepciones personalizadas). En su método `handle`, construye un objeto de respuesta de error tomando el `status` y `message` de la `CustomError`, agrega la URL del request donde ocurrió (para contexto) y la marca temporal actual. Si el status de la excepción es >= 500 (errores de servidor), la estrategia invoca `setLogger` internamente para crear o asignar un `CustomLogger` y registra el error inmediatamente. El log se emite con el nivel indicado en el `CustomError` (por ejemplo, `ERROR` o `FATAL`) y utiliza como contexto el método HTTP del request que causó el error. De este modo, los errores internos quedan registrados en los logs con toda la información necesaria.
- **HttpExceptionStrategy**: Estrategia para las excepciones estándar de NestJS (`HttpException` y sus subclases, que usualmente representan errores HTTP como 404, 400, etc.). Su funcionamiento es similar a `CustomExceptionStrategy`: formatea la respuesta con `status`, `mensaje` y `timestamp`. La diferencia es que obtiene el status vía `exception.getStatus()`. Además, si el status es >= 500, esta estrategia siempre usa el nivel de log `FATAL` al registrar el error, porque se asume que un error HTTP de servidor no fue manejado por nuestro código (por ejemplo, un error inesperado en un guard, filtro no aplicado, etc.) y por tanto es crítico.
- **ErrorExceptionStrategy**: Se encarga de errores genéricos de JavaScript (instancias de la clase nativa `Error` que no sean `HttpException` ni `CustomError`). Esta estrategia considera que si un código lanza `throw new Error(...)` es una situación no manejada adecuadamente en la aplicación. Por ello, en el constructor de la estrategia se inicializa inmediatamente un `CustomLogger` (ya que siempre se logueará este error) y en `handle` formatea la respuesta con `status` 500 fijo (error interno) y un mensaje derivado del error (o un mensaje genérico si no hay detalles). Todo error genérico se registra con nivel `FATAL` automáticamente, indicando la necesidad de corregir el flujo para manejarlo con un tipo de excepción más específico en el futuro.
- **DefaultExceptionStrategy**: Es la estrategia de último recurso, utilizada para excepciones cuyo tipo no corresponde a ninguno de los anteriores (por ejemplo, tipo unknown). Dado que no se puede extraer información específica, simplemente devuelve una respuesta con `status` 500 y mensaje "Internal Server Error". En cuanto al logging, actúa de forma similar a `ErrorExceptionStrategy` asumiendo un error crítico inesperado.

Todas estas estrategias producen un resultado unificado: un objeto `FormattedException`, definido en `common/exceptions` (tipo TypeScript) que contiene los campos estándar de error para la API. Este tipo `FormattedException` podría incluir campos como `statusCode`, `message`, `timestamp` y quizás un `path` o contexto del error. El objetivo es que, sin importar qué fallo ocurrió internamente, la respuesta al cliente tenga un formato consistente y predecible.

**Nota**: Es probable que la aplicación registre un filtro global de excepciones (Global Exception Filter) en NestJS que utilice estas estrategias. Por ejemplo, un filtro podría captar cualquier excepción no manejada en los controladores, determinar su tipo (`CustomError`, `HttpException`, etc.) y delegar en la estrategia correspondiente para formatear la respuesta y hacer logging. De esta manera, el manejo de errores queda centralizado. (Revisar la documentación de NestJS sobre Exception Filters para más contexto sobre esta implementación.)

### Clases Base: BaseController & BaseService

Para evitar duplicar lógica común en todos los módulos, el proyecto define clases genéricas base en `common` que sirven como superclases para los controladores y servicios específicos de cada módulo:

- **BaseController `<Res, DBInput, ID>`**: Esta clase genérica extiende los controladores de NestJS y proporciona implementaciones estándar para endpoints CRUD comunes:

  - **GET /**: Obtener todos los elementos (delegando al servicio correspondiente).
  - **GET /:id**: Obtener un elemento por ID.
  - **DELETE /:id**: Eliminar un elemento por ID.

  Estas rutas ya están definidas en `BaseController` y son heredadas automáticamente por los controladores concretos. Por ejemplo, el `ExampleController` no necesita definir métodos para obtener o eliminar ejemplos, pues ya existen en `BaseController`. Al heredar, el `BaseController` espera que la subclase le pase el tipo de respuesta `Res` (p. ej. `ExampleResponse`), el tipo de datos para crear/actualizar `DBInput` (p. ej. `ExampleDBInput`) y el tipo de ID (generalmente `string` o `number`). De este modo, `BaseController` puede invocar métodos genéricos en el servicio sin conocer los detalles específicos del módulo.

  **Nota**: Los métodos de creación y actualización (POST/PATCH) no están implementados en `BaseController` dado que suelen requerir validaciones o lógicas particulares (por ejemplo, verificar campos únicos, aplicar DTOs diferentes). Esas rutas se definen en cada controlador concreto según la necesidad, como se ve en el `ExampleController`.

- **BaseService `<Repo, Validations, Res, DBInput, ID>`**: Clase genérica para la capa de servicio, encargada de la lógica de negocio común. Al extender `BaseService`, un servicio de módulo (p. ej. `ExampleService`) hereda métodos genéricos para operaciones CRUD:

  - `findAll()`: Recupera todos los registros a través del repositorio.
  - `findOne(id: ID)`: Busca uno por ID.
  - `create(data: DBInput)`: Crea un nuevo registro usando los datos proporcionados.
  - `update(id: ID, data: Partial<DBInput>)`: Actualiza parcialmente un registro existente.
  - `delete(id: ID)`: Elimina un registro.

  El `BaseService` se construye con:

  - **Repo**: la clase de repositorio específica del módulo (por ejemplo `ExampleRepository`), que maneja las operaciones en BD.
  - **Validations**: una clase de validación asociada (por ejemplo `ExampleServiceValidations`), utilizada para comprobar ciertas precondiciones o postcondiciones.
  - Los tipos `Res` y `DBInput` para mantener consistencia tipada en las respuestas y entradas, y el tipo de ID.

  En su constructor, `BaseService` típicamente acepta una instancia del repositorio y puede instanciar su clase de validación. Por ejemplo, en el módulo de ejemplo, `ExampleService` extiende `BaseService` pasando `ExampleRepository` y `ExampleServiceValidations`, e inicializa la superclase con `this.repository` y `new ExampleServiceValidations(...)`. La clase de validación (`BaseServicesValidations` en `common`) es una abstracción para manejar verificaciones comunes en los servicios. Por ejemplo, podría tener métodos para chequear que un resultado de base de datos no sea null cuando se espera un objeto (lanzando un `CustomError` 404 en caso de no encontrarlo), o validar que ciertos datos requeridos estén presentes antes de llamar al repositorio. La implementación actual de `BaseServicesValidations` y sus subclases (como `ExampleServiceValidations`) se provee principalmente como gancho para que el desarrollador implemente reglas de negocio específicas. En la plantilla, `ExampleServiceValidations` está prácticamente vacío (más allá de construir la superclase), indicando dónde agregar lógica de validación si es necesaria.

En conjunto, `BaseController` y `BaseService` permiten que cada módulo solo se preocupe por las diferencias específicas de su dominio, mientras comparten un comportamiento común consistente. Esto acelera el desarrollo de nuevos módulos porque mucho código repetitivo (endpoints CRUD básicos, manejo de errores de no encontrado, etc.) ya está resuelto en estas bases.

**Nota**: Se está considerando refactorizar `BaseService` para que sea una clase abstracta explícita, reforzando que ciertos métodos pueden o deben ser sobreescritos por los servicios concretos si requieren lógica adicional. Esto ayudaría a clarificar el contrato de los servicios (ver sección **Mejoras Futuras**). Asimismo, podría convertirse la funcionalidad común en un módulo global inyectable para evitar instancias múltiples de logger o validadores en cada servicio.

---

## Módulo Example

El módulo de ejemplo (`src/example`) ilustra cómo crear un nuevo módulo siguiendo la arquitectura de la plantilla. A continuación se describen sus componentes principales:

### ExampleController

`src/example/controller/example.controller.ts`: Es el controlador REST para el recurso "Example". Declara las rutas HTTP específicas de este módulo. Extiende `BaseController<ExampleResponse, ExampleDBInput, string>`, por lo que hereda los endpoints `GET /example`, `GET /example/:id` y `DELETE /example/:id`. Además, define dos endpoints propios:

- **POST /example/create**: Crea un nuevo Example en la base de datos. Este método recibe un `CreateExampleDto` en el cuerpo de la petición y delega en el servicio la lógica de creación.
- **PATCH /example/update/:id**: Actualiza un Example existente. Recibe el `id` del recurso en la URL y los campos a actualizar en el cuerpo (`UpdateExampleDto`), luego invoca al servicio para realizar la actualización.

Gracias a la herencia de `BaseController`, no fue necesario escribir código para obtener o eliminar registros individuales; esas operaciones vienen listas.

### ExampleService

`src/example/service/example.service.ts`: Contiene la lógica de negocio del módulo Example. Extiende `BaseService<ExampleRepository, ExampleServiceValidations, ExampleResponse, ExampleDBInput, string>`. En el constructor, inyecta mediante NestJS el repositorio `ExampleRepository` y llama a `super()` pasando ese repositorio, el nombre del modelo ("Example") y una instancia de la clase de validaciones (`new ExampleServiceValidations(...)`). Este servicio utiliza los métodos genéricos de `BaseService` para implementar:

- `create(data: CreateExampleDto): Promise<ExampleResponse>` – Crea un registro nuevo (internamente, `BaseService` manejará la llamada al repositorio y las validaciones necesarias).
- `update(id: string, data: UpdateExampleDto): Promise<ExampleResponse>` – Actualiza un registro existente con los datos proporcionados.

(En la plantilla, estos métodos simplemente invocan la lógica genérica del padre; se podrían extender para agregar lógica adicional de ser necesario.) El servicio se apoya en `ExampleServiceValidations` para cualquier check especial. En este ejemplo básico, no se agregaron validaciones extra, pero en un caso real podría verificar, por ejemplo, que no exista otro registro con un campo único antes de crear, etc.

### ExampleRepository

`src/example/repository/example.repository.ts`: Gestiona la interacción con la base de datos para el módulo Example. Extiende `PrismaClient` (el cliente autogenerado de Prisma) e implementa la interfaz genérica `BaseRepositoryOperationsInterface<Example, ExampleDBInput, string>`. Al ser un `PrismaClient`, expone propiedades que representan cada modelo del esquema (asumiendo que en el esquema de Prisma existe un modelo Example). Principales funciones:

- **onModuleInit y onModuleDestroy**: Métodos del ciclo de vida que conectan/desconectan Prisma automáticamente cuando se inicia o termina el módulo, asegurando la conexión a la base de datos.
- **Operaciones CRUD**: Implementa métodos como `countItems()` (para total de registros), `create(data: ExampleDBInput)`, `findById(id: string)`, `findAll()`, `updateById(id: string, data: Partial<ExampleDBInput>)` y `deleteById(id: string)`. Cada método invoca a la operación correspondiente de Prisma (por ejemplo, `this.example.create`, `this.example.findMany`, etc., donde `this.example` es el client de Prisma para el modelo Example). Estos métodos están envueltos en bloques try/catch:
  - En caso de éxito, devuelven el resultado directamente.
  - En caso de error (por ejemplo, violación de constraint en DB), utilizan el `CustomLogger`: se define un logger `logger = new CustomLogger(ExampleRepository.name)` al iniciar la clase. Al ocurrir un error se hace `logger.setContext(ExampleRepository.name)` (contexto del error) y `logger.generateLog(error.message, logLevels.ERROR)` para registrar el detalle del problema. Luego se lanza un `CustomError(500, 'Error {operacion} example', logLevels.ERROR)`, de forma que el flujo superior capture una excepción controlada con mensaje genérico sin exponer detalles internos. Por ejemplo, si falla `create`, lanza un `CustomError(500, 'Error creating example', ...)`. Estas excepciones serán formateadas por las estrategias de excepción para responder al cliente con un 500 y mensaje apropiado, mientras que el detalle técnico quedó en los logs.

En resumen, el repositorio actúa de puente entre Prisma y el servicio, encapsulando consultas y traduciendo errores de bajo nivel a errores de la aplicación.

**Nota**: Para que `ExampleRepository` funcione correctamente, en el esquema de Prisma (`schema.prisma`) debe existir un modelo Example con sus campos (por ejemplo, un campo `id` de tipo String o UUID, y posiblemente otros campos como `someField` que se usa en el DTO de ejemplo). Este modelo de ejemplo se incluye para demostrar la estructura; en un caso real, se definirían los modelos correspondientes a las entidades del negocio (usuarios, productos, etc.).

### DTOs (Data Transfer Objects)

- **CreateExampleDto** (`src/example/dtos/createExample.dto.ts`): Define la forma de los datos esperados para crear un Example. Utiliza decoradores de `class-validator` para validar los campos. En este caso de ejemplo, incluye un campo `someField` de tipo string con validaciones `@IsString()`, `@MinLength(3)` y `@MaxLength(50)` a modo ilustrativo. En un escenario real, aquí se listan todos los campos requeridos para crear la entidad, con las validaciones necesarias (por ejemplo, formato de email si fuera un usuario, etc.).
- **UpdateExampleDto** (`src/example/dtos/updateExample.dto.ts`): Define los datos para actualizar un Example existente. Extiende `PartialType(CreateExampleDto)` de NestJS, lo que automáticamente convierte todos los campos de creación en opcionales para la actualización. Se pueden agregar validaciones específicas si ciertos campos solo son opcionales en creación pero obligatorios en actualización, etc.

Estos DTOs garantizan que el controlador reciba datos ya validados, facilitando la lógica en el servicio (que puede asumir que la estructura de data cumple los requisitos básicos).

### Interfaces

- **ExampleDBInput** (`src/example/interfaces/exampleDBInput.interface.ts`): Describe la estructura de los datos que el repositorio espera para crear un registro Example en la base de datos. Suele corresponder al input que Prisma necesita. En este caso, es similar a los campos de `CreateExampleDto` (por ejemplo, `{ someField: string }`). Se separa en una interfaz por flexibilidad: puede haber campos que la base de datos complete automáticamente (IDs, timestamps) o transformaciones que el servicio haga antes de llamar al repositorio. Tener esta interfaz permite distinguir entre lo que recibe el servicio (DTO) y lo que finalmente se envía al ORM.
- **ExampleResponse** (`src/example/interfaces/exampleResponse.interface.ts`): Describe la estructura de la respuesta que el servicio/ controlador devolverá al cliente tras una operación exitosa. A veces no es deseable exponer todos los campos tal como están en la base de datos (por ejemplo, nunca devolver contraseñas). Esta interfaz permite formatear la entidad al modelo de respuesta. En el ejemplo sencillo, quizás coincide con los campos de `ExampleDBInput`, pero está separada para futuras diferencias si se requieren.

### ExampleModule

`src/example/example.module.ts`: El módulo NestJS que agrupa todos los elementos anteriores. Utiliza el decorador `@Module` para declarar:

- **controllers**: `[ExampleController]`
- **providers**: `[ExampleService, ExampleRepository]`
- **exports**: `[ExampleService, ExampleRepository]` (exporta estos proveedores por si otros módulos necesitan usar el servicio o el repositorio de Example, aunque en muchos casos no será necesario exportarlos a menos que se planee usar dinámicamente).

Este módulo debe ser importado en el módulo raíz de la aplicación (usualmente `AppModule`) para que NestJS registre sus controladores y proveedores. En la plantilla, el `AppModule` probablemente ya importe `ExampleModule`. Si se generan nuevos módulos, habrá que importarlos igualmente.

En conjunto, el módulo Example demuestra cómo estructurar un nuevo recurso en el proyecto. El patrón general para cada módulo es: **Controller (endpoints HTTP) → Service (lógica de negocio) → Repository (acceso a DB con Prisma)**, apoyándose en DTOs/Interfaces para la definición de datos y en las clases base de `common` para comportamiento repetitivo.

---

## Uso del Proyecto

Esta sección explica cómo usar la plantilla, tanto para ejecutar la API de ejemplo como para extenderla creando nuevos módulos.

### Revisar el módulo de ejemplo

- **Instalación y configuración inicial**: Asegúrate de tener Docker instalado y las variables de entorno configuradas. Corre `docker-compose up -d` para levantar la base de datos PostgreSQL definida en el docker-compose. Crea un archivo `.env` con los valores necesarios (puedes basarte en un `.env.example` si se provee). Las variables típicas incluyen `DATABASE_URL` para Prisma, puertos, etc. Gracias a la validación con Joi, la aplicación te indicará si falta configurar algo.
- **Generar Prisma Client**: Ejecuta `npx prisma generate` (o `npm run prisma:generate` si existe un script) para que Prisma genere el cliente a partir del esquema (esto debería correr automáticamente al hacer `npm install` si está configurado).
- **Iniciar la aplicación**: Ejecuta `npm run start:dev` para iniciar NestJS en modo desarrollo. La API estará disponible (por defecto en [http://localhost:3000](http://localhost:3000)).
- **Probar el módulo example**: Puedes realizar peticiones al endpoint de ejemplo:
  - `GET http://localhost:3000/example` – debería devolver una lista (posiblemente vacía al inicio) de elementos Example.
  - `POST http://localhost:3000/example/create` – crea un nuevo elemento. Envía un JSON en el cuerpo con el formato de `CreateExampleDto` (por ejemplo, `{ "someField": "valor de prueba" }`). Deberías recibir de vuelta un objeto con el campo creado (y posiblemente un ID asignado por la base de datos).
  - `GET http://localhost:3000/example/<id>` – recupera el elemento con el ID dado.
  - `PATCH http://localhost:3000/example/update/<id>` – actualiza el elemento indicado (envía en el body los campos a cambiar según `UpdateExampleDto`).
  - `DELETE http://localhost:3000/example/<id>` – elimina el elemento con ese ID.

Estos endpoints demuestran el ciclo completo CRUD. En caso de errores (por ejemplo, buscar un ID que no existe), se devolverá una respuesta de error formateada por nuestras estrategias (por ejemplo, un 404 con mensaje "Not Found" si se implementó esa validación, o un 500 genérico si ocurre algo inesperado).

- **Consultar los logs**: Observa la consola donde corre la aplicación. Gracias a `CustomLogger`, deberías ver mensajes cuando ocurran ciertos eventos, especialmente errores capturados. Por ejemplo, si la base de datos lanza una excepción, el repositorio la atrapará y emitirá un log con detalles técnicos (nivel `ERROR` o `FATAL`), mientras la respuesta al cliente será simplificada.

### Generación de nuevos módulos

Una de las ventajas de esta plantilla es facilitar la creación de nuevos módulos de forma consistente. Para agregar una nueva entidad o recurso a la API (por ejemplo, un módulo de `Usuarios` para manejar registros de usuario), puedes usar el script automatizado `generate-new-module.js` incluido en la raíz del proyecto.

#### Cómo usar el generador de módulos

#### Cómo usar el generador de módulos

En la terminal, ubicados en la raíz del proyecto, ejecuta el siguiente comando:

```bash
node generate-new-module.js <nombre-del-modulo>
```

Reemplaza <nombre-del-modulo> por el nombre deseado para tu módulo, usando notación singular. Por ejemplo, para crear un módulo de usuarios, usa:

```bash
node generate-new-module.js user
```

El script generará una carpeta `src/<nombre>` con la estructura básica del módulo. Siguiendo el ejemplo de `user`, se creará `src/user/` con los siguientes contenidos:

```plaintext
src/user/
├── controller/
│   └── user.controller.ts
├── dtos/
│   ├── createUser.dto.ts
│   ├── updateUser.dto.ts
│   └── index.ts
├── interfaces/
│   ├── userDBInput.interface.ts
│   ├── userResponse.interface.ts
│   └── index.ts
├── repository/
│   └── user.repository.ts
├── service/
│   ├── user.service.ts
│   └── user.service.validations.ts
└── user.module.ts
```

Cada archivo contendrá una copia del código de ejemplo, con la palabra "Example" reemplazada por "User" donde corresponda, adaptando nombres de clases, métodos y variables automáticamente.

## Ajustes posteriores

- **Importar el módulo**:  
  Abre tu `AppModule` (por ejemplo, `src/app.module.ts`) y añade `UserModule` en la lista de imports para que NestJS lo cargue.

- **Definir el modelo Prisma**:  
  Edita el archivo `schema.prisma` de Prisma para agregar un modelo `User` con los campos necesarios (id, nombre, email, etc. según requiera tu aplicación). Luego ejecuta `npx prisma migrate dev` para crear una migración y actualizar la base de datos, y `npx prisma generate` para regenerar el cliente Prisma con el nuevo modelo. Esto es crucial, ya que el repositorio generado (`UserRepository`) espera que Prisma tenga definido `this.user` en el cliente para funcionar.

- **Revisar DTOs e Interfaces**:  
  Actualiza los archivos `createUser.dto.ts` y `updateUser.dto.ts` con los campos reales que deben recibirse para crear/actualizar un usuario (por ejemplo, email, password, name, etc.), incluyendo las validaciones necesarias de `class-validator`. Haz lo propio en `userDBInput.interface.ts` y `userResponse.interface.ts` para reflejar cómo serán los datos almacenados y devueltos. Remueve o adapta el campo de ejemplo (`someField`) que quedó por defecto.

- **Lógica de Servicio**:  
  Si tu módulo necesita lógica adicional (p.ej., en `UserService.create` quizá quieras encriptar la contraseña antes de guardar, o enviar un email de verificación), este es el momento de incorporarla. Puedes usar la clase `UserServiceValidations` para chequear condiciones (como que no exista ya un usuario con el mismo email, lanzando un `CustomError` 400 en ese caso, por ejemplo).

- **Probar el nuevo módulo**:  
  Levanta nuevamente la aplicación y prueba las rutas del módulo recién creado, asegurándote de obtener las respuestas esperadas. Aprovecha la consistencia: un `GET` a `/user` debería listar usuarios, `POST /user/create` crear uno nuevo, etc., siguiendo el mismo patrón que el módulo `example`.

Usando el generador, todos los nuevos módulos seguirán la misma convención, lo que hace más fácil leer y mantener el proyecto a medida que crece. Observa cómo reutilizan las clases base de `common`:

- El controlador generado extiende `BaseController` (por lo que hereda GET/DELETE).
- El servicio extiende `BaseService` y configura `new UserServiceValidations`.
- El repositorio extiende `PrismaClient` y usa `CustomLogger` y `CustomError` igual que en el ejemplo.

Esto asegura que las prácticas de logging y manejo de errores permanecen uniformes en toda la API.

## Mejoras Futuras

Si bien el proyecto establece una base sólida, existen algunas mejoras potenciales para optimizar y robustecer la plantilla:

- **Refinar el CustomLogger**:  
  Analizar y mejorar la implementación de `CustomLogger` aprovechando mejor las capacidades del logger de NestJS. Una idea es implementar la interfaz `LoggerService` de NestJS en `CustomLogger` y registrarlo como un proveedor global. De esa forma, en lugar de instanciar manualmente `new CustomLogger` en cada clase, se podría inyectar (vía constructor) una única instancia compartida o configurada según contexto. Esto seguiría las recomendaciones oficiales de NestJS para logging (evitando el uso directo de `new Logger()` dentro de clases, lo cual puede dificultar pruebas).

  STACKOVERFLOW.COM  
  GITHUB.COM

- **Módulo Global para Servicios Comunes**:  
  Evaluar la creación de un `GlobalModule` que exponga instancias o proveedores comunes a todos los demás módulos, como el `CustomLogger`, la clase base de servicio o los validadores comunes. Por ejemplo, un `GlobalModule` podría proveer un `CustomLogger` inyectable y quizás un servicio base genérico. Esto centralizaría la configuración y permitiría, por ejemplo, cambiar la forma en que se crea el logger sin tener que modificar cada módulo por separado. Igualmente, componentes como una potencial clase `BaseService` abstracta podrían residir allí para un acceso más limpio.

- **Clase BaseService Abstracta**:  
  Convertir `BaseService` en una clase abstracta que defina claramente qué métodos deben implementar las subclases y cuáles están totalmente provistos. Esto documentaría mejor su uso y prevendría instanciación directa. Adicionalmente, revisar la plantilla generada de los métodos `create`/`update` en los servicios específicos para asegurarse de que llaman correctamente a la lógica padre (evitando llamadas recursivas accidentales). Esta abstracción ayudaría a futuros desarrolladores a extender la funcionalidad común sin romper contratos.

- **Validaciones de Negocio Más Robustas**:  
  Ampliar el uso de las clases de validación en los servicios (`ExampleServiceValidations` y equivalentes) para cubrir más casos. Por ejemplo, implementar verificaciones de existencia antes de actualizar o borrar (lanzando un `CustomError(404)` si no se encuentra el recurso, en lugar de dejar que el repositorio devuelva null sin manejo). También se podría integrar validaciones complejas como chequear reglas de negocio (ejemplo: que un usuario no exceda cierto límite de entidades asociadas, etc.) en estas clases, manteniendo así los servicios limpios y delegando la lógica de validación.

- **Documentación y Pruebas**:  
  Añadir más documentación dentro del código (comentarios en métodos y clases) y, posiblemente, generar documentación HTML automáticamente. Asimismo, incorporar pruebas unitarias y de integración para las utilidades de `common` (especialmente para las estrategias de excepción y el logger) y para los módulos generados, asegurando que la plantilla sea confiable y sirva como punto de partida también en términos de calidad.

Estas mejoras buscan hacer el template más flexible, alineado con las mejores prácticas de NestJS, y prepararlo para escenarios más complejos. Conforme se implementen, se espera reducir la necesidad de código repetitivo y aumentar la consistencia y mantenibilidad del proyecto.

## Referencias

- **NestJS - Documentación Oficial**:  
  Guía completa del framework NestJS, cubriendo desde conceptos básicos de módulos y controladores hasta técnicas avanzadas de logging y manejo de excepciones. Disponible en [docs.nestjs.com](https://docs.nestjs.com) (inglés).

- **NestJS - Sistema de Logging**:  
  Sección de la documentación oficial sobre el uso y personalización del logger de NestJS. Referencia útil para mejorar `CustomLogger` o implementar un `LoggerService` personalizado (NestJS Official Logger Docs).

- **NestJS - Filtros de Excepción**:  
  Explicación oficial de NestJS sobre cómo funcionan los Exception Filters y manejo de errores global, relevante para entender e integrar las estrategias de excepción de este proyecto (NestJS Exception Filters).

- **Prisma - Documentación Oficial**:  
  Documentación de Prisma ORM, incluyendo cómo definir el esquema, generar el cliente y realizar consultas. Útil para adaptar el template a modelos de datos específicos. Disponible en [prisma.io/docs](https://www.prisma.io/docs).
