# Proyecto: Asignación de Horarios (ADSO)

## Resumen
Proyecto sencillo en Node.js + Express + PostgreSQL con estructura MVC (modelo, vista, controlador). Permite:
- Registrar aprendices (por funcionario)
- CRUD de aprendices y horarios (funcionario)
- Login para aprendices y consulta de sus horarios
- Vista mobile estática en `vista/`

## Estructura
```
basedatos/
controlador/
modelo/
vista/
  css/
  js/
sql/
servidor.js
package.json
.env.example
README.md
```

## Archivos importantes y para qué sirven
- `servidor.js`: arranca el servidor Express, define rutas y middlewares de autenticación.
- `modelo/db.js`: configuración del pool de conexión con PostgreSQL.
- `modelo/usuarioModel.js`: funciones para manejar usuarios en la BD.
- `modelo/horarioModel.js`: funciones para manejar horarios en la BD.
- `controlador/funcionarioController.js`: endpoints CRUD para aprendices y horarios (requieren token y rol funcionario).
- `controlador/aprendizController.js`: login de aprendiz y consulta de sus horarios.
- `vista/`: archivos estáticos (HTML/CSS/JS) para la vista mobile.
- `sql/create_tables.sql`: script para crear las tablas y datos iniciales.
- `.env.example`: variables de entorno para conectar a la BD.

## Pasos para ejecutar (paso a paso)
1. **Instalar PostgreSQL** y crear una base de datos llamada `asignacion_horarios` (o cambiar nombre en `.env`).
2. Copiar `.env.example` a `.env` y completar tus credenciales.
3. Ejecutar el script SQL para crear tablas:
   - Con psql: `psql -U tu_usuario -d asignacion_horarios -f sql/create_tables.sql`
4. Instalar dependencias:
   - `npm install`
5. Ejecutar el servidor:
   - `npm run dev` (si tienes nodemon) o `npm start`
6. Abrir la vista en el navegador: `http://localhost:3000`

## Notas sobre autenticación
- El login genera un JWT que contiene `id` y `rol_id`.
- Las rutas de `funcionario` están protegidas por `authMiddleware` y `funcionarioOnly`.
- Para crear un usuario funcionario manualmente, puedes insertar un usuario en la tabla `usuarios` con `rol_id=1` (usa bcrypt para hashear la contraseña si lo haces manualmente).

## Ejemplo rápido para insertar un funcionario (psql)
1. Genera hash de contraseña en Node REPL:
   ```js
   const bcrypt = require('bcrypt'); bcrypt.hash('tu_pass',10).then(console.log)
   ```
2. Inserta en la BD (reemplaza el hash):
   ```sql
   INSERT INTO usuarios (nombre, correo, password, rol_id) VALUES ('Funcionario1','func@ejemplo.com','<hash_aqui>',1);
   ```

## ¿Quieres que haga esto por ti?
Puedo:
- Crear un ZIP descargable con todos los archivos (ya generado aquí).
- Añadir una interfaz administrativa para funcionarios.
- Crear scripts de seed para usuarios (admin) con contraseña segura.


## Seed y Panel administrativo

- `seed.js`: crea un usuario funcionario (admin@ejemplo.com / admin123) de forma idempotente.
- Para correrlo: `node seed.js` después de crear la BD y ejecutar `sql/create_tables.sql`.
- Panel funcionario: abrir `http://localhost:3000/admin.html` y autenticar con el usuario admin.
# Asignaciondehorariosmobile2
