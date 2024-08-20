/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {
  connectToPostgres,
  disconnectFromPostgres,
} = require("../../infrastructure/database/db");
const bcrypt = require("bcryptjs");
const pg = require("pg");

class Usersmodel {
  // Método para obtener todas los tipos ingresos
  static async getAll() {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      const result = await pool.query("SELECT * FROM tipo_ingreso");
      await disconnectFromPostgres(pool);
      /* console.log(result.rows) */
      if (result.rows.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay tipos ingresos registrados",
        };
      }
      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }
  // Función para crear un nuevo tipo de ingresos
  static async createUser(nombre) {
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


      // Consulta para insertar una nuevo tipo de ingresos en la base de datos
      const query = `
            INSERT INTO tipo_ingreso (nombre, registro_fecha)
            VALUES ($1, $2)
            RETURNING *;
          `;

      // Ejecutar la consulta con parámetros
      const result = await pool.query(query, [
        nombre,
        registro_fecha
      ]);

      console.log("Tipo de ingresos creado correctamente");
      return true;
    } catch (error) {
      console.error("Error al crear el tipo de ingreso:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
  // Metodo para actualizar la madida
  static async updateUser(id_tipo_ingresos, nombre) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Consulta para actualizar un tipo de ingreso en la base de datos
      const query = `
            UPDATE tipo_ingreso
            SET nombre = $1
            WHERE id_tipo_ingresos = $2
          `;

      // Ejecutar la consulta con parámetros
      await pool.query(query, [nombre, id_tipo_ingresos]);

      console.log("Tipo de ingresos actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar el tipo de ingreso:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
  // Método para cambiar el estado del tipo de ingreso
  static async changeState(userId, state) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con MSSQL");
      }
      /* const request = pool.request(); */
      // Actualizar el estado del usuario en la base de datos
      await pool.query(
        `UPDATE tipo_ingreso SET estado = ${state} WHERE id_tipo_ingresos = ${userId}`
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
      await pool.query(`DELETE FROM tipo_ingreso WHERE id_tipo_ingresos = ${userId}`);

      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      console.error("Error al eliminar el tipo de ingreso:", error);
      return false;
    }
  }
}

module.exports = Usersmodel;
