# 🛡️ Guia da White Page em Francês para TikTok Ads

Esta estrutura foi desenvolvida especificamente para servir como **Safe Page (White Page)** de altíssima autoridade e conformidade para o **TikTok Ads** no mercado francófono (França, Bélgica, Suíça, Canadá, etc.).

---

## 🎯 Por que esta página é aprovada com 100% de facilidade?

Os robôs e moderadores manuais da ByteDance / TikTok Ads verificam critérios rígidos antes de aprovar anúncios:

1. **Conteúdo Real e Legítimo (Estilo Editorial/Magazine):**
   - Não parece uma página fantasma ou "fake reCAPTCHA" (que o TikTok frequentemente bloqueia por prática enganosa/circumvention).
   - Apresenta um artigo editorial aprofundado, redigido em francês nativo e elegante sobre **Clarté Mentale, Sérénité et Rituels de Bien-Être** (*L'Éveil Quotidien*).
   - Esse tema é 100% white, transmite alta credibilidade e possui congruência perfeita com nichos de desenvolvimento pessoal, espiritualidade, meditação, estilo de vida e produtividade.

2. **Páginas Legais Completas e Obrigatórias (Legislação Francesa & RGPD):**
   - [index.html](file:///c:/Users/tiago/Downloads/estruturas/presell-central-idiomas/white-fr/index.html): Página principal com artigo, FAQ interativo, banner de cookies e captura.
   - [politique-de-confidentialite.html](file:///c:/Users/tiago/Downloads/estruturas/presell-central-idiomas/white-fr/politique-de-confidentialite.html): Política de Privacidade completa em conformidade com o RGPD (GDPR).
   - [mentions-legales.html](file:///c:/Users/tiago/Downloads/estruturas/presell-central-idiomas/white-fr/mentions-legales.html): Menções legais obrigatórias pela lei francesa LCEN (exigidas na Europa).
   - [conditions-utilisation.html](file:///c:/Users/tiago/Downloads/estruturas/presell-central-idiomas/white-fr/conditions-utilisation.html): Termos de uso (CGU).
   - [contact.html](file:///c:/Users/tiago/Downloads/estruturas/presell-central-idiomas/white-fr/contact.html): Central de contato e suporte com formulário funcional.

3. **Cláusula de Isenção Oficial (Disclaimer TikTok):**
   - Rodapé com a declaração explícita de não afiliação com a TikTok™ / ByteDance Ltd., exigida pelas políticas de anúncios.

4. **Performance e UX:**
   - Design ultra-rápido, responsivo (mobile-first), sem fontes pesadas externas, sem imagens quebradas e com ícones vetoriais SVG nativos.
   - Banner de cookies interativo com persistência em `localStorage`.

---

## 🚀 Como Configurar e Usar

### 1. Inserir o seu Pixel do TikTok
No arquivo [index.html](file:///c:/Users/tiago/Downloads/estruturas/presell-central-idiomas/white-fr/index.html) (linhas 24-25), basta descomentar e colar o seu Pixel ID:

```javascript
// Substitua VOTRE_PIXEL_ID pelo código gerado no TikTok Ads Manager:
ttq.load('SEU_PIXEL_AQUI');
ttq.page();
```

### 2. Formas de Implementação

- **Opção A: No seu Cloaker (Keitaro, HideClick, Cloakerly, etc.):**
  - Aponte o tráfego de **Revisores / Bots / Tráfego Não Filtrado** para a URL da pasta `white-fr/index.html` (ou subdomínio correspondente).
  - O robô do TikTok e o analista humano verão um portal editorial perfeito e legítimo, aprovando o anúncio sem restrições.

- **Opção B: Como Safe Page Direta no Domínio:**
  - Se você quiser que ela seja a página inicial do domínio, você pode mover os arquivos da pasta `white-fr/` para a raiz do seu site ou configurar no seu `vercel.json` / Apache / Nginx.
  - Para testar localmente ou na Vercel: basta acessar `https://seu-dominio.com/white-fr/`.

---

## 📁 Estrutura dos Arquivos Criados

| Arquivo | Finalidade |
|---|---|
| `white-fr/index.html` | Página editorial principal em francês com artigo e FAQ |
| `white-fr/style.css` | Estilo moderno, responsivo e limpo |
| `white-fr/politique-de-confidentialite.html` | Política de Privacidade RGPD |
| `white-fr/mentions-legales.html` | Menções Legais (LCEN obrigatório na França) |
| `white-fr/conditions-utilisation.html` | Termos e Condições de Uso (CGU) |
| `white-fr/contact.html` | Página de Contato e Formulário de Suporte |
