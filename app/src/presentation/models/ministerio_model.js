/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {
  connectToPostgres,
  disconnectFromPostgres,
} = require("../../infrastructure/database/db");
const bcrypt = require("bcryptjs");
const pg = require("pg");

class Usersmodel {
  // Método para obtener todas los ministerios
  static async getAll() {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      const result = await pool.query("SELECT * FROM ministerio");
      await disconnectFromPostgres(pool);
      /* console.log(result.rows) */
      if (result.rows.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay ministerios registrados",
        };
      }
      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }
  // Función para crear un nueva ministerios
  static async createUser(nombre, descripcion) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Obtener la fecha actual para la fecha de registro
      /* const currentDate = new Date();
      const fecha_registro = currentDate.toISOString(); */
      const currentDate = new Date();
      const registro_fecha = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;


      // Consulta para insertar una nueva ministerio en la base de datos
      const query = `
            INSERT INTO ministerio (nombre, descripcion, registro_fecha)
            VALUES ($1, $2, $3)
            RETURNING *;
          `;

      // Ejecutar la consulta con parámetros
      const result = await pool.query(query, [
        nombre,
        descripcion,
        registro_fecha,
      ]);

      console.log("Ministerio creado correctamente");
      return true;
    } catch (error) {
      console.error("Error al crear la ministerio:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
  // Metodo para actualizar la madida
  static async updateUser(id_ministerio, nombre, descripcion) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Consulta para actualizar un ministerio en la base de datos
      const query = `
            UPDATE ministerio
            SET nombre = $1, descripcion = $2
            WHERE id_ministerio = $3
          `;

      // Ejecutar la consulta con parámetros
      await pool.query(query, [nombre, descripcion, id_ministerio]);

      console.log("Ministerio actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar el ministerio:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
  // Método para cambiar el estado del ministerio
  static async changeState(userId, state) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con MSSQL");
      }
      /* const request = pool.request(); */
      // Actualizar el estado del usuario en la base de datos
      await pool.query(
        `UPDATE ministerio SET estado = ${state} WHERE id_ministerio = ${userId}`
      );
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
      await pool.query(`DELETE FROM ministerio WHERE id_ministerio = ${userId}`);

      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      console.error("Error al eliminar la ministerio:", error);
      return false;
    }
  }
}

module.exports = Usersmodel;
