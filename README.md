# Presell con Redireccionador Global de Múltiples WhatsApps (Round Robin) en Vercel

Estructura completa de presell de alta conversión traducida al **Español de México (es-MX)**, con **TikTok Pixel**, scripts de rastreo y sistema de **redirección de múltiples números de WhatsApp** utilizando **Round Robin Global Atómico** mediante **Upstash Redis** en **Vercel**.

---

## 📋 Sumario
1. [Visión General de la Arquitectura](#-visión-general-de-la-arquitectura)
2. [Cómo Funciona el Round Robin Global](#-cómo-funciona-el-round-robin-global)
3. [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
4. [Configuración del Archivo `.env`](#-configuración-del-archivo-env)
5. [Cómo Configurar Upstash Redis (Gratuito)](#-cómo-configurar-upstash-redis-gratuito)
6. [Cómo Registrar y Administrar los Números de WhatsApp](#-cómo-registrar-y-administrar-los-números-de-whatsapp)
7. [Cómo Cambiar el Mensaje Automático](#-cómo-cambiar-el-mensaje-automático)
8. [Cómo Subir a GitHub con Seguridad](#-cómo-subir-a-github-con-seguridad)
9. [Cómo Publicar en Vercel y Configurar Variables de Entorno](#-cómo-publicar-en-vercel-y-configurar-variables-de-entorno)
10. [Cómo Probar y Validar la Distribución](#-cómo-probar-y-validar-la-distribución)
11. [Cómo Reiniciar o Resetear el Contador](#-cómo-reiniciar-o-resetear-el-contador)

---

## 🎯 Visión General de la Arquitectura

El flujo de conversión sigue el estándar:

```
Anuncio en TikTok Ads
       ↓
Presell en Español de México (Diseño y Pixel Preservados)
       ↓
Clic voluntario en el botón "No soy un robot"
       ↓
Disparo / Preservación del evento TikTok Pixel (ClickButton / Page)
       ↓
Bloqueo inmediato de doble clic + Animación de verificación
       ↓
Petición asíncrona a /api/whatsapp (preservando UTMs y ttclid)
       ↓
API Serverless en Vercel realiza incremento atómico en Upstash Redis
       ↓
Cálculo exacto: index = (counter - 1) % totalDeNumeros
       ↓
Generación de URL segura: https://wa.me/521XXXXXXXXXX?text=MENSAJE
       ↓
Respuesta JSON → Redirección instantánea del usuario a WhatsApp
```

---

## 🔄 Cómo Funciona el Round Robin Global

La distribución de prospectos entre tus números de WhatsApp es **global y concurrente**:
- **Lead 1** → WhatsApp 1
- **Lead 2** → WhatsApp 2
- **Lead 3** → WhatsApp 3
- **Lead 4** → WhatsApp 1
- **Lead 5** → WhatsApp 2
- ...y así sucesivamente.

### ¿Por qué es verdaderamente global?
El control no se guarda en el navegador del visitante (localStorage/cookies) ni en la memoria volátil de la función serverless. El contador reside en **Upstash Redis** y utiliza la instrucción **`INCR whatsapp_rotation_counter`**, que es **100% atómica**. Esto garantiza que incluso si 100 personas hacen clic al mismo tiempo desde diferentes ciudades o dispositivos, cada una recibirá el siguiente número sin colisiones.

---

## 💻 Instalación y Ejecución Local

### Requisitos:
- Node.js instalado (v18 o superior).

### Paso a paso:

1. Abre la terminal en la carpeta del proyecto:
```bash
cd presell-central-idiomas
```

2. Crea el archivo `.env` a partir de `.env.example`:
```bash
cp .env.example .env
```

3. Inicia el servidor local de desarrollo:
```bash
npm start
```
*(o `node server.js`)*

4. Abre en tu navegador:
```
http://localhost:3000
```

---

## ⚙️ Configuración del Archivo `.env`

En tu entorno local (o en las Environment Variables de Vercel), configura:

```env
# Lista de números de WhatsApp en formato internacional (separados por coma)
# Ejemplo para México (52 + 1 + 10 dígitos o 52 + 10 dígitos):
WHATSAPP_NUMBERS=5215512345678,5215587654321,5215598765432

# Mensaje automático inicial enviado en WhatsApp
WHATSAPP_MESSAGE=Hola, vi el anuncio y me gustaría recibir más información.

# Credenciales REST de Upstash Redis
UPSTASH_REDIS_REST_URL=https://tu-base-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token_aqui
```

---

## 🗄️ Cómo Configurar Upstash Redis (Gratuito)

1. Ingresa a **[console.upstash.com](https://console.upstash.com)** y regístrate gratis.
2. Haz clic en **"Create Database"**.
3. Elige un nombre (ej: `whatsapp-rotator`) y la región más cercana (ej: `us-east-1`).
4. Selecciona el plan gratuito y haz clic en **Create**.
5. En la página de la base de datos, ve a la sección **"REST API"**.
6. Copia:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
7. Pega estos valores en tu `.env` local y en las variables de Vercel.

---

## 📱 Cómo Registrar y Administrar los Números de WhatsApp

### Formato de los números:
- Formato internacional sin espacios, guiones ni signos `+`.
- México: `521` + 10 dígitos (ej: `5215512345678`) o `52` + 10 dígitos.
- También soporta cualquier otro país (ej: `5511...`, `5730...`, `1...`).

### Cómo agregar un nuevo WhatsApp:
Agrega el número al final de `WHATSAPP_NUMBERS`, separado por coma:
```env
WHATSAPP_NUMBERS=5215512345678,5215587654321,5215598765432,5213398765432
```

### Cómo quitar o pausar un WhatsApp:
Elimina el número de la lista en `WHATSAPP_NUMBERS`. La rotación se actualizará inmediatamente sin modificar código.

---

## 💬 Cómo Cambiar el Mensaje Automático

En la variable `WHATSAPP_MESSAGE`, escribe el mensaje deseado en español:
```env
WHATSAPP_MESSAGE=¡Hola! Acabo de ver la información y quiero saber cómo empezar.
```
*El sistema codifica automáticamente los espacios, signos de apertura (¡, ¿), tildes y emojis.*

---

## 🔒 Cómo Subir a GitHub con Seguridad

El proyecto incluye un archivo `.gitignore` configurado para no subir archivos `.env` ni credenciales privadas.

Comandos para enviar a GitHub:
```bash
git add .
git commit -m "feat: traduccion completa a Espanol Mexico y rotador WhatsApp"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

---

## 🚀 Cómo Publicar en Vercel y Configurar Variables

1. Entra a **[Vercel](https://vercel.com)**.
2. Haz clic en **"Add New..."** → **"Project"**.
3. Importa el repositorio de GitHub.
4. En **"Environment Variables"**, agrega:
   - `WHATSAPP_NUMBERS`: Tus números separados por comas.
   - `WHATSAPP_MESSAGE`: Tu mensaje inicial en español.
   - `UPSTASH_REDIS_REST_URL`: Tu URL REST de Upstash Redis.
   - `UPSTASH_REDIS_REST_TOKEN`: Tu Token REST de Upstash Redis.
5. Haz clic en **"Deploy"**.

---

## 🧪 Cómo Probar y Validar la Distribución

### 1. Batería de Pruebas Automatizadas:
Ejecuta en la terminal:
```bash
npm test
```

### 2. Prueba Manual entre Dispositivos:
1. Abre el enlace publicado en tu **computadora** y haz clic en el botón de verificación.
2. Abre el enlace en tu **celular** (o en modo incógnito) y haz clic.
3. Cada clic rotará al siguiente WhatsApp configurado en secuencia.

---

## 🔄 Cómo Reiniciar el Contador

Si deseas reiniciar la rotación desde el primer número:
1. Entra al panel de **[Upstash Redis](https://console.upstash.com)**.
2. Ve a la pestaña **"CLI"** o **"Data Browser"**.
3. Ejecuta:
```redis
DEL whatsapp_rotation_counter
```
El siguiente clic enviará el lead al **WhatsApp 1** de la lista.
