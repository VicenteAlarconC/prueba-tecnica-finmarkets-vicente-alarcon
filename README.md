# Tasks API - NestJS + PostgreSQL

API REST para gestión de tareas desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**.

La entidad `Task` incluye los siguientes campos:

- `id`
- `title`
- `description`
- `status` (`pending | in_progress | done`)
- `priority` (`low | medium | high`)
- `createdAt`
- `updatedAt`

---

## 1. Clonar el repositorio e instalar dependencias

Primero clone el proyecto e instale las dependencias necesarias:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
npm install
```

## 2. Crear un archivo `.env`

Cree un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
PORT= # Puerto en el que correrá la API
DB_HOST= # Host de la base de datos PostgreSQL
DB_PORT= # Puerto de la base de datos PostgreSQL
DB_USER= # Usuario de la base de datos PostgreSQL
DB_PASSWORD= # Contraseña de la base de datos PostgreSQL
DB_NAME= # Nombre de la base de datos PostgreSQL
```

Asegurar de completar los valores con la configuración de tu entorno local.

## 3. (OPCIONAL) Usar Docker para PostgreSQL

Si no se tiene PostgreSQL instalado, puede usar Docker para levantar una instancia rápidamente:

```bash
docker compose up -d
```

Esto levantará un contenedor con PostgreSQL configurado según el archivo `docker-compose.yml`.

## 4. Ejecutar la aplicación

Finalmente, ejecute la aplicación con el siguiente comando:

```bash
npm run start
```

La API estará disponible en `http://localhost:3000` por defecto, pero puedes cambiar el puerto en el archivo `.env`.

## 5. Ejecutar pruebas en Jest y con Postman

Para ejecutar las pruebas unitarias con Jest, usa el siguiente comando:

```bash
npm run test
```
Para ejecutar las pruebas de integración con Postman, se puede importar la colección de Postman incluida en el proyecto y ejecutar las solicitudes definidas para verificar el correcto funcionamiento de la API.

## (OPCIONAL) Utilizar Docker para la aplicación
Si desea ejecutar la aplicación dentro de un contenedor Docker, puedes usar el siguiente comando:

```bash
docker compose -f docker-compose.app.yaml up -d
```
Esto levantará tanto la base de datos PostgreSQL como la aplicación NestJS en contenedores separados, configurados para comunicarse entre sí. Hay que asegurarse de que los puertos y las variables de entorno estén correctamente configurados en el archivo `docker-compose.app.yaml` para que la aplicación pueda conectarse a la base de datos.