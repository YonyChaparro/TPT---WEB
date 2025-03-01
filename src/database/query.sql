CREATE DATABASE Prueba01;

USE Prueba01;

DROP TABLE IF EXISTS Persona;

CREATE TABLE Persona (
    Per_id INT PRIMARY KEY,
    Per_nombre VARCHAR(100) NOT NULL,
    Per_telefono VARCHAR(15) NOT NULL,
    Per_email VARCHAR(100) NOT NULL,
    Per_direccion VARCHAR(100) NOT NULL,
    Per_tipo ENUM('Natural', 'Jurídica') NOT NULL,
    Per_tipo_identificacion ENUM('CC', 'NIP','NUIP', 'TI', 'CE') NOT NULL
);

DROP TABLE IF EXISTS Cliente;
CREATE TABLE Cliente (
    Cli_id INT AUTO_INCREMENT PRIMARY KEY,
    Cli_per_id INT,
    Cli_usuario VARCHAR(100),
    Cli_contrasena VARCHAR(50),
    FOREIGN KEY (Cli_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Empleado;


CREATE TABLE Empleado (
    Emp_id INT AUTO_INCREMENT PRIMARY KEY,
    Emp_per_id INT,
    Emp_puesto VARCHAR(100) NOT NULL,
    Emp_salario DECIMAL(10,2) NOT NULL,
    Emp_fecha_contratacion DATE NOT NULL,
    FOREIGN KEY (Emp_per_id) REFERENCES personas(Per_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Socio;
CREATE TABLE Socio (
    Soc_id INT AUTO_INCREMENT PRIMARY KEY,
    Soc_per_id INT,
    Soc_numero_de_acciones INT NOT NULL,
    FOREIGN KEY (Soc_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS Proveedor;
CREATE TABLE Proveedor (
    Pro_id INT AUTO_INCREMENT PRIMARY KEY,
    Pro_per_id INT,
    Pro_costo_servicio DECIMAL(10,2) NOT NULL,
    Pro_servicio TEXT,
    FOREIGN KEY (Pro_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Tipo_Alquiler;
CREATE TABLE Tipo_Alquiler (
	Tip_Alq_id INT PRIMARY KEY CHECK (Tip_Alq_id IN (1,2)),
    Tip_Alq_nombre ENUM('Estándar', 'Completo') NOT NULL,
    Tip_Alq_costo_por_hora INT NOT NULL
);

DROP TABLE IF EXISTS Tipo_Vehiculo;
CREATE TABLE Tipo_Vehiculo (
	Tip_id INT PRIMARY KEY,
    Tip_nombre VARCHAR(50) NOT NULL,
    Tip_tarifa DECIMAL(4,2) CHECK (Tip_tarifa >= 0),
    Tip_capacidad_carga DECIMAL(6,2) NOT NULL,
    Tip_combustible ENUM('Gasolina', 'Diesel', 'Gas', 'Eléctrico') NOT NULL
);