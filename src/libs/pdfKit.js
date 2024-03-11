// import PDFDocument from "pdfkit";
// import { table } from "pdfkit-table";

// export const construirPDF = (citas, callback) => {
//     const doc = new PDFDocument();

//     // Pipe the PDF into the response
//     doc.pipe(callback);

//     // Add table header
//     const tableHeaders = ['ID', 'Fecha', 'Paciente', 'Médico'];
//     const citasData = citas.map(cita => [cita.id, cita.fecha, cita.paciente, cita.medico]);
    
//     // Draw table
//     doc.moveDown().text('Lista de Citas').moveDown();
//     table(doc, tableHeaders.concat(citasData), {
//         prepareHeader: () => doc.font('Helvetica-Bold'),
//         prepareRow: (row, i) => doc.font('Helvetica').fontSize(12),
//         align: 'center',
//         width: 500,
//         border: 1,
//     });

//     // Finalize PDF
//     doc.end();
// };