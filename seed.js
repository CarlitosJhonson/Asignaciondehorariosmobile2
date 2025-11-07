const pool = require('./modelo/db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // Ensure roles exist
    await pool.query("INSERT INTO roles (nombre) VALUES ('funcionario') ON CONFLICT (nombre) DO NOTHING;");
    await pool.query("INSERT INTO roles (nombre) VALUES ('aprendiz') ON CONFLICT (nombre) DO NOTHING;");

    const correo = 'admin@ejemplo.com';
    const nombre = 'Administrador';
    const plain = 'admin123';

    const { rows } = await pool.query('SELECT * FROM usuarios WHERE correo=$1', [correo]);
    if (rows.length > 0) {
      console.log('Usuario admin ya existe. Saltando...');
      process.exit(0);
    }

    const hash = await bcrypt.hash(plain, 10);

    // obtener id de rol funcionario
    const r = await pool.query("SELECT id FROM roles WHERE nombre='funcionario' LIMIT 1");
    const rol_id = r.rows[0].id;

    await pool.query('INSERT INTO usuarios (nombre, correo, password, rol_id) VALUES ($1,$2,$3,$4)', [nombre, correo, hash, rol_id]);
    console.log('Admin creado: correo=' + correo + ' contraseña=' + plain);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
