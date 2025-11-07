require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const jwt = require('jsonwebtoken');
const app = express();

const funcionarioController = require('./controlador/funcionarioController');
const aprendizController = require('./controlador/aprendizController');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(cors());
app.use(bodyParser());
app.use(express.static('vista'));

// Middleware simple de autenticación (extraer token)
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, error: 'No autorizado' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Token inválido' });
  }
}

// Middleware para verificar rol funcionario (rol_id == 1)
function funcionarioOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ ok: false, error: 'No autorizado' });
  if (req.user.rol_id !== 1) return res.status(403).json({ ok: false, error: 'Se necesita rol funcionario' });
  next();
}

// Rutas - Funcionario (CRUD) - protegidas con auth + rol
app.post('/api/funcionario/aprendices', authMiddleware, funcionarioOnly, funcionarioController.crearAprendiz);
app.get('/api/funcionario/aprendices', authMiddleware, funcionarioOnly, funcionarioController.listarAprendices);
app.put('/api/funcionario/aprendices/:id', authMiddleware, funcionarioOnly, funcionarioController.actualizarAprendiz);
app.delete('/api/funcionario/aprendices/:id', authMiddleware, funcionarioOnly, funcionarioController.eliminarAprendiz);

// Rutas CRUD Horarios - protegidas
app.post('/api/funcionario/horarios', authMiddleware, funcionarioOnly, funcionarioController.crearHorario);
app.get('/api/funcionario/horarios', authMiddleware, funcionarioOnly, funcionarioController.listarHorarios);
app.put('/api/funcionario/horarios/:id', authMiddleware, funcionarioOnly, funcionarioController.actualizarHorario);
app.delete('/api/funcionario/horarios/:id', authMiddleware, funcionarioOnly, funcionarioController.eliminarHorario);

// Rutas - Aprendiz
app.post('/api/aprendiz/login', aprendizController.login);
app.get('/api/aprendiz/mis-horarios', authMiddleware, aprendizController.misHorarios);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Servidor corriendo en http://localhost:' + port));
