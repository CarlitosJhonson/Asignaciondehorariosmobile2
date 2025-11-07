-- DB: asignacion_horarios
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE -- 'funcionario', 'aprendiz'
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  rol_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
  creado TIMESTAMP DEFAULT now()
);

CREATE TABLE horarios (
  id SERIAL PRIMARY KEY,
  aprendiz_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  dia VARCHAR(30) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  materia VARCHAR(150),
  creado TIMESTAMP DEFAULT now()
);

-- Datos iniciales
INSERT INTO roles (nombre) VALUES ('funcionario'), ('aprendiz');
