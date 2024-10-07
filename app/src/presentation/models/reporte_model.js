const { connectToPostgres, disconnectFromPostgres, } = require("../../infrastructure/database/db");

class UsersModel {
  static async postusuarios(fechade, fechaA) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      const query = `
            SELECT 
                id_usuario, 
                nombres, 
                apellidos, 
                perfil,
                usuario,
                TO_CHAR(fecha_registro, 'DD/MM/YYYY') AS fecha_registro
            FROM usuario 
            WHERE 
                fecha_registro BETWEEN '${fechade}' AND '${fechaA}'
            ORDER BY fecha_registro::date;;
    
          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de usuarios:', error);
      return { error: true, message: 'Error al obtener datos de usuarios' };
    }
  }





  static async postmiembros(fechade, fechaA) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      const query = `

            SELECT 
                id_miembro, 
                nombres, 
                apellidos, 
                ci,
                telefono,
                TO_CHAR(fecha_naci, 'DD/MM/YYYY') AS fecha_naci
            FROM miembro
            WHERE 
                registro_fecha BETWEEN '${fechade}' AND '${fechaA}'
            ORDER BY registro_fecha::date;;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos del miembros:', error);
      return { error: true, message: 'Error al obtener datos del miembros' };
    }
  }




  static async postministerios(fechade, fechaA) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      const query = `

            SELECT 
                id_ministerio, 
                nombre, 
                descripcion,
                TO_CHAR(registro_fecha, 'DD/MM/YYYY') AS fecha_registro
            FROM ministerio
            WHERE 
                registro_fecha BETWEEN '${fechade}' AND '${fechaA}'
            ORDER BY registro_fecha::date;;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de ministerios:', error);
      return { error: true, message: 'Error al obtener datos de ministerios' };
    }
  }





  static async postingresoxusuario(fechade, fechaA, id_usuario) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      const query = `


          SELECT 
            usuario.id_usuario, 
            CONCAT(usuario.nombres, ' ', usuario.apellidos) AS usuario_nombre_completo, 
            tipo_ingreso.nombre AS tipo_ingreso_nombre, 
            CONCAT(miembro.nombres, ' ', miembro.apellidos) AS miembro_nombre_completo,
            SUM(ingreso.monto) AS total_ingresos, 
            COUNT(ingreso.id_ingreso) AS cantidad_ingresos
          FROM ingreso
          JOIN usuario ON ingreso.id_usuario = usuario.id_usuario
          JOIN tipo_ingreso ON ingreso.id_tipo_ingresos = tipo_ingreso.id_tipo_ingresos
          JOIN miembro ON ingreso.id_miembro = miembro.id_miembro
          WHERE ingreso.fecha_registro BETWEEN '${fechade}' AND '${fechaA}' 
          AND usuario.id_usuario = ${id_usuario}
          GROUP BY usuario.id_usuario, usuario.nombres, usuario.apellidos, tipo_ingreso.nombre, miembro.nombres, miembro.apellidos
          ORDER BY total_ingresos DESC;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de ingresos:', error);
      return { error: true, message: 'Error al obtener datos de ingresos' };
    }
  }





  static async postingresoxmiembro(fechade, fechaA, id_miembro) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      
      const query = `

          SELECT 
            miembro.id_miembro,
            CONCAT(miembro.nombres, ' ', miembro.apellidos) AS miembro_nombre_completo, 
            tipo_ingreso.nombre AS tipo_ingreso_nombre, 
            SUM(ingreso.monto) AS total_ingresos, 
            COUNT(ingreso.id_ingreso) AS cantidad_ingresos
          FROM ingreso
          JOIN tipo_ingreso ON ingreso.id_tipo_ingresos = tipo_ingreso.id_tipo_ingresos
          JOIN miembro ON ingreso.id_miembro = miembro.id_miembro
          WHERE ingreso.fecha_registro BETWEEN '${fechade}' AND '${fechaA}'
            AND miembro.id_miembro = ${id_miembro} 
          GROUP BY miembro.id_miembro, miembro_nombre_completo, tipo_ingreso.nombre
          ORDER BY total_ingresos DESC;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de miembros:', error);
      return { error: true, message: 'Error al obtener datos de miembros' };
    }
  }








  static async postingresoxtipoingreso(fechade, fechaA, id_tipo_ingreso) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      
      const query = `

          SELECT 
            tipo_ingreso.nombre AS tipo_ingreso_nombre, 
            CONCAT(miembro.nombres, ' ', miembro.apellidos) as nombre_completo_miembro,
            SUM(ingreso.monto) AS total_ingresos, 
            COUNT(ingreso.id_ingreso) AS cantidad_ingresos
          FROM ingreso
          JOIN tipo_ingreso ON ingreso.id_tipo_ingresos = tipo_ingreso.id_tipo_ingresos
          JOIN miembro ON ingreso.id_miembro = miembro.id_miembro
          WHERE ingreso.fecha_registro BETWEEN '${fechade}' AND '${fechaA}'
              AND tipo_ingreso.id_tipo_ingresos = ${id_tipo_ingreso}
          GROUP BY tipo_ingreso.nombre, miembro.nombres, miembro.apellidos
          ORDER BY total_ingresos DESC;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de miembros:', error);
      return { error: true, message: 'Error al obtener datos de miembros' };
    }
  }







  static async postegresoxtipoegreso(fechade, fechaA, id_tipo_egreso) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      
      const query = `

         SELECT 
            tipo_egreso.nombre AS tipo_egreso_nombre, 
            CONCAT(usuario.nombres, ' ', usuario.apellidos) as nombre_completo_usuario,
            SUM(egreso.monto) AS total_egresos, 
            COUNT(egreso.id_egreso) AS cantidad_egresos
          FROM egreso
          JOIN tipo_egreso ON egreso.id_tipo_egresos = tipo_egreso.id_tipo_egresos
          JOIN usuario ON egreso.id_usuario = usuario.id_usuario
          WHERE egreso.fecha_registro BETWEEN '${fechade}' AND '${fechaA}'
            AND egreso.id_tipo_egresos = ${id_tipo_egreso} 
          GROUP BY tipo_egreso.nombre,nombre_completo_usuario
          ORDER BY total_egresos DESC;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de miembros:', error);
      return { error: true, message: 'Error al obtener datos de miembros' };
    }
  }




  static async postlista(fechade, fechaA, id_ministerio) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      
      const query = `

         SELECT 
          ministerio.nombre AS nombre_ministerio,
          CONCAT(miembro.nombres, ' ', miembro.apellidos) AS nombre_completo_miembro
        FROM lista
        JOIN miembro ON miembro.id_miembro = lista.id_miembro
        JOIN ministerio ON ministerio.id_ministerio = lista.id_ministerio
        WHERE lista.fecha_lista BETWEEN '${fechade}' AND '${fechaA}'
            AND ministerio.id_ministerio = ${id_ministerio}
        ORDER BY nombre_completo_miembro DESC;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de miembros:', error);
      return { error: true, message: 'Error al obtener datos de miembros' };
    }
  }







  static async egreso(fechade, fechaA) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      
      const query = `

        SELECT 
          egreso.id_egreso, 
          usuario.nombres AS usuario_nombres, 
          usuario.apellidos AS usuario_apellidos, 
          tipo_egreso.nombre AS tipo_egreso_nombre,
          egreso.monto,
          TO_CHAR(egreso.fecha_egreso, 'DD/MM/YYYY') AS fecha_egreso,
          (SELECT SUM(monto) FROM egreso) AS total_egresos
        FROM egreso 
        JOIN usuario ON egreso.id_usuario = usuario.id_usuario 
        JOIN tipo_egreso ON egreso.id_tipo_egresos = tipo_egreso.id_tipo_egresos
        WHERE egreso.fecha_egreso BETWEEN '${fechade}' AND '${fechaA}'
        ORDER BY egreso.fecha_egreso;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de egreso:', error);
      return { error: true, message: 'Error al obtener datos de egreso' };
    }
  }






  static async ingreso(fechade, fechaA) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      
      const query = `

        SELECT 
          ingreso.id_ingreso, 
          CONCAT(SPLIT_PART(usuario.nombres, ' ', 1), ' ', SPLIT_PART(usuario.apellidos, ' ', 1)) AS nombre_completo_usuario, 
          tipo_ingreso.nombre AS tipo_ingreso_nombre,
          CONCAT(SPLIT_PART(miembro.nombres, ' ', 1), ' ', SPLIT_PART(miembro.apellidos, ' ', 1)) AS nombre_completo_miembro, 
          ingreso.monto,
          TO_CHAR(ingreso.fecha_ingreso, 'DD/MM/YYYY') AS fecha_ingreso,
          (SELECT SUM(monto) FROM ingreso) AS total_ingresos
        FROM ingreso 
        JOIN usuario ON ingreso.id_usuario = usuario.id_usuario 
        JOIN tipo_ingreso ON ingreso.id_tipo_ingresos = tipo_ingreso.id_tipo_ingresos
        JOIN miembro ON ingreso.id_miembro = miembro.id_miembro
        WHERE ingreso.fecha_ingreso BETWEEN '${fechade}' AND '${fechaA}'
        ORDER BY ingreso.fecha_ingreso;

          `;
      const result = await pool.query(query);
      await disconnectFromPostgres(pool);
      //console.log(result.rows)

      if (result.rows.length === 0) {
        return { error: true, message: 'Registro de la fecha no encontrados' };
      }

      return { error: false, data: result.rows };
    } catch (error) {
      console.error('Error al obtener datos de ingreso:', error);
      return { error: true, message: 'Error al obtener datos de ingreso' };
    }
  }


}


module.exports = UsersModel;