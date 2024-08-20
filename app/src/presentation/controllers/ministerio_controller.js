/*****************conection 2*********************/

const Usersmodel = require("../models/ministerio_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas los ministerios
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
  // Método para agregar una nuevo ministerios
  static async createUser(req, res) {
    try {
      const { nombre, descripcion } = req.body;

      // Llamar al método para crear una ministerio en el modelo
      const result = await Usersmodel.createUser(nombre, descripcion);

      // Verificar si el ministerio se creó correctamente en el modelo
      if (result) {
        // Ministerio creado correctamente
        res.status(200).json({ message: "Ministerio creado correctamente" });
      } else {
        // Error al crear el ministerio en el modelo
        res.status(500).json({ error: "Error al crear el ministerio" });
      }
    } catch (error) {
      console.error("Error al crear el ministerio:", error);
      res.status(500).json({ error: "Error al crear el ministerio" });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id_ministerio } = req.params;
      const { nombre, descripcion } = req.body;

      // Llamar al método para actualizar la ministerio en el modelo
      const result = await Usersmodel.updateUser(
        id_ministerio,
        nombre,
        descripcion
      );

      // Verificar si la ministerio se actualizó correctamente en el modelo
      if (result) {
        // Ministerio actualizado correctamente
        res.status(200).json({ message: "Ministerio actualizado correctamente" });
      } else {
        // Error al actualizar la ministerio en el modelo
        res.status(500).json({ error: "Error al actualizar el ministerio" });
      }
    } catch (error) {
      console.error("Error al actualizar el ministerio:", error);
      res.status(500).json({ error: "Error al actualizar el ministerio" });
    }
  }
  // Método para cambiar el estado de  una ministerio
  static async changeState(req, res) {
    try {
      const userId = req.params.userId;
      const { state } = req.body;
      // Llamar al método para cambiar el estado de una ministerio en el modelo
      const result = await Usersmodel.changeState(userId, state);
      
      res.status(200).json({ message: "Estado del ministerio cambiado correctamente" });
    } catch (error) {
      console.error("Error al cambiar el estado del ministerio:", error);
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
      const responseObj = { message: "Ministerio eliminada correctamente" };

      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al eliminar la ministerio:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = Users;
