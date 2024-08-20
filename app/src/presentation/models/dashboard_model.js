/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {connectToPostgres,disconnectFromPostgres,} = require("../../infrastructure/database/db");
  
class DashboardModel {
    static async getUsuarioCount(req, res) {
        try {
            const pool = await connectToPostgres();
            const result = await pool.query('SELECT COUNT(*) AS count FROM usuario');
            await disconnectFromPostgres(pool); // Disconnect from the database
            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener el conteo de usuarios:', error);
            res.status(500).json({ error: 'Error al obtener el conteo de usuarios' });
        }
    }

    static async getingresoCount(req, res) {
        try {
            const pool = await connectToPostgres();
            const result = await pool.query('SELECT COUNT(*) AS count FROM ingreso');
            await disconnectFromPostgres(pool); // Disconnect from the database
            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener el conteo de ingreso:', error);
            res.status(500).json({ error: 'Error al obtener el conteo de ingresos' });
        }
    }

    static async getegresoCount(req, res) {
        try {
            const pool = await connectToPostgres();
            const result = await pool.query('SELECT COUNT(*) AS count FROM egreso');
            await disconnectFromPostgres(pool); // Disconnect from the database
            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener el conteo de egreso:', error);
            res.status(500).json({ error: 'Error al obtener el conteo de egresos' });
        }
    }

    static async getlistaCount(req, res) {
        try {
            const pool = await connectToPostgres();
            const result = await pool.query('SELECT COUNT(*) AS count FROM lista');
            await disconnectFromPostgres(pool); // Disconnect from the database
            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener el conteo de lista:', error);
            res.status(500).json({ error: 'Error al obtener el conteo de lista' });
        }
    }
}

module.exports = DashboardModel;
