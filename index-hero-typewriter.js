/**
 * Hero headline typewriter loop: FASHION → STREETWEAR → (pause) → repeat
 */
(function () {
  var line1 = document.getElementById("hero-type-line1");
  var line2 = document.getElementById("hero-type-line2");
  var cursor = document.querySelector(".hero-type-cursor");
  if (!line1 || !line2) return;

  var w1 = "FASHION";
  var w2 = "STREETWEAR";
  var charMs = 52;
  var pauseBetweenLines = 320;
  /** Pause with full headline visible before clearing and typing again */
  var pauseBeforeRepeat = 2400;
  var pauseBeforeStart = 350;

  var i = 0;
  var phase = 0;

  function resetCursor() {
    if (!cursor) return;
    cursor.classList.remove("is-done");
    cursor.style.display = "";
  }

  function scheduleLoop() {
    line1.textContent = "";
    line2.textContent = "";
    i = 0;
    phase = 0;
    resetCursor();
    window.setTimeout(tick, pauseBeforeStart);
  }

  function tick() {
    if (phase === 0) {
      if (i < w1.length) {
        line1.textContent += w1.charAt(i++);
        window.setTimeout(tick, charMs);
      } else {
        phase = 1;
        i = 0;
        window.setTimeout(tick, pauseBetweenLines);
      }
    } else if (phase === 1) {
      if (i < w2.length) {
        line2.textContent += w2.charAt(i++);
        window.setTimeout(tick, charMs);
      } else {
        window.setTimeout(scheduleLoop, pauseBeforeRepeat);
      }
    }
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    line1.textContent = w1;
    line2.textContent = w2;
    if (cursor) cursor.style.display = "none";
    return;
  }

  window.setTimeout(tick, pauseBeforeStart);
})();
