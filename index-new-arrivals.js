/**
 * Home — NEW ARRIVALS quick add: push to pull stack and open checkout.
 */
(function () {
  function onClick(e) {
    var btn = e.target.closest("[data-vault-quick-checkout]");
    if (!btn) return;
    var id = btn.getAttribute("data-vault-quick-checkout");
    if (!id) return;
    if (!window.VaultStack || typeof window.VaultStack.addAndGoToCheckout !== "function") return;
    e.preventDefault();
    window.VaultStack.addAndGoToCheckout(id);
  }

  document.addEventListener("click", onClick);
})();
