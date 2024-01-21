FROM node:14

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar la aplicación
COPY . .

# Exponer el puerto
EXPOSE 4000

# Agregamos wait-for-it y esperar a que MySQL esté listo antes de iniciar la aplicación
RUN wget https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh -O /usr/local/bin/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

# Renombrar el archivo de entorno durante la construcción
RUN mv .env.production .env

# CMD actualizado para esperar a MySQL y luego iniciar la aplicación
CMD ["wait-for-it.sh", "mysql-db:3306", "--timeout=60", "--", "npm", "start"]
