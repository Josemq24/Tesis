CREATE DATABASE Prueba01;

USE Prueba01;

CREATE TABLE citas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombrePaciente VARCHAR(100) NOT NULL,
    nombreDoctor VARCHAR(100) NOT NULL,
    fecha DATE,
    hora TIME,
    creado_en DATE,
    editado_en DATE
);

SELECT * FROM citas;

CREATE TABLE IF NOT EXISTS users (
    email varchar(100) NOT NULL PRIMARY KEY,
    name varchar(50),
    password varchar(255) NOT NULL
  );