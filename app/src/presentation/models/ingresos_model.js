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
      const result = await pool.query('SELECT * FROM ingreso');
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
     static async createUser(fecha_ingreso, id_usuario, tipo_ingreso, miembro, monto) {
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
          INSERT INTO ingreso (fecha_ingreso, id_usuario, id_tipo_ingresos, id_miembro, monto, fecha_registro)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
    
        // Ejecutar la consulta con parámetros
        const result = await pool.query(query, [
          fecha_ingreso,
          id_usuario,
          tipo_ingreso,
          miembro,
          monto,
          fecha_registro
        ]);
    
        console.log('Ingreso creado correctamente:', result.rows[0]);
        return result.rows[0]; // Devuelve el ingreso creado
      } catch (error) {
        console.error('Error al crear el ingreso:', error);
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
  static async updateUser(id_ingreso, monto) {
    let pool;
    try {
      console.log(id_ingreso, monto)
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }

      // Consulta para actualizar un usuario en la base de datos
      const query = `
      UPDATE ingreso
      SET monto = $1 
      WHERE id_ingreso = $2;
    `;

    const result = await pool.query(query, [monto, id_ingreso]);
/*       console.log(descripcion,id_lista) */
      // Ejecutar la consulta con parámetros
      

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
      await pool.query(`UPDATE ingreso SET estado = ${state} WHERE id_ingreso = ${userId}`);
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
      await pool.query(`DELETE FROM ingreso WHERE id_ingreso = ${userId}`);

      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
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

  // Método para obtener todos los usuarios
  static async fecha(enddate, startdate) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }
      const result = await pool.query(`
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
WHERE ingreso.fecha_ingreso BETWEEN '${startdate}' AND '${enddate}'
ORDER BY ingreso.fecha_ingreso;

        `);
      await disconnectFromPostgres(pool);
      console.log(result.rows)
      if (result.rows.length === 0) {
        return { data: null, error: true, message: 'No hay ingreso registrados' };
      }

      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }
    // Método para buscar cliente
   /*  static async buscliente(nombre) {
      try {
        const pool = await connectToPostgres();
        if (!pool) {
          throw new Error("Error al conectar con PostgreSQL");
        }


        // Ejecutar la consulta con parámetros
        const result = await pool.query(`SELECT nombre, id_tipo_ingresos FROM "tipo_ingreso" where monto = ${nombre}`);

        await disconnectFromPostgres(pool);
        //console.log(result.rows)
        if (result.rows.length === 0) {
          return {
            data: null,
            error: true,
            message: "No hay clientes registrados",
          };
        }
        return { data: result.rows, error: false };
      } catch (error) {
        return { data: null, error: true, message: error.message };
      }
    } */

    
    
    // Método para nuscar producto
   /*  static async busproducto(nombres) {
      try {
        const pool = await connectToPostgres();
        if (!pool) {
          throw new Error("Error al conectar con PostgreSQL");
        }


        // Ejecutar la consulta con parámetros
        const result = await pool.query(`SELECT nombres, id_miembro FROM "miembro" where nombres = '${nombres}'`);

        await disconnectFromPostgres(pool);
        //console.log(result.rows)
        if (result.rows.length === 0) {
          return {
            data: null,
            error: true,
            message: "No hay productos registrados",
          };
        }
        return { data: result.rows, error: false };
      } catch (error) {
        return { data: null, error: true, message: error.message };
      }
    } */

   // Método para generar venta
/*   static async geneventa(id_usuario, id_tipo_ingresos, total, productosAgregados) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error('Error al conectar con PostgreSQL');
      }

      // Iniciar una transacción
      await pool.query('BEGIN');

      const currentDate = new Date();
      const fecha_registro = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

      // Consulta para insertar una nueva venta en la base de datos
      const queryVenta = `
        INSERT INTO ingreso (monto_ingreso, fecha_ingreso, id_tipo_ingreso, id_usuario)
        VALUES ($1, $2, $3, $4)
        RETURNING id_ingreso;
      `;

      // Ejecutar la consulta para insertar la venta y obtener el ID de la venta generada
      const resultVenta = await pool.query(queryVenta, [total, fecha_registro, id_tipo_ingresos, id_usuario]);
      const id_ingreso = resultVenta.rows[0].id_ingreso;

      // Consulta para insertar los productos vendidos en la tabla de detalle de venta
      const queryDetalleVenta = `
        INSERT INTO tipo_ingreso (id_ingreso, id_tipo_ingresos, cantidad_ingreso, precio_ingreso)
        VALUES ($1, $2, $3, $4);
      `;

      // Iterar sobre los productos agregados y ejecutar la consulta para cada producto
      for (const producto of productosAgregados) {
        await pool.query(queryDetalleVenta, [id_ingreso, producto.id, producto.cantidad, producto.preciounitario]);

        // Actualizar el stock del producto en la tabla producto
        const queryActualizarStock = `
          UPDATE tipo_ingreso
          SET nombre = nombre - $1
          WHERE id_tipo_ingresos = $2;
        `;
        await pool.query(queryActualizarStock, [producto.cantidad, producto.id]);
      }

      // Confirmar la transacción
      await pool.query('COMMIT');

      console.log('Venta generada correctamente');
      return true;
    } catch (error) {
      // Revertir la transacción en caso de error
      if (pool) {
        await pool.query('ROLLBACK');
      }
      console.error('Error al generar venta:', error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  } */

  }
  
  module.exports = Usersmodel;
  