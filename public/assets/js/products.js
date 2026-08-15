/* ============================================================
   UNIKAR — catálogo
   Fonte única dos produtos. A SHOP e a página de produto leem
   tudo daqui: nenhum HTML precisa ser editado pra publicar peça.
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. SHOPEE  —  COLE O LINK DA LOJA AQUI
     ----------------------------------------------------------
     Enquanto `store` estiver vazio, os botões de compra levam
     para o WhatsApp. Assim que você colar o endereço da loja,
     todos os botões viram "Comprar na Shopee" automaticamente
     — em todas as páginas, sem mexer em mais nada.

     Ex.: store: "https://shopee.com.br/unikarlabz"

     Se um produto tiver anúncio próprio na Shopee, preencha o
     campo `shopee` dele lá embaixo que ele passa na frente.
     ---------------------------------------------------------- */
  var SHOPEE = {
    store: ""
  };

  var WHATSAPP_NUMERO = "5534984282923";
  var INSTAGRAM = "https://www.instagram.com/unikarlabz/";

  function whatsappUrl(p) {
    var msg = p
      ? "Oi! Quero comprar: " + p.name
      : "Oi! Quero fazer meu pedido UNIKAR.";
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(msg);
  }

  /* ----------------------------------------------------------
     2. Preços dos avulsos
     Troque o null pelo número (sem "R$") e o preço aparece no
     site inteiro. Enquanto for null, mostra "Sob consulta".
     ---------------------------------------------------------- */
  var PRECOS = {
    camiseta: null,
    quadro: null,
    caneca: null,
    cheirinho: null
  };

  var CATEGORIES = [
    { id: "all", label: "Tudo" },
    { id: "t-shirts", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "caps", label: "Caps" },
    { id: "accessories", label: "Accessories" },
    { id: "kits", label: "Kits" }
  ];

  var PRODUCTS = [
    /* ---------- T-SHIRTS ---------- */
    {
      id: "camiseta-custom",
      name: "Camiseta Custom",
      cat: "t-shirts",
      price: PRECOS.camiseta,
      images: ["assets/img/tee-back.jpg", "assets/img/tee-front.jpg"],
      sizes: true,
      desc: "A sua arte nas costas. Assinatura UNIKAR no peito. Branca, como tem que ser.",
      shopee: ""
    },

    /* ---------- ACCESSORIES ---------- */
    {
      id: "quadro-custom",
      name: "Quadro Custom",
      cat: "accessories",
      price: PRECOS.quadro,
      images: ["assets/img/canvas.jpg"],
      desc: "A sua arte emoldurada. Pra parede da sala, do quarto ou da garagem — você decide onde ela merece ficar.",
      shopee: ""
    },
    {
      id: "caneca-custom",
      name: "Caneca Custom",
      cat: "accessories",
      price: PRECOS.caneca,
      images: ["assets/img/mug.jpg"],
      desc: "A sua arte no primeiro café do dia.",
      shopee: ""
    },
    {
      id: "cheirinho",
      name: "Cheirinho Automotivo",
      cat: "accessories",
      price: PRECOS.cheirinho,
      images: ["assets/img/freshener.jpg"],
      desc: "O detalhe que fica pendurado no retrovisor. Marca UNIKAR, aroma automotivo.",
      shopee: ""
    },

    /* ---------- KITS ---------- */
    {
      id: "kit-drive",
      name: "Kit Drive",
      cat: "kits",
      price: 250,
      images: ["assets/img/kit-drive.jpg"],
      badge: "Avulso",
      sizes: true,
      desc: "A entrada na coleção. Sua foto virando camiseta e quadro, na mesma caixa.",
      includes: [
        "Camiseta personalizada",
        "Quadro personalizado",
        "Cheirinho automotivo",
        "+ 2 brindes"
      ],
      shopee: ""
    },
    {
      id: "kit-drive-elite",
      name: "Kit Drive Elite",
      cat: "kits",
      price: 300,
      images: ["assets/img/kit-drive-elite.jpg"],
      badge: "Mais pedido",
      hot: true,
      sizes: true,
      desc: "O kit completo. Camiseta, quadro e caneca com a mesma arte — do closet à mesa.",
      includes: [
        "Camiseta personalizada",
        "Quadro personalizado",
        "Caneca personalizada",
        "Cheirinho automotivo",
        "+ 2 brindes"
      ],
      shopee: ""
    },
    {
      id: "garage-duo",
      name: "Garage Duo",
      cat: "kits",
      price: 350,
      images: ["assets/img/kit-garage-duo.jpg"],
      badge: "Avulso",
      sizes: true,
      desc: "Duas camisetas, uma arte. Feito pra dividir com quem você quer por perto.",
      includes: [
        "2 camisetas personalizadas",
        "Quadro personalizado",
        "Cheirinho automotivo",
        "+ 3 brindes"
      ],
      shopee: ""
    },
    {
      id: "drive-mensal",
      name: "Drive Mensal",
      cat: "kits",
      price: 200,
      unit: "/mês",
      images: ["assets/img/kit-mensal.jpg", "assets/img/box-mystery.jpg"],
      badge: "Assinatura",
      hot: true,
      sizes: true,
      desc: "Todo mês uma arte nova. A camiseta é sua. O quadro muda. O brinde ninguém sabe.",
      includes: [
        "Camiseta personalizada",
        "Quadro personalizado — arte nova todo mês",
        "+ 2 brindes exclusivos"
      ],
      note: "Permanência mínima de 3 meses. Cancelamento antes do período mínimo tem multa proporcional, informada de forma clara no momento da assinatura.",
      shopee: ""
    }
  ];

  /* ----------------------------------------------------------
     3. Categorias ainda sem peça — nada é inventado aqui
     ---------------------------------------------------------- */
  var EMPTY = {
    hoodies: {
      title: "Hoodies em produção",
      text: "A próxima peça da coleção está sendo desenvolvida. Em breve nesta página."
    },
    caps: {
      title: "Caps em produção",
      text: "A próxima peça da coleção está sendo desenvolvida. Em breve nesta página."
    },
    fallback: {
      title: "Nada por aqui ainda",
      text: "Essa categoria ainda não tem peça disponível. Volta logo."
    }
  };

  window.UNIKAR_SHOP = {
    categories: CATEGORIES,
    products: PRODUCTS,
    empty: EMPTY,
    instagram: INSTAGRAM,

    get: function (id) {
      for (var i = 0; i < PRODUCTS.length; i++) {
        if (PRODUCTS[i].id === id) return PRODUCTS[i];
      }
      return null;
    },

    byCat: function (cat) {
      if (cat === "all") return PRODUCTS.slice();
      return PRODUCTS.filter(function (p) { return p.cat === cat; });
    },

    catLabel: function (id) {
      for (var i = 0; i < CATEGORIES.length; i++) {
        if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
      }
      return "";
    },

    /** Link de compra do produto. Cai no WhatsApp enquanto a Shopee não estiver configurada. */
    buyUrl: function (p) {
      return (p && p.shopee) || SHOPEE.store || whatsappUrl(p);
    },

    /** true quando o destino é mesmo a Shopee (muda o texto do botão). */
    onShopee: function (p) {
      return Boolean((p && p.shopee) || SHOPEE.store);
    },

    money: function (v) {
      if (typeof v !== "number" || isNaN(v)) return null;
      return v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: v % 1 === 0 ? 0 : 2
      });
    }
  };
})();
