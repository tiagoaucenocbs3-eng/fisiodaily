# Página ajustada — relatório de alterações

**Regra seguida:** nenhum conteúdo visível foi removido. Comparei o texto renderizado antes e depois — a única diferença é o título duplicado, o caractere corrompido e as tags inválidas. Todo o resto (VSL, título, canal, botões, chat, descrição, rodapé, back-redirect) está intacto.

---

## 1. O bug do seu print — RESOLVIDO

O ícone quebrado era o **botão de enviar do LIVE CHAT**.

No HTML havia o byte `EF BF BD` (caractere de substituição Unicode, `U+FFFD`) no lugar do ícone:

```html
<button class="send-btn2" onclick="sendUserMsg2()">�</button>
```

Isso acontece quando o emoji original se perde na hora de salvar/copiar o arquivo fora de UTF-8. O navegador desenha o losango com "?" — e como o botão tem `color:#065fd4`, ele aparecia **azul**, exatamente como no seu print.

**Correção:** substituí por um ícone SVG de avião de papel (mesmo desenho do YouTube), com `currentColor`. SVG não depende de fonte nem de encoding, então nunca mais quebra em nenhum aparelho.

---

## 2. Bug grave que o print não mostrava — o vídeo cobria o conteúdo

O container do Elementor usa `flex-direction: column` + `flex-wrap: wrap`. Nessa combinação o Chrome **colapsa a altura** do widget que contém o player (o placeholder do VTurb usa `padding: 133.33%` para segurar a proporção 3:4).

Resultado medido: o widget do player ficava com **altura 0px**, e o retângulo preto do vídeo (533px) era desenhado **por cima** do título, do nome do canal e dos botões — com texto escuro sobre fundo preto, ilegível.

Isso ficava visível durante todo o carregamento do player e permanecia para sempre em quem usa bloqueador de anúncios.

**Correção** (em `css/post-170.css`): `--flex-wrap: nowrap` no container. Altura do widget medida depois: **533px**, com o conteúdo começando corretamente abaixo do vídeo.

---

## 3. Pixels de rastreamento removidos

| O que | Onde estava |
|---|---|
| **UTMify Pixel** (`pixelId 6a556a7df80c57d220d7963a`) | widget `a9a1650` |
| **UTMify `latest.js`** (captura de UTM/subids) | widget `f187398` — arquivo também apagado da pasta |
| **PostHog** (`phc_ARuX5jjs…`, `us.i.posthog.com`) | widget `1e8eb4f` |

O script do PostHog ainda estava **corrompido pelo scraper** (`e.SV(...)`, `u.people=u.people[]`) e lançava `Uncaught SyntaxError: Unexpected token ']'` em todo carregamento.

**Mantidos de propósito:** o player VTurb/ConverteAI (é a VSL) e o back-redirect para `jamessam.site/backlaprie/`.

---

## 4. Outros bugs corrigidos

- **`<title>` duplicado** e com byte de controle `\x13` no lugar do travessão → `La Prière Sacrée de Saint Benoît – prosperidadepazy.shop`
- **`<meta viewport>` duplicado e conflitante** (um sem `viewport-fit=cover`) → unificado
- **`lang="pt-BR"`** numa página 100% em francês → `lang="fr"` (evita o Chrome oferecer tradução e corrige leitores de tela)
- **`<meta charset>`, `<meta viewport>` e `<title>Pied de page Checkout</title>` dentro do `<body>`** (herdados do widget de rodapé) → removidos, eram HTML inválido
- **XSS no chat:** a mensagem digitada ia para `innerHTML`. Digitar `<img src=x onerror=...>` executava script. Agora usa `createTextNode`. Testado.
- **Fallback dos avatares do chat:** o `onerror` chamava `div.replaceChild()` sem checar se o `<img>` já estava no DOM — dava `NotFoundError` quando o erro vinha do cache. Agora usa `avatarEl.parentNode` com guarda.
- **Botão Partilhar:** `navigator.clipboard.writeText()` sem `.catch()` — quebrava em HTTP e em iOS antigo. Agora tem fallback.
- **Feeds RSS** com caractere corrompido no `title`
- **Avatar do canal** sem `width`/`height` → causava layout shift. Agora tem dimensões e fallback com iniciais.

---

## 5. Otimizações

| Item | Antes | Depois |
|---|---|---|
| `images/imagem.jpg` | 1024×676, **155 KB** (exibida em 40×40) | 160×160, **4,7 KB** — **−97%** |
| JavaScript carregado | ~316 KB (jQuery, jQuery Migrate, jQuery UI, Elementor, Elementor Pro, wp-i18n, hooks) | **0 KB** de JS local |
| Google Fonts | 3 requisições (Roboto com 18 pesos + Roboto Slab com 18 pesos + Roboto css2) | 1 requisição (Roboto 400/500/700) |
| Loader de emoji do WordPress | ~10 KB inline + requisição | removido |
| Bloco de newsletter Hostinger | CSS + JS (~11 KB) sem nenhum formulário na página | removido |
| Requisições externas | 47 avatares sem `lazy` | `loading="lazy"` + `referrerpolicy="no-referrer"` + `preconnect` |

**Sobre remover o JavaScript do Elementor:** a página só usa widgets do tipo "HTML" — nenhum widget precisa do JS do Elementor. Além disso, o bundle tentava baixar chunks do domínio original (`prosperidadepazy.shop/wp-content/plugins/elementor/...`), gerando `Loading chunk 557 failed` e 4 requisições com erro 403 em todo carregamento.

Comparei as duas versões pixel a pixel: **idênticas**. Mesmo assim, deixei `index-alternativo-com-elementor.html` no pacote — se por algum motivo quiser o JS de volta, é só renomear para `index.html`.

Também adicionei: `preconnect` para converteai/pravatar/fonts, `preload` do avatar, e meta tags `description` + Open Graph (o link não tinha preview ao ser partilhado).

---

## 6. Validação feita

- Todos os scripts inline verificados com `node --check`: **sem erros de sintaxe**
- Renderizado em navegador headless a 430px e 1280px: **zero erros de JavaScript** (antes eram 3)
- Interações testadas uma a uma: assinar, curtir, "...plus", enviar mensagem, partilhar — todas funcionando
- Tentativa de XSS pelo campo do chat: **bloqueada**
- Diff do texto visível antes/depois: só as remoções listadas acima

---

## 7. Antes de subir

1. Suba a pasta inteira mantendo a estrutura (`css/`, `images/`, `fonts/`, `index.html`)
2. Se for reinserir algum pixel depois, coloque antes do `</body>` — não use o widget do Elementor, ele reintroduz o problema de altura
3. O player VTurb não pôde ser testado aqui (o domínio da ConverteAI não é acessível neste ambiente). Abra a página publicada uma vez para confirmar que o vídeo carrega
4. `js/`, `fonts/` e `index-alternativo-com-elementor.html` só servem para a versão alternativa — pode apagar se não for usar
