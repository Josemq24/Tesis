CREATE DATABASE Prueba01;

USE Prueba01;

CREATE TABLE IF NOT EXISTS citas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente VARCHAR(100) NOT NULL,
    id_medico VARCHAR(100) NOT NULL,
    fecha DATE,
    hora TIME,
    creado_en DATE,
    editado_en DATE NULL
);

CREATE TABLE IF NOT EXISTS medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    creado_en DATE,
    editado_en DATE NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    tipo_cuenta VARCHAR(100) NOT NULL,
    created_at DATE,
    updated_at DATE NULL
);

CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente INT auto_increment KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    sexo VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    creado_en DATE,
    editado_en DATE NULL
);

CREATE TABLE IF NOT EXISTS horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_medico VARCHAR(100) NOT NULL,
    fecha DATE,
    initial_date TIME,
    final_date TIME,
    cosnultorio VARCHAR(100),
    creado_en DATE,
    editado_en DATE NULL
);

INSERT INTO pacientes (nombre, edad, sexo, telefono, fecha_nacimiento, direccion, creado_en) VALUES ( 'Joselinho', '25', 'Masculino', '1234567890', '1996-01-01', 'Calle 123', '2021-01-01');

Insert INTO medicos (id_medico, nombre, especialidad, telefono, direccion, creado_en) VALUES ('1', 'Dr. Juan Perez', 'Cirujano', '1234567890', 'Calle 123', '2021-01-01');