// import express from "express";
// import { construirPDF } from "../libs/pdfKit.js";
// import { obtenerCitas } from "../controllers/citasController.js"; // Asumiendo que tienes un controlador para las citas

// const router = express.Router();

// router.get("/pdf", async (req, res) => {
//     res.writeHead(200, {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=Citas.pdf"
//     });

//     try {
//         const citas = await obtenerCitas(); // Suponiendo que obtienes las citas de algún lugar
//         construirPDF(citas, (data) => {
//             res.write(data); // Envía datos PDF directamente a la respuesta
//         }, () => {
//             res.end(); // Finaliza la respuesta cuando se complete la creación del PDF
//         });
//     } catch (error) {
//         console.error("Error al obtener citas:", error);
//         res.status(500).send("Error al generar el PDF de citas.");
//     }
// });

// export default router;