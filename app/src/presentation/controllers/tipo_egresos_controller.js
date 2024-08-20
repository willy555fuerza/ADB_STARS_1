/*****************conection 2*********************/

const Usersmodel = require("../models/tipo_egresos_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas los tipos de ingresos
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
  // Método para agregar una nuevo tipos de ingresos
  static async createUser(req, res) {
    try {
      const { nombre } = req.body;

      // Llamar al método para crear un tipo de ingreso en el modelo
      const result = await Usersmodel.createUser(nombre);

      // Verificar si el tipo de ingresos se creó correctamente en el modelo
      if (result) {
        // Tipo de ingresos creado correctamente
        res.status(200).json({ message: "Tipos de egresos creado correctamente" });
      } else {
        // Error al crear el tipo de ingresos en el modelo
        res.status(500).json({ error: "Error al crear el tipo de egresos" });
      }
    } catch (error) {
      console.error("Error al crear el tipo de egresos:", error);
      res.status(500).json({ error: "Error al crear el tipo de egresos" });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id_tipo_egresos } = req.params;
      const { nombre } = req.body;

      // Llamar al método para actualizar el tipo de ingresos en el modelo
      const result = await Usersmodel.updateUser(
        id_tipo_egresos,
        nombre
      );

      // Verificar si el tipo de ingresos se actualizó correctamente en el modelo
      if (result) {
        // Tipo de ingresos actualizado correctamente
        res.status(200).json({ message: "Tipo de egresos actualizado correctamente" });
      } else {
        // Error al actualizar el tipo de ingresos en el modelo
        res.status(500).json({ error: "Error al actualizar el tipo de egresos" });
      }
    } catch (error) {
      console.error("Error al actualizar el tipo de egresos:", error);
      res.status(500).json({ error: "Error al actualizar el tipo de egresos" });
    }
  }
  // Método para cambiar el estado de  un tipo de ingresos
  static async changeState(req, res) {
    try {
      const userId = req.params.userId;
      const { state } = req.body;
      // Llamar al método para cambiar el estado de un tipo de ingresos en el modelo
      const result = await Usersmodel.changeState(userId, state);
      
      res.status(200).json({ message: "Estado del tipo de egresos cambiado correctamente" });
    } catch (error) {
      console.error("Error al cambiar el estado del tipo de egresos:", error);
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
      const responseObj = { message: "Tipo de egresos eliminada correctamente" };

      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al eliminar el tipo de egresos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = Users;
