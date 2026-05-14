/**
 * Checkout — confirm dialog (Cancel / Proceed) and delivered success state.
 */
(function () {
  var STORAGE_KEY = "vaultPhCollectionStack";

  var confirmRoot = document.getElementById("checkout-confirm-root");
  var deliveredRoot = document.getElementById("checkout-delivered-root");
  var cancelBtn = document.getElementById("checkout-confirm-cancel");
  var proceedBtn = document.getElementById("checkout-confirm-proceed");
  var previousFocus = null;

  if (!confirmRoot || !deliveredRoot || !cancelBtn || !proceedBtn) return;

  function isConfirmOpen() {
    return !confirmRoot.classList.contains("hidden");
  }

  function isDeliveredOpen() {
    return !deliveredRoot.classList.contains("hidden");
  }

  function openConfirm() {
    previousFocus = document.activeElement;
    confirmRoot.classList.remove("hidden");
    confirmRoot.classList.add("flex");
    confirmRoot.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    proceedBtn.focus();
  }

  function closeConfirm(keepBodyLock) {
    confirmRoot.classList.add("hidden");
    confirmRoot.classList.remove("flex");
    confirmRoot.setAttribute("aria-hidden", "true");
    if (!keepBodyLock && !isDeliveredOpen()) {
      document.body.style.overflow = "";
    }
    if (!keepBodyLock && previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function clearStack() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    if (window.VaultCheckoutOrder && typeof window.VaultCheckoutOrder.refresh === "function") {
      window.VaultCheckoutOrder.refresh();
    }
    if (window.VaultStack && typeof window.VaultStack.reload === "function") {
      window.VaultStack.reload();
    }
  }

  function openDelivered() {
    deliveredRoot.classList.remove("hidden");
    deliveredRoot.classList.add("flex");
    deliveredRoot.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    deliveredRoot.classList.remove("checkout-delivered-root--visible");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        deliveredRoot.classList.add("checkout-delivered-root--visible");
      });
    });
  }

  document.querySelectorAll(".js-checkout-place-order").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openConfirm();
    });
  });

  cancelBtn.addEventListener("click", function () {
    closeConfirm(false);
  });
  proceedBtn.addEventListener("click", function () {
    closeConfirm(true);
    clearStack();
    openDelivered();
  });

  confirmRoot.querySelectorAll("[data-checkout-confirm-dismiss]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeConfirm(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (isConfirmOpen()) closeConfirm(false);
  });
})();
