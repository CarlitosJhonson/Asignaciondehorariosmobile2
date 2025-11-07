const Horario = require('../modelo/horarioModel');
const Usuario = require('../modelo/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = {
  async login(req, res) {
    try {
      const { correo, password } = req.body;
      const user = await Usuario.buscarPorCorreo(correo);
      if (!user) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

      const token = jwt.sign({ id: user.id, rol_id: user.rol_id }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ ok: true, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false });
    }
  },

  async misHorarios(req, res) {
    try {
      const aprendiz_id = req.user.id; // middleware debe haber colocado req.user
      const lista = await Horario.listarPorAprendiz(aprendiz_id);
      res.json({ ok: true, horarios: lista });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false });
    }
  }
};
