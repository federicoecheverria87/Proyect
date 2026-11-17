# Tech Store - Backend

API REST para la tienda Tech Store, desarrollada con Node.js, Express y MySQL.

## Requisitos

- Node.js y npm.
- MySQL Server.
- La base de datos `Tech_Store`, creada con el script `data_base.sql` ubicado en la raíz del proyecto.

## Instalación y configuración

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd BackEnd
npm install
```

Antes de iniciar la API, crea e inicializa la base de datos. Desde la raíz del proyecto, puedes ejecutar el script con el cliente de MySQL:

```bash
mysql -u root -p < data_base.sql
```

También puedes abrir y ejecutar `data_base.sql` desde MySQL Workbench. El script crea `Tech_Store`, sus tablas (`Users`, `Categories` y `Products`) y registros iniciales.

La conexión a MySQL está configurada en `config/connectionDB.js` y actualmente usa `127.0.0.1`, el usuario `root`, contraseña vacía y la base de datos `Tech_Store`. Si tu instalación usa valores distintos, actualiza allí esos valores antes de iniciar el backend.

## Iniciar el servidor

Desde la carpeta `BackEnd`:

```bash
npm start
```

El servidor escucha en `http://localhost:3000`. El puerto está definido directamente en `app.js`.

## Rutas principales

Todas las rutas de la siguiente tabla están bajo `http://localhost:3000`.

| Método                  | Ruta                                      | Acceso  | Descripción                                            |
|-------------------------|-------------------------------------------|---------|--------------------------------------------------------|
| `POST`                  | `/auth/login`                             | Público | Inicia sesión y devuelve un token.                     |
| `POST`                  | `/users/register`                         | Público | Registra un usuario con rol `User`.                    |
| `GET`, `PUT`            | `/users/my`                               | Token   | Consulta o actualiza el perfil propio.                 |
| `GET`                   | `/users`, `/users/inactive`, `/users/:id` | Admin   | Lista usuarios activos/inactivos o consulta uno.       |
| `PUT`, `DELETE`         | `/users/:id`                              | Admin   | Actualiza o desactiva un usuario.                      |
| `GET`                   | `/categories`, `/categories/:id`          | Token   | Lista o consulta categorías.                           |
| `POST`, `PUT`, `DELETE` | `/categories`, `/categories/:id`          | Admin   | Crea, actualiza o desactiva categorías.                |
| `GET`                   | `/products`, `/products/:id`              | Token   | Lista o consulta productos.                            |
| `POST`, `PUT`, `DELETE` | `/products`, `/products/:id`              | Admin   | Crea, actualiza o desactiva productos.                 |
| `GET`                   | `/uploads/:archivo`                       | Público | Obtiene un archivo disponible en la carpeta de cargas. |

Las rutas protegidas requieren el encabezado:

```http
Authorization: Bearer <token>
```

El inicio de sesión espera un cuerpo JSON con `email` y `password`, por ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "tu-contraseña"
}
```

El token se obtiene al iniciar sesión y vence en una hora. Los endpoints de registro y perfil aceptan datos de formulario; las fotos de usuario usan el campo `photo`. Para crear o actualizar productos, envía `name`, `description`, `price`, `stock` y `categoryId`; al crear también se requiere una imagen en el campo `image`. Para las cargas de archivos utiliza `multipart/form-data`.

Los `DELETE` desactivan el registro, no lo eliminan físicamente. Consulta [Roles.md](./Roles.md) para ver el detalle de permisos por rol.

## Nota de seguridad

El secreto JWT está definido directamente en el código. Antes de desplegar el backend en un entorno compartido o de producción, reemplázalo por un secreto fuerte y mantenlo fuera del repositorio.

## Dependencias

Las dependencias de ejecución se declaran en `package.json`: `express`, `cors`, `mysql2`, `bcrypt`, `jsonwebtoken` y `multer`. No es necesario instalarlas una por una; `npm install` las instala.
