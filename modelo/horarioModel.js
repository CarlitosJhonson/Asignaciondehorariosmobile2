const pool = require('./db');

const Horario = {
  async crear({ aprendiz_id, dia, hora_inicio, hora_fin, materia }) {
    const q = `INSERT INTO horarios (aprendiz_id,dia,hora_inicio,hora_fin,materia) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const { rows } = await pool.query(q, [aprendiz_id, dia, hora_inicio, hora_fin, materia]);
    return rows[0];
  },

  async listarPorAprendiz(aprendiz_id) {
    const { rows } = await pool.query('SELECT * FROM horarios WHERE aprendiz_id=$1 ORDER BY dia,hora_inicio', [aprendiz_id]);
    return rows;
  },

  async listarTodos() {
    const { rows } = await pool.query('SELECT * FROM horarios ORDER BY dia,hora_inicio');
    return rows;
  },

  async obtenerPorId(id) {
    const { rows } = await pool.query('SELECT * FROM horarios WHERE id=$1', [id]);
    return rows[0];
  },

  async actualizar(id, camposObj) {
    const campos = Object.keys(camposObj);
    const valores = Object.values(camposObj);
    if (campos.length === 0) return null;
    const setStr = campos.map((c,i)=>`${c}=$${i+1}`).join(', ');
    valores.push(id);
    const q = `UPDATE horarios SET ${setStr} WHERE id=$${valores.length} RETURNING *`;
    const { rows } = await pool.query(q, valores);
    return rows[0];
  },

  async eliminar(id) {
    await pool.query('DELETE FROM horarios WHERE id=$1', [id]);
    return true;
  }
};

module.exports = Horario;
