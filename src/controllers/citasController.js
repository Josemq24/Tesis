// import pool from '../database.js';

// export const obtenerCitas = () => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             SELECT citas.id, citas.fecha, pacientes.nombre AS paciente, medicos.nombre AS medico
//             FROM citas
//             INNER JOIN pacientes ON citas.id_paciente = pacientes.id_paciente
//             INNER JOIN medicos ON citas.id_medico = medicos.id_medico
//         `;
//         pool.query(query, (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };