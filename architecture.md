## Diseño de Arquitectura

### 1) ¿Cómo escalaría esta API para soportar 1000 requests por segundo?

> **R:**  
> Para escalar esta API y soportar 1000 requests por segundo, se pueden implementar varias estrategias. Primero, se puede utilizar un balanceador de carga para distribuir las solicitudes entre múltiples instancias de la aplicación, lo que permite escalar horizontalmente, repartir el tráfico y evitar que una sola instancia se convierta en un cuello de botella. Además, se puede implementar caching para reducir la carga en la base de datos y mejorar el rendimiento. También es importante optimizar las consultas a la base de datos y utilizar índices adecuados para acelerar el acceso a los datos. Finalmente, se puede considerar el uso de microservicios para dividir la aplicación en componentes más pequeños y escalables, lo que facilita la gestión y el mantenimiento a medida que la aplicación crece. Además, se puede plantear la idea de utilizar Fastify en lugar de Express, ya que es un framework más rápido y eficiente para manejar un gran volumen de solicitudes, lo que podría ayudar a alcanzar el objetivo de 1000 requests por segundo. Sin embargo, esto requeriría una adaptación significativa del código existente, por lo que se debe evaluar cuidadosamente si los beneficios superan los costos en términos de tiempo y recursos.

---

### 2) ¿Qué cambios haría si el sistema creciera a millones de tareas?

> **R:**  
> En caso de que el sistema creciera a millones de tareas, no sólo sería un cambio en la API, sino que tambien un cambio en el modelo de los datos. Lo primero sería realizar páginación en las consultas, idealmente cursor-based, para que no se tenga que cargar toda la tabla en memoria. Además, se podrían implementar índices (tal cual como está ahora mismo), en las prinicipales columnas de busqueda, para acelerar las consultas. Tambíen se podría considerar la idea de dividir la tabla de tareas en particiones, por ejemplo por fecha de creación. A nivel de API, se podrían agregar filtros para permitir a los usuarios buscar tareas específicas sin necesidad de cargar todas las tareas en memoria. Se podría considerar la migración a microservicios, dividiendo la aplicación en componentes más pequeños y escalables, lo que facilitaría la gestión y el mantenimiento a medida que la aplicación crece. Además, se podría considerar el uso de una base de datos NoSQL para manejar grandes volúmenes de datos, aunque esto dependería de los requisitos específicos del proyecto y de cómo se estructuran los datos.

---

### 3) ¿Cómo implementaría autenticación JWT en este sistema?

> **R:**  
> Lo haría utilizando un AuthModule separado, tendría un endpoint de login que recibiría las credenciales del usuario, y validaría esas credenciales para firmar un token JWT con una clave secreta. Luego, implementaría un Guard que se encargaría de verificar la validez del token en cada solicitud protegida, extrayendo el token del encabezado de autorización y validándolo antes de permitir el acceso a los recursos protegidos. Además, se podrían agregar roles y permisos al token para implementar autorización basada en roles, lo que permitiría controlar el acceso a diferentes partes de la API según el rol del usuario. También se podría considerar la implementación de refresh tokens para mejorar la seguridad y la experiencia del usuario, permitiendo renovar el token JWT sin necesidad de volver a ingresar las credenciales.

---

### 4) ¿Cómo manejaría procesamiento asincrónico para tareas pesadas?

> **R:**  
> Por un lado, se podría utilizar un sistema de colas, como RabbitMQ o Redis, para manejar las tareas pesadas de manera asincrónica. Esto permitiría que la API responda rápidamente a las solicitudes del usuario, mientras que las tareas pesadas se procesan en segundo plano. Se podría implementar un Worker que escuche la cola y procese las tareas a medida que llegan, lo que ayudaría a distribuir la carga y mejorar el rendimiento. Además, se podrían utilizar herramientas como Bull o Agenda para gestionar las colas y los trabajos de manera eficiente. También para este caso, el hecho de tener microservicios podría ser beneficioso, ya que se podría tener un servicio dedicado exclusivamente al procesamiento de tareas pesadas, lo que permitiría escalar ese servicio de manera independiente según sea necesario. Esto ayudaría a mantener la API principal ligera y rápida, mientras que las tareas pesadas se manejan de manera eficiente en segundo plano.
