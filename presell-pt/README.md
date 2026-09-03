# Presell em Português (Checkout Wiapy)

Estrutura de presell de alta conversão no formato de verificação de segurança (estilo reCAPTCHA), totalmente em Português do Brasil (pt-BR), **sem nenhum pixel de rastreamento** e com redirecionamento direto para o checkout da Wiapy.

---

## 🎯 Configuração Atual

- **Link de Checkout configurado:** `https://pay.wiapy.com/JErhaN8O_CGI`
- **Pixels instalados:** Nenhum (código 100% limpo)
- **Idioma:** Português do Brasil (`pt-BR`)
- **Preservação de UTMs:** Ativa (qualquer parâmetro como `utm_source`, `utm_campaign`, etc. colocado na URL da presell é automaticamente repassado ao link do checkout)

---

## 📁 Arquivos da Pasta `presell-pt`

- `index.html`: Página principal com o design da verificação e script de redirecionamento.
- `config.js`: Arquivo onde você pode alterar o link de destino e textos rapidamente.
- `assets/style.css`: Folha de estilo isolada e independente.

---

## ⚙️ Como Alterar o Link do Checkout

Abra o arquivo `config.js` dentro da pasta `presell-pt`:

```javascript
window.PRESELL_CONFIG = {
  destinationUrl: 'https://pay.wiapy.com/JErhaN8O_CGI',
  delayAfterClick: 600,
  title: 'Verificação de segurança',
  checkboxText: 'Não sou um robô',
  footerText: 'Protegido por verificação · Privacidade · Termos',
  errorMessage: 'Não foi possível continuar neste momento. Tente novamente.'
};
```

Basta alterar a linha `destinationUrl` para o link que desejar.

---

## 🚀 Como Testar Localmente

1. No terminal do projeto:
   ```bash
   npm start
   ```
2. Abra no navegador:
   `http://localhost:3000/presell-pt`
3. Ao clicar em "Não sou um robô", após a animação ele redirecionará direto para:
   `https://pay.wiapy.com/JErhaN8O_CGI`
