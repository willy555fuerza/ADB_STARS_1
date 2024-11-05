const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const pdf = require("../models/reporte_model"); // Ajusta la ruta según tu estructura de archivos

router.post("/reportes_usuarios/usuarios", async (req, res) => {
  const { fechade, fechaA } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postusuarios(fechade, fechaA);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `USUARIOS REGISTRADOS`;
    const headerText3 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      /* doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Arial').text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3); */

        doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
        .text(headerText1, 160, headerTextY)
        .moveDown(1)
        .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
        .fontSize(12).font('Arial').text(headerText3,headerTextX3);

      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Nombres', 90, yPosition - 16)
              .text('Apellidos', 200, yPosition - 16)
              .text('Perfil', 320, yPosition - 16)
              .text('Usuario', 420, yPosition - 16)
              .text('Fecha', 530, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .text('Nº', 25, yPosition - 16)
            .text('Nombres', 90, yPosition - 16)
            .text('Apellidos', 200, yPosition - 16)
            .text('Perfil', 320, yPosition - 16)
            .text('Usuario', 420, yPosition - 16)
            .text('Fecha', 530, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .text(numero, 25, yPosition + 2)
            .text(item.nombres, -390, yPosition + 2, {align: 'center'})
            .text(item.apellidos, -170, yPosition + 2, {align: 'center'})
            .text(item.perfil, 60, yPosition + 2, {align: 'center'})
            .text(item.usuario, 265, yPosition + 2, {align: 'center'})
            .text(item.fecha_registro, 475, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});







router.post("/reportes_miembros/miembros", async (req, res) => {
  const { fechade, fechaA } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postmiembros(fechade, fechaA);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `MIEMBROS REGISTRADOS`;
    const headerText3 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         /* .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
         .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Nombres', 90, yPosition - 16)
              .text('Apellidos', 195, yPosition - 16)
              .text('CI', 320, yPosition - 16)
              .text('Telefono', 380, yPosition - 16)
              .text('Fecha_nacimiento', 470, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Nombres', 90, yPosition - 16)
            .text('Apellidos', 195, yPosition - 16)
            .text('CI', 320, yPosition - 16)
            .text('Telefono', 380, yPosition - 16)
            .text('Fecha_nacimiento', 470, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.nombres, -390, yPosition + 2, {align: 'center'})
            .text(item.apellidos, -170, yPosition + 2, {align: 'center'})
            .text(item.ci, 45, yPosition + 2, {align: 'center'})
            .text(item.telefono, 195, yPosition + 2, {align: 'center'})
            .text(item.fecha_naci, 430, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});






router.post("/reportes_ministerios/ministerios", async (req, res) => {
  const { fechade, fechaA } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postministerios(fechade, fechaA);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)


    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `MINISTERIOS REGISTRADOS`;
    const headerText3 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         /* .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(14).text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
         .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Nombre', 120, yPosition - 16)
              .text('Descripcion', 280, yPosition - 16)
              .text('Fecha_registro', 470, yPosition - 16);
              
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Nombre', 120, yPosition - 16)
            .text('Descripcion', 280, yPosition - 16)
            .text('Fecha_registro', 470, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')  
            .text(numero, 25, yPosition + 2)
            .text(item.nombre, -330, yPosition + 2, {align: 'center'})
            .text(item.descripcion, 15, yPosition + 2, {align: 'center'})
            .text(item.fecha_registro, 410, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});









router.post("/reportes_ingresos/usuarios", async (req, res) => {
  const { fechade, fechaA, id_usuario } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postingresoxusuario(fechade, fechaA, id_usuario);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    const date = data[0].usuario_nombre_completo;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `INGRESOS POR USUARIO`;
    const headerText3 = `Usuario: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
     /*  doc.fontSize(15).fill('#000000').font('Helvetica-Bold') */
         /* .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3)
         .fontSize(12).text(headerText4,headerTextX4); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
         .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Tipo_ingreso', 80, yPosition - 16)
              .text('Miembro', 230, yPosition - 16)
              .text('Total_ingreso', 370, yPosition - 16)
              .text('Contidad_ingreso', 470, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Tipo_ingreso', 80, yPosition - 16)
            .text('Miembro', 230, yPosition - 16)
            .text('Total_ingreso', 370, yPosition - 16)
            .text('Contidad_ingreso', 470, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.tipo_ingreso_nombre, -380, yPosition + 2, {align: 'center'})
            .text(item.miembro_nombre_completo, -105, yPosition + 2, {align: 'center'})
            .text(item.total_ingresos, 200, yPosition + 2, {align: 'center'})
            .text(item.cantidad_ingresos, 440, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});









router.post("/reportes_ingresos/miembros", async (req, res) => {
  const { fechade, fechaA, id_miembro } = req.body;
  
  try {
    // Obtener datos de la base de datos
    const result = await pdf.postingresoxmiembro(fechade, fechaA, id_miembro);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    const date = data[0].miembro_nombre_completo;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `INGRESOS POR MIEMBRO`;
    const headerText3 = `Miembro: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
     /*  doc.fontSize(15).fill('#000000').font('Helvetica-Bold') */
         /* .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3)
         .fontSize(12).text(headerText4,headerTextX4); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
         .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Registro_fecha', 290, yPosition - 16)
              .text('Tipo_ingreso', 470, yPosition - 16)
              .text('Total_ingreso', 370, yPosition - 16)
              .text('Contidad_ingreso', 470, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Registro_fecha', 70, yPosition - 16)
            .text('Tipo_ingreso', 230, yPosition - 16)
            .text('Total_ingreso', 370, yPosition - 16)
            .text('Contidad_ingreso', 470, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.registro_fecha, -390, yPosition + 2, {align: 'center'})
            .text(item.tipo_ingreso_nombre, -80, yPosition + 2, {align: 'center'})
            .text(item.total_ingresos, 200, yPosition + 2, {align: 'center'})
            .text(item.cantidad_ingresos, 440, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});









router.post("/reportes_ingresos/tipo_ingreso", async (req, res) => {
  const { fechade, fechaA, id_tipo_ingreso } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postingresoxtipoingreso(fechade, fechaA, id_tipo_ingreso);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    const date = data[0].tipo_ingreso_nombre;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `INGRESOS POR TIPO DE INGRESO`;
    const headerText3 = `Tipo de ingreso: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      /* doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3)
         .fontSize(12).text(headerText4,headerTextX4); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
         .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Registro_fecha', 220, yPosition - 16)
              .text('Miembro', 220, yPosition - 16)
              .text('Total_ingreso', 370, yPosition - 16)
              .text('Contidad_ingreso', 470, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Registro_fecha', 70, yPosition - 16)
            .text('Miembro', 245, yPosition - 16)
            .text('Total_ingreso', 370, yPosition - 16)
            .text('Contidad_ingreso', 470, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.registro_fecha, -390, yPosition + 2, {align: 'center'})
            .text(item.nombre_completo_miembro, -70, yPosition + 2, {align: 'center'})
            .text(item.total_ingresos, 200, yPosition + 2, {align: 'center'})
            .text(item.cantidad_ingresos, 440, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});








router.post("/reportes_egresos/tipo_egreso", async (req, res) => {
  const { fechade, fechaA, id_tipo_egreso } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postegresoxtipoegreso(fechade, fechaA, id_tipo_egreso);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    const date = data[0].tipo_egreso_nombre;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `EGRESOS POR TIPO DE EGRESO`;
    const headerText3 = `Tipo de egreso: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      /* doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         .fontSize(12).text(headerText3,headerTextX3)
         .fontSize(12).text(headerText4,headerTextX4); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
         .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 12;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Usuario', 170, yPosition - 16)
              .text('Registro_fecha', 220, yPosition - 16)
              .text('Total_egreso', 370, yPosition - 16)
              .text('Contidad_egreso', 470, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Registro_fecha', 70, yPosition - 16)
            .text('Usuario', 240, yPosition - 16)
            .text('Total_egreso', 370, yPosition - 16)
            .text('Contidad_egreso', 470, yPosition - 16);
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.registro_fecha, -390, yPosition + 2, {align: 'center'})
            .text(item.nombre_completo_usuario, -85, yPosition + 2, {align: 'center'})
            .text(item.total_egresos, 200, yPosition + 2, {align: 'center'})
            .text(item.cantidad_egresos, 440, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});








router.post("/reportes_miembros/ministerios", async (req, res) => {
  const { fechade, fechaA, id_ministerio } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.postlista(fechade, fechaA, id_ministerio);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    const date = data[0].nombre_ministerio;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `MIEMBROS POR MINISTERIOS`;
    const headerText3 = `Ministerio: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
      .text(headerText1, 160, headerTextY)
      .moveDown(1)
      .fontSize(12).font('Helvetica-Bold').text(headerText2,headerTextX2) // Aplicando negritas a "USUARIOS REGISTRADOS"
      .fontSize(12).font('Arial').text(headerText3,headerTextX3);
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 15;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 60, yPosition - 16)
              .text('Total_Miembro por Ministerio', 280, yPosition - 16)
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX+30, yPosition-20, tableWidth-75,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX+30, yPosition-20, tableWidth-75,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX+30, yPosition-20, tableWidth-75, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 60, yPosition - 16)
            .text('Total_Miembros por  Ministerio', 210, yPosition - 16)
          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 60, yPosition + 2)
            .text(item.nombre_completo_miembro, 10, yPosition + 2, {align: 'center'})

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});








router.post("/reportes_egreso", async (req, res) => {
  const { fechade, fechaA } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.egreso(fechade, fechaA);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    /* const date = data[0].nombre_ministerio; */

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);
    const fontpath = path.join(__dirname,"../../../public/font/Arial.ttf")

    doc.registerFont('Arial', fontpath)

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `DETALLES DE EGRESO`;
    //const headerText3 = `Ministerio: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    //const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    //const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
     /*  doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         //.fontSize(12).text(headerText3,headerTextX3)
         .fontSize(12).text(headerText4,headerTextX4); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
   .text(headerText1, 160, headerTextY)
   .moveDown(1)
   .fontSize(12).text(headerText2,headerTextX2) 
   .fontSize(12).font('Arial').text(headerText4,headerTextX4); // Aplicando negritas a "DETALLES DE INGRESO"

      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 15;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Usuario', 90, yPosition - 16)
              .text('Tipo de egreso', 235, yPosition - 16)
              .text('Monto', 415, yPosition - 16)
              .text('Fecha_egreso', 475, yPosition - 16);
            
            numero++
        } 
        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Usuario', 90, yPosition - 16)
            .text('Tipo de egreso', 235, yPosition - 16)
            .text('Monto', 415, yPosition - 16)
            .text('Fecha_egreso', 475, yPosition - 16);

          i = false
        }
          
        doc.fontSize(9).fill('#000000')
            .font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.usuario_nombres, -390, yPosition + 2, {align: 'center'})
            .text(item.tipo_egreso_nombre, -50, yPosition + 2, {align: 'center'})
            .text(item.monto, 250, yPosition + 2, {align: 'center'})
            .text(item.fecha_egreso, 420, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});








router.post("/reportes_ingreso", async (req, res) => {
  const { fechade, fechaA } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.ingreso(fechade, fechaA);
    if (result.error) {   
      return res.status(404).send(result.message);
    }
    const data = result.data;
    /* const date = data[0].nombre_ministerio; */

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ layout: 'portrait', margin: 0 });
    let filename = "Recibo.pdf";
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    const fontPath = path.join(__dirname, '../../../public/font/Arial.ttf');

    doc.registerFont('Arial', fontPath);

    // Obtener la fecha actual y formatearla como DD/MM/YYYY
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Ruta del logo
    const logoPath = path.join(__dirname, "../../../public/img/WILL.png");

    const headerText1 = 'IGLESIA ASAMBLEA DE DIOS BOLIVIANA';
    const headerText2 = `DETALLES DE INGRESOS`;
    //const headerText3 = `Ministerio: ${date}`;
    const headerText4 = `del ${fechade} a ${fechaA}`;
    const headerTextWidth1 = doc.widthOfString(headerText1);
    const headerTextWidth2 = doc.widthOfString(headerText2);
    //const headerTextWidth3 = doc.widthOfString(headerText3);
    const headerTextWidth4 = doc.widthOfString(headerText4);
    const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
    const headerTextX2 = (doc.page.width - headerTextWidth2) / 2
    //const headerTextX3 = (doc.page.width - headerTextWidth3) / 2
    const headerTextX4 = (doc.page.width - headerTextWidth4) / 2
    const headerTextY = 30;


    const addHeader = () => {
      doc.image(logoPath, 30, 30, { width: 100 });
        
      /* doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
         .text(headerText1, 160, headerTextY)
         .moveDown(1)
         .fontSize(12).text(headerText2,headerTextX2)
         //.fontSize(12).text(headerText3,headerTextX3)
         .fontSize(12).text(headerText4,headerTextX4); */
         doc.fontSize(15).fill('#000000').font('Helvetica-Bold')
   .text(headerText1, 160, headerTextY)
   .moveDown(1)
   .fontSize(12).text(headerText2,headerTextX2) 
   .fontSize(12).font('Arial').text(headerText4,headerTextX4); 
      // Añadir la fecha en la parte superior derecha
     doc.fontSize(8)
        .text(formattedDate, doc.page.width - 80, 30);

    };
    
    const footer = (pageNumber, totalPages) =>{
        const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario

        doc.fontSize(8).fill('#000000')
            .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left' });
    }

    let pageNumber = 1;

    addHeader()

    const tableX = 20;
    const tableWidth = doc.page.width - 50;
    const contentHeight = 12; // Altura estimada del contenido que estás agregando

    let yPosition = 130;
    const rowHeight = 15;
    const maxRowsPerPage = Math.floor((doc.page.height - 190) / rowHeight);

    const totalRows = data.length;
    const totalContentRows = totalRows;
    const totalPages = Math.ceil(totalContentRows / maxRowsPerPage);

    let numero  = 1
    let borde = 5
    let i = true
    let e = true

    
    data.forEach(item => {
        if (yPosition + rowHeight > doc.page.height - 60) {
            footer(pageNumber, totalPages);
            doc.addPage();
            addHeader()
            pageNumber++;
            yPosition = 130;
            if (e) {
              let registrosUltimaPagina = 0;
              if (totalRows % maxRowsPerPage === 0) {
                  // Si el número total de registros es múltiplo de maxRowsPerPage, la última página está llena
                  registrosUltimaPagina = maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              } else {
                  // Si no, el número de registros en la última página es el resto de la división
                  registrosUltimaPagina = totalRows % maxRowsPerPage;
                  doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosUltimaPagina * rowHeight) + 20,borde).stroke();
              }
              e = false
            }
            doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();


            doc.fontSize(12).fill('#ffffff')
              .font('Helvetica-Bold')
              .text('Nº', 25, yPosition - 16)
              .text('Usuario', 70, yPosition - 16)
              .text('Tipo de ingreso', 210, yPosition - 16)
              .text('Miembro', 405, yPosition - 16)
              .text('Monto', 520, yPosition - 16);
            
            numero++
        } 

        if (i) {
          let registrosPrimeraPagina = 0;
            if (totalRows > maxRowsPerPage) {
                registrosPrimeraPagina = maxRowsPerPage;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            } else {
                // Si hay menos registros que el máximo por página, todos están en la primera página
                registrosPrimeraPagina = totalRows;
                doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth,(registrosPrimeraPagina * rowHeight) + 20,borde).stroke();
            }
        }


        if (i) {
          doc.lineWidth(1).roundedRect(tableX, yPosition-20, tableWidth, contentHeight+5, borde).fill('#031D35').stroke();

          doc.fontSize(12).fill('#ffffff')
            .font('Helvetica-Bold')
            .text('Nº', 25, yPosition - 16)
            .text('Usuario', 70, yPosition - 16)
            .text('Tipo de ingreso', 210, yPosition - 16)
            .text('Miembro', 405, yPosition - 16)
            .text('Monto', 520, yPosition - 16);

          i = false
        }
          
        doc.fontSize(9).fill('#000000').font('Arial')
            .text(numero, 25, yPosition + 2)
            .text(item.nombre_completo_usuario, -420, yPosition + 2, {align: 'center'})
            .text(item.tipo_ingreso_nombre, -100, yPosition + 2, {align: 'center'})
            .text(item.nombre_completo_miembro, 250, yPosition + 2, {align: 'center'})
            .text(item.monto, 460, yPosition + 2, {align: 'center'});

        yPosition += rowHeight ;
        numero++
        
    });

    footer(pageNumber, totalPages);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al generar el PDF");
  }
});

module.exports = router;