/**
 * Vault PH — collections catalog: mock products, filters, search, sort.
 */
(function () {
  const PAGE_SIZE = 6;

  var PRODUCTS = window.VAULT_PRODUCTS;
  if (!PRODUCTS || !PRODUCTS.length) {
    console.error("catalog-data.js must load before collections-page.js (VAULT_PRODUCTS missing).");
    return;
  }

  const grid = document.getElementById("product-grid");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort-by");
  const countEl = document.getElementById("collections-result-count");
  const loadMoreBtn = document.getElementById("load-more-btn");

  let visibleCount = PAGE_SIZE;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  /** For URLs in double-quoted attributes — do not escape & or the request breaks. */
  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function formatPrice(n) {
    return "PHP " + Number(n).toLocaleString("en-PH");
  }

  function getSelectedCategories() {
    return Array.from(document.querySelectorAll(".filter-category:checked")).map(
      function (el) {
        return el.getAttribute("data-category");
      }
    );
  }

  function getActiveSizes() {
    return Array.from(document.querySelectorAll(".filter-size.is-active")).map(function (el) {
      return el.getAttribute("data-size");
    });
  }

  function getActiveColors() {
    return Array.from(document.querySelectorAll(".filter-color.is-active")).map(function (el) {
      return el.getAttribute("data-color");
    });
  }

  function matchesFilters(p) {
    var cats = getSelectedCategories();
    if (cats.length && cats.indexOf(p.category) === -1) return false;

    var sizes = getActiveSizes();
    if (sizes.length) {
      var okSize = p.sizes.some(function (s) {
        return sizes.indexOf(s) !== -1;
      });
      if (!okSize) return false;
    }

    var colors = getActiveColors();
    if (colors.length) {
      var okColor = p.colors.some(function (c) {
        return colors.indexOf(c) !== -1;
      });
      if (!okColor) return false;
    }

    var q = (searchInput && searchInput.value ? searchInput.value : "").trim().toLowerCase();
    if (q && p.name.toLowerCase().indexOf(q) === -1) return false;

    return true;
  }

  function sortList(list) {
    var v = sortSelect ? sortSelect.value : "newest";
    var out = list.slice();
    if (v === "price-asc") {
      out.sort(function (a, b) {
        return a.price - b.price;
      });
    } else if (v === "price-desc") {
      out.sort(function (a, b) {
        return b.price - a.price;
      });
    } else {
      out.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    return out;
  }

  function tagMarkup(p) {
    if (!p.tag) return "";
    var cls =
      p.tagVariant === "limited"
        ? "bg-primary text-on-primary border-[1px] border-primary"
        : "bg-tertiary-fixed-dim text-primary border-[1px] border-primary";
    return (
      '<div class="absolute top-2 left-2 ' +
      cls +
      ' font-label-caps text-label-caps px-2 py-1 uppercase z-10">' +
      escapeHtml(p.tag) +
      "</div>"
    );
  }

  function detailHref(id) {
    return "product-detail.html?id=" + encodeURIComponent(id);
  }

  function cardHtml(p) {
    var name = escapeHtml(p.name);
    var price = formatPrice(p.price);
    var img = escapeAttr(p.image);
    var href = escapeAttr(detailHref(p.id));
    return (
      '<article class="product-card border-b-[2px] border-r-[2px] border-grid flex flex-col group relative cursor-pointer" data-href="' +
      href +
      '" role="link" tabindex="0">' +
      '<div class="aspect-[3/4] relative overflow-hidden bg-surface-container border-b-[2px] border-grid">' +
      '<img alt="' +
      name +
      '" class="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-300" src="' +
      img +
      '" referrerpolicy="no-referrer" loading="lazy" decoding="async" />' +
      tagMarkup(p) +
      "</div>" +
      '<div class="p-4 flex flex-col gap-1 bg-surface z-10">' +
      '<h4 class="font-headline-md text-headline-md uppercase text-primary leading-none tracking-tighter group-hover:underline">' +
      name +
      "</h4>" +
      '<div class="flex justify-between items-center mt-2">' +
      '<span class="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase">' +
      price +
      "</span>" +
      '<button type="button" class="product-add bg-primary text-on-primary font-label-caps text-label-caps px-3 py-1 uppercase border-[2px] border-primary hover:bg-surface hover:text-primary transition-colors">ADD</button>' +
      "</div></div></article>"
    );
  }

  function wireCardClicks() {
    if (!grid) return;
    grid.querySelectorAll(".product-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".product-add")) return;
        var href = card.getAttribute("data-href");
        if (href) window.location.href = href;
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!e.target.closest(".product-add")) {
            var href = card.getAttribute("data-href");
            if (href) window.location.href = href;
          }
        }
      });
    });
    grid.querySelectorAll(".product-add").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var card = btn.closest(".product-card");
        var h = card && card.getAttribute("data-href");
        if (h) window.location.href = h;
      });
    });
  }

  function render() {
    if (!grid) return;

    var filtered = PRODUCTS.filter(matchesFilters);
    var sorted = sortList(filtered);
    var slice = sorted.slice(0, visibleCount);

    if (countEl) {
      countEl.textContent =
        sorted.length === 1 ? "1 PIECE" : sorted.length + " PIECES";
    }

    if (slice.length === 0) {
      grid.innerHTML =
        '<div class="col-span-full border-b-[2px] border-r-[2px] border-grid p-stack-md text-center font-body-md text-body-md text-on-surface-variant">' +
        "No pieces match your filters. Clear filters or search to see the full registry.</div>";
    } else {
      grid.innerHTML = slice.map(cardHtml).join("");
      wireCardClicks();
    }

    if (loadMoreBtn) {
      var hasMore = sorted.length > visibleCount;
      loadMoreBtn.hidden = !hasMore;
      loadMoreBtn.disabled = !hasMore;
    }
  }

  function resetVisible() {
    visibleCount = PAGE_SIZE;
  }

  document.querySelectorAll(".filter-category").forEach(function (el) {
    el.addEventListener("change", function () {
      resetVisible();
      render();
    });
  });

  document.querySelectorAll(".filter-size").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.toggle("is-active");
      if (btn.classList.contains("is-active")) {
        btn.classList.add("bg-primary", "text-on-primary");
      } else {
        btn.classList.remove("bg-primary", "text-on-primary");
      }
      resetVisible();
      render();
    });
  });

  document.querySelectorAll(".filter-color").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.toggle("is-active");
      if (btn.classList.contains("is-active")) {
        btn.classList.add("ring-2", "ring-offset-2", "ring-primary");
      } else {
        btn.classList.remove("ring-2", "ring-offset-2", "ring-primary");
      }
      btn.setAttribute("aria-pressed", btn.classList.contains("is-active") ? "true" : "false");
      resetVisible();
      render();
    });
  });

  if (searchInput) {
    var t;
    searchInput.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        resetVisible();
        render();
      }, 180);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      resetVisible();
      render();
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      visibleCount += PAGE_SIZE;
      render();
    });
  }

  render();
})();
