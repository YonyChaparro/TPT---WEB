// init-db.js para SQLite (sin triggers problemáticos)
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const initDb = async () => {
  const db = await open({
    filename: './src/database.db', // Ruta actualizada a './src/database.db'
    driver: sqlite3.Database
  });

  await db.exec(`
    -- Eliminar tablas existentes si existen (orden inverso por dependencias)
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

-- Los triggers before_insert_vehiculo y before_update_vehiculo han sido eliminados
-- debido a problemas de sintaxis persistentes con SQLite en este entorno.
-- La lógica para calcular Veh_soat_vigente y Veh_rtm_vigente debe ser implementada
-- en la capa de aplicación (Node.js) antes de insertar o actualizar un vehículo.

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

-- Datos de ejemplo

-- Insertar datos en Persona
INSERT INTO Persona (Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion) VALUES
(1, 'Juan Perez', '3001234567', 'juan.perez@example.com', 'Calle 10 # 20-30, Bogotá', 'Natural', 'CC'),
(2, 'Maria Garcia', '3109876543', 'maria.garcia@example.com', 'Carrera 5 # 15-25, Medellín', 'Natural', 'CC'),
(3, 'Transportes SA', '6015551234', 'info@transportessa.com', 'Avenida 68 # 45-10, Cali', 'Jurídica', 'NIP'),
(4, 'Pedro Lopez', '3201112233', 'pedro.lopez@example.com', 'Calle 50 # 8-15, Barranquilla', 'Natural', 'CC'),
(5, 'Logística Express', '6017778899', 'contacto@logisticaexpress.com', 'Diagonal 70 # 10-5, Cartagena', 'Jurídica', 'NIP'),
(6, 'Ana Rodriguez', '3012345678', 'ana.rodriguez@example.com', 'Calle 7 # 12-34, Bucaramanga', 'Natural', 'CC'),
(7, 'Carlos Sanchez', '3123456789', 'carlos.sanchez@example.com', 'Carrera 80 # 25-50, Pereira', 'Natural', 'TI'),
(8, 'Distribuidora Global', '6021112233', 'ventas@distribuidoraglobal.com', 'Avenida Principal # 1-1, Manizales', 'Jurídica', 'NIP'),
(9, 'Laura Gomez', '3056789012', 'laura.gomez@example.com', 'Calle 20 # 5-10, Cúcuta', 'Natural', 'CE'),
(10, 'Servicios Integrales SAS', '6043334455', 'soporte@serviciosintegrales.com', 'Carrera 4 # 7-8, Pasto', 'Jurídica', 'NIP');

-- Insertar datos en Cliente
INSERT INTO Cliente (Cli_per_id, Cli_usuario, Cli_contrasena) VALUES
(1, 'jperez', 'pass123'),
(2, 'mgarcia', 'securepass'),
(6, 'arodriguez', 'ana_pass'),
(9, 'lgomez', 'laura_pass');

-- Insertar datos en Empleado
INSERT INTO Empleado (Emp_per_id, Emp_puesto, Emp_salario, Emp_fecha_contratacion) VALUES
(4, 'Gerente de Operaciones', 4500000.00, '2022-01-15'),
(5, 'Coordinador de Flota', 3000000.00, '2023-03-01'),
(7, 'Mecánico Principal', 2800000.00, '2021-08-20'),
(10, 'Asistente Administrativo', 1800000.00, '2024-01-10');

-- Insertar datos en Socio
INSERT INTO Socio (Soc_per_id, Soc_numero_de_acciones) VALUES
(1, 1000),
(3, 5000),
(8, 2500);

-- Insertar datos en Proveedor
INSERT INTO Proveedor (Pro_per_id, Pro_costo_servicio, Pro_servicio) VALUES
(3, 150000.00, 'Mantenimiento de vehículos'),
(5, 80000.00, 'Soporte GPS'),
(8, 200000.00, 'Suministro de repuestos'),
(10, 50000.00, 'Servicios de limpieza');

-- Insertar datos en Tipo_Alquiler
INSERT INTO Tipo_Alquiler (Tip_Alq_id, Tip_Alq_nombre, Tip_Alq_costo_por_hora) VALUES
(1, 'Estándar', 50000),
(2, 'Completo', 80000);

-- Insertar datos en Tipo_Vehiculo
INSERT INTO Tipo_Vehiculo (Tip_id, Tip_nombre, Tip_tarifa, Tip_capacidad_carga, Tip_combustible) VALUES
(1, 'Camioneta', 120000.00, 1.5, 'Gasolina'),
(2, 'Furgoneta', 100000.00, 2.0, 'Diesel'),
(3, 'Camión Pequeño', 200000.00, 5.0, 'Diesel'),
(4, 'Automóvil', 80000.00, 0.5, 'Gasolina'),
(5, 'Camión Grande', 350000.00, 10.0, 'Diesel');

-- Insertar datos en Vehiculo
INSERT INTO Vehiculo (Veh_placa, Veh_cuidad_de_registro, Veh_tipo, Veh_marca, Veh_modelo, Veh_año, Veh_kilometraje, Veh_certificado_runt, Veh_soat_vigencia, Veh_rtm_vigencia, Veh_norma_ambiental, Veh_gps_instalado) VALUES
('ABC123', 'Bogotá', 1, 'Toyota', 'Hilux', 2020, 50000, 1, '2025-12-31', '2025-11-30', 'Euro V', 1),
('DEF456', 'Medellín', 2, 'Renault', 'Master', 2019, 75000, 1, '2025-10-20', '2025-09-15', 'Euro IV', 1),
('GHI789', 'Cali', 3, 'Chevrolet', 'NPR', 2021, 30000, 1, '2026-06-01', '2026-05-25', 'Euro VI', 1),
('JKL012', 'Bogotá', 4, 'Nissan', 'Versa', 2022, 15000, 1, '2025-08-01', '2025-07-20', 'Euro VI', 0),
('MNO345', 'Barranquilla', 1, 'Ford', 'Ranger', 2023, 10000, 1, '2026-03-15', '2026-02-28', 'Euro VI', 1),
('PQR678', 'Cali', 5, 'Freightliner', 'Cascadia', 2018, 150000, 1, '2025-09-01', '2025-08-10', 'Euro V', 1),
('STU901', 'Medellín', 2, 'Peugeot', 'Boxer', 2020, 60000, 1, '2025-11-01', '2025-10-20', 'Euro VI', 0);

-- Insertar datos en Taller
INSERT INTO Taller (Tal_nombre, Tal_direccion) VALUES
('Taller Mecánico Central', 'Calle 100 # 15-40, Bogotá'),
('Servicio Automotriz Rápido', 'Carrera 30 # 5-10, Medellín'),
('Auto Repuestos y Servicio', 'Avenida Las Américas # 1-1, Cali'),
('Diagnóstico Diesel', 'Vía 40 # 2-30, Barranquilla');

-- Insertar datos en Mantenimiento_Vehiculo
INSERT INTO Mantenimiento_Vehiculo (Man_vehiculo_placa, Man_taller, Man_fecha, Man_tipo, Man_kilometraje_actual, Man_descripcion, Man_costo, Man_cambio_de_aceite, Man_cambio_frenos, Man_alineación_y_balanceo, Man_revision_sistema_electrico, Man_revision_neumaticos, Man_certificacion_ambiental, Man_certificacion_mecanica, Man_detalles, Man_estado, Man_fecha_certificacion_ambiental, Man_fecha_certificacion_mecanica) VALUES
('ABC123', 1, '2024-06-01', 'Preventivo', 49500, 'Mantenimiento de 50.000 km', 350000.00, 1, 0, 1, 1, 1, 0, 0, 'Revisión general y cambio de filtros.', 'Completado', NULL, NULL),
('DEF456', 2, '2024-05-10', 'Correctivo', 74800, 'Reparación de sistema de frenos', 600000.00, 0, 1, 0, 0, 0, 0, 0, 'Cambio de pastillas y discos delanteros.', 'Completado', NULL, NULL),
('GHI789', 3, '2024-04-20', 'Preventivo', 29000, 'Inspección de 30.000 km', 280000.00, 1, 0, 0, 1, 1, 0, 0, 'Revisión de fluidos y sistema de dirección.', 'Completado', NULL, NULL),
('JKL012', 1, '2024-07-01', 'Preventivo', 14500, 'Primer mantenimiento programado', 200000.00, 1, 0, 0, 0, 1, 0, 0, 'Cambio de aceite y rotación de neumáticos.', 'Pendiente', NULL, NULL),
('MNO345', 4, '2024-06-15', 'Correctivo', 9800, 'Revisión de aire acondicionado', 180000.00, 0, 0, 0, 1, 0, 0, 0, 'Recarga de gas refrigerante.', 'En proceso', NULL, NULL);

-- Insertar datos en Alquiler
INSERT INTO Alquiler (Alq_cliente, Alq_vehiculo_placa, Alq_tipo, Alq_fecha_inicio, Alq_duracion, Alq_estado) VALUES
(1, 'ABC123', 1, '2024-07-01', 24, 'Finalizado'),
(2, 'DEF456', 2, '2024-07-05', 48, 'Activo'),
(6, 'JKL012', 1, '2024-07-10', 72, 'Activo'),
(9, 'GHI789', 2, '2024-06-25', 120, 'Finalizado'),
(1, 'MNO345', 1, '2024-07-08', 36, 'Activo');

-- Insertar datos en Factura (Nota: El trigger TR_Auto_Generar_Factura insertaría esto automáticamente si el estado de Alquiler cambia a 'Finalizado')
-- Para fines de datos iniciales, insertamos algunas manualmente.
INSERT INTO Factura (Fac_alquiler_id, Fac_fecha, Fac_impuesto, Fac_descuento, Fac_metodo_pago) VALUES
(1, '2024-07-02', 120000.00, 60000.00, 'Tarjeta crédito'),
(4, '2024-07-01', 480000.00, 240000.00, 'Efectivo');
  `);

  console.log('✅ Base de datos SQLite creada y poblada correctamente.');
};

initDb();
