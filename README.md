# UNIKAR — Street Culture Automotiva

Site institucional + SHOP da UNIKAR LABZ. HTML estático servido pelo Vite, sem framework.

## Rodando

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:5173`. Para gerar a versão de produção em `dist/`:

```bash
npm run build
```

## Estrutura

```
index.html          Home
shop.html           Vitrine com filtros por categoria
produto.html        Página de produto — lê ?id= da URL
vite.config.js      As 3 páginas precisam estar listadas aqui no build
public/assets/
  css/styles.css    Design system: tokens, header, hero, kits, footer
  css/shop.css      SHOP, cards, página de produto, logo, ajustes responsivos
  js/products.js    CATÁLOGO — link da Shopee, preços e produtos
  js/shop.js        Monta a vitrine e a página de produto
  js/main.js        Intro, reveals no scroll, parallax, menu
  img/              Fotos dos produtos e logo
```

> `public/` é copiado tal e qual para o build. Se mover os assets pra fora dele,
> os JS e as imagens somem do `dist`.

## Mexer no conteúdo

Quase tudo da loja está em **`public/assets/js/products.js`** — não precisa tocar em HTML.

**Link da Shopee** (topo do arquivo). Enquanto estiver vazio, os botões de compra
levam para o Instagram. Assim que preencher, viram "Comprar na Shopee" em todas
as páginas:

```js
var SHOPEE = {
  store: ""   // ex.: "https://shopee.com.br/unikarlabz"
};
```

**Preços** dos avulsos. `null` mostra "Sob consulta":

```js
var PRECOS = {
  camiseta:  null,
  quadro:    null,
  caneca:    null,
  cheirinho: null
};
```

**Produto novo**: adicione um objeto em `PRODUCTS`. Ele aparece sozinho na vitrine,
no filtro da categoria e ganha página própria em `produto.html?id=SEU-ID`.

```js
{
  id: "moletom-unikar",          // vira a URL
  name: "Moletom UNIKAR",
  cat: "hoodies",                // t-shirts | hoodies | caps | accessories | kits
  price: 199,                    // ou null
  images: ["assets/img/foto.jpg"],   // a 2ª imagem, se houver, aparece no hover
  sizes: true,                   // mostra a grade P/M/G/GG
  desc: "Uma ou duas frases.",
  shopee: ""                     // link próprio; vazio usa o da loja
}
```

Categorias sem nenhum produto mostram um aviso de "em produção" em vez de
ficarem vazias — o texto está em `EMPTY`, no mesmo arquivo.

## Identidade

| | |
|---|---|
| Preto / Carvão | `#000000` · `#08090A` |
| Grafite / Cinza | `#272829` · `#666666` |
| Prata / Off-white | `#B5B5B5` · `#E5E5E5` |
| Vermelho | `#D71920` — só em detalhe e no botão de compra |

Tipografia: **Archivo** (variável, eixo de largura) nos títulos, **Space Mono**
em rótulos e microtextos.

## Convenções

- Sem framework e sem build step no JS: os scripts são clássicos, não módulos.
- Toda peça de conteúdo real. Não inventar produto, preço, número ou depoimento —
  categoria sem produto usa o estado "em produção".
- Animações discretas: reveal no scroll, hover nas imagens. Nada de neon ou glow.
