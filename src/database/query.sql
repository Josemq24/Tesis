CREATE DATABASE Prueba01;

USE Prueba01;

CREATE TABLE IF NOT EXISTS citas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente VARCHAR(100) NOT NULL,
    nombre varchar(100) not null,
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
    id_paciente INT auto_increment KEY,
    email VARCHAR(100),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    contrasena VARCHAR(100),
    edad INT,
    sexo VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    creado_en DATE,
    editado_en DATE NULL
);

CREATE TABLE IF NOT EXISTS medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido varchar(100) not null,
    sexo varchar(100) not null,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    email varchar(100) not NULL,
    contrasena varchar(100) not null,
    creado_en DATE,
    editado_en DATE NULL
);

INSERT INTO pacientes (email, nombre, edad, sexo, telefono, fecha_nacimiento, direccion, creado_en) VALUES ( 'usuario@usuario.com','Joselinho', '25', 'Masculino', '1234567890', '1996-01-01', 'Calle 123', '2021-01-01');

Insert INTO medicos (nombre, apellido, especialidad, telefono, direccion, email, creado_en, sexo, contrasena) VALUES ('Miguel','Quintero', 'Traumatologo', '1234567890', 'Calle 123', 'Miguel@cdlj.com', '2021-01-01', 'Hombre', '123');
Insert INTO medicos (nombre, apellido, especialidad, telefono, direccion, email, creado_en, sexo, contrasena) VALUES ('Rafael','Parraga', 'Cirujano', '987654321', 'Calle 321', 'Rafael@cdlj.com', '2021-01-01', 'Hombre', '123');
Insert INTO medicos (nombre, apellido, especialidad, telefono, direccion, email, creado_en, sexo, contrasena) VALUES ('Maria','Perez', 'Pediatra', '2244667799', 'Calle 123', 'Maria@cdlj.com', '2021-01-01', 'Mujer', '123');

SELECT * FROM pacientes where email = "usuario@usuario.com";