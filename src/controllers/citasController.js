import pool from '../database.js';

// Obtener todas las citas
export const getAllCitas = async () => {
    try {
        const [citas] = await pool.query('SELECT * FROM citas');
        return citas;
    } catch (error) {
        throw error;
    }
};

// Crear una nueva cita
export const createCita = async (citaData) => {
    try {
        await pool.query('INSERT INTO citas SET ?', citaData);
    } catch (error) {
        throw error;
    }
};

// Actualizar una cita existente
export const updateCita = async (id, citaData) => {
    try {
        await pool.query('UPDATE citas SET ? WHERE id = ?', [citaData, id]);
    } catch (error) {
        throw error;
    }
};

// Eliminar una cita
export const deleteCita = async (id) => {
    try {
        await pool.query('DELETE FROM citas WHERE id = ?', id);
    } catch (error) {
        throw error;
    }
};