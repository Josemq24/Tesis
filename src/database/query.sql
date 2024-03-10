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
    id_paciente VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    sexo VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    creado_en DATE,
    editado_en DATE NULL
);