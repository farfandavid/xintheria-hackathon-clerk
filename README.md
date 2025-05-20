# XINTHERIA

[Demo](https://xintheria-hackathon-clerk.onrender.com) • [Repositorio](https://github.com/farfandavid/xintheria-hackathon-clerk)

## Capturas de pantalla

A continuación se muestran algunas capturas de pantalla de la aplicación:

![Pantalla de inicio](https://raw.githubusercontent.com/farfandavid/xintheria-hackathon-clerk/main/screenshot/inicio.png)
![app_inicio](https://raw.githubusercontent.com/farfandavid/xintheria-hackathon-clerk/main/screenshot/app_inicio.png)
![Editor](https://raw.githubusercontent.com/farfandavid/xintheria-hackathon-clerk/main/screenshot/editor.png)
![Preview](https://raw.githubusercontent.com/farfandavid/xintheria-hackathon-clerk/main/screenshot/preview.png)

## Descripcion del proyecto

Esta aplicación web permite a los usuarios autenticados generar páginas HTML, CSS y JS utilizando la inteligencia artificial de Gemini. Los usuarios pueden interactuar con la IA para recibir tanto mensajes como páginas web completas, facilitando la creación rápida de prototipos y diseños simples. La autenticación y gestión de usuarios se realiza con Clerk, asegurando acceso seguro y personalizado a cada proyecto y conversación.

## Uso de Clerk

Clerk se integra en la aplicación para gestionar la autenticación y el ciclo de vida de los usuarios. A continuación se explica cómo se utiliza en los principales archivos:

### En `src/middleware.ts`

Se utiliza el middleware de Clerk para proteger rutas como `/app`, asegurando que solo usuarios autenticados puedan acceder. Si un usuario no está autenticado, se le redirige a la página de inicio de sesión (`/signin`). Además, al autenticarse, se crea el usuario en la base de datos si no existe.

### En `src/pages/signin.astro` y `src/pages/signup.astro`

Estas páginas muestran los formularios de inicio de sesión y registro usando el componente `<ClerkForm>`. Si el usuario ya está autenticado, se le redirige automáticamente a `/app`.

### En `src/pages/api`

Los endpoints de la API pueden acceder a la información del usuario autenticado a través de Clerk, permitiendo asociar acciones y datos (como proyectos o mensajes) al usuario correspondiente de forma segura.

# Estructura de Base de Datos para User, Project y Message

## Tabla users

| Campo | Tipo   | Descripción           |
| ----- | ------ | --------------------- |
| id    | STRING | ID Generado por Clerk |

## Tabla projects

| Campo      | Tipo     | Descripción              | Relación      |
| ---------- | -------- | ------------------------ | ------------- |
| id         | STRING   | Clave primaria (UUID)    |               |
| name       | STRING   | Nombre del proyecto      |               |
| user_id    | STRING   | Clave foránea → users.id | N:1 con users |
| created_at | DATETIME | Fecha de creación        |               |
| updated_at | DATETIME | Fecha de actualización   |               |

## Tabla messages

| Campo      | Tipo   | Descripción                 | Relación         |
| ---------- | ------ | --------------------------- | ---------------- |
| id         | STRING | Clave primaria (UUID)       |                  |
| role       | STRING | Rol ("user", "assistant")   |                  |
| text       | TEXT   | Contenido del mensaje       |                  |
| images_url | TEXT   | URLs de imágenes            |                  |
| project_id | STRING | Clave foránea → projects.id | N:1 con projects |
