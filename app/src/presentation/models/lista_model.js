/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const { connectToPostgres, disconnectFromPostgres } = require('../../infrastructure/database/db');
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
      const result = await pool.query('SELECT * FROM lista');
      await disconnectFromPostgres(pool);
      /* console.log(result.rows) */
      if (result.rows.length === 0) {
        return { data: null, error: true, message: 'No hay lista registrados' };
      }

      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }

  // Método para agregar un nuevo usuario
  static async createUser(descripcion, fecha_lista, miembro, ministerio ) {
    let pool;
    try {
        // Conectar a la base de datos PostgreSQL
        pool = await connectToPostgres();
        if (!pool) {
            throw new Error('Error al conectar con PostgreSQL');
        }
        // Obtener la fecha actual para la fecha de registro
        /* const currentDate = new Date();
        const fecha_registro = currentDate.toISOString(); */
        const currentDate = new Date();
        const fecha_registro = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        const stock = 0
        // Consulta para insertar un nuevo usuario en la base de datos
        const query = `
            INSERT INTO lista (descripcion, fecha_lista, id_miembro, id_ministerio, fecha_registro)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        // Ejecutar la consulta con parámetros
        const result = await pool.query(query, [
          descripcion,
          fecha_lista,
          miembro,
          ministerio,
          fecha_registro
        ]);

        console.log('lista creado correctamente');
        return true;
    } catch (error) {
        console.error('Error al crear la lista:', error);
        return false;
    } finally {
        // Desconectar de la base de datos
        if (pool) {
            await disconnectFromPostgres(pool);
        }
    }
}

  // Metodo para actualizar el usuario
  static async updateUser(id_lista, descripcion) {
    let pool;
    try {
      console.log(id_lista, descripcion)
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }

      // Consulta para actualizar un usuario en la base de datos
      const query = `
            UPDATE lista
            SET descripcion = $1
            WHERE id_lista = $2;
          `;
      console.log(descripcion,id_lista)
      // Ejecutar la consulta con parámetros
      await pool.query(query, [
        descripcion,  
        id_lista 
      ]);

      console.log('lista actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar el lista:', error);
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
      await pool.query(`UPDATE lista SET estado = ${state} WHERE id_lista = ${userId}`);
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
      await pool.query(`DELETE FROM lista WHERE id_lista = ${userId}`);

      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
      return false;
    }
  }

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


module.exports = Usersmodel