/**
 * Checkout prefill from session + profile page render / sign out.
 */
(function () {
  var store = window.VAULT_AUTH_STORE;
  if (!store) return;

  function countryLabel(code) {
    var c = String(code || "PH").toUpperCase();
    var map = { PH: "Philippines", US: "United States", SG: "Singapore", JP: "Japan" };
    return map[c] || c;
  }

  function splitFullName(full) {
    var s = String(full || "").trim();
    if (!s) return { first: "", last: "" };
    var idx = s.indexOf(" ");
    if (idx === -1) return { first: s, last: "" };
    return { first: s.slice(0, idx), last: s.slice(idx + 1).trim() };
  }

  function setInput(id, value) {
    var el = document.getElementById(id);
    if (!el || value == null) return;
    el.value = value;
  }

  function setSelectValueOrAdd(selectEl, value) {
    if (!selectEl || value == null || value === "") return;
    var v = String(value);
    for (var i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === v || selectEl.options[i].textContent === v) {
        selectEl.selectedIndex = i;
        return;
      }
    }
    var opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
    selectEl.value = v;
  }

  function prefillCheckout() {
    if (!document.getElementById("checkout-shipping-first")) return;
    var session = store.getSession();
    if (!session) return;

    setInput("checkout-contact-email", session.email);

    var parts = splitFullName(session.fullName);
    setInput("checkout-shipping-first", parts.first);
    setInput("checkout-shipping-last", parts.last);

    var addr = session.addresses && session.addresses[0];
    if (addr) {
      setInput("checkout-shipping-address1", addr.line1);
      setInput("checkout-shipping-address2", addr.line2 || "");
      setInput("checkout-shipping-city", addr.city);
      setInput("checkout-shipping-postal", addr.postalCode);
      setSelectValueOrAdd(document.getElementById("checkout-shipping-region"), addr.region);
    }

    var countryEl = document.getElementById("checkout-shipping-country");
    if (countryEl && addr && addr.country) {
      setSelectValueOrAdd(countryEl, addr.country);
    }

    var news = document.getElementById("news");
    if (news && session.newsletterOptIn) news.checked = true;
  }

  function formatAddressPlain(addr) {
    if (!addr) return "";
    var lines = [addr.line1, addr.line2].filter(Boolean).join(", ");
    var tail = [addr.city, addr.region, addr.postalCode, countryLabel(addr.country)]
      .filter(Boolean)
      .join(", ");
    return (lines || "") + (lines && tail ? "\n" : "") + (tail || "");
  }

  function renderProfile() {
    var root = document.getElementById("profile-root");
    var guest = document.getElementById("profile-guest");
    if (!root) return;

    var session = store.getSession();
    if (!session) {
      if (guest) guest.classList.remove("hidden");
      root.classList.add("hidden");
      return;
    }
    if (guest) guest.classList.add("hidden");
    root.classList.remove("hidden");

    var setText = function (id, text) {
      var n = document.getElementById(id);
      if (n) n.textContent = text == null || text === "" ? "—" : text;
    };

    setText("profile-full-name", session.fullName);
    setText("profile-email", session.email);
    setText("profile-phone", session.phone || "—");
    setText("profile-role", session.role || "customer");
    setText("profile-newsletter", session.newsletterOptIn ? "Subscribed" : "Not subscribed");
    setText(
      "profile-created",
      session.createdAt
        ? new Date(session.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—"
    );
    setText(
      "profile-last-login",
      session.lastLoginAt ? new Date(session.lastLoginAt).toLocaleString() : "—"
    );

    var initialsEl = document.getElementById("profile-avatar-initials");
    if (initialsEl) {
      var nm = String(session.fullName || "").trim();
      var parts = nm.split(/\s+/).filter(Boolean);
      var initials =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : parts.length === 1
            ? parts[0].slice(0, 2).toUpperCase()
            : "?";
      initialsEl.textContent = initials;
    }

    var addrBox = document.getElementById("profile-address-block");
    if (addrBox) {
      addrBox.textContent = "";
      var a = session.addresses && session.addresses[0];
      if (a) {
        var pre = document.createElement("pre");
        pre.className =
          "font-body-md text-base md:text-lg text-primary whitespace-pre-wrap leading-relaxed m-0 tracking-tight";
        pre.textContent = formatAddressPlain(a) || "—";
        addrBox.appendChild(pre);
      } else {
        var p = document.createElement("p");
        p.className =
          "font-body-md text-body-md text-on-surface-variant m-0 max-w-md border-l-[3px] border-primary pl-4 py-1";
        p.textContent = "No address on file.";
        addrBox.appendChild(p);
      }
    }

    var termsEl = document.getElementById("profile-terms");
    if (termsEl) {
      termsEl.textContent = session.registryTermsAccepted ? "Accepted" : "—";
    }

    var out = document.getElementById("profile-sign-out");
    if (out) {
      out.onclick = function () {
        store.clearSession();
        window.location.href = "sign-in.html";
      };
    }
  }

  function init() {
    prefillCheckout();
    renderProfile();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
