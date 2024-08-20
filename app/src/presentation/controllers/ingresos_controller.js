/*****************conection 2*********************/

const Usersmodel = require("../models/ingresos_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas las medidas
  static async getAll(req, res) {
    try {
      /* const { data, error, message } = await Usersmodel.getAll(); */
      const data = await Usersmodel.getAll();

      if (!data) {
        return res.status(404).json({ error: message });
      }
      /* console.log(data) */
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


  static async createUser(req, res) {
    try {
      const { fecha_ingreso, id_usuario, tipo_ingreso, miembro, monto } = req.body;
  
      // Llamar al método para crear el usuario en el modelo
      const result = await Usersmodel.createUser(
        fecha_ingreso,
        id_usuario,
        tipo_ingreso,
        miembro,
        monto
      );
  
      // Verificar si el usuario se creó correctamente en el modelo
      if (result) {
        // Usuario creado correctamente
        res.status(200).json({ message: "Ingreso registrado correctamente" });
      } else {
        // Error al crear el usuario en el modelo
        res.status(500).json({ error: "El ingreso con monto: " + monto + ", ya existe o hubo un error al registrarlo." });
      }
    } catch (error) {
      console.error("Error al registrar el ingreso:", error);
      res.status(500).json({ error: "Error al registrar el ingreso" });
    }
  }
  

  // Metodo para actualizar el usuario
  static async updateUser(req, res) {
    try {
      const { id_ingreso } = req.params;
      const {  monto } = req.body;

     /*  const query = `
      UPDATE lista
      SET descripcion = $1
      WHERE id_lista = $2;
    `; */
      // Llamar al método para actualizar el usuario en el modelo
      const result = await Usersmodel.updateUser(
        id_ingreso,
        monto
      );

      // Verificar si el usuario se actualizó correctamente en el modelo
      if (result) {
        // Usuario actualizado correctamente
        res.status(200).json({ message: "Lista actualizado correctamente" });
      } else {
        // Error al actualizar el usuario en el modelo
        res.status(500).json({ error: "Error al actualizar la lista" });
      }
    } catch (error) {
      console.error("Error al actualizar la lista:", error);
      res.status(500).json({ error: "Error al actualizar la lista" });
    }
  }
  // Método para cambiar el estado de un usuario
  static async changeState(req, res) {
    try {
      const userId = req.params.userId;
      const { state } = req.body;
      // Llamar al método para cambiar el estado del usuario en el modelo
      const result = await Usersmodel.changeState(userId, state);
      // Crear el objeto de respuesta
      const responseObj = { message: "Lista inhabilitado correctamente" };
      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al cambiar el estado de la lista:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  // Método para eliminar usuario de la data base
  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;

      // Llamar al método para eliminar el usuario en el modelo
      const result = await Usersmodel.deleteUser(userId);

      // Crear el objeto de respuesta
      const responseObj = { message: "Lista eliminado correctamente" };

      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  // Método para obtener el stock
  static async stock(req, res) {
    try {
      /* const { data, error, message } = await Usersmodel.getAll(); */
      const data = await Usersmodel.stock();

      if (!data) {
        return res.status(404).json({ error: message });
      }
      /* console.log(data) */
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Metodo para obtener el cliente
  static async buscliente(req, res){
    try {
      const { nombre } = req.body;
      
      const data = await Usersmodel.buscliente(nombre);

      // Verificar si la medida se creó correctamente en el modelo
      if (data) {
        // Medida creado correctamente
        res.status(200).json(data);
      } else {
        // Error al crear la medida en el modelo
        res.status(500).json({ error: "Error al buscara el cliente" });
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      res.status(500).json({ error: "Error al buscar cliente" });
    }
    
  }

  // Metodo para obtener el cliente
  static async busproducto(req, res){
    try {
      const { nombres } = req.body;
      
      const data = await Usersmodel.busproducto(nombres);

      // Verificar si la medida se creó correctamente en el modelo
      if (data) {
        // Medida creado correctamente
        res.status(200).json(data);
      } else {
        // Error al crear la medida en el modelo
        res.status(500).json({ error: "Error al buscara el producto" });
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
      res.status(500).json({ error: "Error al buscar producto" });
    }
    
  }

  // Metodo para generar venta
  static async geneventa(req, res) {
      try {
          const { id_usuario, id_tipo_ingresos, total, miembro } = req.body;

          // Llamar al método para crear el proveedor en el modelo
          const result = await Usersmodel.geneventa(id_usuario, id_tipo_ingresos, total, miembro);

          // Verificar si el proveedor se creó correctamente en el modelo
          if (result) {
              // Proveedor creado correctamente
              res.status(200).json({ message: 'Venta generada correctamente' });
          } else {
              // Error al crear el proveedor en el modelo
              res.status(500).json({ error: 'Error al generar la venta' });
          }
      } catch (error) {
          console.error('Error al generar la venta:', error);
          res.status(500).json({ error: 'Error al generar la venta' });
      }
  }

  
}

module.exports = Users;
