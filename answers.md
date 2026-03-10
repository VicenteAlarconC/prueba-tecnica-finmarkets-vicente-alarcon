## Preguntas Teóricas

### 1) Explique la diferencia entre Middleware, Guard, Interceptor y Pipe en NestJS.

> **R:**  
> El Middleware se ejecuta antes de que la solicitud alcance el controlador, y generalmente se utiliza para tareas como la autenticación, registro de solicitudes o manejo de errores. El Guard, se ejecuta después del Middleware y se utiliza para determinar si una solicitud tiene permiso para acceder a un recurso en específico. El Interceptor se ejecuta después del Guard y se utiliza para transformar la respuesta o manejar errores. El Pipe se ejecuta después del Interceptor y se utiliza para transformar los datos de entrada o salida. Es decir, sus diferencias se encuentran principalmente en el orden de ejecución y en sus propositos específicos dentro del ciclo de vida de una solicitud, aunque en algunos casos se pueden utilizar de la misma manera, como por ejemplo para validar datos de entrada, pero en general cada uno tiene un propósito específico dentro del ciclo de vida de una solicitud.

---

### 2) ¿Cómo implementaría autorización basada en roles?

> **R:**  
> Para implementar autorización basada en roles en NestJS, se puede utilizar Guards para verificar si el usuario tiene el rol necesario para acceder a un recurso específico. Se puede crear un Guard personalizado que verifique el rol del usuario y luego aplicarlo a los controladores o rutas que requieren autorización. Además, se pueden utilizar Decoradores personalizados para asignar roles a los controladores o rutas, lo que facilita la gestión de permisos y la organización del código.

---

### 3) ¿Qué problemas aparecen cuando un backend crece mucho y cómo NestJS ayuda a resolverlos?

> **R:**  
> Cuando un backend crece mucho, pueden surgir problemas como la dificultad para mantener el código, la falta de organización, la duplicación de código y la dificultad para escalar. Nest ayuda a resolver estos problemas al proporcionar una estructura modular y escalable, lo que facilita la organización del código y la separación de responsabilidades. Además, Nest utiliza TypeScript, lo que mejora la mantenibilidad y la calidad del código al proporcionar tipado estático y características avanzadas de programación orientada a objetos. También ofrece herramientas integradas para manejar errores, validación y autenticación, lo que reduce la necesidad de escribir código adicional para estas funcionalidades comunes. Nest, al ser un framework que trabaja por defecto como monolito modular permite que un proyecto crezca sin perder la organización y mantenibilidad, además de ofrecer herramientas integradas para manejar problemas comunes en el desarrollo de backend, lo que facilita la escalabilidad y el mantenimiento a largo plazo del proyecto.

---

### 4) ¿Cómo manejaría configuración por ambiente (development, staging, production)?

> **R:**  
> Para manejar la configuración por ambiente en NestJS, se puede utilizar el módulo ConfigModule, que permite cargar variables de entorno desde archivos .env específicos para cada ambiente. Se pueden crear archivos .env.development, .env.staging y .env.production, y luego configurar el ConfigModule para cargar el archivo correspondiente según el valor de la variable NODE_ENV. Esto permite tener configuraciones específicas para cada ambiente sin necesidad de modificar el código fuente, lo que facilita la gestión de configuraciones y mejora la seguridad al no exponer información sensible en el código.

---

### 5) ¿Cómo evitaría que dos usuarios compren el último producto disponible al mismo tiempo?

> **R:**  
> Lo resolvería a nivel de base de datos, no solo con lógica en memoria. Haría la compra dentro de una transacción y bloquearía la fila del producto o del inventario antes de descontar stock, por ejemplo con un lock pesimista de escritura. PostgreSQL documenta que los row-level locks bloquean a otros escritores sobre esa misma fila hasta el fin de la transacción, y TypeORM soporta esto con setLock("pessimistic_write").
>
> El flujo sería: abrir transacción, leer el producto con lock, verificar que stock > 0, descontar 1, guardar y confirmar. Si otro usuario intenta comprar al mismo tiempo, tendrá que esperar o fallar, según la estrategia (nowait o esperar). Esto garantiza que solo un usuario pueda comprar el último producto disponible, evitando condiciones de carrera y asegurando la integridad de los datos.

## Análisis y Debugging

### 1) Identifique al menos 5 problemas de arquitectura o diseño.

> **R:**
>
> 1. **No existe persistencia real de las órdenes.**  
>    `private orders = []` no es una solución escalable ni confiable, ya que los datos se perderán al reiniciar la aplicación y no se podrán compartir entre múltiples instancias de la aplicación.
> 2. **No se manejan errores ni excepciones correctamente.**  
>    Si el id no existe, no se controla ese caso y la aplicación podría fallar devolviendo un error interno en lugar de una respuesta adecuada, como un 404 Not Found.
> 3. **No existen DTOs ni validación de entrada.**  
>    Los datos se reciben sin ningún tipo de validación, lo que puede afectar la estabilidad, la seguridad y la consistencia de la aplicación.
> 4. **No hay control sobre los estados permitidos.**  
>    No existe un enum ni una validación formal para status, por lo que se podrían guardar valores inválidos, generando comportamientos inesperados en la lógica del sistema.
> 5. **La función findAll() no contempla paginación ni filtrado.**  
>    Si la cantidad de órdenes creciera, devolver todos los registros en una sola respuesta sería ineficiente y poco escalable.

### 2) Explique cómo refactorizaría esta implementación en un proyecto real de NestJS.

> **R:**  
> En un proyecto real de NestJS, refactorizaría esta implementación separando claramente las responsabilidades dentro de un OrdersModule, con su respectivo OrdersController, OrdersService y una capa de persistencia bien definida. Reemplazaría el arreglo en memoria por una base de datos real utilizando una entidad Order y un repositorio con TypeORM o Prisma, de manera que la información sea persistente, consistente y escalable. Además, crearía DTOs como CreateOrderDto y UpdateOrderStatusDto para validar la entrada de datos con class-validator, y definiría un enum para restringir los estados permitidos de la orden. También implementaría un manejo adecuado de errores HTTP, por ejemplo lanzando una NotFoundException cuando una orden no exista, en lugar de dejar que la aplicación falle con un error interno. Finalmente, agregaría tipado fuerte y una estructura clara para la entidad, incluyendo campos como id, status, createdAt y updatedAt, lo que permitiría tener un sistema más mantenible, testeable y preparado para crecer.
