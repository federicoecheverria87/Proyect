# Tech Store - Frontend

Frontend de la tienda en línea Tech Store, desarrollado con HTML, CSS y JavaScript en módulos. 
Permite registrarse e iniciar sesión, consultar productos y acceder a las secciones de perfil y administración.

## Requisitos

- Node.js y npm
- Backend de Tech Store en ejecución en `http://localhost:3000`

## Instalación y ejecución

Desde una terminal, ubícarse en la carpeta `FrontEnd`:

```bash
npm install
npm start
```

Abre [http://localhost:5500](http://localhost:5500) en el navegador. La página de entrada es `Index.html`.

## Configuración de la API

El frontend se conecta al backend en `http://localhost:3000`. Si el backend utiliza otra dirección, actualiza la constante `URL` en `JavaScript/api/api.js`.


## Usuarios

ADMINS
User: tony.stark@example.com
Pass: ironman

User: bruno.diaz@example.com
Pass: ironman

USERS
User: celia.cruz@example.com
Pass: ironman

User: el.zorro.@example.com
Pass: ironman

## Estructura principal

- `Index.html`: página de bienvenida.
- `Pages/`: páginas de inicio, acceso, registro, productos, categorías, perfil y usuarios.
- `JavaScript/api/`: llamadas a los endpoints del backend.
- `JavaScript/components/`: navegación, sesión, notificaciones y acciones compartidas.
- `JavaScript/pages/`: lógica específica de cada página.
- `Css/`: estilos y colores.
- `Assets/`: imágenes e iconos.

Bootstrap y Font Awesome se cargan desde CDN, por lo que se requiere conexión a internet para esos recursos.
