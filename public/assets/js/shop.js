/* ============================================================
   UNIKAR — shop.js
   Monta a vitrine (shop.html) e a página de produto (produto.html).
   Reaproveita o sistema de reveal do main.js.
   ============================================================ */
(function () {
  "use strict";

  var shop = window.UNIKAR_SHOP;
  if (!shop) return;

  var doc = document;
  var SIZES = ["P", "M", "G", "GG"];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /** Marca os novos elementos para o reveal e dispara a entrada com stagger.
      O setTimeout garante que o conteúdo apareça mesmo se o rAF estiver
      suspenso (aba em segundo plano) — nada pode ficar invisível. */
  function playReveal(scope) {
    var els = Array.prototype.slice.call(scope.querySelectorAll("[data-reveal]"));
    els.forEach(function (el, i) {
      el.style.setProperty("--delay", Math.min(i, 8) * 80 + "ms");
    });

    var shown = false;
    var show = function () {
      if (shown) return;
      shown = true;
      els.forEach(function (el) { el.classList.add("is-in"); });
    };

    requestAnimationFrame(function () { requestAnimationFrame(show); });
    setTimeout(show, 60);
  }

  function priceHTML(p, cls) {
    var v = shop.money(p.price);
    if (!v) return '<div class="' + cls + ' ' + cls + '--tbd">Sob consulta</div>';
    return '<div class="' + cls + '">' + v + (p.unit ? "<small>" + p.unit + "</small>" : "") + "</div>";
  }

  /* ----------------------------------------------------------
     Vitrine
     ---------------------------------------------------------- */
  function cardHTML(p) {
    return [
      '<a class="pcard reveal" data-reveal="up" href="produto.html?id=' + p.id + '">',
      '  <div class="pcard__media">',
      '    <img src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy" />',
      p.images[1]
        ? '    <img class="pcard__alt" src="' + p.images[1] + '" alt="" aria-hidden="true" loading="lazy" />'
        : "",
      p.badge
        ? '    <span class="pcard__badge' + (p.hot ? " pcard__badge--hot" : "") + '">' + esc(p.badge) + "</span>"
        : "",
      "  </div>",
      '  <div class="pcard__body">',
      '    <span class="pcard__cat">' + esc(shop.catLabel(p.cat)) + "</span>",
      '    <h3 class="pcard__name">' + esc(p.name) + "</h3>",
      priceHTML(p, "pcard__price"),
      '    <span class="pcard__cta">Ver produto <i>&rarr;</i></span>',
      "  </div>",
      "</a>"
    ].join("");
  }

  function initGrid() {
    var grid = doc.getElementById("shopGrid");
    if (!grid) return;

    var bar = doc.getElementById("shopFilters");
    var count = doc.getElementById("shopCount");

    shop.categories.forEach(function (c) {
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("data-cat", c.id);
      b.textContent = c.label;
      bar.appendChild(b);
    });

    function draw(cat) {
      var list = shop.byCat(cat);

      if (list.length) {
        grid.innerHTML = list.map(cardHTML).join("");
      } else {
        var copy = shop.empty[cat] || shop.empty.fallback;
        grid.innerHTML =
          '<div class="shop-empty reveal" data-reveal="up">' +
          "<h3>" + esc(copy.title) + "</h3>" +
          "<p>" + esc(copy.text) + "</p>" +
          "</div>";
      }

      if (count) {
        count.textContent = list.length === 1 ? "01 peça" : String(list.length).padStart(2, "0") + " peças";
      }

      Array.prototype.forEach.call(bar.querySelectorAll(".chip"), function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-cat") === cat);
      });

      playReveal(grid);
    }

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      var cat = btn.getAttribute("data-cat");
      history.replaceState(null, "", cat === "all" ? location.pathname : "?cat=" + cat);
      draw(cat);
    });

    var wanted = new URLSearchParams(location.search).get("cat");
    var valid = shop.categories.some(function (c) { return c.id === wanted; });
    draw(valid ? wanted : "all");
  }

  /* ----------------------------------------------------------
     Página de produto
     ---------------------------------------------------------- */
  function initProduct() {
    var root = doc.getElementById("pdp");
    if (!root) return;

    var id = new URLSearchParams(location.search).get("id");
    var p = id ? shop.get(id) : null;

    if (!p) {
      root.innerHTML =
        '<div class="container">' +
        '  <div class="shop-empty reveal" data-reveal="up">' +
        "    <h3>Produto não encontrado</h3>" +
        "    <p>Esse link não existe mais ou a peça saiu da coleção.</p>" +
        '    <a class="btn btn--ghost" href="shop.html" style="margin-top:28px">Voltar para a shop</a>' +
        "  </div>" +
        "</div>";
      playReveal(root);
      return;
    }

    doc.title = p.name + " — UNIKAR";

    var buy = shop.buyUrl(p);
    var onShopee = shop.onShopee(p);

    var thumbs = p.images.length > 1
      ? '<div class="pdp__thumbs">' +
        p.images.map(function (src, i) {
          return (
            '<button type="button" class="pdp__thumb' + (i === 0 ? " is-active" : "") +
            '" data-src="' + src + '" aria-label="Ver imagem ' + (i + 1) + '">' +
            '<img src="' + src + '" alt="" /></button>'
          );
        }).join("") +
        "</div>"
      : "";

    root.innerHTML = [
      '<div class="container">',
      '  <nav class="crumbs reveal" data-reveal="fade" aria-label="Você está aqui">',
      '    <a href="index.html">Home</a><i>/</i>',
      '    <a href="shop.html?cat=' + p.cat + '">' + esc(shop.catLabel(p.cat)) + "</a><i>/</i>",
      "    <span>" + esc(p.name) + "</span>",
      "  </nav>",

      '  <div class="pdp__grid">',
      '    <div class="pdp__gallery reveal" data-reveal="up">',
      '      <div class="pdp__main"><img id="pdpImg" src="' + p.images[0] + '" alt="' + esc(p.name) + '" /></div>',
      thumbs,
      "    </div>",

      '    <div class="pdp__info reveal" data-reveal="up" data-delay="120">',
      '      <span class="pdp__cat">' + esc(shop.catLabel(p.cat)) + "</span>",
      '      <h1 class="pdp__name">' + esc(p.name) + "</h1>",
      priceHTML(p, "pdp__price"),
      '      <p class="pdp__desc">' + esc(p.desc) + "</p>",

      p.includes
        ? '      <ul class="kit__feat pdp__feat">' +
          p.includes.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
          "</ul>"
        : "",

      p.sizes
        ? '      <div class="pdp__opt">' +
          '        <span class="pdp__opt-label">Grade</span>' +
          '        <div class="pdp__sizes">' +
          SIZES.map(function (s) { return '<span class="pdp__size">' + s + "</span>"; }).join("") +
          "        </div>" +
          "      </div>"
        : "",

      '      <div class="pdp__actions">',
      '        <a class="btn btn--buy" href="' + buy + '" target="_blank" rel="noopener">' +
        (onShopee ? "Comprar na Shopee" : "Comprar pelo WhatsApp") + "</a>",
      '        <a class="btn btn--ghost" href="shop.html">Continuar vendo</a>',
      "      </div>",

      '      <p class="pdp__ship">' +
        (onShopee
          ? "Pagamento e entrega são finalizados na Shopee."
          : "A compra é fechada pelo WhatsApp — a gente responde e combina tudo por lá.") +
        "</p>",

      p.note ? '      <p class="kit__note">' + esc(p.note) + "</p>" : "",

      '      <div class="pdp__meta">',
      "        <div><h5>Personalização</h5><p>Você envia a foto depois da compra — carro, pet, família, o que for. A arte é criada só pra você.</p></div>",
      "        <div><h5>Produção</h5><p>Cada peça é produzida sob demanda, uma de cada vez.</p></div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");

    Array.prototype.forEach.call(root.querySelectorAll(".pdp__thumb"), function (t) {
      t.addEventListener("click", function () {
        doc.getElementById("pdpImg").src = t.getAttribute("data-src");
        Array.prototype.forEach.call(root.querySelectorAll(".pdp__thumb"), function (x) {
          x.classList.toggle("is-active", x === t);
        });
      });
    });

    playReveal(root);
  }

  function boot() {
    initGrid();
    initProduct();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
