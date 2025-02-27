CREATE DATABASE Prueba01;

USE Prueba01;

DROP TABLE IF EXISTS personas;


CREATE TABLE personas(
    Per_id INT PRIMARY KEY,
    Per_nombre VARCHAR(50) NOT NULL,
    Per_telefono VARCHAR(15) UNIQUE NOT NULL,
    Per_email VARCHAR(100) UNIQUE NOT NULL,
    Per_direccion VARCHAR(100) UNIQUE NOT NULL,
    Per_tipo ENUM('Natural', 'Juridica'),
    Per_tipo_identificacion ENUM('CC', 'NIP','NUIP', 'TI', 'CE')
);


DROP TABLE IF EXISTS Cliente;
CREATE TABLE Cliente (
    Cli_id INT AUTO_INCREMENT PRIMARY KEY,
    Cli_per_id INT,
    FOREIGN KEY (Cli_per_id) REFERENCES personas(Per_id) ON DELETE CASCADE
);

SELECT * FROM personas;

-- CREATE TABLE Persona (
--     Per_id INT PRIMARY KEY,
--     Per_nombre VARCHAR(100) NOT NULL,
--     Per_telefono VARCHAR(15) UNIQUE NOT NULL,
--     Per_email VARCHAR(100) UNIQUE NOT NULL,
--     Per_direccion VARCHAR(100) UNIQUE NOT NULL,
--     Per_tipo ENUM('Natural', 'Jurídica') NOT NULL,
--     Per_tipo_identificacion ENUM('CC', 'NIP','NUIP', 'TI', 'CE') NOT NULL
-- );