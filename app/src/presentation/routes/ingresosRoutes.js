/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const Users = require('../controllers/ingresos_controller')
const  pdf  = require('../models/ingresos_model'); 


// Ruta para obtener todas las medidas
router.get('/ingreso',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/ingreso/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_ingreso', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/ingreso/:id_ingreso', Users.updateUser); 
// Ruta para eliminar un usuario
router.delete('/ingreso_delete/:userId', Users.deleteUser);

/*******INGRESOS__- */
router.post('/download/fecha', async (req, res) => {
  const { enddate, startdate } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.fecha(enddate, startdate);
  
    if (result.error) {
      return res.status(404).send(result.message);
    }
    
    const data = result.data;
  
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 30 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);
  
    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
  
    // Enviar el documento PDF al cliente
    doc.pipe(res);
  
    // Configuración de fuentes y colores
    doc.font('Helvetica');
  
    // Ruta del logo
    const logoPath = path.join(__dirname, '../../../public/img/WILL.png');
  
    // Verificar si el archivo del logo existe
    if (fs.existsSync(logoPath)) {
      // Agregar el logo al PDF
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.error('Logo file not found:', logoPath);
    }
  
    // Añadir un espacio después del logo
    doc.moveDown(2); // Ajusta el número según el espacio que desees
  
    // Añadir el título con fuente más pequeña
    doc.fontSize(16).text('IGLESIA ASAMBLEA DE DIOS BOLIVIANA', { align: 'center' });
  
    doc.moveDown(2);
    doc.fontSize(12).text('Detalles del Ingreso por usuario:', { align: 'center', underline: true });
  
    const pageWidth = doc.page.width; // Ancho total de la página
    const margin = 50; // Margen izquierdo de la tabla
    const columnWidths = [40, 110, 130, 110, 50, 80]; // Ancho de las columnas
    const rowHeight = 40; // Altura de las filas
  
    // Calcular el ancho total de la tabla
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
  
    // Calcular la posición horizontal para centrar la tabla
    const tableLeft = (pageWidth - tableWidth - 2 * margin) / 2 + margin;
  
    // Agregar encabezado de la tabla
    doc.fontSize(10);
    let rowTop = doc.y;
  
    // Cabecera de la tabla con colores y bordes
    const headers = ['ID Ingreso', 'Usuario', 'Tipo de Ingreso', 'Miembro', 'Monto', 'Fecha'];
    headers.forEach((header, i) => {
      const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
  
      // Dibujar fondo para la celda de la cabecera
      doc.fillColor('#031D35')
        .rect(xPosition, rowTop, columnWidths[i], rowHeight)
        .fill();
  
      // Dibujar borde gris para la celda de la cabecera
      doc.strokeColor('gray')
        .lineWidth(1)
        .rect(xPosition, rowTop, columnWidths[i], rowHeight)
        .stroke();
  
      // Añadir texto a la celda de la cabecera
      doc.fillColor('white')
        .text(header, xPosition + 5, rowTop + 12, { width: columnWidths[i] - 10, align: 'center' });
    });
  
    rowTop += rowHeight;
  
    // Iterar sobre los datos y agregarlos a la tabla
    data.forEach((item, rowIndex) => {
      const values = [
        item.id_ingreso,
        `${item.usuario_nombres || ''} ${item.usuario_apellidos || ''}`,
        item.tipo_ingreso_nombre,
        `${item.miembro_nombres || ''} ${item.miembro_apellidos || ''}`,
        item.monto,
        new Date(item.fecha_ingreso).toLocaleDateString('es-ES') // Formatear la fecha
      ];
  
      values.forEach((value, i) => {
        const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
  
        // Dibujar fondo para la celda de datos
        doc.fillColor(rowIndex % 2 === 0 ? 'lightgray' : 'white')
          .rect(xPosition, rowTop, columnWidths[i], rowHeight)
          .fill();
  
        // Dibujar borde gris para la celda de datos
        doc.strokeColor('gray')
          .lineWidth(1)
          .rect(xPosition, rowTop, columnWidths[i], rowHeight)
          .stroke();
  
        // Añadir texto a la celda de datos
        doc.fillColor('black')
          .text(value || '', xPosition + 5, rowTop + (rowHeight / 2) - 8, { width: columnWidths[i] - 10, align: 'center', valign: 'center' });
      });
  
      rowTop += rowHeight;
  
      // Si la fila se sale de la página, crear una nueva página
      if (rowTop + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        rowTop = doc.y;
        
        // Re-dibujar cabecera de la tabla en la nueva página
        headers.forEach((header, i) => {
          const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.fillColor('blue')
            .rect(xPosition, rowTop, columnWidths[i], rowHeight)
            .fill();
          doc.strokeColor('gray')
            .lineWidth(1)
            .rect(xPosition, rowTop, columnWidths[i], rowHeight)
            .stroke();
          doc.fillColor('white')
            .text(header, xPosition + 5, rowTop + 12, { width: columnWidths[i] - 10, align: 'center' });
        });
        rowTop += rowHeight;
      }
    });
  
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
  
  });
 
module.exports = router 