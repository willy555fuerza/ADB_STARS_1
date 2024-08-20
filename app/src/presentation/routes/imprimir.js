/* const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');



router.get('/downloadpdf', async (req, res) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });
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

    doc.fontSize(20).text('THE BEST COMPANY ADB', { align: 'center' });

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
}); 

module.exports = router; */
/*YO NO ME DOY POR VENCIDO */

const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const  pdf  = require('../models/imprimir'); // Ajusta la ruta según tu estructura de archivos


/*******EGRESOS__- */
router.post('/downloadpdff', async (req, res) => {
  const { id_egreso } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.getAllvent(id_egreso);
    if (result.error) {
      return res.status(404).send(result.message);
    }
    const data = result.data[0];

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

    doc.fontSize(20).text('IGLESIA ASAMBLEA DE DIOS BOLIVIANA', { align: 'center' });

    // Agregar datos del ingreso al PDF
    doc.moveDown(2);
doc.fontSize(12).text('Detalles del Egreso por usuario:', { align: 'center', underline: true });

// Añadir una tabla
const tableTop = doc.y + 50; // Centrar verticalmente desde la posición actual
const item = data;

// Dibujar la tabla
doc.fontSize(10);
const rowHeight = 30; // Aumentar la altura de las filas a 30
let rowTop = tableTop;

// Ancho de las columnas adaptado
const columnWidths = [60, 110, 110, 110, 60]; // Ajustar los anchos de las columnas

// Cabecera de la tabla con colores y bordes
const headers = ['ID Egreso', 'Usuario', 'Tipo de Egreso', 'Monto', 'Fecha'];
headers.forEach((header, i) => {
  const xPosition = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);

  // Dibujar fondo para la celda de la cabecera
  doc.fillColor('blue')
    .rect(xPosition, rowTop, columnWidths[i], rowHeight)
    .fill();

  // Dibujar borde gris para la celda de la cabecera
  doc.strokeColor('gray')
    .lineWidth(1)
    .rect(xPosition, rowTop, columnWidths[i], rowHeight)
    .stroke();

  // Añadir texto a la celda de la cabecera
  doc.fillColor('white')
    .text(header, xPosition + 5, rowTop + 10, { width: columnWidths[i] - 10, align: 'center' }); // Ajustar posición del texto
});

rowTop += rowHeight;

// Datos de la tabla con colores alternados y bordes
const values = [
  item.id_egreso,
  `${item.usuario_nombres || ''} ${item.usuario_apellidos || ''}`,
  item.tipo_egreso,
  item.monto,
  item.fecha_egreso
];

values.forEach((value, i) => {
  const xPosition = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);

  // Dibujar fondo para la celda de datos
  doc.fillColor(i % 2 === 0 ? 'lightgray' : 'white')
    .rect(xPosition, rowTop, columnWidths[i], rowHeight)
    .fill();

  // Dibujar borde gris para la celda de datos
  doc.strokeColor('gray')
    .lineWidth(1)
    .rect(xPosition, rowTop, columnWidths[i], rowHeight)
    .stroke();

  // Añadir texto a la celda de datos
  doc.fillColor('black')
    .text(value || '', xPosition + 5, rowTop + 10, { width: columnWidths[i] - 10, align: 'center' }); // Ajustar posición del texto
});

rowTop += rowHeight;

// Asegurarse de que total_egresos esté definido
const totalEgresos = item.total_egresos !== undefined && item.total_egresos !== null ? item.total_egresos : 'No disponible';

doc.fillColor('red')
  .text(`Total de Egresos: ${totalEgresos}`, 50, rowTop);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

/*******INGRESOS__- */
router.post('/downloadpdf', async (req, res) => {
  const {id_ingreso} = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.getAllventa(id_ingreso);
    if (result.error) {
      return res.status(404).send(result.message);
    }
    const data = result.data[0];

    
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 30 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdff');

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

    doc.fontSize(20).text('IGLESIA ASAMBLEA DE DIOS BOLIVIANA', { align: 'center' });

    // Agregar datos del ingreso al PDF
   /*  doc.moveDown(); */
   doc.moveDown(2);
   doc.fontSize(12).text('Detalles del Ingreso por usuario:', { align: 'center', underline: true });
   
   const pageWidth = doc.page.width; // Ancho total de la página
   const margin = 50; // Margen izquierdo de la tabla
   
   // Dibujar la tabla
   doc.fontSize(10);
   const rowHeight = 40; // Aumentar la altura de las filas a 40
   let rowTop = doc.y + 50; // Posición inicial vertical de la tabla
   
   // Ancho de las columnas adaptado
   const columnWidths = [40, 110, 130, 110, 50, 80]; // Reducir el ancho de "ID Ingreso" a 40
   
   // Calcular el ancho total de la tabla
   const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
   
   // Calcular la posición horizontal para centrar la tabla
   const tableLeft = (pageWidth - tableWidth - 2 * margin) / 2 + margin;
   
   // Cabecera de la tabla con colores y bordes
   const headers = ['ID Ingreso', 'Usuario', 'Tipo de Ingreso', 'Miembro', 'Monto', 'Fecha'];
   headers.forEach((header, i) => {
     const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
   
     // Dibujar fondo para la celda de la cabecera
     doc.fillColor('blue')
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
   
   // Datos de la tabla con bordes y colores alternados
   const item = data;
   const values = [
     item.id_ingreso,
     `${item.usuario_nombres || ''} ${item.usuario_apellidos || ''}`,
     item.tipo_ingreso_nombre,
     `${item.miembro_nombres || ''} ${item.miembro_apellidos || ''}`,
     item.monto,
     item.fecha_ingreso
   ];
   
   values.forEach((value, i) => {
     const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
   
     // Dibujar fondo para la celda de datos
     doc.fillColor(i % 2 === 0 ? 'lightgray' : 'white')
       .rect(xPosition, rowTop, columnWidths[i], rowHeight)
       .fill();
   
     // Dibujar borde gris para la celda de datos
     doc.strokeColor('gray')
       .lineWidth(1)
       .rect(xPosition, rowTop, columnWidths[i], rowHeight)
       .stroke();
   
     // Añadir texto a la celda de datos
     doc.fillColor('gray')
       .text(value || '', xPosition + 5, rowTop + (rowHeight / 2) - 8, { width: columnWidths[i] - 10, align: 'center', valign: 'center' });
   });
   
   rowTop += rowHeight;
   
   // Asegurarse de que total_ingresos esté definido
   const totalIngresos = item.total_ingresos !== undefined && item.total_ingresos !== null ? item.total_ingresos : 'No disponible';
   
   // Añadir total de ingresos
   doc.fillColor('red')
     .text(`Total de Ingresos: ${totalIngresos}`, tableLeft, rowTop);
    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});



/*******INGRESOS__- */
router.post('/imprimirtablas', async (req, res) => {
  const { datosTabla } = req.body;

  try {
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

    doc.fontSize(20).text('IGLESIA ASAMBLEA DE DIOS BOLIVIANA', { align: 'center' });

    // Agregar datos del ingreso al PDF
    doc.moveDown(2);
    doc.fontSize(12).text('Detalles del Ingreso:', { align: 'center', underline: true });
    
    const pageWidth = doc.page.width; // Ancho total de la página
    const margin = 50; // Margen izquierdo de la tabla
    
    // Ancho de las columnas ajustado
    const columnWidths = [50, 80, 150, 100, 80, 100]; // Reducir el ancho de "Monto" y aumentar el ancho de "Miembro"
    
    // Calcular el ancho total de la tabla
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    
    // Calcular la posición horizontal para centrar la tabla
    const tableLeft = (pageWidth - tableWidth - 2 * margin) / 2 + margin;
    
    // Ajustar altura de las filas
    const rowHeight = 40; // Aumentar la altura de las filas para permitir más espacio para el texto
    let rowTop = doc.y + 20; // Posición inicial vertical de la tabla
    
    // Cabecera de la tabla con colores y bordes
    const headers = ['ID Ingreso', 'Usuario', 'Tipo de Ingreso', 'Miembro', 'Monto', 'Fecha'];
    headers.forEach((header, i) => {
      const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
    
      // Dibujar fondo para la celda de la cabecera
      doc.fillColor('blue')
        .rect(xPosition, rowTop, columnWidths[i], rowHeight)
        .fill();
    
      // Dibujar borde para la celda de la cabecera
      doc.strokeColor('gray')
        .lineWidth(1)
        .rect(xPosition, rowTop, columnWidths[i], rowHeight)
        .stroke();
    
      // Añadir texto a la celda de la cabecera
      doc.fillColor('white')
        .text(header, xPosition + 5, rowTop + (rowHeight / 2) - 5, { width: columnWidths[i] - 10, align: 'center' });
    });
    
    rowTop += rowHeight;
    
    // Datos de la tabla con bordes y colores alternados
    datosTabla.forEach((row) => {
      // Reordenar los datos para que el segundo dato (Usuario) se mueva al final
      const reorderedRow = [row[0], row[2], row[3], row[4], row[5], row[1]];
    
      reorderedRow.forEach((cell, i) => {
        const xPosition = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
    
        // Dibujar borde para la celda de datos
        doc.strokeColor('gray')
          .lineWidth(1)
          .rect(xPosition, rowTop, columnWidths[i], rowHeight)
          .stroke();
    
        // Añadir texto a la celda de datos
        doc.fillColor('gray')
          .text(cell, xPosition + 5, rowTop + (rowHeight / 2) - 5, { width: columnWidths[i] - 10, align: 'center' });
      });
    
      // Mover la posición hacia abajo para la siguiente fila
      rowTop += rowHeight;
    });
    
    // Aumentar la altura adicional si es necesario para el contenido
    rowTop += rowHeight;
    
    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});


/*******EGRESOS__- */
router.post('/imprimirtabla', async (req, res) => {
  const { datosTabla } = req.body;

  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 30 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdff');

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

    doc.fontSize(20).text('IGLESIA ASAMBLEA DE DIOS BOLIVIANA', { align: 'center' });

    // Agregar datos del ingreso al PDF
    doc.moveDown(2);
    doc.fontSize(12).text('Detalles del Egreso:', { align: 'center', underline: true });
    
    // Añadir una tabla
    const tableTop = doc.y + 20; // Centrar verticalmente desde la posición actual
    
    // Dibujar la tabla
    doc.fontSize(10);
    const rowHeight = 35; // Aumentar la altura de las filas
    let rowTop = tableTop;
    
    // Reducir el ancho de las columnas para que ocupen menos espacio horizontal
    const columnWidths = [60, 110, 120, 110, 110]; 
    
    // Cabecera de la tabla con colores y bordes
    const headers = ['ID Egreso', 'Usuario', 'Tipo de Egreso', 'Monto', 'Fecha'];
    headers.forEach((header, i) => {
        const xPosition = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        
        // Dibujar el fondo de la cabecera
        doc.fillColor('blue')
            .rect(xPosition, rowTop, columnWidths[i], rowHeight)
            .fill();
        
        // Dibujar el borde alrededor de la celda
         // Dibujar borde para la celda de datos
         doc.strokeColor('gray')
         .lineWidth(1)
         .rect(xPosition, rowTop, columnWidths[i], rowHeight)
         .stroke();
        
        // Dibujar el texto de la cabecera
        doc.fillColor('white')
            .text(header, xPosition + 5, rowTop + 12, { width: columnWidths[i] - 10, align: 'center' });
    });
    
    rowTop += rowHeight;
    
    // Dibujar las filas de datos con bordes
    datosTabla.forEach((row) => {
        // Reordenar los datos para que el segundo dato (Usuario) se mueva al final
        const reorderedRow = [row[0], row[2], row[3], row[4], row[1]];
        
        // Dibujar cada celda en la fila
        reorderedRow.forEach((cell, i) => {
            const xPosition = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
            
            // Dibujar el borde alrededor de la celda
            
            doc.lineWidth(1) // Ancho del borde
                .rect(xPosition, rowTop, columnWidths[i], rowHeight)
                .stroke();
            
            // Dibujar el texto de la celda
            doc.fillColor('gray')
                .text(cell, xPosition + 5, rowTop + 12, { width: columnWidths[i] - 10, align: 'center' });
        });
        
        // Mover la posición y hacia abajo para la siguiente fila
        rowTop += rowHeight;
    });
    
      
    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});
module.exports = router;


