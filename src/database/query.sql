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
    Tip_tarifa DECIMAL(20,2) CHECK (Tip_tarifa >= 0),
    Tip_capacidad_carga DECIMAL(20,2) NOT NULL,
    Tip_combustible ENUM('Gasolina', 'Diesel', 'Gas', 'Eléctrico') NOT NULL
);

DROP TABLE IF EXISTS Vehiculo;

CREATE TABLE Vehiculo (
    Veh_placa CHAR(6) PRIMARY KEY,
    Veh_cuidad_de_registro VARCHAR(50) NOT NULL,
    Veh_tipo INT NOT NULL,
    Veh_marca VARCHAR(50) NOT NULL,
    Veh_modelo VARCHAR(50) NOT NULL,
    Veh_año YEAR NOT NULL,
    Veh_kilometraje INT CHECK (Veh_kilometraje >= 0) DEFAULT 0,
    Veh_certificado_runt BOOLEAN DEFAULT FALSE,
    Veh_soat_vigencia DATE NOT NULL,
    Veh_soat_vigente BOOLEAN DEFAULT FALSE,
    Veh_rtm_vigencia DATE NOT NULL,
    Veh_rtm_vigente BOOLEAN DEFAULT FALSE,
    Veh_norma_ambiental VARCHAR(50) NOT NULL,
    Veh_gps_instalado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Veh_tipo) REFERENCES Tipo_Vehiculo(Tip_id)
);

-- trigger que actualiza automáticamente su estado al insertar o modificar un vehículo:

DELIMITER //

CREATE TRIGGER before_insert_vehiculo
BEFORE INSERT ON Vehiculo
FOR EACH ROW
BEGIN
    SET NEW.Veh_soat_vigente = (NEW.Veh_soat_vigencia >= CURDATE() AND NEW.Veh_soat_vigencia >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR));
    SET NEW.Veh_rtm_vigente = (NEW.Veh_rtm_vigencia >= CURDATE() AND NEW.Veh_rtm_vigencia >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR));
END;
//

CREATE TRIGGER before_update_vehiculo
BEFORE UPDATE ON Vehiculo
FOR EACH ROW
BEGIN
    SET NEW.Veh_soat_vigente = (NEW.Veh_soat_vigencia >= CURDATE() AND NEW.Veh_soat_vigencia >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR));
    SET NEW.Veh_rtm_vigente = (NEW.Veh_rtm_vigencia >= CURDATE() AND NEW.Veh_rtm_vigencia >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR));
END;
//

DELIMITER ;



-- FIN DE VEHÍCULOS

DROP TABLE IF EXISTS Taller;

CREATE TABLE Taller (
    Tal_id INT AUTO_INCREMENT PRIMARY KEY,
    Tal_nombre VARCHAR(50) NOT NULL,
    Tal_direccion VARCHAR(100) NOT NULL
);



DROP TABLE IF EXISTS Mantenimiento_Vehiculo;
CREATE TABLE Mantenimiento_Vehiculo (
    Man_id INT AUTO_INCREMENT PRIMARY KEY,
    Man_vehiculo_placa CHAR(6) NOT NULL,
    Man_taller INT NOT NULL,
    Man_fecha DATE NOT NULL,
    Man_tipo ENUM('Preventivo', 'Correctivo') NOT NULL,
    Man_kilometraje_actual INT NOT NULL,
    Man_descripcion TEXT NOT NULL,
    Man_costo DECIMAL(10,2) NOT NULL,
    Man_cambio_de_aceite BOOLEAN NOT NULL DEFAULT FALSE,
    Man_cambio_frenos BOOLEAN NOT NULL DEFAULT FALSE,
    Man_alineación_y_balanceo BOOLEAN NOT NULL DEFAULT FALSE,
    Man_revision_sistema_electrico BOOLEAN NOT NULL DEFAULT FALSE,
    Man_revision_neumaticos BOOLEAN NOT NULL DEFAULT FALSE,
    Man_certificacion_ambiental BOOLEAN NOT NULL DEFAULT FALSE,
    Man_certificacion_mecanica BOOLEAN NOT NULL DEFAULT FALSE,
    Man_detalles TEXT,
    Man_estado ENUM('Completado', 'Pendiente', 'En proceso') NOT NULL DEFAULT 'Pendiente',
    Man_fecha_certificacion_ambiental DATE,
    Man_fecha_certificacion_mecanica DATE,
    FOREIGN KEY (Man_vehiculo_placa) REFERENCES Vehiculo(Veh_placa) ON DELETE CASCADE,
    FOREIGN KEY (Man_taller) REFERENCES Taller(Tal_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Alquiler;
CREATE TABLE Alquiler (
	Alq_id INT AUTO_INCREMENT PRIMARY KEY,
    Alq_cliente INT,
    Alq_vehiculo_placa CHAR(6),
    Alq_tipo INT,
    Alq_fecha_inicio DATE NOT NULL,
    Alq_duracion INT NOT NULL,
    Alq_estado ENUM('Activo', 'Finalizado') NOT NULL,
    FOREIGN KEY (Alq_cliente) REFERENCES Cliente(Cli_id) ON DELETE CASCADE,
    FOREIGN KEY (Alq_vehiculo_placa) REFERENCES Vehiculo(Veh_placa) ON DELETE CASCADE,
    FOREIGN KEY (Alq_tipo) REFERENCES Tipo_Alquiler(Tip_Alq_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Factura;
CREATE TABLE Factura (
    Fac_id INT AUTO_INCREMENT PRIMARY KEY,
    Fac_alquiler_id INT,
    Fac_fecha DATE NOT NULL,
    Fac_impuesto DECIMAL(10,2) NOT NULL,
    Fac_descuento DECIMAL(10,2) DEFAULT 0,
    Fac_metodo_pago ENUM('Tarjeta débito', 'Tarjeta crédito', 'Efectivo', 'Transferencia') NOT NULL,
    FOREIGN KEY (Fac_alquiler_id) REFERENCES Alquiler(Alq_id) ON DELETE CASCADE
);



-- PROCESO ALMACENADO PARA ALQUILAR VEHÍCULO *******************************;




-- Descripción del Procedimiento Almacenado SP_Verificar_Disponibilidad
-- El procedimiento almacenado SP_Verificar_Disponibilidad se encarga de verificar si un vehículo está disponible para ser alquilado. Su lógica se basa en dos condiciones principales:
-- El vehículo NO debe tener un alquiler activo.
-- El vehículo NO debe estar en mantenimiento pendiente.
-- Si el vehículo cumple ambas condiciones, se considera disponible; de lo contrario, se considera no disponible.
DROP PROCEDURE IF EXISTS SP_Verificar_Disponibilidad;
DELIMITER $$

CREATE PROCEDURE SP_Verificar_Disponibilidad(IN placa CHAR(6))
BEGIN
    DECLARE existe_alquiler INT;
    DECLARE existe_mantenimiento INT;
    DECLARE disponible BOOLEAN;

    -- Verificar si el vehículo ya tiene un alquiler activo
    SELECT COUNT(*) INTO existe_alquiler
    FROM Alquiler
    WHERE Alq_vehiculo_placa = placa AND Alq_estado = 'Activo';

    -- Verificar si el vehículo está en mantenimiento
    SELECT COUNT(*) INTO existe_mantenimiento
    FROM Mantenimiento_Vehiculo
    WHERE Man_vehiculo_placa = placa AND Man_estado = 'Pendiente';

    -- Si hay alquiler o mantenimiento, el vehículo no está disponible
    IF existe_alquiler > 0 OR existe_mantenimiento > 0 THEN
        SET disponible = FALSE;
    ELSE
        SET disponible = TRUE;
    END IF;

    -- Devolver el valor de disponible
    SELECT disponible AS disponible;
END $$

DELIMITER ;


