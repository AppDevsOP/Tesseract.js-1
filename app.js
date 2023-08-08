const express = require('express');
const Tesseract = require('tesseract.js');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Configurar multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.use(express.static('public'));

app.post('/api/ocr', upload.single('imageFile'), (req, res) => {
  const imagePath = req.file.path;
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
  
    // Eliminar el archivo cargado después del procesamiento
    fs.unlink(imagePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      }
    });
  
    res.json(extractedData);
  }).catch(error => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el procesamiento de la imagen' });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
