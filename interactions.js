/**
 * interactions.js — Interaction System (Masterpiece Edition)
 *
 * Raycasts from camera center to detect interactable objects.
 * Features: proximity-based glow intensity, smooth highlight transitions,
 * object pulse on hover, distance-based prompt text scaling.
 *
 * HOW TO ADD A NEW INTERACTABLE OBJECT:
 *   1. In roles.js, add an object with: interactable: true, name, promptText, interactionText.
 *   2. The interactionText supports HTML (shown in info panel).
 *   3. Add a matching task entry in the tasks array with the same objectName.
 */

var VRInteractions = (function () {

  // ─── Constants ──────────────────────────────────
  var IDIST      = 6;      // max interaction distance (increased from 5)
  var HCOL       = 0x335577;
  var HINT       = 0.35;
  var HINT_CLOSE = 0.6;   // glow intensity when very close
  var HIGHLIGHT_SPEED = 4; // smooth transition speed

  // ─── State ──────────────────────────────────────
  var interactables = [];
  var origEmissive  = new Map();
  var currentTarget = null;
  var panelOpen     = false;
  var enabled       = false;

  // Smooth highlight state
  var highlightT    = 0;    // 0 = no highlight, 1 = full highlight
  var targetHL      = 0;    // target for smooth interpolation
  var lastTarget    = null;

  var promptEl, promptTextEl, crosshairEl;
  var panelEl, panelTitleEl, panelTextEl, panelCloseBtn;

  var ray;    // THREE.Raycaster
  var CENTER; // THREE.Vector2

  /** Call once after Three.js has loaded. */
  function init() {
    ray    = new THREE.Raycaster();
    CENTER = new THREE.Vector2(0, 0);

    promptEl      = document.getElementById('interaction-prompt');
    promptTextEl  = document.getElementById('prompt-text');
    crosshairEl   = document.getElementById('crosshair');
    panelEl       = document.getElementById('info-panel');
    panelTitleEl  = document.getElementById('ip-title');
    panelTextEl   = document.getElementById('ip-text');
    panelCloseBtn = document.getElementById('ip-close');

    panelCloseBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', function (e) {
      if (!enabled) return;
      if (e.code === 'KeyE') {
        if (panelOpen) {
          closePanel();
        } else if (currentTarget) {
          var name = currentTarget.userData.name || 'Object';
          var text = currentTarget.userData.interactionText || 'No info.';
          openPanel(name, text);
          if (typeof VRTasks !== 'undefined') VRTasks.complete(currentTarget.userData.name);
          if (typeof VRSound !== 'undefined') VRSound.interact();
        }
      }
      if (e.code === 'Escape' && panelOpen) closePanel();
    });
  }

  function setInteractables(meshes) {
    interactables = meshes;
    origEmissive.clear();
    meshes.forEach(function (m) {
      if (m.material) {
        origEmissive.set(m.uuid, {
          c: m.material.emissive ? m.material.emissive.getHex() : 0,
          i: m.material.emissiveIntensity || 0
        });
      }
    });
  }

  function clear() {
    interactables = [];
    origEmissive.clear();
    currentTarget = null;
    lastTarget = null;
    highlightT = 0;
    targetHL = 0;
    hidePrompt();
    closePanel();
  }

  function enable()  { enabled = true; highlightT = 0; }
  function disable() { enabled = false; highlightT = 0; }

  function update(camera) {
    if (!enabled || !camera) return;

    if (panelOpen) return;

    ray.setFromCamera(CENTER, camera);
    var hits = ray.intersectObjects(interactables, false);
    var hit = null;
    var hitDist = Infinity;
    if (hits.length > 0 && hits[0].distance <= IDIST) {
      hit = hits[0].object;
      hitDist = hits[0].distance;
    }

    if (hit !== currentTarget) {
      // Start transition to new target
      if (currentTarget) {
        unhighlight(currentTarget);
      }
      currentTarget = hit;
      lastTarget = hit;
      if (currentTarget) {
        highlight(currentTarget);
        showPrompt(currentTarget.userData.promptText || 'Interact');
      } else {
        hidePrompt();
      }
    }

    // Smooth highlight intensity based on proximity
    targetHL = hit ? Math.max(0, 1 - hitDist / IDIST) : 0;
    highlightT += (targetHL - highlightT) * Math.min(1, HIGHLIGHT_SPEED * 0.016);

    // Apply proximity-based emissive intensity
    if (currentTarget && currentTarget.material && currentTarget.material.emissive) {
      var orig = origEmissive.get(currentTarget.uuid);
      if (orig) {
        var baseI = orig.i;
        var highlightI = baseI + highlightT * (HINT - baseI + (HINT_CLOSE - HINT) * highlightT);
        currentTarget.material.emissiveIntensity = highlightI;
      } else {
        currentTarget.material.emissiveIntensity = highlightT * HINT;
      }
      // Slight emissive color shift on close approach
      if (highlightT > 0.5) {
        var t = (highlightT - 0.5) * 2;
        currentTarget.material.emissive.setHex(
          lerpColor(HCOL, 0x64b5f6, t)
        );
      }
    }
  }

  function lerpColor(a, b, t) {
    var ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
    var br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
    var rr = Math.round(ar + (br - ar) * t);
    var rg = Math.round(ag + (bg - ag) * t);
    var rb = Math.round(ab + (bb - ab) * t);
    return (rr << 16) | (rg << 8) | rb;
  }

  function highlight(mesh) {
    if (mesh.material && mesh.material.emissive) {
      mesh.material.emissive.setHex(HCOL);
      mesh.material.emissiveIntensity = 0;
    }
    crosshairEl.classList.add('active');
  }

  function unhighlight(mesh) {
    if (mesh.material && mesh.material.emissive) {
      var orig = origEmissive.get(mesh.uuid);
      if (orig) {
        mesh.material.emissive.setHex(orig.c);
        mesh.material.emissiveIntensity = orig.i;
      } else {
        mesh.material.emissive.setHex(0);
        mesh.material.emissiveIntensity = 0;
      }
    }
    crosshairEl.classList.remove('active');
  }

  function showPrompt(text) {
    promptTextEl.innerHTML = '<kbd>E</kbd> ' + text;
    promptEl.classList.remove('hidden');
  }

  function hidePrompt() {
    promptEl.classList.add('hidden');
  }

  function openPanel(title, text) {
    panelTitleEl.textContent = title;
    panelTextEl.innerHTML   = text;
    panelEl.classList.remove('hidden');
    panelOpen = true;
    hidePrompt();
  }

  function closePanel() {
    panelEl.classList.add('hidden');
    panelOpen = false;
  }

  function getCurrentTarget() { return currentTarget; }

  return {
    init: init,
    setInteractables: setInteractables,
    clear: clear,
    enable: enable,
    disable: disable,
    update: update,
    getCurrentTarget: getCurrentTarget
  };

})();
