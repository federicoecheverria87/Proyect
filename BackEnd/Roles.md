# Acceso a endpoints por rol

Base URL: `http://localhost:3000`

La tabla refleja los middlewares configurados en el backend. 
**Sí** significa que la solicitud puede acceder a la ruta
**No (401)** indica que requiere autenticación 
**No (403)** que requiere rol Admin. 
Las rutas protegidas requieren un encabezado `Authorization` con esquema Bearer y el token vigente. El token se emite al iniciar sesión y vence en una hora.

| Endpoint                                                                   | Sin loguearse | Logueado Admin | Logueado User |
|----------------------------------------------------------------------------|---------------|----------------|---------------|
| **Autenticación**                                                          |               |                |               |
| `POST /auth/login` — iniciar sesión                                        | Sí            | Sí             | Sí            |
| **Usuarios**                                                               |               |                |               |
| `POST /users/register` — registrar usuario                                 | Sí            | Sí             | Sí            |
| `GET /users/my` — consultar el propio perfil                               | No (401)      | Sí             | Sí            |
| `PUT /users/my` — actualizar el propio perfil (el rol no se modifica)      | No (401)      | Sí             | Sí            |
| `GET /users` — listar usuarios activos                                     | No (401)      | Sí             | No (403)      |
| `GET /users/inactive` — listar usuarios inactivos                          | No (401)      | Sí             | No (403)      |
| `GET /users/:id` — consultar un usuario                                    | No (401)      | Sí             | No (403)      |
| NO HABILITADO — `POST /users` — crear usuario                              | No (401)      | Sí             | No (403)      |
| `PUT /users/:id` — modificar usuario, incluido su rol                      | No (401)      | Sí             | No (403)      |
| `DELETE /users/:id` — desactivar usuario                                   | No (401)      | Sí             | No (403)      |
| **Categorías**                                                             |               |                |               |
| `GET /categories` — listar categorías                                      | No (401)      | Sí             | Sí            |
| `GET /categories/:id` — consultar una categoría                            | No (401)      | Sí             | Sí            |
| `POST /categories` — crear categoría                                       | No (401)      | Sí             | No (403)      |
| `PUT /categories/:id` — modificar categoría                                | No (401)      | Sí             | No (403)      |
| `DELETE /categories/:id` — desactivar categoría                            | No (401)      | Sí             | No (403)      |
| **Productos**                                                              |               |                |               |
| `GET /products` — listar productos                                         | No (401)      | Sí             | Sí            |
| `GET /products/:id` — consultar un producto                                | No (401)      | Sí             | Sí            |
| `POST /products` — crear producto                                          | No (401)      | Sí             | No (403)      |
| `PUT /products/:id` — modificar producto                                   | No (401)      | Sí             | No (403)      |
| `DELETE /products/:id` — desactivar producto                               | No (401)      | Sí             | No (403)      |
| **Archivos estáticos**                                                     |               |                |               |
| `GET /uploads/:archivo` — obtener una imagen o archivo cargado (si existe) | Sí            | Sí             | Sí            |

## Consideraciones

- Los endpoints de registro e inicio de sesión son públicos; el registro asigna el rol `User`.
- El perfil `/users/my` identifica al usuario mediante el token, por lo que un usuario no puede elegir el ID de otra cuenta para estas operaciones.
- El acceso a los archivos en `/uploads` es público: conocer la URL del archivo alcanza para solicitarlo.
- Las rutas con `:id` requieren un ID válido. La tabla describe autorización; no garantiza que el recurso exista ni que los datos enviados sean válidos.
