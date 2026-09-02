/**
 * API Serverless para Vercel: Redireccionador Global de WhatsApp con Round Robin Atómico
 * Compatible nativamente con la infraestructura Serverless de Vercel y Upstash Redis.
 */

export default async function handler(req, res) {
  // Configuración de encabezados CORS para permitir peticiones del frontend
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Respuesta para peticiones preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Obtener y limpiar la lista de números configurados (con fallback automático por defecto)
    const rawNumbers = (process.env.WHATSAPP_NUMBERS && process.env.WHATSAPP_NUMBERS.trim() !== '')
      ? process.env.WHATSAPP_NUMBERS
      : '5573981246685';

    const validNumbers = rawNumbers
      .split(',')
      .map(num => num.replace(/\D/g, '').trim())
      .filter(num => num.length >= 10); // Estándar internacional (ej: 5215512345678 o 5511999999999)

    // Si no hay números configurados, usa el fallback seguro
    if (validNumbers.length === 0) {
      validNumbers.push('5573981246685');
    }

    // 2. Obtener el mensaje predeterminado
    const defaultMessage = 'Hola, vi el anuncio y me gustaría recibir más información.';
    const message = process.env.WHATSAPP_MESSAGE !== undefined && process.env.WHATSAPP_MESSAGE !== ''
      ? process.env.WHATSAPP_MESSAGE
      : defaultMessage;

    let chosenIndex = 0;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    // 3. Incremento atómico en Upstash Redis para Round Robin Global
    if (redisUrl && redisToken) {
      try {
        const cleanRedisUrl = redisUrl.replace(/\/+$/, '');
        const redisResponse = await fetch(`${cleanRedisUrl}/incr/whatsapp_rotation_counter`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (redisResponse.ok) {
          const redisData = await redisResponse.json();
          // Upstash Redis devuelve { result: <numero_incrementado> }
          const counter = Number(redisData.result);
          if (!isNaN(counter)) {
            // Operación atómica de Round Robin: (counter - 1) % totalDeNumeros
            chosenIndex = Math.abs(counter - 1) % validNumbers.length;
          }
        } else {
          console.error('Fallo en la respuesta de Upstash Redis:', await redisResponse.text());
          // Fallback resiliente en caso de fallo de respuesta de Redis
          chosenIndex = Math.floor(Math.random() * validNumbers.length);
        }
      } catch (redisError) {
        console.error('Error al conectar con Upstash Redis:', redisError);
        // Fallback resiliente: evita que el usuario se quede detenido si Redis no responde
        chosenIndex = Math.floor(Math.random() * validNumbers.length);
      }
    } else {
      // Si Redis no está configurado (ej: ambiente local de prueba rápida), usa rotación alternativa
      chosenIndex = Math.floor(Math.random() * validNumbers.length);
    }

    const chosenNumber = validNumbers[chosenIndex];

    // 4. Construir la URL segura de WhatsApp con mensaje codificado
    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = encodedMessage
      ? `https://wa.me/${chosenNumber}?text=${encodedMessage}`
      : `https://wa.me/${chosenNumber}`;

    // 5. Retornar respuesta JSON segura
    return res.status(200).json({
      url: whatsappUrl,
      number: chosenNumber,
      index: chosenIndex
    });
  } catch (error) {
    console.error('Error en el procesamiento del redireccionador de WhatsApp:', error);
    return res.status(500).json({
      error: 'No fue posible generar la redirección hacia WhatsApp.'
    });
  }
}
