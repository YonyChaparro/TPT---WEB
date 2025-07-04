// init-db.js para SQLite
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const initDb = async () => {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    -- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS Factura;
DROP TABLE IF EXISTS Alquiler;
DROP TABLE IF EXISTS Mantenimiento_Vehiculo;
DROP TABLE IF EXISTS Taller;
DROP TABLE IF EXISTS Vehiculo;
DROP TABLE IF EXISTS Tipo_Vehiculo;
DROP TABLE IF EXISTS Tipo_Alquiler;
DROP TABLE IF EXISTS Proveedor;
DROP TABLE IF EXISTS Socio;
DROP TABLE IF EXISTS Empleado;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Persona;


-- Tabla Persona
CREATE TABLE IF NOT EXISTS Persona (
    Per_id INTEGER PRIMARY KEY,
    Per_nombre VARCHAR(100) NOT NULL,
    Per_telefono VARCHAR(15) NOT NULL,
    Per_email VARCHAR(100) NOT NULL,
    Per_direccion VARCHAR(100) NOT NULL,
    Per_tipo TEXT NOT NULL CHECK (Per_tipo IN ('Natural', 'Jurídica')),
    Per_tipo_identificacion TEXT NOT NULL CHECK (Per_tipo_identificacion IN ('CC', 'NIP', 'NUIP', 'TI', 'CE'))
);

-- Tabla Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    Cli_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Cli_per_id INTEGER,
    Cli_usuario VARCHAR(100),
    Cli_contrasena VARCHAR(50),
    FOREIGN KEY (Cli_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);

-- Tabla Empleado
CREATE TABLE IF NOT EXISTS Empleado (
    Emp_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Emp_per_id INTEGER,
    Emp_puesto VARCHAR(100) NOT NULL,
    Emp_salario REAL NOT NULL, -- DECIMAL(10,2) se convierte a REAL
    Emp_fecha_contratacion TEXT NOT NULL, -- DATE se convierte a TEXT
    FOREIGN KEY (Emp_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);

-- Tabla Socio
CREATE TABLE IF NOT EXISTS Socio (
    Soc_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Soc_per_id INTEGER,
    Soc_numero_de_acciones INTEGER NOT NULL,
    FOREIGN KEY (Soc_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);

-- Tabla Proveedor
CREATE TABLE IF NOT EXISTS Proveedor (
    Pro_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Pro_per_id INTEGER,
    Pro_costo_servicio REAL NOT NULL, -- DECIMAL(10,2) se convierte a REAL
    Pro_servicio TEXT,
    FOREIGN KEY (Pro_per_id) REFERENCES Persona(Per_id) ON DELETE CASCADE
);

-- Tabla Tipo_Alquiler
CREATE TABLE IF NOT EXISTS Tipo_Alquiler (
    Tip_Alq_id INTEGER PRIMARY KEY CHECK (Tip_Alq_id IN (1,2)),
    Tip_Alq_nombre TEXT NOT NULL CHECK (Tip_Alq_nombre IN ('Estándar', 'Completo')),
    Tip_Alq_costo_por_hora INTEGER NOT NULL
);

-- Tabla Tipo_Vehiculo
CREATE TABLE IF NOT EXISTS Tipo_Vehiculo (
    Tip_id INTEGER PRIMARY KEY,
    Tip_nombre VARCHAR(50) NOT NULL,
    Tip_tarifa REAL CHECK (Tip_tarifa >= 0), -- DECIMAL(20,2) se convierte a REAL
    Tip_capacidad_carga REAL NOT NULL, -- DECIMAL(20,2) se convierte a REAL
    Tip_combustible TEXT NOT NULL CHECK (Tip_combustible IN ('Gasolina', 'Diesel', 'Gas', 'Eléctrico'))
);

-- Tabla Vehiculo
CREATE TABLE IF NOT EXISTS Vehiculo (
    Veh_placa CHAR(6) PRIMARY KEY,
    Veh_cuidad_de_registro VARCHAR(50) NOT NULL,
    Veh_tipo INTEGER NOT NULL,
    Veh_marca VARCHAR(50) NOT NULL,
    Veh_modelo VARCHAR(50) NOT NULL,
    Veh_año INTEGER NOT NULL, -- YEAR se convierte a INTEGER
    Veh_kilometraje INTEGER CHECK (Veh_kilometraje >= 0) DEFAULT 0,
    Veh_certificado_runt INTEGER DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Veh_soat_vigencia TEXT NOT NULL, -- DATE se convierte a TEXT
    Veh_soat_vigente INTEGER DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Veh_rtm_vigencia TEXT NOT NULL, -- DATE se convierte a TEXT
    Veh_rtm_vigente INTEGER DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Veh_norma_ambiental VARCHAR(50) NOT NULL,
    Veh_gps_instalado INTEGER DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    FOREIGN KEY (Veh_tipo) REFERENCES Tipo_Vehiculo(Tip_id)
);

-- Trigger que actualiza automáticamente su estado al insertar un vehículo
CREATE TRIGGER before_insert_vehiculo
BEFORE INSERT ON Vehiculo
FOR EACH ROW
BEGIN
    UPDATE NEW SET
        Veh_soat_vigente = CASE
            WHEN NEW.Veh_soat_vigencia >= strftime('%Y-%m-%d', 'now') THEN 1
            ELSE 0
        END,
        Veh_rtm_vigente = CASE
            WHEN NEW.Veh_rtm_vigencia >= strftime('%Y-%m-%d', 'now') THEN 1
            ELSE 0
        END;
END;

-- Trigger que actualiza automáticamente su estado al modificar un vehículo
CREATE TRIGGER before_update_vehiculo
BEFORE UPDATE ON Vehiculo
FOR EACH ROW
BEGIN
    UPDATE NEW SET
        Veh_soat_vigente = CASE
            WHEN NEW.Veh_soat_vigencia >= strftime('%Y-%m-%d', 'now') THEN 1
            ELSE 0
        END,
        Veh_rtm_vigente = CASE
            WHEN NEW.Veh_rtm_vigencia >= strftime('%Y-%m-%d', 'now') THEN 1
            ELSE 0
        END;
END;

-- Tabla Taller
CREATE TABLE IF NOT EXISTS Taller (
    Tal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Tal_nombre VARCHAR(50) NOT NULL,
    Tal_direccion VARCHAR(100) NOT NULL
);

-- Tabla Mantenimiento_Vehiculo
CREATE TABLE IF NOT EXISTS Mantenimiento_Vehiculo (
    Man_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Man_vehiculo_placa CHAR(6) NOT NULL,
    Man_taller INTEGER NOT NULL,
    Man_fecha TEXT NOT NULL, -- DATE se convierte a TEXT
    Man_tipo TEXT NOT NULL CHECK (Man_tipo IN ('Preventivo', 'Correctivo')),
    Man_kilometraje_actual INTEGER NOT NULL,
    Man_descripcion TEXT NOT NULL,
    Man_costo REAL NOT NULL, -- DECIMAL(10,2) se convierte a REAL
    Man_cambio_de_aceite INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_cambio_frenos INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_alineación_y_balanceo INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_revision_sistema_electrico INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_revision_neumaticos INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_certificacion_ambiental INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_certificacion_mecanica INTEGER NOT NULL DEFAULT 0, -- BOOLEAN se convierte a INTEGER
    Man_detalles TEXT,
    Man_estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (Man_estado IN ('Completado', 'Pendiente', 'En proceso')),
    Man_fecha_certificacion_ambiental TEXT, -- DATE se convierte a TEXT
    Man_fecha_certificacion_mecanica TEXT, -- DATE se convierte a TEXT
    FOREIGN KEY (Man_vehiculo_placa) REFERENCES Vehiculo(Veh_placa) ON DELETE CASCADE,
    FOREIGN KEY (Man_taller) REFERENCES Taller(Tal_id) ON DELETE CASCADE
);

-- Tabla Alquiler
CREATE TABLE IF NOT EXISTS Alquiler (
    Alq_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Alq_cliente INTEGER,
    Alq_vehiculo_placa CHAR(6),
    Alq_tipo INTEGER,
    Alq_fecha_inicio TEXT NOT NULL, -- DATE se convierte a TEXT
    Alq_duracion INTEGER NOT NULL,
    Alq_estado TEXT NOT NULL CHECK (Alq_estado IN ('Activo', 'Finalizado')),
    FOREIGN KEY (Alq_cliente) REFERENCES Cliente(Cli_id) ON DELETE CASCADE,
    FOREIGN KEY (Alq_vehiculo_placa) REFERENCES Vehiculo(Veh_placa) ON DELETE CASCADE,
    FOREIGN KEY (Alq_tipo) REFERENCES Tipo_Alquiler(Tip_Alq_id) ON DELETE CASCADE
);

-- Tabla Factura
CREATE TABLE IF NOT EXISTS Factura (
    Fac_id INTEGER PRIMARY KEY AUTOINCREMENT,
    Fac_alquiler_id INTEGER,
    Fac_fecha TEXT NOT NULL, -- DATE se convierte a TEXT
    Fac_impuesto REAL NOT NULL, -- DECIMAL(10,2) se convierte a REAL
    Fac_descuento REAL DEFAULT 0, -- DECIMAL(10,2) se convierte a REAL
    Fac_metodo_pago TEXT NOT NULL CHECK (Fac_metodo_pago IN ('Tarjeta débito', 'Tarjeta crédito', 'Efectivo', 'Transferencia')),
    FOREIGN KEY (Fac_alquiler_id) REFERENCES Alquiler(Alq_id) ON DELETE CASCADE
);

-- Este trigger se activará cuando el estado de un alquiler cambie a Finalizado.
-- La lógica de cálculo de la factura debe ser manejada por la aplicación,
-- ya que SQLite no soporta procedimientos almacenados.
CREATE TRIGGER TR_Auto_Generar_Factura
AFTER UPDATE ON Alquiler
FOR EACH ROW
BEGIN
    -- Si el estado cambia a "Finalizado", se inserta una factura básica.
    -- La lógica de cálculo de impuestos, descuentos, etc., debe realizarse en la aplicación
    -- antes de insertar la factura. Este trigger solo inserta un registro básico.
    -- Para una implementación completa, la aplicación debería llamar a una función
    -- para calcular y crear la factura cuando el estado del alquiler cambie a 'Finalizado'.
    INSERT INTO Factura (Fac_alquiler_id, Fac_fecha, Fac_impuesto, Fac_descuento, Fac_metodo_pago)
    SELECT
        NEW.Alq_id,
        strftime('%Y-%m-%d', 'now'),
        0.0, -- El impuesto debe calcularse en la aplicación
        0.0, -- El descuento debe calcularse en la aplicación
        'Efectivo' -- El método de pago debe ser determinado por la aplicación
    WHERE OLD.Alq_estado != 'Finalizado' AND NEW.Alq_estado = 'Finalizado';
END;
  `);

  console.log('✅ Base de datos SQLite creada correctamente.');
};

initDb();
