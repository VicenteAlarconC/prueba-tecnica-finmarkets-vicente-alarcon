# --- Etapa de Construcción (Builder Stage) ---
# Usa una imagen base de Node.js con Alpine Linux para un tamaño más pequeño
FROM node:20-alpine AS build 

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app 

# Copia los archivos package*.json y yarn.lock (o package-lock.json) para instalar dependencias
COPY package*.json ./
# Si usas yarn, usa: COPY yarn.lock ./

# Instala las dependencias. Usa --frozen-lockfile con yarn o npm ci para consistencia
RUN npm install 
# Si usas yarn, usa: RUN yarn install --frozen-lockfile 

# Copia el resto del código fuente al directorio de trabajo
COPY . .

# Ejecuta el comando de compilación de NestJS (genera la carpeta dist)
RUN npm run build

# --- Etapa de Producción (Production Stage) ---
# Usa una imagen base más ligera para el entorno de ejecución final
FROM node:20-alpine AS production

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo los archivos necesarios de la etapa de construcción anterior
# Copia los archivos package*.json para instalar solo las dependencias de producción
COPY package*.json ./
# Copia la carpeta dist generada
COPY --from=build /usr/src/app/dist ./dist 

# Instala solo las dependencias de producción (omite las devDependencies)
RUN npm install --omit=dev 
# Si usas yarn, usa: RUN yarn install --production

# Expone el puerto en el que escucha la aplicación NestJS (por defecto es 3000)
EXPOSE 3000

# Define el comando para ejecutar la aplicación
# Usa el archivo main.js dentro de la carpeta dist compilada
CMD ["node", "dist/main.js"]
