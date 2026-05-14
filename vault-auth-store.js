/**
 * Vault PH — client-side user list + session (demo only).
 * JSON users merge with localStorage registrations; passwords must never ship to production like this.
 */
(function (global) {
  var REG_KEY = "vaultPhRegisteredUsers";
  var SESS_KEY = "vaultPhSession";

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

  function fetchJsonUsers() {
    return fetch("./users.json", { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("users.json");
        return res.json();
      })
      .then(function (data) {
        return data && Array.isArray(data.users) ? data.users : [];
      })
      .catch(function () {
        return [];
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
    normalizeEmail: normalizeEmail,
    getRegisteredUsers: getRegisteredUsers,
    registerUser: registerUser,
    fetchJsonUsers: fetchJsonUsers,
    mergeUserLists: mergeUserLists,
    findUserByCredentials: findUserByCredentials,
    setSession: setSession,
    getSession: getSession,
    clearSession: clearSession,
    sanitizeSessionUser: sanitizeSessionUser,
  };
})(typeof window !== "undefined" ? window : this);
