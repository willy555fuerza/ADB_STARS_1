


-- Cuadro de texto, cuadro combinado, select, cuadro de control, llenar select dependiente de otro select

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombres VARCHAR(150) COLLATE "C" NOT NULL,
    apellidos VARCHAR(150) COLLATE "C" NOT NULL,
    perfil VARCHAR(20) COLLATE "C" NULL,
    usuario VARCHAR(100) COLLATE "C" UNIQUE NOT NULL,
    contraseña VARCHAR(200) COLLATE "C" NOT NULL,
    fecha_registro TIMESTAMP NOT NULL,
	  primerlogin BOOLEAN DEFAULT TRUE,
    estado BOOLEAN DEFAULT TRUE
);

INSERT INTO usuario (nombres, apellidos, perfil, usuario, contraseña,   fecha_registro)
VALUES ('LUNA', 'ROSA', 'ADMINISTRADOR', 'willy', '$2a$12$5OHqjaveOSbuRl0QAQsf3e11vcgqGx/GFvAuU2OkmlwvPXqLLNuRq', CURRENT_TIMESTAMP);
select * from usuario;


/* table miembro*/


CREATE TABLE miembro (
    id_miembro SERIAL PRIMARY KEY,
    nombres VARCHAR(150) COLLATE "C" NOT NULL,
    apellidos VARCHAR(150) COLLATE "C" NOT NULL,
		ci VARCHAR(150) COLLATE "C" NOT NULL,
		dirrecion VARCHAR(150) COLLATE "C" NOT NULL,
		telefono INTEGER NOT NULL,
		fecha_naci DATE NOT NULL,
    registro_fecha TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

insert into miembro(nombres,apellidos,ci,dirrecion,telefono,fecha_naci,registro_fecha) values ('START','QUBYTESOFT','89696986','LA GUARDIA','67735546','1994-09-18','2022-01-13');
select * from miembro;


/* table ministerio*/


CREATE TABLE Ministerio (
    id_ministerio SERIAL PRIMARY KEY,
    nombre VARCHAR(150) COLLATE "C" NOT NULL,
    descripcion VARCHAR(150) COLLATE "C" NOT NULL,
    registro_fecha TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

insert into ministerio(nombre,descripcion,registro_fecha) values ('START','QUBYTESOFT','2022-01-13');
select * from ministerio;



/* table de tipo ingresos */


CREATE TABLE tipo_ingreso (
    id_tipo_ingresos SERIAL PRIMARY KEY,
    nombre VARCHAR(150) COLLATE "C" NOT NULL,
    registro_fecha TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

INSERT INTO tipo_ingreso (nombre, registro_fecha)
VALUES ('Diezmos', '2022-01-13');

select * from tipo_ingreso;

/* table de  ingresos */


CREATE TABLE ingreso (
    id_ingreso SERIAL PRIMARY KEY,
    fecha_ingreso TIMESTAMP NOT NULL,
   
	
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    id_tipo_ingresos INTEGER REFERENCES tipo_ingreso(id_tipo_ingresos),
    id_miembro INTEGER REFERENCES miembro(id_miembro),
    monto DECIMAL(10, 2) NULL, -- Cambiado a tipo DECIMAL
    fecha_registro TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
); 
 
INSERT INTO ingreso (fecha_ingreso, id_usuario, id_tipo_ingresos, id_miembro, monto, fecha_registro)
VALUES (CURRENT_TIMESTAMP, 1, 1, 1, 10.2, CURRENT_TIMESTAMP);

SELECT * FROM ingreso 
SELECT * FROM tipo_ingreso WHERE id_tipo_ingreso = 7;



SELECT i.*, u.nombres,t.nombre, m.nombres
        FROM ingreso i
				LEFT JOIN usuario u ON i.id_usuario = u.id_usuario
        LEFT JOIN tipo_ingresos t ON i.id_tipo_ingresos = t.id_tipo_ingresos 
        LEFT JOIN miembro m ON i.id_miembro = m.id_miembro


/* table de tipo egresos */


CREATE TABLE tipo_egreso (
    id_tipo_egresos SERIAL PRIMARY KEY,
    nombre VARCHAR(150) COLLATE "C" NOT NULL,
    registro_fecha TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

INSERT INTO tipo_egreso (nombre, registro_fecha)
VALUES ('Servicios Basicos', '2022-01-13');

select * from tipo_egreso;


/* table de  egresos */


CREATE TABLE egreso (
    id_egreso SERIAL PRIMARY KEY,
    fecha_egreso TIMESTAMP NOT NULL,

	
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    id_tipo_egresos INTEGER REFERENCES tipo_egreso(id_tipo_egresos),
    monto DECIMAL(10, 2) NULL, -- Cambiado a tipo DECIMAL
    fecha_registro TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
); 
 
INSERT INTO egreso (fecha_egreso, estado, id_usuario, id_tipo_egresos,monto, fecha_registro)
VALUES (CURRENT_TIMESTAMP, TRUE, 1, 1,5.99,CURRENT_TIMESTAMP);

SELECT * FROM egreso


SELECT * FROM tipo_egreso WHERE id_tipo_egreso = 2;



SELECT i.*, u.nombres,t.nombre, m.nombres
        FROM egreso i
				LEFT JOIN usuario u ON i.id_usuario = u.id_usuario
        LEFT JOIN tipo_egresos t ON i.id_tipo_egresos = t.id_tipo_egresos 
        LEFT JOIN miembro m ON i.id_miembro = m.id_miembro



/* table de lista */


CREATE TABLE lista (
    id_lista SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) COLLATE "C" NOT NULL,
    fecha_lista TIMESTAMP NOT NULL,

	
    id_miembro INTEGER REFERENCES miembro(id_miembro),
    id_ministerio INTEGER REFERENCES ministerio(id_ministerio),
    fecha_registro TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
); 
 
INSERT INTO lista (descripcion, fecha_lista, id_miembro, id_ministerio, fecha_registro, estado)
VALUES ('THE BEST COMPANY', CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, TRUE);



SELECT * FROM lista

/*******************************************iner join*******************************/

SELECT 
        ingreso.*, 
        usuario.nombres AS usuario_nombres, 
        usuario.apellidos AS usuario_apellidos, 
        tipo_ingreso.id_tipo_ingresos,
        miembro.nombres AS miembro_nombre,
        miembro.apellidos AS miembro_apellido
        FROM ingreso 
        JOIN usuario ON ingreso.id_usuario = usuario.id_usuario 
        JOIN tipo_ingreso ON ingreso.id_tipo_ingresos = tipo_ingreso.id_tipo_ingresos
        JOIN miembro ON ingreso.id_miembro = miembro.id_miembro
        WHERE ingreso.id_ingreso = 1

/**********************************************************************************************/

   SELECT 
  ingreso.id_ingreso, 
  usuario.nombres AS usuario_nombres, 
  usuario.apellidos AS usuario_apellidos, 
  tipo_ingreso.nombre AS tipo_ingreso_nombre,
  miembro.nombres AS miembro_nombres,
  miembro.apellidos AS miembro_apellidos,
  ingreso.monto,
  ingreso.fecha_ingreso,
  (SELECT SUM(monto) FROM ingreso) AS total_ingresos
FROM ingreso 
JOIN usuario ON ingreso.id_usuario = usuario.id_usuario 
JOIN tipo_ingreso ON ingreso.id_tipo_ingresos = tipo_ingreso.id_tipo_ingresos
JOIN miembro ON ingreso.id_miembro = miembro.id_miembro
where id_ingreso = '${id_ingreso}'
ORDER BY ingreso.fecha_ingreso;
      `;

/**********************************************************************************************/
SELECT 
  egreso.id_egreso, 
  usuario.nombres AS usuario_nombres, 
  usuario.apellidos AS usuario_apellidos, 
  tipo_egreso.nombre AS tipo_egreso,
  egreso.monto,
  egreso.fecha_egreso,
  (SELECT SUM(monto) FROM egreso) AS total_egresos
FROM egreso 
JOIN usuario ON egreso.id_usuario = usuario.id_usuario 
JOIN tipo_egreso ON egreso.id_tipo_egresos = tipo_egreso.id_tipo_egresos
WHERE egreso.id_egreso = 2
ORDER BY egreso.fecha_egreso;

/**********************************************************************************************/