const pool = require('./db');

const Usuario = {
  async crear({ nombre, correo, password, rol_id }) {
    const q = `INSERT INTO usuarios (nombre, correo, password, rol_id) VALUES ($1,$2,$3,$4) RETURNING id,nombre,correo,rol_id`;
    const { rows } = await pool.query(q, [nombre, correo, password, rol_id]);
    return rows[0];
  },

  async buscarPorCorreo(correo) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE correo=$1', [correo]);
    return rows[0];
  },

  async listarPorRol(rol_nombre) {
    const q = `SELECT u.id,u.nombre,u.correo,r.nombre AS rol FROM usuarios u JOIN roles r ON u.rol_id=r.id WHERE r.nombre=$1`;
    const { rows } = await pool.query(q, [rol_nombre]);
    return rows;
  },

  async obtenerPorId(id) {
    const { rows } = await pool.query('SELECT id,nombre,correo,rol_id FROM usuarios WHERE id=$1', [id]);
    return rows[0];
  }
};

module.exports = Usuario;
