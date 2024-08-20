/*****************conection 1*********************/
/* 
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

async function getAllventa(id_ingreso) {
  try {
    const query = `
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
        WHERE ingreso.id_ingreso = '${id_ingreso}';
    `;
    const result = await pool.query(query, [id_ingreso]);
    if (result.rows.length === 0) {
      return { error: true, message: 'Ingreso no encontrado' };
    }
    return { error: false, data: result.rows };
  } catch (error) {
    console.error('Error al obtener datos del ingreso:', error);
    return { error: true, message: 'Error al obtener datos del ingreso' };
  }
}

module.exports = { getAllventa };
 */

const {connectToPostgres,disconnectFromPostgres,} = require("../../infrastructure/database/db");

class pdf{
  static async getAllvent(id_egreso) {
    try {
      const pool = await connectToPostgres();
        if (!pool) {
          throw new Error("Error al conectar con PostgreSQL");
        }
        console.log('egreso: '+id_egreso)

      const query = `
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
WHERE egreso.id_egreso = '${id_egreso}'
ORDER BY egreso.fecha_egreso;

      `;
      const result = await  pool.query(query);
      await disconnectFromPostgres(pool);
      console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Ingreso no encontrado' };
      }
      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos del ingreso:', error);
      return { error: true, message: 'Error al obtener datos del ingreso' };
    }
  }

  static async getAllventa(id_ingreso) {
    try {
      const pool = await connectToPostgres();
        if (!pool) {
          throw new Error("Error al conectar con PostgreSQL");
        }
        console.log('ingreso: '+id_ingreso)

      const query = `
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
      const result = await  pool.query(query);
      await disconnectFromPostgres(pool);
      console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Ingreso no encontrado' };
      }
      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos del ingreso:', error);
      return { error: true, message: 'Error al obtener datos del ingreso' };
    }
  }
}


module.exports = pdf;

