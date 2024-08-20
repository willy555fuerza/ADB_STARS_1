/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {
  connectToPostgres,
  disconnectFromPostgres,
} = require("../../infrastructure/database/db");
const bcrypt = require("bcryptjs");
const pg = require("pg");

class Usersmodel {
  // Método para obtener todas los miembros
  static async getAll() {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      const result = await pool.query("SELECT * FROM miembro");
      await disconnectFromPostgres(pool);
      /* console.log(result.rows) */
      if (result.rows.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay miembros registrados",
        };
      }
      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }

  // Función para crear un nuevo miembro
  static async createUser(nombres, apellidos, ci, dirrecion, telefono, fecha_naci) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Obtener la fecha actual para la fecha de registro
      /* const currentDate = new Date();
          const registro_fecha = currentDate.toISOString(); */
      const currentDate = new Date();
      const registro_fecha = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

      // Consulta para insertar una nuevo miembro en la base de datos
      const query = `
            INSERT INTO miembro (nombres, apellidos, ci, dirrecion, telefono, fecha_naci,registro_fecha)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `;

      // Ejecutar la consulta con parámetros
      const result = await pool.query(query, [
        nombres,
        apellidos,
        ci,
        dirrecion,
        telefono,
        fecha_naci,
        registro_fecha
      ]);

      console.log("miembro creado correctamente");
      return true;
    } catch (error) {
      console.error("Error al crear el miembro:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
  // Metodo para actualizar el miembro
  static async updateUser(id_miembro, nombres, apellidos, ci, dirrecion, telefono) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Consulta para actualizar un miembro en la base de datos
      const query = `
            UPDATE miembro
            SET nombres = $1, apellidos = $2, ci = $3, dirrecion = $4, telefono = $5
            WHERE id_miembro = $6
          `;

      // Ejecutar la consulta con parámetros
      await pool.query(query, [nombres, apellidos, ci, dirrecion, telefono, id_miembro]);

      console.log("Miembro actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar el miembro:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }

  // Método para cambiar el estado de un miembro
  static async changeState(userId, state) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con MSSQL");
      }
      /* console.log("lol") */
      /* const request = pool.request(); */
      // Actualizar el estado de un miembro en la base de datos
      await pool.query(
        `UPDATE miembro SET estado = ${state} WHERE id_miembro = ${userId}`
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
      await pool.query(`DELETE FROM miembro WHERE id_miembro = ${userId}`);

      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      console.error("Error al eliminar el miembro:", error);
      return false;
    }
  }
}

module.exports = Usersmodel;
