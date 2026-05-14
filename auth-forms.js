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
    if (document.getElementById("sign-in-form")) {
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

      store.fetchJsonUsers().then(function (allUsers) {
        var user = store.findUserByCredentials(email, password, allUsers);
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

      store.fetchJsonUsers().then(function (allUsers) {
        if (!Array.isArray(allUsers)) allUsers = [];
        var n = store.normalizeEmail(emailRaw);
        var taken = allUsers.some(function (u) {
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

        return fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: newUser }),
        })
          .then(function (res) {
            if (res.status === 409) {
              window.alert("This email is already registered. Sign in instead.");
              return Promise.reject({ duplicate: true });
            }
            if (!res.ok) {
              return res.text().then(function (t) {
                var msg = "Could not save to users.json.";
                try {
                  var j = JSON.parse(t);
                  if (j && j.error) msg = j.error;
                } catch (e) {}
                throw new Error(msg);
              });
            }
            return res.text().then(function (t) {
              try {
                return t ? JSON.parse(t) : { ok: true };
              } catch (e2) {
                return { ok: true };
              }
            });
          })
          .then(function () {
            return store.persistUsersJsonSnapshot();
          })
          .catch(function (err) {
            if (err && err.duplicate) return Promise.reject(err);
            console.warn("vault-ph: POST /api/register failed — saving to localStorage only.", err);
            store.registerUser(newUser);
            return store.persistUsersJsonSnapshot();
          });
      }).then(function (doc) {
        if (!doc) return;
        window.location.href =
          "sign-in.html?email=" + encodeURIComponent(emailRaw);
      }).catch(function (err) {
        if (err && err.duplicate) return;
        console.error("vault-ph sign-up:", err);
        window.alert(
          (err && err.message) ||
            "Sign-up could not complete. If you are not using this app’s Node server, run `npm start` and open http://localhost:3000 — or check the browser console for details."
        );
      });
    });
  }
})();
