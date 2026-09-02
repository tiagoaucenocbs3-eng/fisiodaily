import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './api/whatsapp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env si existe
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// Configuraciones por defecto para pruebas si no están en .env
if (!process.env.WHATSAPP_NUMBERS) {
  process.env.WHATSAPP_NUMBERS = '5573981246685';
}
if (!process.env.WHATSAPP_MESSAGE) {
  process.env.WHATSAPP_MESSAGE = 'Hola, vi el anuncio y me gustaría recibir más información.';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Ruta de la API Serverless: /api/whatsapp
  if (pathname === '/api/whatsapp' || pathname === '/api/whatsapp/') {
    const customRes = {
      setHeader: (k, v) => res.setHeader(k, v),
      status: (statusCode) => {
        res.statusCode = statusCode;
        return customRes;
      },
      json: (data) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
      },
      end: (chunk) => res.end(chunk)
    };

    return handler(req, customRes);
  }

  // Servir archivos estáticos
  let safePath = path.normalize(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.statusCode = 403;
    return res.end('Acceso denegado');
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    safePath = path.join(safePath, 'index.html');
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Página no encontrada (404)');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Servidor de desarrollo local iniciado!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📱 Números de WhatsApp cargados: ${process.env.WHATSAPP_NUMBERS}`);
  console.log(`💬 Mensaje: "${process.env.WHATSAPP_MESSAGE}"\n`);
});
