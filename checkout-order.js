/**
 * Checkout order summary from pull stack (localStorage vaultPhCollectionStack).
 * Depends on catalog-data.js (window.VAULT_PRODUCTS).
 */
(function () {
  var STORAGE_KEY = "vaultPhCollectionStack";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function formatPeso(n) {
    return "₱ " + Number(n).toLocaleString("en-PH");
  }

  function productByIdMap() {
    var map = {};
    (window.VAULT_PRODUCTS || []).forEach(function (p) {
      map[p.id] = p;
    });
    return map;
  }

  function readStackLines() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      var byId = productByIdMap();
      var hasCatalog = Object.keys(byId).length > 0;
      return parsed
        .filter(function (row) {
          return row && typeof row.id === "string" && (!hasCatalog || byId[row.id]);
        })
        .map(function (row) {
          return { id: row.id, qty: Math.max(1, parseInt(row.qty, 10) || 1) };
        });
    } catch (e) {
      return [];
    }
  }

  function itemRowHtml(p, qty, lineTotal) {
    var name = escapeHtml(p.name);
    var img = escapeAttr(p.image);
    var meta =
      qty > 1
        ? escapeHtml(formatPeso(p.price)) + " × " + qty
        : "Qty: " + qty;
    return (
      '<div class="flex gap-4 items-start relative group">' +
      '<div class="w-24 h-24 border-[2px] border-primary bg-surface overflow-hidden relative shrink-0">' +
      '<div class="absolute -top-2 -right-2 bg-primary text-on-primary w-6 h-6 flex items-center justify-center font-label-caps text-[10px] rounded-full z-10">' +
      qty +
      "</div>" +
      '<img alt="' +
      escapeAttr(p.name) +
      '" class="w-full h-full object-cover grayscale mix-blend-multiply" src="' +
      img +
      '" referrerpolicy="no-referrer" decoding="async" />' +
      "</div>" +
      '<div class="flex-grow flex flex-col justify-between min-h-[6rem] pt-1">' +
      "<div>" +
      '<h3 class="font-label-caps text-label-caps font-bold uppercase">' +
      name +
      "</h3>" +
      '<p class="font-body-md text-body-md text-on-surface-variant text-sm mt-1">' +
      meta +
      "</p>" +
      "</div>" +
      '<div class="font-label-caps text-label-caps font-bold mt-2">' +
      escapeHtml(formatPeso(lineTotal)) +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function render() {
    var itemsEl = document.getElementById("checkout-order-items");
    var subEl = document.getElementById("checkout-summary-subtotal");
    var vatEl = document.getElementById("checkout-summary-vat");
    var totalEl = document.getElementById("checkout-summary-total");
    if (!itemsEl || !subEl || !vatEl || !totalEl) return;

    var products = window.VAULT_PRODUCTS || [];
    if (!products.length) {
      itemsEl.innerHTML =
        '<div class="text-center py-8 px-4">' +
        '<p class="font-body-md text-on-surface-variant">Catalog unavailable. Open the shop to load your stack.</p>' +
        '<a href="collections.html" class="inline-block mt-4 font-label-caps text-label-caps uppercase text-primary underline">Return to shop</a>' +
        "</div>";
      subEl.textContent = formatPeso(0);
      vatEl.textContent = formatPeso(0);
      totalEl.textContent = formatPeso(0);
      return;
    }

    var byId = productByIdMap();
    var lines = readStackLines();

    if (!lines.length) {
      itemsEl.innerHTML =
        '<div class="text-center py-8 px-4 border-[2px] border-dashed border-primary bg-surface">' +
        '<span class="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">inventory_2</span>' +
        '<p class="font-body-md text-on-surface-variant">Nothing in your stack. Add pieces from the shop floor.</p>' +
        '<a href="collections.html" class="inline-block mt-4 font-label-caps text-label-caps uppercase text-primary underline">Browse collections</a>' +
        "</div>";
      subEl.textContent = formatPeso(0);
      vatEl.textContent = formatPeso(0);
      totalEl.textContent = formatPeso(0);
      return;
    }

    var subtotal = 0;
    itemsEl.innerHTML = lines
      .map(function (row) {
        var p = byId[row.id];
        if (!p) return "";
        var lineTotal = p.price * row.qty;
        subtotal += lineTotal;
        return itemRowHtml(p, row.qty, lineTotal);
      })
      .join("");

    var vat = Math.round(subtotal * 0.12);
    var total = subtotal + vat;
    subEl.textContent = formatPeso(subtotal);
    vatEl.textContent = formatPeso(vat);
    totalEl.textContent = formatPeso(total);
  }

  function run() {
    render();
    if (typeof window.VaultStack !== "undefined" && window.VaultStack.reload) {
      window.VaultStack.reload();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY) render();
  });

  window.VaultCheckoutOrder = { refresh: render };
})();
