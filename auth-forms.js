/**
 * Sign in / sign up — demo: merge users.json + localStorage, session, redirect.
 */
(function () {
  var store = window.VAULT_AUTH_STORE;
  if (!store) return;

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function prefillSignInEmailFromQuery() {
    try {
      var q = new URLSearchParams(window.location.search).get("email");
      var input = document.getElementById("signin-email");
      if (q && input) input.value = decodeURIComponent(q).replace(/\+/g, " ");
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", prefillSignInEmailFromQuery);

  document.addEventListener("DOMContentLoaded", function () {
    if (!store.getSession()) return;
    if (document.getElementById("sign-in-form") || document.getElementById("sign-up-form")) {
      window.location.replace("home.html");
    }
  });

  var signIn = document.getElementById("sign-in-form");
  if (signIn) {
    signIn.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = val("signin-email");
      var passEl = document.getElementById("signin-password");
      var password = passEl ? passEl.value : "";
      if (!email || !password) return;

      store.fetchJsonUsers().then(function (jsonUsers) {
        var reg = store.getRegisteredUsers();
        var all = store.mergeUserLists(jsonUsers, reg);
        var user = store.findUserByCredentials(email, password, all);
        if (!user) {
          if (passEl) {
            passEl.setCustomValidity("Invalid email or password.");
            passEl.reportValidity();
            setTimeout(function () {
              passEl.setCustomValidity("");
            }, 2000);
          }
          return;
        }
        user.lastLoginAt = new Date().toISOString();
        store.setSession(user);
        window.location.href = "home.html";
      });
    });
  }

  var signUp = document.getElementById("sign-up-form");
  if (signUp) {
    signUp.addEventListener("submit", function (e) {
      e.preventDefault();
      var p1 = document.getElementById("signup-password");
      var p2 = document.getElementById("signup-password2");
      if (p1 && p2 && p1.value !== p2.value) {
        p2.setCustomValidity("Passwords must match");
        p2.reportValidity();
        return;
      }
      if (p2) p2.setCustomValidity("");

      var emailRaw = val("signup-email");
      var fullName = val("signup-name");
      var password = p1 ? p1.value : "";

      var line1 = val("signup-address-line1");
      var line2 = val("signup-address-line2");
      var city = val("signup-city");
      var region = val("signup-region");
      var postal = val("signup-postal");
      var countryEl = document.getElementById("signup-country");
      var country = countryEl ? countryEl.value : "PH";

      var newsletterEl = document.getElementById("signup-newsletter");

      store.fetchJsonUsers().then(function (jsonUsers) {
        var reg = store.getRegisteredUsers();
        var all = store.mergeUserLists(jsonUsers, reg);
        var n = store.normalizeEmail(emailRaw);
        var taken = all.some(function (u) {
          return u && store.normalizeEmail(u.email) === n;
        });
        if (taken) {
          window.alert("This email is already registered. Sign in instead.");
          return;
        }

        var addr = {
          label: "default",
          line1: line1,
          city: city,
          region: region,
          postalCode: postal,
          country: country,
        };
        if (line2) addr.line2 = line2;

        var newUser = {
          id: "usr_" + Date.now(),
          fullName: fullName,
          email: emailRaw,
          passwordDemo: password,
          phone: "",
          role: "customer",
          newsletterOptIn: !!(newsletterEl && newsletterEl.checked),
          registryTermsAccepted: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
          addresses: [addr],
        };

        store.registerUser(newUser);
        window.location.href =
          "sign-in.html?email=" + encodeURIComponent(emailRaw);
      });
    });
  }
})();
