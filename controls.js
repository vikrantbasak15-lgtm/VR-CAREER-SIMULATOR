/**
 * controls.js — First-Person Controls (Masterpiece Edition)
 *
 * Pointer lock mouse look + WASD movement + sprint + jump + crouch + head bob.
 * Features: smooth mouse interpolation, sprint stamina, head bob, crouch system.
 *
 * HOW TO ADJUST SETTINGS:
 *   SPEED     — walk speed (default 4.5)
 *   SPRINT    — sprint multiplier (default 1.8)
 *   SENS      — mouse sensitivity (default 0.002)
 *   SMOOTH    — mouse smoothing factor (default 0.15)
 *   JUMPV     — jump velocity (default 5)
 *   GRAV      — gravity (default 12)
 *   PH        — player eye height (default 1.6)
 *   CH        — crouch eye height (default 1.0)
 *   PR        — player radius for collision (default 0.3)
 *   BOB_FREQ  — head bob frequency (default 8)
 *   BOB_AMP   — head bob amplitude (default 0.04)
 *   STAMINA_MAX — max stamina (default 100)
 *   STAMINA_DRAIN — drain rate (default 25/sec)
 *   STAMINA_REGEN — regen rate (default 15/sec)
 */

var VRControls = (function () {

  // ─── Tunable constants ──────────────────────────
  var SPEED       = 4.5;
  var SPRINT      = 1.8;
  var SENS        = 0.002;
  var SMOOTH      = 0.15;    // mouse interpolation factor (0=instant, 1=frozen)
  var JUMPV       = 5;
  var GRAV        = 12;
  var PH          = 1.6;     // standing eye height
  var CH          = 1.0;     // crouched eye height
  var PR          = 0.3;
  var PLIM        = Math.PI / 2 - 0.05;
  var BOB_FREQ    = 8;       // head bob cycles per second
  var BOB_AMP     = 0.04;    // head bob vertical amplitude
  var BOB_LATERAL = 0.02;    // head bob lateral sway
  var STAMINA_MAX     = 100;
  var STAMINA_DRAIN   = 25;  // per second while sprinting
  var STAMINA_REGEN   = 15;  // per second while not sprinting
  var STAMINA_EXHAUST = 20;  // min stamina to start sprinting again

  // ─── State ──────────────────────────────────────
  var cam, domEl;
  var locked = false;
  var enabled = false;
  var yaw       = 0;
  var pitch     = 0;
  var targetYaw   = 0;
  var targetPitch = 0;
  var vy        = 0;
  var onG       = true;
  var bounds    = null;
  var ks = { f: 0, b: 0, l: 0, r: 0, sp: 0 };

  // Head bob state
  var bobTime    = 0;
  var bobActive  = false;
  var bobOffsetY = 0;
  var bobOffsetX = 0;

  // Crouch state
  var crouching    = false;
  var targetEyeH   = PH;
  var currentEyeH  = PH;

  // Stamina
  var stamina = STAMINA_MAX;
  var canSprint = true;
  var sprinting = false;

  // Smooth mouse
  var smoothYaw   = 0;
  var smoothPitch = 0;

  // Footstep callback
  var onFootstep = null;

  // V-key unlock state (user unlocked mouse to click UI)
  var vUnlocked = false;

  // Vectors allocated once after THREE is available
  var _fw, _rt, _mv;

  /** Call once after Three.js has loaded. */
  function init(camera, container) {
    cam   = camera;
    domEl = container;
    _fw = new THREE.Vector3();
    _rt = new THREE.Vector3();
    _mv = new THREE.Vector3();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    domEl.addEventListener('click', requestLock);
  }

  function enable()  {
    enabled = true;
    stamina = STAMINA_MAX;
    canSprint = true;
    sprinting = false;
    crouching = false;
    targetEyeH = PH;
    bobTime = 0;
    bobOffsetY = 0;
    bobOffsetX = 0;
  }

  function disable() {
    enabled = false;
    locked = false;
    ks.f = ks.b = ks.l = ks.r = ks.sp = 0;
    vy = 0;
    crouching = false;
    sprinting = false;
    targetEyeH = PH;
    if (document.pointerLockElement) document.exitPointerLock();
  }

  function setBounds(b) { bounds = b; }

  function requestLock() {
    if (enabled) domEl.requestPointerLock();
  }

  function setOnFootstep(cb) { onFootstep = cb; }

  /** Call every frame with delta time. */
  function update(dt) {
    if (!enabled || !cam) return;

    // ── Smooth mouse interpolation ──
    smoothYaw   += (targetYaw   - smoothYaw)   * Math.min(1, dt / (SMOOTH * 0.016));
    smoothPitch += (targetPitch - smoothPitch) * Math.min(1, dt / (SMOOTH * 0.016));
    yaw   = smoothYaw;
    pitch = smoothPitch;

    cam.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));

    // ── Sprint stamina ──
    var wantSprint = ks.sp && (ks.f || ks.b || ks.l || ks.r);
    if (wantSprint && canSprint && stamina > 0) {
      sprinting = true;
      stamina -= STAMINA_DRAIN * dt;
      if (stamina <= 0) {
        stamina = 0;
        canSprint = false;
        sprinting = false;
      }
    } else {
      sprinting = false;
      if (!canSprint && stamina > STAMINA_EXHAUST) {
        canSprint = true;
      }
      stamina = Math.min(STAMINA_MAX, stamina + STAMINA_REGEN * dt);
    }

    var isMoving = ks.f || ks.b || ks.l || ks.r;
    var sp = SPEED * (sprinting ? SPRINT : 1) * dt;

    _fw.set(0, 0, -1).applyQuaternion(cam.quaternion);
    _fw.y = 0; _fw.normalize();

    _rt.set(1, 0, 0).applyQuaternion(cam.quaternion);
    _rt.y = 0; _rt.normalize();

    _mv.set(0, 0, 0);
    if (ks.f) _mv.add(_fw.clone().multiplyScalar(sp));
    if (ks.b) _mv.add(_fw.clone().multiplyScalar(-sp));
    if (ks.l) _mv.add(_rt.clone().multiplyScalar(-sp));
    if (ks.r) _mv.add(_rt.clone().multiplyScalar(sp));

    var nx = cam.position.x + _mv.x;
    var nz = cam.position.z + _mv.z;
    if (bounds) {
      nx = Math.max(bounds.minX + PR, Math.min(bounds.maxX - PR, nx));
      nz = Math.max(bounds.minZ + PR, Math.min(bounds.maxZ - PR, nz));
    }
    cam.position.x = nx;
    cam.position.z = nz;

    // ── Jump / gravity ──
    if (!onG) {
      vy -= GRAV * dt;
      cam.position.y += vy * dt;
      if (cam.position.y <= currentEyeH) {
        cam.position.y = currentEyeH;
        vy = 0;
        onG = true;
      }
    }

    // ── Crouch ──
    targetEyeH = crouching ? CH : PH;
    currentEyeH += (targetEyeH - currentEyeH) * Math.min(1, dt * 12);
    if (onG && !crouching) {
      cam.position.y = currentEyeH;
    }

    // ── Head bob ──
    if (isMoving && onG) {
      var bobSpeed = sprinting ? BOB_FREQ * 1.4 : BOB_FREQ;
      bobTime += dt * bobSpeed;
      var bobIntensity = sprinting ? 1.3 : 1.0;
      bobOffsetY = Math.sin(bobTime * 2) * BOB_AMP * bobIntensity;
      bobOffsetX = Math.sin(bobTime) * BOB_LATERAL * bobIntensity;
      bobActive = true;

      // Footstep callback
      if (onFootstep) {
        var stepPhase = (bobTime * 2) % (Math.PI * 2);
        if (stepPhase < dt * bobSpeed * 2) {
          onFootstep(sprinting ? 'sprint' : 'walk');
        }
      }
    } else {
      // Ease out bob
      bobOffsetY *= 0.85;
      bobOffsetX *= 0.85;
      if (Math.abs(bobOffsetY) < 0.001) { bobOffsetY = 0; bobActive = false; }
      bobTime = 0;
    }

    cam.position.y += bobOffsetY;
    cam.position.x += bobOffsetX * _rt.x;
    cam.position.z += bobOffsetX * _rt.z;
  }

  // ─── Event handlers ─────────────────────────────
  function onMouseMove(e) {
    if (!locked || !enabled) return;
    targetYaw   -= (e.movementX || 0) * SENS;
    targetPitch -= (e.movementY || 0) * SENS;
    targetPitch  = Math.max(-PLIM, Math.min(PLIM, targetPitch));
  }

  function onKeyDown(e) {
    if (!enabled) return;
    switch (e.code) {
      case 'KeyW': ks.f = 1; break;
      case 'KeyS': ks.b = 1; break;
      case 'KeyA': ks.l = 1; break;
      case 'KeyD': ks.r = 1; break;
      case 'ShiftLeft': case 'ShiftRight': ks.sp = 1; break;
      case 'KeyC':
        crouching = !crouching;
        break;
      case 'Space':
        if (onG && !crouching) { vy = JUMPV; onG = false; }
        e.preventDefault();
        break;
      case 'KeyV':
        // Release pointer lock so user can click UI buttons (quiz, professor, etc.)
        if (locked && enabled) {
          vUnlocked = true;
          document.exitPointerLock();
        }
        break;
    }
  }

  function onKeyUp(e) {
    switch (e.code) {
      case 'KeyW': ks.f = 0; break;
      case 'KeyS': ks.b = 0; break;
      case 'KeyA': ks.l = 0; break;
      case 'KeyD': ks.r = 0; break;
      case 'ShiftLeft': case 'ShiftRight': ks.sp = 0; break;
    }
  }

  function onPointerLockChange() {
    locked = (document.pointerLockElement === domEl);
    var ptrPrompt    = document.getElementById('pointer-lock-prompt');
    var instrOverlay = document.getElementById('instructions-overlay');
    if (locked) {
      vUnlocked = false;
      if (ptrPrompt)    ptrPrompt.classList.add('hidden');
      if (instrOverlay) instrOverlay.classList.add('hidden');
    } else if (enabled && ptrPrompt) {
      // If user pressed V to unlock, don't show the blocking prompt
      // so they can click UI buttons (quiz, professor, etc.)
      if (vUnlocked) {
        ptrPrompt.classList.add('hidden');
      } else {
        ptrPrompt.classList.remove('hidden');
      }
    }
  }

  return {
    init: init,
    enable: enable,
    disable: disable,
    setBounds: setBounds,
    requestLock: requestLock,
    update: update,
    setOnFootstep: setOnFootstep,
    getYaw: function () { return yaw; },
    getPitch: function () { return pitch; },
    setYaw: function (v) { targetYaw = v; smoothYaw = v; yaw = v; },
    setPitch: function (v) { targetPitch = v; smoothPitch = v; pitch = v; },
    isSprinting: function () { return sprinting; },
    isCrouching: function () { return crouching; },
    getStamina: function () { return stamina; },
    getStaminaMax: function () { return STAMINA_MAX; },
    isMoving: function () { return ks.f || ks.b || ks.l || ks.r; },
    getBobOffset: function () { return { x: bobOffsetX, y: bobOffsetY }; }
  };

})();
