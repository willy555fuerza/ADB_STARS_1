/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {
  connectToPostgres,disconnectFromPostgres,} = require("../../infrastructure/database/db");
const bcrypt = require('bcryptjs');
const pg = require('pg');



class Usersmodel {
// Método para obtener todos los usuarios
static async getAll() {
  try {
    const pool = await connectToPostgres();
    if (!pool) {
      throw new Error('Error al conectar con PostgreSQL');
    }
    const result = await pool.query('SELECT * FROM egreso');
    await disconnectFromPostgres(pool);
    /* console.log(result.rows) */
    if (result.rows.length === 0) {
      return { data: null, error: true, message: 'No hay ingreso registrados' };
    }

    return { data: result.rows, error: false };
  } catch (error) {
    return { data: null, error: true, message: error.message };
  }
}


   // Método para agregar un nuevo usuario
   static async createUser(fecha_egreso, id_usuario, tipo_egreso, monto) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }
  
      // Obtener la fecha actual para la fecha de registro
      const currentDate = new Date();
      const fecha_registro = currentDate.toISOString().slice(0, 19).replace('T', ' ');
  
      // Consulta para insertar un nuevo usuario en la base de datos
      const query = `
        INSERT INTO egreso (fecha_egreso, id_usuario, id_tipo_egresos, monto, fecha_registro)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
  
      // Ejecutar la consulta con parámetros
      const result = await pool.query(query, [
        fecha_egreso,
        id_usuario,
        tipo_egreso,
        monto,
        fecha_registro
      ]);
  
      console.log('Egreso creado correctamente:', result.rows[0]);
      return result.rows[0]; // Devuelve el ingreso creado
    } catch (error) {
      console.error('Error al crear el egreso:', error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
/*********************************************the end create ingreso************************************/
// Metodo para actualizar el usuario
static async updateUser(id_egreso, monto) {
  let pool;
  try {
    console.log(id_egreso, monto)
    // Conectar a la base de datos PostgreSQL
    pool = await connectToPostgres();
    if (!pool) {
      throw new Error('Error al conectar con PostgreSQL');
    }

    // Consulta para actualizar un usuario en la base de datos
    const query = `
    UPDATE egreso
    SET monto = $1 
    WHERE id_egreso = $2;
  `;

  const result = await pool.query(query, [monto, id_egreso]);
/*       console.log(descripcion,id_lista) */
    // Ejecutar la consulta con parámetros
    

    console.log('Egreso actualizado correctamente');
    return true;
  } catch (error) {
    console.error('Error al actualizar el Egreso:', error);
    return false;
  } finally {
    // Desconectar de la base de datos
    if (pool) {
      await disconnectFromPostgres(pool);
    }
  }
}
// Método para cambiar el estado de un usuario
static async changeState(userId, state) {
  try {
    const pool = await connectToPostgres();
    if (!pool) {
      throw new Error('Error al conectar con PostgreSQL');
    }
    //const request = pool.request(); 
    // Actualizar el estado del usuario en la base de datos
    await pool.query(`UPDATE egreso SET estado = ${state} WHERE id_egreso = ${userId}`);
    await disconnectFromPostgres(pool);
    return true;
  } catch (error) {
    return false;
  }
}
// Método para eliminar usuario de la data base
static async deleteUser(userId) {
  try {
    const pool = await connectToPostgres();
    if (!pool) {
      throw new Error("Error al conectar con PostgreSQL");
    }

    // Eliminar el usuario de la base de datos
    await pool.query(`DELETE FROM egreso WHERE id_egreso = ${userId}`);

    await disconnectFromPostgres(pool);
    return true;
  } catch (error) {
    console.error("Error al eliminar el egreso:", error);
    return false;
  }
}

/*****************************************the end******************************************************************/

// Método para obtener tel stock
static async stock() {
  try {
    const pool = await connectToPostgres();
    if (!pool) {
      throw new Error('Error al conectar con PostgreSQL');
    }
    const result = await pool.query('select id_lista, descripcion from lista ');
    await disconnectFromPostgres(pool);
    /* console.log(result.rows) */
    if (result.rows.length === 0) {
      return { data: null, error: true, message: 'No hay listas registrados' };
    }

    return { data: result.rows, error: false };
  } catch (error) {
    return { data: null, error: true, message: error.message };
  }
}

}

module.exports = Usersmodel;
