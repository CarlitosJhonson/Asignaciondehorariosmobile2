const Usuario = require('../modelo/usuarioModel');
const Horario = require('../modelo/horarioModel');
const bcrypt = require('bcrypt');
const pool = require('../modelo/db');

module.exports = {
  async crearAprendiz(req, res) {
    try {
      const { nombre, correo, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const nuevo = await Usuario.crear({ nombre, correo, password: hash, rol_id: 2 });
      res.status(201).json({ ok: true, usuario: nuevo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al crear aprendiz' });
    }
  },

  async listarAprendices(req, res) {
    try {
      const aprendices = await Usuario.listarPorRol('aprendiz');
      res.json({ ok: true, aprendices });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false });
    }
  },

  async actualizarAprendiz(req, res) {
    try {
      const { id } = req.params;
      const { nombre, correo, password } = req.body;
      let campos = [];
      let valores = [];
      if (nombre) { campos.push('nombre'); valores.push(nombre); }
      if (correo) { campos.push('correo'); valores.push(correo); }
      if (password) {
        const hash = await bcrypt.hash(password, 10);
        campos.push('password'); valores.push(hash);
      }
      if (campos.length === 0) return res.status(400).json({ ok: false, error: 'Nada para actualizar' });

      const setStr = campos.map((c, i) => `${c}=$${i + 1}`).join(', ');
      valores.push(id);

      const { rows } = await pool.query(`UPDATE usuarios SET ${setStr} WHERE id=$${valores.length} RETURNING id,nombre,correo,rol_id`, valores);
      res.json({ ok: true, usuario: rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al actualizar aprendiz' });
    }
  },

  async eliminarAprendiz(req, res) {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);
      res.json({ ok: true, msg: 'Aprendiz eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al eliminar aprendiz' });
    }
  },

  async crearHorario(req, res) {
    try {
      const { aprendiz_id, dia, hora_inicio, hora_fin, materia } = req.body;
      const horario = await Horario.crear({ aprendiz_id, dia, hora_inicio, hora_fin, materia });
      res.status(201).json({ ok: true, horario });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al crear horario' });
    }
  },

  async listarHorarios(req, res) {
    try {
      const horarios = await Horario.listarTodos();
      res.json({ ok: true, horarios });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al listar horarios' });
    }
  },

  async actualizarHorario(req, res) {
    try {
      const { id } = req.params;
      const campos = {};
      const { dia, hora_inicio, hora_fin, materia } = req.body;
      if (dia) campos.dia = dia;
      if (hora_inicio) campos.hora_inicio = hora_inicio;
      if (hora_fin) campos.hora_fin = hora_fin;
      if (materia) campos.materia = materia;

      if (Object.keys(campos).length === 0) return res.status(400).json({ ok: false, error: 'Nada para actualizar' });

      const horario = await Horario.actualizar(id, campos);
      res.json({ ok: true, horario });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al actualizar horario' });
    }
  },

  async eliminarHorario(req, res) {
    try {
      const { id } = req.params;
      await Horario.eliminar(id);
      res.json({ ok: true, msg: 'Horario eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error al eliminar horario' });
    }
  }
};
