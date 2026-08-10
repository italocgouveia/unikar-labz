/* ============================================================
   UNIKAR — main.js
   Scroll reveals, parallax, progress line, header, intro.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var win = window;
  var doc = document;
  var docEl = doc.documentElement;
  var body = doc.body;

  var clamp = function (v, min, max) {
    return v < min ? min : v > max ? max : v;
  };

  /* ----------------------------------------------------------
     1. Intro
     ---------------------------------------------------------- */
  var intro = doc.getElementById("intro");

  function runIntro() {
    if (!intro) {
      body.classList.add("is-loaded");
      return;
    }
    body.classList.add("is-intro");
    var delay = reduceMotion ? 0 : 150;
    setTimeout(function () {
      intro.classList.add("is-done");
      setTimeout(function () {
        body.classList.add("is-loaded");
      }, reduceMotion ? 0 : 700);
    }, delay);
  }

  if (reduceMotion) {
    if (intro) {
      intro.classList.add("is-done");
      intro.style.display = "none";
    }
    body.classList.add("is-loaded");
  } else {
    runIntro();
    /* Safety: never let the intro lock the page */
    setTimeout(function () {
      if (intro && !intro.classList.contains("is-done")) {
        intro.classList.add("is-done");
        body.classList.add("is-loaded");
      }
    }, 3600);
  }

  /* ----------------------------------------------------------
     2. Header state + active nav
     ---------------------------------------------------------- */
  var header = doc.getElementById("header");
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (link) {
      /* Fora da home os links apontam pra outra página (index.html#...),
         que não é seletor válido — só resolvemos âncoras da própria página. */
      var href = link.getAttribute("href") || "";
      return href.charAt(0) === "#" && href.length > 1 ? doc.querySelector(href) : null;
    })
    .filter(Boolean);

  /* Páginas sem hero (produto) pedem header sólido o tempo todo. */
  var solidHeader = body.getAttribute("data-header") === "solid";

  var onHeaderScroll = function (y) {
    if (y > 40 || solidHeader) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    var current = null;
    var offset = 140;
    sections.forEach(function (sec) {
      if (sec.offsetTop - offset <= y) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle(
        "is-active",
        current ? link.getAttribute("href") === "#" + current.id : false
      );
    });
  };

  /* ----------------------------------------------------------
     3. Hero scroll reaction
     ---------------------------------------------------------- */
  var hero = doc.getElementById("hero");
  var heroTitle = doc.getElementById("heroTitle");

  function onHeroScroll(y) {
    if (!hero || !heroTitle) return;
    var p = clamp(y / (win.innerHeight * 0.9), 0, 1);
    hero.style.setProperty("--hero-p", p.toFixed(3));
  }

  /* ----------------------------------------------------------
     4. Split words
     ---------------------------------------------------------- */
  function splitWords(el) {
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    el.textContent = "";
    words.forEach(function (word, i) {
      var wrap = doc.createElement("span");
      wrap.className = "word";
      var inner = doc.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--d", Math.min(i * 55, 620) + "ms");
      wrap.appendChild(inner);
      el.appendChild(wrap);
      /* Os .word são inline-block: sem este espaço as palavras colam. */
      if (i < words.length - 1) el.appendChild(doc.createTextNode(" "));
    });
  }

  Array.prototype.forEach.call(doc.querySelectorAll("[data-split]"), splitWords);

  /* ----------------------------------------------------------
     4b. Split de caracteres — usado no botão com letras
         escalonadas. Espaços viram nó de texto para não
         perderem a largura entre as palavras.
     ---------------------------------------------------------- */
  function splitChars(el) {
    var text = el.textContent.trim();
    var host = el.closest("a, button");
    var i = 0;

    el.textContent = "";
    text.split("").forEach(function (ch) {
      if (ch === " ") {
        el.appendChild(doc.createTextNode(" "));
        return;
      }
      var s = doc.createElement("span");
      s.textContent = ch;
      s.setAttribute("data-ch", ch);
      s.style.setProperty("--i", i++);
      el.appendChild(s);
    });

    /* o texto vira um monte de spans: some do leitor de tela e
       devolve o rótulo inteiro no elemento clicável */
    el.setAttribute("aria-hidden", "true");
    if (host && !host.getAttribute("aria-label")) host.setAttribute("aria-label", text);
  }

  Array.prototype.forEach.call(doc.querySelectorAll("[data-chars]"), splitChars);

  /* ----------------------------------------------------------
     5. Reveal observer
     ---------------------------------------------------------- */
  Array.prototype.forEach.call(
    doc.querySelectorAll("[data-reveal][data-delay]"),
    function (el) {
      el.style.setProperty("--delay", el.getAttribute("data-delay") + "ms");
    }
  );

  var revealEls = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  revealEls.forEach(function (el) {
    if (reduceMotion) {
      el.classList.add("is-in");
    } else {
      revealObserver.observe(el);
    }
  });

  var splitEls = Array.prototype.slice.call(doc.querySelectorAll(".split-words"));
  var splitObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          splitObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  splitEls.forEach(function (el) {
    if (reduceMotion) {
      el.classList.add("is-in");
    } else {
      splitObserver.observe(el);
    }
  });

  /* ----------------------------------------------------------
     6. Parallax
     ---------------------------------------------------------- */
  var parallaxEls = Array.prototype.slice.call(doc.querySelectorAll("[data-parallax]"));

  function updateParallax() {
    if (reduceMotion || parallaxEls.length === 0) return;
    var vh = win.innerHeight;
    parallaxEls.forEach(function (img) {
      var wrap = img.closest(".parallax-wrap") || img.parentElement;
      var rect = wrap.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > vh + 80) return;
      var center = rect.top + rect.height / 2 - vh / 2;
      var speed = parseFloat(img.getAttribute("data-parallax")) || 8;
      var y = center * (speed / 100);
      var maxShift = rect.height * 0.11;
      y = clamp(y, -maxShift, maxShift);
      img.style.transform = "translate3d(0, " + y.toFixed(1) + "px, 0)";
    });
  }

  /* ----------------------------------------------------------
     7. Process progress line
     ---------------------------------------------------------- */
  var processTrack = doc.getElementById("processTrack");
  var processFill = doc.getElementById("processFill");
  var steps = Array.prototype.slice.call(doc.querySelectorAll(".step"));

  function updateProcess() {
    if (!processTrack || !processFill || steps.length === 0) return;
    var vh = win.innerHeight;
    var rect = processTrack.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) return;

    var total = rect.height - vh * 0.55;
    var passed = clamp(vh * 0.72 - rect.top, 0, total);
    var p = total > 0 ? passed / total : 0;

    processFill.style.height = (p * 100).toFixed(1) + "%";

    var idx = Math.round(p * (steps.length - 1));
    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i === idx);
      step.classList.toggle("is-done", i < idx);
    });
  }

  /* ----------------------------------------------------------
     8. Menu
     ---------------------------------------------------------- */
  var burger = doc.getElementById("burger");
  var menu = doc.getElementById("menu");

  function closeMenu() {
    body.classList.remove("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    if (menu) menu.setAttribute("aria-hidden", "true");
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    });
  }

  Array.prototype.forEach.call(doc.querySelectorAll("[data-scroll]"), function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ----------------------------------------------------------
     9. Scroll loop
     ---------------------------------------------------------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () {
      var y = win.pageYOffset || docEl.scrollTop;
      onHeaderScroll(y);
      onHeroScroll(y);
      updateParallax();
      updateProcess();
      ticking = false;
    });
  }

  /* ----------------------------------------------------------
     10. Init
     ---------------------------------------------------------- */
  var onResize = function () {
    if (!reduceMotion) updateParallax();
    updateProcess();
  };

  var onLoad = function () {
    onScroll();
  };

  win.addEventListener("scroll", onScroll, { passive: true });
  win.addEventListener("resize", onResize, { passive: true });
  win.addEventListener("load", onLoad);
  onScroll();
})();
