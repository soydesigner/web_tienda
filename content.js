/* content.js — coloca las imágenes de cada zona y construye el carrusel antes/después
   a partir de images.json. Si no hay datos (o se abre en local sin servidor),
   se mantienen los degradados de muestra y el trabajo de respaldo del HTML. */
(function () {
  "use strict";

  /* ---- Imágenes simples (galería, taller, portada) ---- */
  function applyImage(key, item) {
    if (!item || !item.src) return;
    var nodes = document.querySelectorAll('[data-img="' + key + '"]');
    Array.prototype.forEach.call(nodes, function (el) {
      el.style.backgroundImage = 'url("' + item.src + '")';
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = item.position || "center";
      el.style.backgroundRepeat = "no-repeat";
      if (item.alt) { el.setAttribute("role", "img"); el.setAttribute("aria-label", item.alt); }
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---- Comparador deslizable (uno por slide) ---- */
  function initCompare(cmp) {
    var after = cmp.querySelector(".layer-after");
    var divider = cmp.querySelector(".divider");
    var knob = cmp.querySelector(".knob");
    var dragging = false;
    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      divider.style.left = pct + "%";
      knob.style.left = pct + "%";
      cmp.setAttribute("aria-valuenow", Math.round(pct));
    }
    function fromX(x) {
      var r = cmp.getBoundingClientRect();
      setPos(((x - r.left) / r.width) * 100);
    }
    cmp.addEventListener("pointerdown", function (e) { dragging = true; cmp.setPointerCapture(e.pointerId); fromX(e.clientX); });
    cmp.addEventListener("pointermove", function (e) { if (dragging) fromX(e.clientX); });
    cmp.addEventListener("pointerup", function () { dragging = false; });
    cmp.addEventListener("pointercancel", function () { dragging = false; });
    cmp.addEventListener("keydown", function (e) {
      var c = parseFloat(cmp.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") { setPos(c - 4); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(c + 4); e.preventDefault(); }
      if (e.key === "Home") { setPos(0); e.preventDefault(); }
      if (e.key === "End") { setPos(100); e.preventDefault(); }
    });
    setPos(50);
  }

  /* ---- Construcción del carrusel ---- */
  function buildCarousel(items) {
    var track = document.getElementById("cmpTrack");
    if (!track || !items || !items.length) return;

    var knobSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#0D0D0F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 4 12l5 6M15 6l5 6-5 6"/></svg>';
    track.innerHTML = "";
    items.forEach(function (it) {
      var slide = document.createElement("div");
      slide.className = "car-slide";
      slide.innerHTML =
        '<div class="compare" role="slider" aria-label="Comparador antes y después" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">' +
          '<div class="layer layer-before"><span class="plabel">Antes</span></div>' +
          '<div class="layer layer-after"><span class="plabel">Después</span></div>' +
          '<div class="divider"></div>' +
          '<div class="knob" aria-hidden="true">' + knobSvg + "</div>" +
        "</div>" +
        '<p class="car-caption">' + (it.title ? esc(it.title) : "") + "</p>";
      var before = slide.querySelector(".layer-before");
      var after = slide.querySelector(".layer-after");
      if (it.before) before.style.backgroundImage = 'url("' + it.before + '")';
      if (it.after) after.style.backgroundImage = 'url("' + it.after + '")';
      track.appendChild(slide);
      initCompare(slide.querySelector(".compare"));
    });

    setupNav(items.length);
  }

  function setupNav(n) {
    var track = document.getElementById("cmpTrack");
    var dots = document.getElementById("cmpDots");
    var prev = document.getElementById("cmpPrev");
    var next = document.getElementById("cmpNext");
    var idx = 0;

    function updateDots() {
      if (!dots) return;
      Array.prototype.forEach.call(dots.children, function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    }
    function go(i) {
      idx = (i + n) % n;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      updateDots();
    }

    if (dots) {
      dots.innerHTML = "";
      for (var i = 0; i < n; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "car-dot" + (i === 0 ? " active" : "");
          b.setAttribute("aria-label", "Ir al trabajo " + (i + 1));
          b.addEventListener("click", function () { go(i); });
          dots.appendChild(b);
        })(i);
      }
    }
    if (prev) prev.addEventListener("click", function () { go(idx - 1); });
    if (next) next.addEventListener("click", function () { go(idx + 1); });

    var show = n > 1 ? "flex" : "none";
    if (prev) prev.style.display = n > 1 ? "flex" : "none";
    if (next) next.style.display = n > 1 ? "flex" : "none";
    if (dots) dots.style.display = show;
    go(0);
  }

  /* ---- Carga de datos ---- */
  fetch("images.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("images.json no encontrado"); return r.json(); })
    .then(function (data) {
      if (data.comparisons) buildCarousel(data.comparisons);
      Object.keys(data).forEach(function (key) {
        if (key === "comparisons") return;
        applyImage(key, data[key]);
      });
    })
    .catch(function () {
      /* Sin images.json o en local (file://): se mantiene el respaldo del HTML y los degradados. */
    });
})();
