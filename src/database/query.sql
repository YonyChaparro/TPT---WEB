CREATE DATABASE Prueba01;

USE Prueba01;

DROP TABLE IF EXISTS personas;

CREATE TABLE personas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    age INT,
    Per_telefono VARCHAR(15) UNIQUE NOT NULL,
    Per_email VARCHAR(100) UNIQUE NOT NULL,
    Per_direccion VARCHAR(100) UNIQUE NOT NULL,
    Per_tipo ENUM('Natural', 'Juridica'),
    Per_tipo_identificacion ENUM('CC', 'NIP','NUIP', 'TI', 'CE')
);

SELECT * FROM personas;