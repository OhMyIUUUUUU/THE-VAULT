/**
 * Vault PH — global pull stack (shared cart) + nav badges.
 * Depends on catalog-data.js (window.VAULT_PRODUCTS) when rendering line items.
 */
(function () {
  var STORAGE_KEY = "vaultPhCollectionStack";

  var STACK_ASIDE_HTML =
    '<aside id="stack-drawer" tabindex="-1" class="vault-stack-panel vault-stack-panel--sticky w-full h-full min-h-0 flex flex-col border-[2px] border-primary bg-surface text-primary shadow-[4px_4px_0px_#000000]" aria-labelledby="stack-drawer-title">' +
    '<div class="vault-stack-header flex flex-col gap-2 px-5 py-5 border-b-[2px] border-primary bg-surface shrink-0">' +
    '<h2 id="stack-drawer-title" class="font-headline-md text-lg uppercase tracking-tight text-primary leading-none">Pull stack</h2>' +
    '<p class="font-label-caps text-xs sm:text-sm text-on-surface-variant uppercase tracking-[0.12em] leading-relaxed">Pieces queued from the shop floor</p>' +
    "</div>" +
    '<div id="stack-drawer-empty" class="vault-stack-empty flex flex-col items-center justify-center px-5 py-8 text-center border-b-[2px] border-grid shrink-0">' +
    '<span class="material-symbols-outlined text-3xl text-on-surface-variant mb-3">inventory_2</span>' +
    '<p class="font-body-md text-sm text-on-surface-variant max-w-[16rem] leading-relaxed">Nothing in the stack yet. Hit <span class="text-primary font-label-caps text-label-caps uppercase">buy</span> on a piece to add it here.</p>' +
    "</div>" +
    '<ul id="stack-drawer-list" class="vault-stack-list hidden flex-1 min-h-0 overflow-y-auto flex flex-col divide-y-[2px] divide-primary" role="list"></ul>' +
    '<div id="stack-drawer-footer" class="vault-stack-footer hidden shrink-0 border-t-[2px] border-primary flex flex-col gap-5 bg-surface-container px-5 py-5">' +
    '<div class="vault-stack-footer-summary flex flex-col gap-2">' +
    '<span class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-[0.14em]">Subtotal</span>' +
    '<span id="stack-drawer-subtotal" class="vault-stack-subtotal-amount font-headline-md text-xl sm:text-2xl text-tertiary-fixed-dim tabular-nums leading-none tracking-tight"></span>' +
    "</div>" +
    '<a href="checkout.html" class="vault-stack-cta w-full text-center bg-primary text-on-primary font-label-caps text-label-caps py-3.5 min-h-[48px] flex items-center justify-center border-[2px] border-primary hover:bg-tertiary-fixed-dim hover:text-primary hover:shadow-[4px_4px_0px_#000000] transition-all duration-200">Continue to cart</a>' +
    "</div>" +
    "</aside>";

  var productById = {};
  /** @type {{ id: string, qty: number }[]} */
  var stackLines = [];

  function getProducts() {
    return window.VAULT_PRODUCTS && window.VAULT_PRODUCTS.length ? window.VAULT_PRODUCTS : [];
  }

  function rebuildProductMap() {
    productById = {};
    getProducts().forEach(function (p) {
      productById[p.id] = p;
    });
  }

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

  function detailHref(id) {
    return "product-detail.html?id=" + encodeURIComponent(id);
  }

  function mountStackIfNeeded() {
    var mount = document.getElementById("vault-stack-mount");
    if (!mount || document.getElementById("stack-drawer")) return;
    mount.innerHTML = STACK_ASIDE_HTML;
  }

  function loadStackFromStorage() {
    rebuildProductMap();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        stackLines = [];
        return;
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        stackLines = [];
        return;
      }
      var products = getProducts();
      if (!products.length) {
        stackLines = parsed.filter(function (row) {
          return row && typeof row.id === "string";
        }).map(function (row) {
          return { id: row.id, qty: Math.max(1, parseInt(row.qty, 10) || 1) };
        });
        return;
      }
      stackLines = parsed
        .filter(function (row) {
          return row && typeof row.id === "string" && productById[row.id];
        })
        .map(function (row) {
          return { id: row.id, qty: Math.max(1, parseInt(row.qty, 10) || 1) };
        });
    } catch (e) {
      stackLines = [];
    }
  }

  function persistStack() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stackLines));
    } catch (e) {
      /* ignore */
    }
  }

  function stackLineCount() {
    return stackLines.reduce(function (n, row) {
      return n + row.qty;
    }, 0);
  }

  function badgeCountIgnoringCatalog() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return 0;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return 0;
      return parsed.reduce(function (n, row) {
        if (!row || typeof row.id !== "string") return n;
        return n + Math.max(1, parseInt(row.qty, 10) || 1);
      }, 0);
    } catch (e) {
      return 0;
    }
  }

  function syncAllBadges() {
    var totalQty = getProducts().length ? stackLineCount() : badgeCountIgnoringCatalog();
    var text = totalQty > 99 ? "99+" : String(totalQty);
    document.querySelectorAll(".vault-stack-badge").forEach(function (b) {
      b.textContent = text;
      if (totalQty > 0) b.classList.remove("hidden");
      else b.classList.add("hidden");
    });
  }

  function scrollStackIntoView() {
    var stackDrawer = document.getElementById("stack-drawer");
    if (!stackDrawer) {
      window.location.href = "collections.html#stack-drawer";
      return;
    }
    var instant = false;
    try {
      instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      /* ignore */
    }
    stackDrawer.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "nearest" });
    try {
      stackDrawer.focus({ preventScroll: true });
    } catch (err) {
      /* ignore */
    }
  }

  function setLineQty(productId, qty) {
    var n = Math.max(0, parseInt(qty, 10) || 0);
    stackLines = stackLines
      .map(function (row) {
        if (row.id !== productId) return row;
        return n <= 0 ? null : { id: row.id, qty: n };
      })
      .filter(Boolean);
    persistStack();
    renderStackDrawer();
  }

  function removeLine(productId) {
    stackLines = stackLines.filter(function (row) {
      return row.id !== productId;
    });
    persistStack();
    renderStackDrawer();
  }

  function renderStackDrawer() {
    syncAllBadges();

    var stackList = document.getElementById("stack-drawer-list");
    var stackEmpty = document.getElementById("stack-drawer-empty");
    var stackFooter = document.getElementById("stack-drawer-footer");
    var stackSubtotal = document.getElementById("stack-drawer-subtotal");

    if (!stackList || !stackEmpty || !stackFooter || !stackSubtotal) return;

    rebuildProductMap();

    if (!getProducts().length) {
      stackEmpty.classList.remove("hidden");
      stackList.classList.add("hidden");
      stackFooter.classList.add("hidden");
      stackList.innerHTML = "";
      stackEmpty.querySelector("p") &&
        (stackEmpty.querySelector("p").textContent =
          "Catalog unavailable. Open the shop to manage your stack.");
      return;
    }

    if (stackLines.length === 0) {
      stackEmpty.classList.remove("hidden");
      stackList.classList.add("hidden");
      stackFooter.classList.add("hidden");
      stackList.innerHTML = "";
      return;
    }

    stackEmpty.classList.add("hidden");
    stackList.classList.remove("hidden");
    stackFooter.classList.remove("hidden");

    var subtotal = 0;
    stackList.innerHTML = stackLines
      .map(function (row) {
        var p = productById[row.id];
        if (!p) return "";
        subtotal += p.price * row.qty;
        var name = escapeHtml(p.name);
        var img = escapeAttr(p.image);
        var href = escapeAttr(detailHref(p.id));
        var lineTotal = p.price * row.qty;
        var metaRow =
          row.qty > 1
            ? '<p class="vault-stack-card-meta font-body-md text-xs text-on-surface-variant leading-normal">' +
              escapeHtml(formatPrice(p.price)) +
              " × " +
              row.qty +
              " in stack</p>"
            : "";
        return (
          '<li class="vault-stack-card flex flex-row gap-3 px-5 py-5 bg-surface" role="listitem">' +
          '<a href="' +
          href +
          '" class="vault-stack-card-thumb shrink-0 block w-[4.25rem] h-[5.25rem] sm:w-[4.5rem] sm:h-[5.5rem] border-[2px] border-primary overflow-hidden bg-surface-container">' +
          '<img alt="' +
          escapeAttr(p.name) +
          '" class="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all" src="' +
          img +
          '" referrerpolicy="no-referrer" decoding="async" />' +
          "</a>" +
          '<div class="vault-stack-card-body min-w-0 flex-1 flex flex-col gap-3">' +
          '<a href="' +
          href +
          '" class="vault-stack-card-title block font-label-caps uppercase text-primary tracking-[0.05em] text-[0.7rem] leading-snug hover:underline decoration-1 underline-offset-2">' +
          name +
          "</a>" +
          '<p class="vault-stack-card-line font-headline-md text-base sm:text-lg text-tertiary-fixed-dim tabular-nums leading-none whitespace-nowrap">' +
          escapeHtml(formatPrice(lineTotal)) +
          "</p>" +
          metaRow +
          '<div class="vault-stack-card-actions flex flex-row flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1">' +
          '<div class="inline-flex border-[2px] border-primary">' +
          '<button type="button" class="stack-qty stack-qty-minus vault-stack-qty-btn font-label-caps text-label-caps bg-surface hover:bg-primary hover:text-on-primary transition-colors" data-product-id="' +
          escapeAttr(p.id) +
          '">−</button>' +
          '<span class="vault-stack-qty-btn flex items-center justify-center font-label-caps text-label-caps border-l-[2px] border-r-[2px] border-primary min-w-[2.75rem]">' +
          row.qty +
          "</span>" +
          '<button type="button" class="stack-qty stack-qty-plus vault-stack-qty-btn font-label-caps text-label-caps bg-surface hover:bg-primary hover:text-on-primary transition-colors" data-product-id="' +
          escapeAttr(p.id) +
          '">+</button>' +
          "</div>" +
          '<button type="button" class="stack-remove vault-stack-remove font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-primary border-b border-transparent hover:border-primary transition-colors min-h-[44px] inline-flex items-center shrink-0" data-product-id="' +
          escapeAttr(p.id) +
          '">remove</button>' +
          "</div></div></li>"
        );
      })
      .join("");

    stackSubtotal.textContent = formatPrice(subtotal);

    stackList.querySelectorAll(".stack-qty-minus").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-product-id");
        var row = stackLines.find(function (r) {
          return r.id === id;
        });
        if (!row) return;
        setLineQty(id, row.qty - 1);
      });
    });
    stackList.querySelectorAll(".stack-qty-plus").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-product-id");
        var row = stackLines.find(function (r) {
          return r.id === id;
        });
        if (!row) return;
        setLineQty(id, row.qty + 1);
      });
    });
    stackList.querySelectorAll(".stack-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeLine(btn.getAttribute("data-product-id"));
      });
    });
  }

  function applyStackAdd(productId) {
    rebuildProductMap();
    if (!productId || !productById[productId]) return false;
    var existing = stackLines.find(function (row) {
      return row.id === productId;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      stackLines.push({ id: productId, qty: 1 });
    }
    persistStack();
    return true;
  }

  function addProductToStack(productId) {
    if (!applyStackAdd(productId)) return;
    renderStackDrawer();
    scrollStackIntoView();
  }

  function addProductToStackAndGoToShop(productId) {
    if (!applyStackAdd(productId)) return;
    renderStackDrawer();
    window.location.assign("collections.html#stack-drawer");
  }

  function addProductToStackAndGoToCheckout(productId) {
    if (!applyStackAdd(productId)) return;
    renderStackDrawer();
    window.location.assign("checkout.html");
  }

  function wireStackToggles() {
    document.querySelectorAll("[data-vault-stack-toggle]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (document.getElementById("stack-drawer")) {
          e.preventDefault();
          scrollStackIntoView();
        }
      });
    });
  }

  function onHashToStack() {
    if (window.location.hash !== "#stack-drawer") return;
    requestAnimationFrame(function () {
      scrollStackIntoView();
    });
  }

  function init() {
    mountStackIfNeeded();
    rebuildProductMap();
    loadStackFromStorage();
    renderStackDrawer();
    wireStackToggles();
    window.addEventListener("hashchange", onHashToStack);
    onHashToStack();
  }

  window.VaultStack = {
    add: addProductToStack,
    addAndGoToShop: addProductToStackAndGoToShop,
    addAndGoToCheckout: addProductToStackAndGoToCheckout,
    render: renderStackDrawer,
    reload: function () {
      rebuildProductMap();
      loadStackFromStorage();
      renderStackDrawer();
    },
    scrollIntoView: scrollStackIntoView,
  };

  function run() {
    init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
