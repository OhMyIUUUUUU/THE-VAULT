/**
 * Vault PH — product detail: reads ?id= from URL and fills the page from catalog-data.js.
 */
(function () {
  var COLOR_STYLES = {
    black: "w-12 h-12 bg-primary border-[2px] border-primary shadow-[2px_2px_0px_#1A1A1A]",
    white: "w-12 h-12 bg-white border-[2px] border-primary shadow-[2px_2px_0px_#1A1A1A]",
    charcoal: "w-12 h-12 bg-[#4A4A4A] border-[2px] border-primary",
    burgundy: "w-12 h-12 bg-[#8B0000] border-[2px] border-primary",
    gold: "w-12 h-12 bg-tertiary-fixed-dim border-[2px] border-primary",
  };

  var SIZE_INACTIVE =
    "py-3 font-label-caps text-label-caps text-on-surface-variant border-[2px] border-outline-variant hover:border-primary hover:text-primary transition-colors bg-surface detail-size-btn";
  var SIZE_ACTIVE =
    "py-3 font-label-caps text-label-caps text-on-primary border-[2px] border-primary bg-primary shadow-[2px_2px_0px_#1A1A1A] detail-size-btn";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function formatPrice(n) {
    return "PHP " + Number(n).toLocaleString("en-PH");
  }

  function titleHtml(name) {
    var parts = String(name).trim().split(/\s+/);
    if (parts.length <= 1) return escapeHtml(name);
    return escapeHtml(parts[0]) + "<br />" + escapeHtml(parts.slice(1).join(" "));
  }

  function boot() {
    var products = window.VAULT_PRODUCTS;
    var loaded = document.getElementById("detail-loaded");
    var notFound = document.getElementById("detail-not-found");
    if (!loaded || !notFound) return;

    if (!products || !products.length) {
      loaded.classList.add("hidden");
      notFound.classList.remove("hidden");
      document.title = "Vault PH — Catalog unavailable";
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var p = window.findVaultProductById ? window.findVaultProductById(id) : null;
    if (!p) {
      loaded.classList.add("hidden");
      notFound.classList.remove("hidden");
      document.title = "Vault PH — Piece not found";
      return;
    }

    loaded.classList.remove("hidden");
    notFound.classList.add("hidden");
    document.title = "Vault PH — " + p.name;

    var hero = document.getElementById("detail-hero-img");
    if (hero) {
      hero.src = p.image;
      hero.alt = p.name;
    }

    var badge = document.getElementById("detail-badge");
    if (badge) {
      if (p.tag) {
        var bCls =
          p.tagVariant === "limited"
            ? "bg-primary text-on-primary border-[1px] border-primary"
            : "bg-tertiary-fixed-dim text-primary border-[1px] border-primary";
        badge.className =
          "absolute top-4 left-4 px-3 py-1 font-label-caps text-label-caps border-[1px] border-primary shadow-[2px_2px_0px_#000000] " +
          bCls;
        badge.textContent = p.tag;
        badge.classList.remove("hidden");
      } else {
        badge.textContent = "";
        badge.className =
          "absolute top-4 left-4 px-3 py-1 font-label-caps text-label-caps border-[1px] border-primary shadow-[2px_2px_0px_#000000] hidden";
      }
    }

    var titleEl = document.getElementById("detail-title");
    if (titleEl) titleEl.innerHTML = titleHtml(p.name);

    var priceEl = document.getElementById("detail-price");
    if (priceEl) priceEl.textContent = formatPrice(p.price);

    var descEl = document.getElementById("detail-description");
    if (descEl) descEl.textContent = p.description || "";

    var colorRow = document.getElementById("detail-color-buttons");
    if (colorRow && p.colors && p.colors.length) {
      colorRow.innerHTML = p.colors
        .map(function (c, i) {
          var base = COLOR_STYLES[c] || COLOR_STYLES.black;
          var active = i === 0 ? " ring-2 ring-offset-2 ring-primary" : "";
          return (
            '<button type="button" class="detail-color-swatch ' +
            base +
            active +
            '" data-color="' +
            escapeAttr(c) +
            '" aria-label="' +
            escapeAttr(c) +
            '"></button>'
          );
        })
        .join("");
      colorRow.querySelectorAll(".detail-color-swatch").forEach(function (sw) {
        sw.addEventListener("click", function () {
          colorRow.querySelectorAll(".detail-color-swatch").forEach(function (s) {
            s.classList.remove("ring-2", "ring-offset-2", "ring-primary");
          });
          sw.classList.add("ring-2", "ring-offset-2", "ring-primary");
        });
      });
    } else if (colorRow) {
      colorRow.innerHTML = "";
    }

    var sizeRow = document.getElementById("detail-size-buttons");
    if (sizeRow && p.sizes && p.sizes.length) {
      var defaultSel = p.sizes.indexOf("M") >= 0 ? "M" : p.sizes[0];
      sizeRow.innerHTML = p.sizes
        .map(function (sz) {
          var isSel = sz === defaultSel;
          var cls = isSel ? SIZE_ACTIVE : SIZE_INACTIVE;
          return (
            '<button type="button" class="' +
            cls +
            '" data-size="' +
            escapeAttr(sz) +
            '">' +
            escapeHtml(sz) +
            "</button>"
          );
        })
        .join("");
      sizeRow.querySelectorAll(".detail-size-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          sizeRow.querySelectorAll(".detail-size-btn").forEach(function (b) {
            b.className = SIZE_INACTIVE;
          });
          btn.className = SIZE_ACTIVE;
        });
      });
    } else if (sizeRow) {
      sizeRow.innerHTML = "";
    }

    var checkout = document.getElementById("detail-checkout-btn");
    if (checkout) {
      checkout.onclick = function () {
        window.location.href = "checkout.html?id=" + encodeURIComponent(p.id);
      };
    }

    var rel = document.getElementById("detail-related-grid");
    if (rel) {
      var others = products.filter(function (x) {
        return x.id !== p.id;
      });
      var pick = others.slice(0, 4);
      rel.innerHTML = pick
        .map(function (r) {
          var href = "product-detail.html?id=" + encodeURIComponent(r.id);
          return (
            '<a class="bg-surface group relative flex flex-col cursor-pointer no-underline text-inherit" href="' +
            escapeAttr(href) +
            '">' +
            '<div class="aspect-square bg-surface-container relative overflow-hidden border-b-[1px] border-primary">' +
            '<img alt="' +
            escapeHtml(r.name) +
            '" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="' +
            escapeAttr(r.image) +
            '" referrerpolicy="no-referrer" loading="lazy" decoding="async"/>' +
            "</div>" +
            '<div class="p-4 flex flex-col gap-1 bg-surface">' +
            '<span class="font-label-caps text-label-caps text-primary truncate">' +
            escapeHtml(r.name) +
            "</span>" +
            '<span class="font-body-md text-body-md text-tertiary-fixed-dim">' +
            escapeHtml(formatPrice(r.price)) +
            "</span></div></a>"
          );
        })
        .join("");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
