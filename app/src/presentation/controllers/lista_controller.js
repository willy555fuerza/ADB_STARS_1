/*****************conection 2*********************/

const Usersmodel = require("../models/lista_model"); // Importa el modelo listaModel

class Users {
  // Método para obtener todos los usuarios
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
  // Método para agregar un nuevo usuario
  static async createUser(req, res) {
    try {
      const { descripcion, fecha_lista, miembro, ministerio, fecha_registro } = req.body;

      const query = `
      INSERT INTO lista (descripcion, fecha_lista, id_miembro, id_ministerio, fecha_registro)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
  `;

      // Llamar al método para crear el usuario en el modelo
      const result = await Usersmodel.createUser(
        descripcion,
        fecha_lista,
        miembro,
        ministerio,
        fecha_registro
      );

      // Verificar si el usuario se creó correctamente en el modelo
      if (result) {
        // Usuario creado correctamente
        res.status(200).json({ message: "Lista registrado correctamente" });
      } else {
        // Error al crear el usuario en el modelo
        res
          .status(500)
          .json({ error: "El nombre del lista: " + descripcion + ", ya existe" });
      }
    } catch (error) {
      console.error("Error al registrar la lista:", error);
      res.status(500).json({ error: "Error al registrar la lista" });
    }
  }

  // Metodo para actualizar el usuario
  static async updateUser(req, res) {
    try {
      const { id_lista } = req.params;
      const { descripcion } = req.body;

      const query = `
      UPDATE lista
      SET descripcion = $1
      WHERE id_lista = $2;
    `;
      // Llamar al método para actualizar el usuario en el modelo
      const result = await Usersmodel.updateUser(
        id_lista,
        descripcion
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
}

module.exports = Users;
