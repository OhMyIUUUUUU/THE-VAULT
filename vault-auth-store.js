/**
 * Vault PH — client-side user list + session (demo only).
 * JSON users merge with localStorage registrations; passwords must never ship to production like this.
 */
(function (global) {
  var REG_KEY = "vaultPhRegisteredUsers";
  var SESS_KEY = "vaultPhSession";
  /** Full merged document (same shape as users.json) after sign-up sync. */
  var SNAPSHOT_KEY = "vaultPhUsersJsonSnapshot";

  function normalizeEmail(e) {
    return String(e || "")
      .trim()
      .toLowerCase();
  }

  function getRegisteredUsers() {
    try {
      var raw = localStorage.getItem(REG_KEY);
      if (!raw) return [];
      var p = JSON.parse(raw);
      return Array.isArray(p) ? p : [];
    } catch (err) {
      return [];
    }
  }

  function saveRegisteredUsers(arr) {
    localStorage.setItem(REG_KEY, JSON.stringify(arr));
  }

  function registerUser(user) {
    var list = getRegisteredUsers();
    list.push(user);
    saveRegisteredUsers(list);
  }

  function usersJsonFetchUrl() {
    return "./users.json?v=" + Date.now();
  }

  /**
   * Loads users.json from the server and merges in local registrations (same list used for sign-in / sign-up).
   */
  function fetchJsonUsers() {
    return fetch(usersJsonFetchUrl(), {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(function (res) {
        if (!res.ok) throw new Error("users.json");
        return res.json();
      })
      .then(function (data) {
        var fileUsers = data && Array.isArray(data.users) ? data.users : [];
        return mergeUserLists(fileUsers, getRegisteredUsers());
      })
      .catch(function () {
        try {
          var snap = localStorage.getItem(SNAPSHOT_KEY);
          if (snap) {
            var doc = JSON.parse(snap);
            if (doc && Array.isArray(doc.users)) {
              return mergeUserLists(doc.users, getRegisteredUsers());
            }
          }
        } catch (err) {}
        return mergeUserLists([], getRegisteredUsers());
      });
  }

  /**
   * Re-reads users.json, merges with all registered users, and saves a users.json-shaped snapshot to localStorage.
   * Browsers cannot write the real file; copy from DevTools → Application → Local Storage or use Export if you add it.
   */
  function persistUsersJsonSnapshot() {
    return fetch(usersJsonFetchUrl(), {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(function (res) {
        if (!res.ok) throw new Error("users.json");
        return res.json();
      })
      .then(function (base) {
        var merged = mergeUserLists(base.users || [], getRegisteredUsers());
        var doc = {
          version: typeof base.version === "number" ? base.version : 1,
          updatedAt: new Date().toISOString(),
          users: merged,
        };
        try {
          localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(doc, null, 2));
        } catch (err) {}
        return doc;
      })
      .catch(function () {
        var reg = getRegisteredUsers();
        var doc = {
          version: 1,
          updatedAt: new Date().toISOString(),
          users: reg,
        };
        try {
          localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(doc, null, 2));
        } catch (err2) {}
        return doc;
      });
  }

  /** Registered users override JSON when email matches. */
  function mergeUserLists(jsonUsers, regUsers) {
    var map = {};
    (jsonUsers || []).forEach(function (u) {
      if (u && u.email) map[normalizeEmail(u.email)] = u;
    });
    (regUsers || []).forEach(function (u) {
      if (u && u.email) map[normalizeEmail(u.email)] = u;
    });
    return Object.keys(map).map(function (k) {
      return map[k];
    });
  }

  function findUserByCredentials(email, password, allUsers) {
    var n = normalizeEmail(email);
    var pw = String(password || "");
    for (var i = 0; i < allUsers.length; i++) {
      var u = allUsers[i];
      if (!u || normalizeEmail(u.email) !== n) continue;
      var stored = u.passwordDemo != null ? u.passwordDemo : u.password;
      if (String(stored) === pw) return u;
    }
    return null;
  }

  function sanitizeSessionUser(u) {
    if (!u) return null;
    var o = JSON.parse(JSON.stringify(u));
    delete o.passwordDemo;
    delete o.password;
    return o;
  }

  function setSession(user) {
    localStorage.setItem(SESS_KEY, JSON.stringify(sanitizeSessionUser(user)));
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(SESS_KEY);
  }

  global.VAULT_AUTH_STORE = {
    REG_KEY: REG_KEY,
    SESS_KEY: SESS_KEY,
    SNAPSHOT_KEY: SNAPSHOT_KEY,
    normalizeEmail: normalizeEmail,
    getRegisteredUsers: getRegisteredUsers,
    registerUser: registerUser,
    fetchJsonUsers: fetchJsonUsers,
    persistUsersJsonSnapshot: persistUsersJsonSnapshot,
    mergeUserLists: mergeUserLists,
    findUserByCredentials: findUserByCredentials,
    setSession: setSession,
    getSession: getSession,
    clearSession: clearSession,
    sanitizeSessionUser: sanitizeSessionUser,
  };
})(typeof window !== "undefined" ? window : this);
