// const XLSX = require('xlsx');

// // Datos de ejemplo por sección
// const usuariosData = [
//   { Tipo: 'Total', Cantidad: 150 },
//   { Tipo: 'Activos', Cantidad: 120 },
//   { Tipo: 'No Activos', Cantidad: 30 },
//   { Tipo: 'Usuarios como Administrador', Detalle: '40' },
//   { Tipo: 'Usuarios como Moderador', Detalle: '40' },

// ];

// const publicacionesData = [
//   { Tipo: 'Total', Cantidad: 200 },
//   { Tipo: 'Activas', Cantidad: 180 },
//   { Tipo: 'Desactivadas', Cantidad: 10 },
//   { Tipo: 'Cerradas', Cantidad: 10 },
//   { Tipo: 'Total de Comentarios en Publicaciones', Cantidad: '40' },

// ];

// const avistamientosData = [
//   { Tipo: 'Total', Cantidad: 50 },
//   { Tipo: 'Avisatamientos en publicaciones cerradas resueltas', Cantidad: 20 },
//   { Tipo: 'Avistamientos en publicaciones cerradas no resueltas', Cantidad: 30 },
// ];

// const materialEducativoData = [
//   { Tipo: 'Total', Cantidad: 100 },
//   { Tipo: 'Activos', Cantidad: 80 },
//   { Tipo: 'No Activos', Cantidad: 20 },
//   { Tipo: 'Material Educativo - PDF', Cantidad: '40', Vistas: '100' },
//   { Tipo: 'Material Educativo - Video', Cantidad: '40', Vistas: '100' },

// ];

// const crear_reporte_excel = (usuariosData,publicacionesData,avistamientosData,materialEducativoData) => {
// // Crear un libro de trabajo (workbook)
//     const workbook = XLSX.utils.book_new();

//     // Crear hojas de trabajo (worksheets) para cada sección
//     const usuariosSheet = XLSX.utils.json_to_sheet(usuariosData);
//     XLSX.utils.book_append_sheet(workbook, usuariosSheet, 'Usuarios');

//     const publicacionesSheet = XLSX.utils.json_to_sheet(publicacionesData);
//     XLSX.utils.book_append_sheet(workbook, publicacionesSheet, 'Publicaciones');

//     const avistamientosSheet = XLSX.utils.json_to_sheet(avistamientosData);
//     XLSX.utils.book_append_sheet(workbook, avistamientosSheet, 'Avistamientos');

//     const materialEducativoSheet = XLSX.utils.json_to_sheet(materialEducativoData);
//     XLSX.utils.book_append_sheet(workbook, materialEducativoSheet, 'Material Educativo');

//     // Escribir el archivo Excel
//     XLSX.writeFile(workbook, 'Reportes_FindUS.xlsx');

//     console.log('Archivo Excel creado con éxito: Reportes_FindUS.xlsx');
// }

// crear_reporte_excel(usuariosData,publicacionesData,avistamientosData,materialEducativoData);

// module.exports = {
//     crear_reporte_excel,
// };

const ExcelJS = require('exceljs');

// Función para crear estilos de encabezado
const applyHeaderStyles = (worksheet) => {
  const headerRow = worksheet.getRow(1); // Primera fila (encabezados)
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Texto blanco
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }, // Fondo azul
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
};

// Datos de ejemplo por sección
const usuariosData = [
  { Tipo: 'Total', Cantidad: 150 },
  { Tipo: 'Activos', Cantidad: 120 },
  { Tipo: 'No Activos', Cantidad: 30 },
  { Tipo: 'Usuarios como Administrador', Detalle: '40' },
  { Tipo: 'Usuarios como Moderador', Detalle: '40' },
];

const publicacionesData = [
  { Tipo: 'Total', Cantidad: 200 },
  { Tipo: 'Activas', Cantidad: 180 },
  { Tipo: 'Desactivadas', Cantidad: 10 },
  { Tipo: 'Cerradas', Cantidad: 10 },
  { Tipo: 'Total de Comentarios en Publicaciones', Cantidad: '40' },
];

const avistamientosData = [
  { Tipo: 'Total', Cantidad: 50 },
  { Tipo: 'Avisatamientos en publicaciones cerradas resueltas', Cantidad: 20 },
  { Tipo: 'Avistamientos en publicaciones cerradas no resueltas', Cantidad: 30 },
];

const materialEducativoData = [
  { Tipo: 'Total', Cantidad: 100 },
  { Tipo: 'Activos', Cantidad: 80 },
  { Tipo: 'No Activos', Cantidad: 20 },
  { Tipo: 'Material Educativo - PDF', Cantidad: '40', Vistas: '100' },
  { Tipo: 'Material Educativo - Video', Cantidad: '40', Vistas: '100' },
];

// Función para crear el reporte
const crear_reporte_excel = async (usuariosData,publicacionesData,avistamientosData,materialEducativoData) => {
  const workbook = new ExcelJS.Workbook();

  // Crear hojas y agregar datos
  const sheetsData = [
    { name: 'Usuarios', data: usuariosData },
    { name: 'Publicaciones', data: publicacionesData },
    { name: 'Avistamientos', data: avistamientosData },
    { name: 'Material Educativo', data: materialEducativoData },
  ];

  for (const { name, data } of sheetsData) {
    const sheet = workbook.addWorksheet(name);

    // Definir columnas y agregar datos
    sheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key: key,
      width: 30,
    }));
    sheet.addRows(data);

    // Aplicar estilos a los encabezados
    applyHeaderStyles(sheet);
  }

  // Guardar el archivo
//   await workbook.xlsx.writeFile('Reportes_FindUS.xlsx');
  const buffer = await workbook.xlsx.writeBuffer();
  const filebase64 = buffer.toString('base64');
  return filebase64;
//   console.log('Archivo Excel creado con éxito: Reportes_FindUS.xlsx');
};

// crear_reporte_excel(usuariosData,publicacionesData,avistamientosData,materialEducativoData).then((filebase64) => {
//     console.log('Archivo Excel creado con éxito');
//     console.log(filebase64);
// });

module.exports = {
    crear_reporte_excel,
};