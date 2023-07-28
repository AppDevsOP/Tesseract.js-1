const Tesseract = require('tesseract.js');

// Ruta de la imagen que deseas procesar
const imagePath = './Texto2.jpg';

// Realiza el OCR en la imagen
Tesseract.recognize(
  imagePath,           // Ruta de la imagen
  'spa+eng',               // Idioma de reconocimiento (en este caso, español)
  {
    logger: info => console.log(info.progress) // Mostrar el progreso del OCR en la consola
  }
).then(({ data: { text } }) => {
  console.log('Texto extraído:', text);

  // Buscar las palabras clave y extraer los valores asociados
  const keywords = ['Subtotal', 'IVA', 'Fecha', 'Total', 'Fecha vencimiento', 'Carretera' ];
  const extractedData = {};

  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}\\s+([\\d,.]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      extractedData[keyword] = match[1].trim(); // No se realiza el reemplazo de comas por puntos
    } else {
      extractedData[keyword] = 'No encontrado';
    }
  }
  
  console.log('Datos extraídos:', extractedData);
}).catch(error => {
  console.error('Error:', error);
});
