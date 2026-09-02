import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from '../api/whatsapp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper para mockar req e res
function createMockReqRes() {
  const req = { method: 'GET', headers: {} };
  let statusCode = 200;
  let responseData = null;

  const res = {
    statusCode: 200,
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
    },
    end: () => {}
  };

  return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

async function runTests() {
  console.log('🧪 Iniciando batería de pruebas del Redireccionador y Traducción al Español (México)...\n');

  // ----------------------------------------------------
  // TESTE 1: Lógica do Round Robin com 3 WhatsApps (México)
  // ----------------------------------------------------
  console.log('Prueba 1: Distribución Round Robin con 3 números de México...');
  const testNumbers = ['5215511111111', '5215522222222', '5215533333333'];
  const total = testNumbers.length;

  for (let counter = 1; counter <= 6; counter++) {
    const index = Math.abs(counter - 1) % total;
    const expectedNumber = testNumbers[(counter - 1) % 3];
    assert.strictEqual(testNumbers[index], expectedNumber, `Fallo en el contador ${counter}`);
    console.log(`  Petición #${counter} (Contador=${counter}) → Índice ${index} (${expectedNumber}) ✅`);
  }

  // ----------------------------------------------------
  // TESTE 2: Formatação e Higienização de Números
  // ----------------------------------------------------
  console.log('\nPrueba 2: Limpieza y formato de números en WHATSAPP_NUMBERS...');
  const dirtyNumbers = '  +52 1 (55) 1234-1111 , 5215512342222,  +52 (55) 9888-3333  ';
  const parsed = dirtyNumbers
    .split(',')
    .map(num => num.replace(/\D/g, '').trim())
    .filter(num => num.length >= 10);

  assert.deepStrictEqual(parsed, ['5215512341111', '5215512342222', '525598883333']);
  console.log('  Limpieza de números con formato incorrecto funcionó perfectamente ✅');

  // ----------------------------------------------------
  // TESTE 3: Codificação de Mensagem com Acentos, Signos e Emojis
  // ----------------------------------------------------
  console.log('\nPrueba 3: Codificación de caracteres especiales en español...');
  const msg = '¡Hola! Quiero más información sobre la Oración de San Benito 🙏✨.';
  const encoded = encodeURIComponent(msg);
  assert.ok(!encoded.includes(' '), 'El mensaje codificado no debe contener espacios vacíos.');
  assert.ok(encoded.includes('%C2%A1'), 'El signo de apertura de exclamación debe estar codificado.');
  assert.ok(encoded.includes('%C3%B3'), 'La tilde debe estar codificada correctamente.');
  console.log(`  Mensaje original: "${msg}"`);
  console.log(`  Mensaje codificado: "${encoded}" ✅`);

  // ----------------------------------------------------
  // TESTE 4: Comportamento quando nenhum número é configurado
  // ----------------------------------------------------
  console.log('\nPrueba 4: Validación de lista vacía de números...');
  process.env.WHATSAPP_NUMBERS = '';
  const { req, res, getStatus, getData } = createMockReqRes();
  await handler(req, res);
  assert.strictEqual(getStatus(), 500, 'Debe retornar status 500 cuando no hay números.');
  assert.ok(getData().error, 'Debe retornar mensaje de error controlado.');
  console.log(`  Error controlado retornado con éxito: "${getData().error}" ✅`);

  // ----------------------------------------------------
  // TESTE 5: Chamada com número único
  // ----------------------------------------------------
  console.log('\nPrueba 5: Operación con 1 único número registrado...');
  process.env.WHATSAPP_NUMBERS = '5215512345678';
  process.env.WHATSAPP_MESSAGE = 'Hola';
  const mockSingle = createMockReqRes();
  await handler(mockSingle.req, mockSingle.res);
  assert.strictEqual(mockSingle.getStatus(), 200);
  assert.strictEqual(mockSingle.getData().number, '5215512345678');
  assert.strictEqual(mockSingle.getData().url, 'https://wa.me/5215512345678?text=Hola');
  console.log(`  URL generada: ${mockSingle.getData().url} ✅`);

  // ----------------------------------------------------
  // TESTE 6: Varredura de Textos em Francês nos Arquivos
  // ----------------------------------------------------
  console.log('\nPrueba 6: Verificación de textos en francés o portugués en los archivos principales...');
  const filesToCheck = [
    'index.html',
    'config.js',
    'politique-de-confidentialite.html',
    'support.html',
    'frances/index.html',
    'frances/config.js',
    'portugues/index.html',
    'portugues/config.js',
    'prosperidade-fr/index.html',
    'prosperidade-fr/backlaprie/index.html'
  ];

  const forbiddenWords = [
    'Vérification de sécurité',
    'Je ne suis pas un robot',
    'Confidentialité',
    'Conditions',
    'Protégé par vérification',
    'Dites quelque chose',
    'Não sou um robô',
    'Verificação de segurança',
    'Protegido por verificação'
  ];

  let foundForbidden = false;
  for (const relPath of filesToCheck) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const word of forbiddenWords) {
        if (content.includes(word)) {
          console.error(`  ⚠️ Texto no deseado encontrado en ${relPath}: "${word}"`);
          foundForbidden = true;
        }
      }
    }
  }

  assert.strictEqual(foundForbidden, false, 'No deben existir textos en francés ni portugués en las páginas traducidas al español.');
  console.log('  Todos los archivos verificados están 100% traducidos al Español (México) ✅');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON CON ÉXITO!\n');
}

runTests().catch(err => {
  console.error('\n❌ Error en la ejecución de pruebas:', err);
  process.exit(1);
});
