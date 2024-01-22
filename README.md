
# Documentación de Endpoints - Proyecto de Tickets

## Descripción del Proyecto

Este proyecto de tickets proporciona una API para gestionar usuarios y tickets. Los usuarios pueden ser creados y consultados, y los tickets pueden ser creados, consultados, actualizados y eliminados. Los tickets están asociados a un usuario y tienen un estado que puede ser "abierto" o "cerrado". La información de los tickets se puede obtener de manera paginada, proporcionando detalles sobre el número total de tickets y el número de páginas disponibles.

### Pasos para Usar Localmente

1. Instalación de Dependencias

Asegúrate de tener Node.js instalado en tu máquina (https://nodejs.org/en). Luego, ejecuta el siguiente comando para instalar las dependencias del proyecto:

```console
  npm install
```
Si el anterior comando puso problemas por versionamiento de dependecias, ejecutar este otro comando:

```console
  npm install --force
```

2. Configuración de Variables de Entorno

Crea un archivo llamado .env en la raíz del proyecto con la siguiente estructura:

```console
  HOST=localhost
  PORTDB=3306
  USERDB=partners_user
  PASSWORD=password-v-parterns
  DATABASE=partners_db
```

3. Creación de la Base de Datos

para crear la base de matos de manera local debemos tener instalado docker en este, luego corremos el siguiente comando para correr la imagen de mysql:

```console
  docker compose up mysql-db
```

4. Ya luego de que nuestra base de datos este corriendo de manera efectiva, tenemos dos opciones para correr la aplicacion, una con una imagen de la aplicacion y otra con el proyecto en local, para correr el proyecto con docker ejecutamos el siguiente comando:

```console
  npm run deploy
```

este se encargara de subir la imagen tanto de mysql como la del proyecto en si, luego si queremos correr el proyecto en modo de desarrollo simplemente escribimos el siguiente comando:

```console
  npm start
```

## Usuarios

### Crear Usuario

Endpoint: POST /users

Descripción: Crea un nuevo usuario.

Parámetros:

- name (string): Nombre del usuario.

#### Ejemplo de Solicitud:

```json
{
"name": "EjemploUsuario"
}
```

#### Ejemplo de Respuesta Exitosa:

  ```json
{
	"ok": true,
	"user": {
	"id": 1,
	"name": "EjemploUsuario"
	}
}
```

### Obtener Usuarios

Endpoint: GET /users

Descripción: Obtiene la lista de todos los usuarios.

Parámetros:

- No requiere parámetros.

#### Ejemplo de Respuesta Exitosa:

  ```json
{

"ok": true,

"results": [
{
"id": 1,
"name": "Usuario1"
},
{
"id": 2,
"name": "Usuario2"
}
// ... más usuarios
]
}
```
  
## Tickets

### Crear Ticket

Endpoint: POST /tickets

Descripción: Crea un nuevo ticket (Importante primero crear un usuario para colocar un id existente).

Parámetros:

- user (number): ID del usuario asociado al ticket.

- status (string): Estado del ticket.

#### Ejemplo de Solicitud:

  ```json
{
"user": 1,
"status": "OPEN" | "CLOSE"
}
```


#### Ejemplo de Respuesta Exitosa:
  ```json
{
"ok": true,
"ticket": {
"id": 1,
"user": {
"id": 1,
"name": "Usuario1"
},
"status": "abierto",
"dateCreate": "2024-01-20T12:00:00Z",
"dateUpdate": "2024-01-20T12:00:00Z"
}
}
```

### Obtener Tickets

Endpoint: GET /tickets

Descripción: Obtiene la lista de tickets paginada con información adicional.

Parámetros:  

- page (number): Número de página (opcional, por defecto es 1).

- filter (string): Filtro para búsqueda (opcional, por defecto es '').

- limit (number): Número de tickets por página (opcional, por defecto es 10).

#### Ejemplo de Respuesta Exitosa:

   ```json
{
"ok": true,
"results": [
{
"id": 1,
"user": {
"id": 1,
"name": "Usuario1"
},
"status": "abierto",
"dateCreate": "2024-01-20T12:00:00Z",
"dateUpdate": "2024-01-20T12:00:00Z"
},
{
"id": 2,
"user": {
"id": 2,
"name": "Usuario2"
},
"status": "cerrado",
"dateCreate": "2024-01-20T13:00:00Z",
"dateUpdate": "2024-01-20T14:30:00Z"
}
// ... más tickets
],
"info": {
"count": 20,
"pages": 2,
"currentPage": 1
}
}
```

### Actualizar Ticket

Endpoint: PUT /tickets/:id

Descripción: Actualiza el estado de un ticket.

Parámetros:

- id (number): ID del ticket que se va a actualizar.

- status (string): Nuevo estado del ticket.

#### Ejemplo de Solicitud:

  ```json
{
"status": "OPEN" | "CLOSE"
}
```

#### Ejemplo de Respuesta Exitosa:

   ```json
{
"ok": true,
"ticket": {
"id": 1,
"user": {
"id": 1,
"name": "Usuario1"
},
"status": "cerrado",
"dateCreate": "2024-01-20T12:00:00Z",
"dateUpdate": "2024-01-20T15:00:00Z"
}
}
```

### Eliminar Ticket

Endpoint: DELETE /tickets/:id

Descripción: Elimina un ticket.

Parámetros:


- id (number): ID del ticket que se va a eliminar.

#### Ejemplo de Respuesta Exitosa:

  ```json
{
"ok": true,
"ticket": {
"id": 1,
"user": {
"id": 1,
"name": "Usuario1"
},
"status": "cerrado",
"dateCreate": "2024-01-20T12:00:00Z",
"dateUpdate": "2024-01-20T15:00:00Z"
}
}
```


