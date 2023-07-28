// app.js
const express = require('express');
const Tesseract = require('tesseract.js');

const app = express();

// ... (otros middleware y rutas)
app.use(express.json());


// Ruta para procesar la imagen y realizar el OCR
app.post('/api/ocr', (req, res) => {
  const imagePath = req.body.imagePath; // Asegúrate de enviar la ruta de la imagen en el cuerpo de la solicitud (en el caso de una solicitud POST)
  const keywords = ['Subtotal', 'IVA', 'Fecha', 'Total', 'Fecha vencimiento', 'Carretera'];
  const extractedData = {};

  Tesseract.recognize(
    imagePath,
    'spa+eng',
    {
      logger: info => console.log(info.progress)
    }
  ).then(({ data: { text } }) => {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}\\s+([\\d,.]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        extractedData[keyword] = match[1].trim();
      } else {
        extractedData[keyword] = 'No encontrado';
      }
    }
  
    res.json(extractedData);
  }).catch(error => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el procesamiento de la imagen' });
  });
});

// ... (más rutas y configuraciones)

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
