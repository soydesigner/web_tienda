/* content.js — coloca en cada zona la imagen indicada en images.json.
   Si no hay imagen (o se abre en local sin servidor), se mantiene el degradado de muestra. */
(function () {
  "use strict";

  function applyImage(key, item) {
    if (!item || !item.src) return;
    var nodes = document.querySelectorAll('[data-img="' + key + '"]');
    Array.prototype.forEach.call(nodes, function (el) {
      el.style.backgroundImage = 'url("' + item.src + '")';
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = item.position || "center";
      el.style.backgroundRepeat = "no-repeat";
      if (item.alt) {
        el.setAttribute("role", "img");
        el.setAttribute("aria-label", item.alt);
      }
    });
  }

  fetch("images.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("images.json no encontrado");
      return r.json();
    })
    .then(function (data) {
      Object.keys(data).forEach(function (key) {
        applyImage(key, data[key]);
      });
    })
    .catch(function () {
      /* Sin images.json o abierto en local (file://): se quedan los degradados de muestra. */
    });
})();
