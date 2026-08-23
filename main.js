/**
 * main.js — Main Entry Point (Masterpiece Edition)
 *
 * Initializes Three.js with ACES tone mapping, shadow mapping, bloom + film grain + vignette.
 * Manages role selection, scene building, animation system, particles,
 * camera transitions, quality auto-detection, minimap, compass, achievements.
 *
 * ARCHITECTURE:
 *   roles.js        — role data (ROLES array)
 *   controls.js     — VRControls (first-person controls)
 *   interactions.js — VRInteractions (raycasting + prompts)
 *   BloomPostFX.js  — bloom + grain + vignette + chromatic aberration
 *   Particles.js    — particle system (7 presets)
 *   CanvasTextures.js — live animated screen textures (9 types)
 *   main.js         — this file (scene, render loop, UI wiring)
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  QUALITY MANAGER
  // ═══════════════════════════════════════════════════
  var Quality = (function () {
    var TIER_NAMES = ['Low', 'Medium', 'High'];
    var tier = 2;

    function detect() {
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) { tier = 0; return; }
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        var gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).toLowerCase();
        if (gpu.indexOf('intel') !== -1 || gpu.indexOf('mesa') !== -1 || gpu.indexOf('swiftshader') !== -1) tier = 1;
        if (gpu.indexOf('adreno 3') !== -1 || gpu.indexOf('mali-4') !== -1 || gpu.indexOf('powervr') !== -1) tier = 0;
      }
    }

    function setTier(t) { tier = Math.max(0, Math.min(2, t)); updateBadge(); }
    function getTier() { return tier; }
    function shadowsEnabled() { return tier >= 1; }
    function bloomEnabled()   { return tier >= 2; }
    function particlesEnabled() { return tier >= 1; }
    function screensEnabled() { return tier >= 1; }

    function cycleTier() { tier = (tier + 1) % 3; updateBadge(); }

    function updateBadge() {
      var badge = document.getElementById('quality-badge');
      if (badge) badge.textContent = 'Quality: ' + TIER_NAMES[tier];
    }

    return { detect: detect, setTier: setTier, getTier: getTier, cycleTier: cycleTier,
             shadowsEnabled: shadowsEnabled, bloomEnabled: bloomEnabled,
             particlesEnabled: particlesEnabled, screensEnabled: screensEnabled };
  })();

  // ═══════════════════════════════════════════════════
  //  SOUND SYSTEM (Web Audio API)
  // ═══════════════════════════════════════════════════
  var VRSound = (function () {
    var audioCtx = null;
    var on = true;
    var lastBeepTime = 0;

    function init() {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext); } catch (e) {}
    }

    function beep(freq, dur, vol) {
      if (!on || !audioCtx) return;
      var now = audioCtx.currentTime;
      if (now - lastBeepTime < 0.05) return;
      lastBeepTime = now;
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = freq; o.type = 'sine';
      g.gain.setValueAtTime(vol || 0.1, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + (dur || 0.15));
      o.start(); o.stop(now + (dur || 0.15));
    }

    function interact() { beep(800, 0.1, 0.08); }
    function taskDone() {
      beep(523, 0.1, 0.06);
      setTimeout(function () { beep(659, 0.1, 0.06); }, 100);
      setTimeout(function () { beep(784, 0.15, 0.08); }, 200);
    }
    function allDone() {
      beep(523, 0.1, 0.06);
      setTimeout(function () { beep(659, 0.1, 0.06); }, 120);
      setTimeout(function () { beep(784, 0.1, 0.06); }, 240);
      setTimeout(function () { beep(1047, 0.25, 0.1); }, 360);
    }
    function footstep(type) {
      if (type === 'sprint') beep(200, 0.03, 0.03);
      else beep(180, 0.03, 0.02);
    }
    function toggle() { on = !on; return on; }

    return {
      init: init, beep: beep, interact: interact,
      taskDone: taskDone, allDone: allDone, footstep: footstep,
      toggle: toggle, isOn: function () { return on; }
    };
  })();

  // ═══════════════════════════════════════════════════
  //  INVENTORY SYSTEM
  // ═══════════════════════════════════════════════════
  var InventorySystem = (function () {
    var items = [];
    var maxSlots = 8;
    var panelEl, slotsEl;

    function init() {
      panelEl = document.getElementById('inventory-panel');
      slotsEl = document.getElementById('inventory-slots');
      if (slotsEl) slotsEl.innerHTML = '';
      items = [];
      render();
    }

    function addItem(name, icon) {
      if (items.length >= maxSlots) return false;
      if (items.find(function(i){ return i.name === name; })) return false;
      items.push({ name: name, icon: icon || '📦' });
      render();
      return true;
    }

    function removeItem(name) {
      items = items.filter(function(i){ return i.name !== name; });
      render();
    }

    function hasItem(name) { return items.some(function(i){ return i.name === name; }); }

    function render() {
      if (!slotsEl) return;
      slotsEl.innerHTML = '';
      for (var i = 0; i < maxSlots; i++) {
        var slot = document.createElement('div');
        slot.className = 'inventory-slot' + (items[i] ? ' filled' : '');
        slot.textContent = items[i] ? items[i].icon : '';
        if (items[i]) {
          var tip = document.createElement('div');
          tip.className = 'slot-tooltip';
          tip.textContent = items[i].name;
          slot.appendChild(tip);
        }
        slotsEl.appendChild(slot);
      }
      if (panelEl) panelEl.classList.toggle('hidden', items.length === 0);
    }

    function getItems() { return items; }
    function getCount() { return items.length; }

    return { init: init, addItem: addItem, removeItem: removeItem, hasItem: hasItem, getItems: getItems, getCount: getCount };
  })();

  // ═══════════════════════════════════════════════════
  //  TIMER / CHALLENGE MODE
  // ═══════════════════════════════════════════════════
  var ChallengeTimer = (function () {
    var running = false, startTime = 0, elapsed = 0;
    var containerEl, displayEl, urgentThreshold = 180;

    function init() {
      containerEl = document.getElementById('timer-container');
      displayEl = document.getElementById('timer-display');
      running = false; elapsed = 0;
      if (containerEl) containerEl.classList.add('hidden');
    }

    function start() {
      running = true; startTime = Date.now(); elapsed = 0;
      if (containerEl) containerEl.classList.remove('hidden');
    }

    function stop() {
      running = false;
      elapsed = (Date.now() - startTime) / 1000;
    }

    function toggle() {
      if (running) stop(); else start();
    }

    function update() {
      if (!running || !displayEl) return;
      elapsed = (Date.now() - startTime) / 1000;
      var m = Math.floor(elapsed / 60);
      var s = Math.floor(elapsed % 60);
      displayEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      containerEl.classList.toggle('urgent', elapsed > urgentThreshold);
    }

    function getElapsed() { return elapsed; }
    function isRunning() { return running; }

    function showResults(score, total) {
      var resultsEl = document.getElementById('timer-results');
      var timeEl = document.getElementById('timer-results-time');
      var scoreEl = document.getElementById('timer-results-score');
      var ratingEl = document.getElementById('timer-results-rating');
      if (!resultsEl) return;
      var m = Math.floor(elapsed / 60);
      var s = Math.floor(elapsed % 60);
      timeEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      scoreEl.textContent = score + ' / ' + total + ' tasks completed';
      var pct = total > 0 ? score / total : 0;
      var stars = pct >= 1 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : pct >= 0.3 ? '⭐' : '💪';
      ratingEl.textContent = stars;
      resultsEl.classList.remove('hidden');
    }

    return { init: init, start: start, stop: stop, toggle: toggle, update: update,
             getElapsed: getElapsed, isRunning: isRunning, showResults: showResults };
  })();

  // ═══════════════════════════════════════════════════
  //  SCORING SYSTEM
  // ═══════════════════════════════════════════════════
  var ScoreSystem = (function () {
    var score = 0, containerEl, displayEl;

    function init() {
      score = 0;
      containerEl = document.getElementById('score-container');
      displayEl = document.getElementById('score-display');
      if (containerEl) containerEl.classList.add('hidden');
    }

    function show() { if (containerEl) containerEl.classList.remove('hidden'); }
    function hide() { if (containerEl) containerEl.classList.add('hidden'); }

    function addPoints(pts, reason) {
      score += pts;
      if (displayEl) displayEl.textContent = score;
      show();
      if (reason) showNotif('+' + pts + ' ' + reason);
    }

    function getScore() { return score; }

    function getRating() {
      if (score >= 500) return { stars: '⭐⭐⭐⭐⭐', label: 'Master' };
      if (score >= 300) return { stars: '⭐⭐⭐⭐', label: 'Expert' };
      if (score >= 150) return { stars: '⭐⭐⭐', label: 'Skilled' };
      if (score >= 50) return { stars: '⭐⭐', label: 'Apprentice' };
      return { stars: '⭐', label: 'Beginner' };
    }

    return { init: init, show: show, hide: hide, addPoints: addPoints, getScore: getScore, getRating: getRating };
  })();

  // ═══════════════════════════════════════════════════
  //  PROFESSOR MODE (narration tips)
  // ═══════════════════════════════════════════════════
  var ProfessorMode = (function () {
    var active = false, tipIndex = 0, panelEl, textEl, roleTips = [], currentRoleId = '';

    var ROLE_THEME = {
      doctor:   { color: '#4fc3f7', rgb: '79,195,247',  title: 'Doctor',   icon: '🩺' },
      engineer: { color: '#ffb74d', rgb: '255,183,77',   title: 'Engineer', icon: '⚙️' },
      chemist:  { color: '#81c784', rgb: '129,199,132',  title: 'Chemist',  icon: '🧪' },
      architect:{ color: '#ab47bc', rgb: '171,71,188',   title: 'Architect',icon: '📐' },
      pilot:    { color: '#ef5350', rgb: '239,83,80',    title: 'Pilot',    icon: '✈️' },
      chef:     { color: '#ff7043', rgb: '255,112,67',   title: 'Chef',     icon: '👨‍🍳' }
    };

    var TIPS = {
      doctor: [
        'In a real hospital room, the heart rate monitor is always positioned where the nurse can see it from the doorway.',
        'The IV stand is typically on the patient\u2019s right side for easier access by medical staff.',
        'Medicine cabinets are wall-mounted at eye level for quick access during emergencies.',
        'Blood pressure cuffs come in different sizes — using the wrong one gives inaccurate readings.',
        'The defibrillator should always be within 3 steps of the patient bed in an ICU setting.',
        'Sharps containers must be mounted at arm height and never placed on the floor.'
      ],
      engineer: [
        'An oscilloscope is the engineer\u2019s best friend — it lets you see electrical signals in real time.',
        'The pegboard organizes tools by frequency of use — most-used tools at eye level.',
        'A proper workbench has ESD protection to prevent static damage to sensitive components.',
        'Server racks need proper airflow — hot aisle/cold aisle design prevents overheating.',
        'The 3D printer should be on a stable surface away from the soldering station to avoid fumes.',
        'A logic analyzer can decode I2C, SPI, and UART protocols automatically.'
      ],
      chemist: [
        'The fume hood is your primary defense against toxic vapors — always keep the sash at working height.',
        'Copper sulfate solution turns blue because of d-d electron transitions in the Cu\u00B2\u207A ion.',
        'An analytical balance reads to 0.01mg — even breathing on it can affect the reading.',
        'The periodic table organizes elements by electron configuration, revealing chemical trends.',
        'Centrifugation separates mixtures by density using centrifugal force.',
        'Never pipette by mouth — always use a pipette bulb or electronic pipettor.'
      ],
      architect: [
        'Cross-laminated timber (CLT) is revolutionizing sustainable construction — it\u2019s stronger than concrete by weight.',
        'A good floor plan follows the flow: public \u2192 semi-private \u2192 private spaces.',
        'LEED Platinum requires 80+ points across energy, water, materials, and indoor environment categories.',
        'The building code limits travel distance to exits based on whether the building is sprinklered.',
        'BIM (Building Information Modeling) allows clash detection before construction begins.',
        'Biophilic design incorporates natural elements to improve occupant wellbeing and productivity.'
      ],
      pilot: [
        'The PFD (Primary Flight Display) combines six instruments into one screen — attitude, airspeed, altitude, heading, vertical speed, and flight director.',
        'The throttle quadrant has detent positions for idle, climb, flex, and TOGA thrust settings.',
        'Coffee in the cockpit is a long-standing tradition — airlines require spill-proof cups.',
        'The overhead panel controls electrical, hydraulic, fuel, pneumatic, and anti-ice systems.',
        'TCAS (Traffic Collision Avoidance System) provides resolution advisories to avoid mid-air collisions.',
        'The rudder pedals control yaw and also operate wheel brakes on the ground.'
      ],
      chef: [
        'Mise en place means "everything in its place" — professional kitchens live and die by this principle.',
        'The Maillard reaction between amino acids and sugars creates the brown crust on seared meats.',
        'A convection oven uses a fan to circulate hot air, cooking food 25% faster than a conventional oven.',
        'Knife skills are the foundation of cooking — proper technique prevents injury and ensures uniform cuts.',
        'Deglazing a hot pan with wine or stock dissolves the fond (caramelized bits) into a flavorful sauce.',
        'The walk-in fridge must stay below 40\u00B0F (4\u00B0C) to prevent bacterial growth — the danger zone is 40-140\u00B0F.'
      ]
    };

    function _applyTheme(roleId) {
      var theme = ROLE_THEME[roleId] || ROLE_THEME.doctor;
      panelEl.style.setProperty('--prof-accent', theme.color);
      panelEl.style.setProperty('--prof-accent-rgb', theme.rgb);
      var roleTag = document.getElementById('professor-role-tag');
      if (roleTag) roleTag.textContent = theme.icon + ' ' + theme.title;
    }

    function _updateCounter() {
      var numEl = document.getElementById('professor-tip-num');
      var totalEl = document.getElementById('professor-tip-total');
      var bar = document.getElementById('professor-progress-bar');
      if (numEl) numEl.textContent = (tipIndex % roleTips.length) + 1;
      if (totalEl) totalEl.textContent = roleTips.length;
      if (bar) bar.style.width = (((tipIndex % roleTips.length) + 1) / roleTips.length * 100) + '%';
    }

    function init(roleId) {
      panelEl = document.getElementById('professor-panel');
      textEl = document.getElementById('professor-text');
      roleTips = TIPS[roleId] || TIPS.doctor;
      currentRoleId = roleId;
      tipIndex = 0; active = false;
      if (panelEl) {
        panelEl.classList.add('hidden');
        _applyTheme(roleId);
      }
    }

    function toggle() {
      active = !active;
      if (active) { showTip(); } else { hide(); }
    }

    function showTip() {
      if (!panelEl || !textEl) return;
      textEl.style.opacity = '0';
      setTimeout(function () {
        textEl.textContent = roleTips[tipIndex % roleTips.length];
        textEl.style.opacity = '1';
        _updateCounter();
      }, 120);
      panelEl.classList.remove('hidden');
      _applyTheme(currentRoleId);
      _updateCounter();
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(roleTips[tipIndex % roleTips.length]);
        u.rate = 0.9; u.pitch = 1; u.volume = 0.8;
        speechSynthesis.speak(u);
      }
    }

    function nextTip() {
      tipIndex++;
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      showTip();
    }

    function hide() {
      active = false;
      if (panelEl) panelEl.classList.add('hidden');
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    }

    function isActive() { return active; }

    return { init: init, toggle: toggle, nextTip: nextTip, hide: hide, isActive: isActive };
  })();

  // ═══════════════════════════════════════════════════
  //  QUIZ MODE
  // ═══════════════════════════════════════════════════
  var QuizSystem = (function () {
    var active = false, currentQ = 0, correct = 0, total = 0;
    var panelEl, questionEl, optionsEl, feedbackEl, nextBtn, scoreEl;
    var questions = [];

    var QUIZ_BANK = {
      doctor: [
        { q: 'What does SpO2 measure?', opts: ['Blood oxygen saturation', 'Blood pressure', 'Heart rate', 'Body temperature'], ans: 0, explain: 'SpO2 measures peripheral oxygen saturation — the percentage of hemoglobin carrying oxygen.' },
        { q: 'What is the normal resting heart rate for adults?', opts: ['40-60 bpm', '60-100 bpm', '100-120 bpm', '120-150 bpm'], ans: 1, explain: 'Normal resting heart rate is 60-100 beats per minute. Athletes may have lower rates.' },
        { q: 'What does a defibrillator do?', opts: ['Monitors blood pressure', 'Delivers electric shock to restore heart rhythm', 'Pumps blood through the body', 'Measures oxygen levels'], ans: 1, explain: 'A defibrillator delivers a controlled electric shock to the heart to restore normal rhythm during cardiac arrest.' },
        { q: 'What does CBC stand for?', opts: ['Complete Blood Count', 'Central Blood Check', 'Cardiac Blood Chart', 'Chronic Blood Condition'], ans: 0, explain: 'CBC (Complete Blood Count) measures red cells, white cells, hemoglobin, hematocrit, and platelets.' },
        { q: 'What is the normal range for blood oxygen saturation?', opts: ['80-85%', '85-90%', '95-100%', '70-75%'], ans: 2, explain: 'Normal SpO2 is 95-100%. Below 90% is considered hypoxemia and requires intervention.' }
      ],
      engineer: [
        { q: 'What does an oscilloscope display?', opts: ['Sound waves only', 'Voltage over time', 'Current over resistance', 'Temperature over time'], ans: 1, explain: 'An oscilloscope displays voltage (Y-axis) over time (X-axis), allowing engineers to visualize electrical signals.' },
        { q: 'What is the purpose of a logic analyzer?', opts: ['Measures voltage', 'Captures and analyzes digital signals', 'Generates waveforms', 'Measures temperature'], ans: 1, explain: 'A logic analyzer captures multiple digital signals simultaneously and can decode protocols like SPI, I2C, and UART.' },
        { q: 'What does PWM stand for?', opts: ['Power Wire Monitor', 'Pulse Width Modulation', 'Parallel Word Memory', 'Primary Wave Mode'], ans: 1, explain: 'PWM (Pulse Width Modulation) controls power to devices by rapidly switching on/off with variable duty cycle.' },
        { q: 'What is the primary purpose of a breadboard?', opts: ['Cutting bread', 'Prototyping circuits without soldering', 'Testing voltage', 'Measuring resistance'], ans: 1, explain: 'A breadboard allows rapid prototyping of electronic circuits by inserting components and wires without soldering.' },
        { q: 'What is Ohm\u2019s Law?', opts: ['P = IV', 'V = IR', 'E = mc\u00B2', 'F = ma'], ans: 1, explain: 'Ohm\u2019s Law states V = IR (Voltage = Current \u00D7 Resistance), relating the three fundamental electrical quantities.' }
      ],
      chemist: [
        { q: 'What gives copper sulfate its blue color?', opts: ['Refraction', 'd-d electron transitions in Cu\u00B2\u207A', 'Nuclear fission', 'Magnetic resonance'], ans: 1, explain: 'The blue color comes from d-d transitions in the Cu\u00B2\u207A ion absorbing orange light.' },
        { q: 'What does pH measure?', opts: ['Temperature', 'Concentration', 'Acidity/alkalinity', 'Density'], ans: 2, explain: 'pH measures the concentration of hydrogen ions, indicating how acidic or basic a solution is (0-14 scale).' },
        { q: 'What is the purpose of a fume hood?', opts: ['Heating chemicals', 'Protecting from toxic vapors', 'Mixing solutions', 'Weighing substances'], ans: 1, explain: 'A fume hood draws air away from the user, preventing inhalation of toxic or hazardous vapors.' },
        { q: 'What does a centrifuge do?', opts: ['Heats samples', 'Separates by density using centrifugal force', 'Measures pH', 'Filters liquids'], ans: 1, explain: 'A centrifuge spins samples at high speed, separating components by density — heavier particles move outward.' },
        { q: 'What is the periodic table organized by?', opts: ['Alphabetical order', 'Atomic number', 'Atomic mass', 'Discovery date'], ans: 1, explain: 'The modern periodic table organizes elements by atomic number (number of protons), revealing periodic trends.' }
      ],
      architect: [
        { q: 'What does CLT stand for?', opts: ['Concrete Layered Tile', 'Cross-Laminated Timber', 'Central Layout Template', 'Composite Laminate Technology'], ans: 1, explain: 'CLT (Cross-Laminated Timber) is an engineered wood product with layers glued at right angles for strength.' },
        { q: 'What is LEED?', opts: ['A type of building material', 'Leadership in Energy and Environmental Design', 'A construction method', 'An architecture software'], ans: 1, explain: 'LEED is a green building certification program measuring sustainability across energy, water, materials, and indoor quality.' },
        { q: 'What is BIM?', opts: ['Building Information Modeling', 'Basic Interior Measurement', 'Bridge Inspection Manual', 'Budget Impact Model'], ans: 0, explain: 'BIM creates a digital 3D model containing physical and functional characteristics of a building for design and management.' },
        { q: 'What is the maximum occupancy load based on?', opts: ['Building height', 'Floor area per occupant', 'Number of windows', 'Number of exits only'], ans: 1, explain: 'Occupancy load is calculated from net floor area divided by area per occupant (e.g., 50 sq ft per person for assembly).' },
        { q: 'What does SHGC measure?', opts: ['Structural health', 'Solar Heat Gain Coefficient', 'Steel hardness', 'Surface gloss'], ans: 1, explain: 'SHGC measures how much solar radiation passes through a window — lower values mean less heat gain.' }
      ],
      pilot: [
        { q: 'What does PFD stand for?', opts: ['Primary Flight Display', 'Power Failure Detector', 'Pilot Flight Data', 'Pre-Flight Diagnostic'], ans: 0, explain: 'The PFD (Primary Flight Display) shows attitude, airspeed, altitude, heading, vertical speed, and flight mode.' },
        { q: 'What is V1 speed?', opts: ['Maximum speed', 'Decision speed — beyond which takeoff must continue', 'Landing speed', 'Taxi speed'], ans: 1, explain: 'V1 is the decision speed — if a problem occurs before V1, you can abort. After V1, you must continue the takeoff.' },
        { q: 'What does TCAS do?', opts: ['Controls the engines', 'Detects and avoids other aircraft', 'Manages fuel', 'Controls the landing gear'], ans: 1, explain: 'TCAS (Traffic Collision Avoidance System) detects nearby aircraft and provides resolution advisories to prevent collisions.' },
        { q: 'What is a SID in aviation?', opts: ['Standard Instrument Departure', 'Single Integrated Display', 'Safety Inspection Daily', 'System Input Diagnostic'], ans: 0, explain: 'A SID (Standard Instrument Departure) is a published route that transitions from the airport to the enroute airway system.' },
        { q: 'What does FL370 mean?', opts: ['Flight Level 370 meters', 'Flight Level 37,000 feet', 'Fuel Level 370 gallons', 'Fuselage Length 370'], ans: 1, explain: 'FL370 means Flight Level 370, which is 37,000 feet. Flight levels are in hundreds of feet (FL370 = 37,000 ft).' }
      ],
      chef: [
        { q: 'What temperature should a refrigerator be kept at?', opts: ['Below 32\u00B0F (0\u00B0C)', 'Below 40\u00B0F (4\u00B0C)', 'Below 50\u00B0F (10\u00B0C)', 'Below 60\u00B0F (16\u00B0C)'], ans: 1, explain: 'Refrigerators should be below 40\u00B0F (4\u00B0C) to prevent bacterial growth. The danger zone is 40-140\u00B0F.' },
        { q: 'What is the Maillard reaction?', opts: ['Water boiling', 'Browning reaction between amino acids and sugars', 'Fat rendering', 'Sugar caramelization only'], ans: 1, explain: 'The Maillard reaction creates complex flavors and brown color when proteins and sugars are heated together.' },
        { q: 'What does mise en place mean?', opts: ['Cook quickly', 'Everything in its place', 'Clean as you go', 'Taste before serving'], ans: 1, explain: 'Mise en place (French for "put in place") means having all ingredients prepped and organized before cooking begins.' },
        { q: 'What is a roux?', opts: ['A type of knife cut', 'A thickener made from equal parts fat and flour', 'A French soup', 'A meat marinade'], ans: 1, explain: 'A roux is equal parts fat (butter) and flour cooked together — white for béchamel, brown for gumbo.' },
        { q: 'What is the danger zone for food?', opts: ['0-32\u00B0F', '32-40\u00B0F', '40-140\u00B0F', '140-212\u00B0F'], ans: 2, explain: 'The food safety danger zone is 40-140\u00B0F (4-60\u00B0C) where bacteria multiply rapidly. Keep food out of this range.' }
      ]
    };

    function init(roleId) {
      panelEl = document.getElementById('quiz-panel');
      questionEl = document.getElementById('quiz-question');
      optionsEl = document.getElementById('quiz-options');
      feedbackEl = document.getElementById('quiz-feedback');
      nextBtn = document.getElementById('quiz-next');
      scoreEl = document.getElementById('quiz-score');
      questions = (QUIZ_BANK[roleId] || QUIZ_BANK.doctor).slice();
      currentQ = 0; correct = 0; total = questions.length; active = false;
      if (panelEl) panelEl.classList.add('hidden');
    }

    function toggle() {
      active = !active;
      if (active) { showQuestion(); } else { hide(); }
    }

    function showQuestion() {
      if (currentQ >= questions.length) {
        hide();
        showNotif('Quiz complete! Score: ' + correct + '/' + questions.length);
        ScoreSystem.addPoints(correct * 25, 'Quiz bonus');
        return;
      }
      if (!panelEl) return;
      var q = questions[currentQ];
      questionEl.textContent = q.q;
      scoreEl.textContent = 'Score: ' + correct + '/' + currentQ;
      feedbackEl.classList.add('hidden');
      nextBtn.classList.add('hidden');
      optionsEl.innerHTML = '';
      q.opts.forEach(function(opt, i) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', function() { answer(i); });
        optionsEl.appendChild(btn);
      });
      panelEl.classList.remove('hidden');
    }

    function answer(idx) {
      var q = questions[currentQ];
      var btns = optionsEl.querySelectorAll('.quiz-option');
      btns.forEach(function(b, i) {
        b.disabled = true;
        if (i === q.ans) b.classList.add('correct');
        if (i === idx && idx !== q.ans) b.classList.add('wrong');
      });
      var isCorrect = idx === q.ans;
      if (isCorrect) correct++;
      feedbackEl.textContent = (isCorrect ? '\u2705 Correct! ' : '\u274C Incorrect. ') + q.explain;
      feedbackEl.className = 'quiz-option ' + (isCorrect ? 'correct' : 'wrong');
      feedbackEl.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
    }

    function next() { currentQ++; showQuestion(); }

    function hide() {
      active = false;
      if (panelEl) panelEl.classList.add('hidden');
    }

    return { init: init, toggle: toggle, next: next, hide: hide };
  })();

  // ═══════════════════════════════════════════════════
  //  NPC SYSTEM
  // ═══════════════════════════════════════════════════
  var NPCSystem = (function () {
    var meshes = [], dialogEl, nameEl, textEl, avatarEl;
    var dialogueQueue = [], currentNPC = null;

    var NPC_DATA = {
      doctor: [{ name: 'Nurse Sarah', icon: '👩\u200d⚕️', lines: ['Room 104 is prepped. Patient Jane Doe is stable.', 'Dr. Smith wants the lab results on his desk before rounds.', 'The defibrillator passed its daily check. All green!'] }],
      engineer: [{ name: 'Tech Lead Mike', icon: '👨\u200d💻', lines: ['The sensor board firmware needs testing before Friday.', 'Check the oscilloscope output for signal integrity.', 'Build server is running 3 concurrent firmware builds right now.'] }],
      chemist: [{ name: 'Lab Director Dr. Patel', icon: '👩\u200d🔬', lines: ['Safety first — goggles on before approaching the fume hood.', 'The copper nanoparticle synthesis looks promising. Run TEM next.', 'Weekly safety inspection is Thursday. Keep everything labeled.'] }],
      architect: [{ name: 'Project Manager Lisa', icon: '👩\u200d💼', lines: ['Client presentation is March 1st — have the renderings ready.', 'The sustainability report needs the LEED scorecard section.', 'Material samples should be mounted on the presentation board.'] }],
      pilot: [{ name: 'First Officer James', icon: '👨\u200d✈️', lines: ['ATIS Info K received — runway 27L in use at Heathrow.', 'Fuel check: 38,400 kg remaining. Plenty for the crossing.', 'The weather cell at W025 looks like we may need a slight deviation.'] }],
      chef: [{ name: 'Sous Chef Maria', icon: '👩\u200d🍳', lines: ['Table 4 is VIP tonight — duck needs to be perfect.', 'The walk-in is fully stocked. Mise en place is done.', 'Service starts in 30 minutes. All stations should be ready.'] }]
    };

    function init(roleId) {
      dialogEl = document.getElementById('npc-dialogue');
      nameEl = document.getElementById('npc-name');
      textEl = document.getElementById('npc-text');
      avatarEl = document.getElementById('npc-avatar');
      meshes = []; dialogueQueue = []; currentNPC = null;
      if (dialogEl) dialogEl.classList.add('hidden');
    }

    function spawnNPC(scene, roleId) {
      var data = NPC_DATA[roleId];
      if (!data || !data.length || typeof THREE === 'undefined') return;
      var npc = data[0];
      var bodyMat = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.7, metalness: 0.1 });
      var body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 12), bodyMat);
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.8 }));
      head.position.y = 0.78;
      body.add(head);
      body.position.set(3, 0.6, 3);
      body.userData.isNPC = true;
      body.userData.npcName = npc.name;
      body.userData.npcIcon = npc.icon;
      body.userData.npcLines = npc.lines;
      body.userData.lineIndex = 0;
      scene.add(body);
      meshes.push(body);
    }

    function triggerDialogue(npcMesh) {
      if (!dialogEl || !npcMesh) return;
      var name = npcMesh.userData.npcName;
      var icon = npcMesh.userData.npcIcon;
      var lines = npcMesh.userData.npcLines;
      var idx = npcMesh.userData.lineIndex || 0;
      avatarEl.textContent = icon;
      nameEl.textContent = name;
      textEl.textContent = lines[idx % lines.length];
      npcMesh.userData.lineIndex = idx + 1;
      dialogEl.classList.remove('hidden');
      currentNPC = npcMesh;
    }

    function dismiss() {
      if (dialogEl) dialogEl.classList.add('hidden');
      currentNPC = null;
    }

    function update(dt) {
      for (var i = 0; i < meshes.length; i++) {
        var m = meshes[i];
        m.rotation.y += dt * 0.3;
        m.position.y = 0.6 + Math.sin(Date.now() * 0.001 + i) * 0.03;
      }
    }

    function clear(scene) {
      meshes.forEach(function(m) { scene.remove(m); });
      meshes = [];
      dismiss();
    }

    function getNearNPC(camera, maxDist) {
      maxDist = maxDist || 3;
      for (var i = 0; i < meshes.length; i++) {
        var d = camera.position.distanceTo(meshes[i].position);
        if (d < maxDist) return meshes[i];
      }
      return null;
    }

    return { init: init, spawnNPC: spawnNPC, triggerDialogue: triggerDialogue, dismiss: dismiss,
             update: update, clear: clear, getNearNPC: getNearNPC };
  })();

  // ═══════════════════════════════════════════════════
  //  DAY/NIGHT CYCLE
  // ═══════════════════════════════════════════════════
  var DayNightCycle = (function () {
    var time = 0, speed = 0.05, indicatorEl, iconEl, textEl;
    var ambientLight = null;

    function init() {
      time = 0;
      indicatorEl = document.getElementById('daynight-indicator');
      iconEl = document.getElementById('daynight-icon');
      textEl = document.getElementById('daynight-text');
      if (indicatorEl) indicatorEl.classList.add('hidden');
    }

    function start() { if (indicatorEl) indicatorEl.classList.remove('hidden'); }
    function stop() { if (indicatorEl) indicatorEl.classList.add('hidden'); }

    function setAmbientLight(light) { ambientLight = light; }

    function update(dt) {
      time = (time + dt * speed) % 1;
      var hour = time * 24;
      var isNight = hour < 6 || hour > 20;
      var label = isNight ? '🌙 Night' : hour < 12 ? '☀️ Morning' : hour < 17 ? '☀️ Afternoon' : '🌅 Evening';
      if (iconEl) iconEl.textContent = isNight ? '🌙' : hour < 17 ? '☀️' : '🌅';
      if (textEl) textEl.textContent = label;
      if (ambientLight) {
        var brightness = isNight ? 0.5 : Math.sin((hour - 6) / 14 * Math.PI);
        ambientLight.intensity = 0.4 + brightness * 0.6;
      }
    }

    return { init: init, start: start, stop: stop, update: update, setAmbientLight: setAmbientLight };
  })();

  // ═══════════════════════════════════════════════════
  //  MINI LABELS
  // ═══════════════════════════════════════════════════
  var MiniLabelSystem = (function () {
    var containerEl, labels = [], visible = true;

    function init() {
      containerEl = document.getElementById('mini-labels-container');
      labels = [];
      if (containerEl) containerEl.innerHTML = '';
    }

    function create(mesh, text) {
      var el = document.createElement('div');
      el.className = 'mini-label';
      el.innerHTML = '<span class="label-dot"></span>' + text;
      if (containerEl) containerEl.appendChild(el);
      labels.push({ el: el, mesh: mesh });
    }

    var _tmpVec = null; // pre-allocated, no per-frame alloc
    function update(camera, renderer) {
      if (!renderer) return;
      if (!_tmpVec) _tmpVec = new THREE.Vector3();
      var w = renderer.domElement.width, h = renderer.domElement.height;
      for (var i = 0; i < labels.length; i++) {
        var l = labels[i];
        if (!l.mesh || !l.mesh.position) continue;
        var dist = camera.position.distanceTo(l.mesh.position);
        if (dist > 8 || !visible) { l.el.style.opacity = '0'; continue; }
        _tmpVec.copy(l.mesh.position);
        _tmpVec.y += 0.4;
        _tmpVec.project(camera);
        var x = (_tmpVec.x * 0.5 + 0.5) * w;
        var y = (-_tmpVec.y * 0.5 + 0.5) * h;
        if (_tmpVec.z > 1) { l.el.style.opacity = '0'; continue; }
        l.el.style.left = x + 'px';
        l.el.style.top = y + 'px';
        l.el.style.opacity = Math.max(0, 1 - dist / 8);
      }
    }

    function setVisible(v) { visible = v; }
    function clear() { labels = []; if (containerEl) containerEl.innerHTML = ''; }

    return { init: init, create: create, update: update, setVisible: setVisible, clear: clear };
  })();

  // ═══════════════════════════════════════════════════
  //  SCREENSHOT SYSTEM
  // ═══════════════════════════════════════════════════
  var ScreenshotSystem = (function () {
    function capture(renderer) {
      if (!renderer) return;
      renderer.render(scene, camera);
      var link = document.createElement('a');
      link.download = 'vr-career-screenshot-' + Date.now() + '.png';
      link.href = renderer.domElement.toDataURL('image/png');
      link.click();
      showNotif('📸 Screenshot saved!');
    }
    return { capture: capture };
  })();

  // ═══════════════════════════════════════════════════
  //  MOBILE TOUCH CONTROLS
  // ═══════════════════════════════════════════════════
  var MobileControls = (function () {
    var isMobile = false, joystickBase, joystickKnob;
    var joyX = 0, joyY = 0, activeTouch = null;

    function init() {
      isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      var el = document.getElementById('mobile-controls');
      if (!isMobile || !el) { if (el) el.classList.add('hidden'); return; }
      el.classList.remove('hidden');
      joystickBase = document.getElementById('joystick-base');
      joystickKnob = document.getElementById('joystick-knob');
      if (joystickBase) {
        joystickBase.addEventListener('touchstart', joyStart, { passive: false });
        joystickBase.addEventListener('touchmove', joyMove, { passive: false });
        joystickBase.addEventListener('touchend', joyEnd, { passive: false });
      }
      var btnMap = { 'mobile-interact': 'KeyE', 'mobile-pickup': 'KeyF', 'mobile-jump': 'Space',
                     'mobile-sprint': 'ShiftLeft', 'mobile-crouch': 'KeyC' };
      Object.keys(btnMap).forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
          btn.addEventListener('touchstart', function(e) { e.preventDefault(); simulateKey(btnMap[id], true); });
          btn.addEventListener('touchend', function(e) { e.preventDefault(); simulateKey(btnMap[id], false); });
        }
      });
    }

    function simulateKey(code, down) {
      document.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code: code }));
    }

    function joyStart(e) { e.preventDefault(); activeTouch = e.touches[0]; }
    function joyMove(e) {
      e.preventDefault();
      if (!activeTouch || !joystickBase) return;
      var rect = joystickBase.getBoundingClientRect();
      var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      var dx = e.touches[0].clientX - cx, dy = e.touches[0].clientY - cy;
      var maxR = rect.width / 2 - 20;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxR) { dx = dx / dist * maxR; dy = dy / dist * maxR; }
      if (joystickKnob) joystickKnob.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
      joyX = dx / maxR; joyY = dy / maxR;
    }
    function joyEnd() {
      activeTouch = null; joyX = 0; joyY = 0;
      if (joystickKnob) joystickKnob.style.transform = 'translate(-50%, -50%)';
    }

    function isActive() { return isMobile; }
    function getJoystick() { return { x: joyX, y: joyY }; }

    return { init: init, isActive: isActive, getJoystick: getJoystick };
  })();

  // ═══════════════════════════════════════════════════
  //  NOTIFICATION SYSTEM
  // ═══════════════════════════════════════════════════
  var notifEl = null, notifTimer;
  function showNotif(msg, dur) {
    notifEl = notifEl || document.getElementById('notification');
    notifEl.textContent = msg;
    notifEl.classList.remove('show');
    void notifEl.offsetWidth;
    notifEl.classList.add('show');
    clearTimeout(notifTimer);
    notifTimer = setTimeout(function () { notifEl.classList.remove('show'); }, dur || 2500);
  }

  // ═══════════════════════════════════════════════════
  //  ACHIEVEMENT SYSTEM
  // ═══════════════════════════════════════════════════
  var AchievementSystem = (function () {
    var toastEl = null, titleEl = null, descEl = null, toastTimer = null;
    var earned = new Set();

    function init() {
      toastEl = document.getElementById('achievement-toast');
      titleEl = document.getElementById('achievement-title');
      descEl  = document.getElementById('achievement-desc');
    }

    function earn(id, title, desc) {
      if (earned.has(id)) return;
      earned.add(id);
      if (!toastEl) init();
      titleEl.textContent = title;
      descEl.textContent = desc;
      toastEl.classList.remove('hidden');
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastEl.classList.remove('show');
        setTimeout(function () { toastEl.classList.add('hidden'); }, 500);
      }, 3500);
    }

    function reset() { earned.clear(); }

    return { init: init, earn: earn, reset: reset };
  })();

  // ═══════════════════════════════════════════════════
  //  TASK SYSTEM
  // ═══════════════════════════════════════════════════
  var VRTasks = (function () {
    var tasks = [];
    var done = new Set();
    var listEl, counterEl;

    function init(t) {
      tasks = t || [];
      done = new Set();
      listEl = document.getElementById('task-list');
      counterEl = document.getElementById('obj-counter');
      var tp = document.getElementById('task-panel');
      if (tasks.length > 0) { tp.classList.remove('hidden'); render(); }
      else { tp.classList.add('hidden'); }
      updateCounter();
    }

    function render() {
      listEl.innerHTML = '';
      tasks.forEach(function (t, idx) {
        var d = document.createElement('div');
        d.className = 'task-item' + (done.has(t.id) ? ' done' : '');
        d.innerHTML = '<div class="task-check">' + (done.has(t.id) ? '✓' : '') + '</div><span>' + t.label + '</span>';
        d.style.animationDelay = (idx * 0.05) + 's';
        listEl.appendChild(d);
      });
    }

    function complete(objName) {
      var task = tasks.find(function (t) { return t.objectName === objName; });
      if (task && !done.has(task.id)) {
        done.add(task.id);
        render();
        VRSound.taskDone();
        showNotif('✅ Task complete: ' + task.label);
        if (done.size === tasks.length) {
          setTimeout(function () {
            showNotif('🎉 All tasks completed! Great work!', 4000);
            VRSound.allDone();
            AchievementSystem.earn('all_tasks', '🏆 Master Explorer', 'Completed all tasks in a role');
          }, 800);
        } else if (done.size === Math.ceil(tasks.length / 2)) {
          AchievementSystem.earn('half_tasks', '🔍 Halfway There', 'Explored half the objects');
        }
      }
      updateCounter();
    }

    function updateCounter() {
      if (!counterEl) return;
      counterEl.textContent = 'Explored: ' + done.size + ' / ' + tasks.length + ' objects';
    }

    function getProgress() { return tasks.length > 0 ? done.size / tasks.length : 0; }

    return { init: init, complete: complete, getProgress: getProgress };
  })();

  window.VRTasks = VRTasks;

  // ═══════════════════════════════════════════════════
  //  SCENE TRANSITION
  // ═══════════════════════════════════════════════════
  var transEl = null;
  function sceneTransition(onMidpoint) {
    transEl = transEl || document.getElementById('scene-transition');
    transEl.classList.add('active');
    setTimeout(function () {
      onMidpoint();
      setTimeout(function () { transEl.classList.remove('active'); }, 100);
    }, 400);
  }

  // ═══════════════════════════════════════════════════
  //  MINIMAP
  // ═══════════════════════════════════════════════════
  var minimapCanvas = null, minimapCtx = null;
  var minimapRole = null;

  function initMinimap() {
    minimapCanvas = document.getElementById('minimap-canvas');
    if (minimapCanvas) minimapCtx = minimapCanvas.getContext('2d');
  }

  var _minimapObjDots = null; // cached dot positions (pre-computed once)
  function _cacheMinimapDots() {
    if (!minimapRole) { _minimapObjDots = null; return; }
    var rs = minimapRole.roomSize;
    var cw = minimapCanvas.width, ch = minimapCanvas.height;
    var sc = Math.min(cw, ch) / Math.max(rs.width, rs.depth) * 0.85;
    var ox = cw / 2, oy = ch / 2;
    _minimapObjDots = [];
    minimapRole.objects.forEach(function (o) {
      if (o.interactable) {
        _minimapObjDots.push({ x: ox + o.p[0] * sc, y: oy + o.p[2] * sc });
      }
    });
  }
  function drawMinimap() {
    if (!minimapCtx || !minimapRole || !camera) return;
    var ctx = minimapCtx;
    var cw = minimapCanvas.width, ch = minimapCanvas.height;
    var rs = minimapRole.roomSize;
    var scale = Math.min(cw, ch) / Math.max(rs.width, rs.depth) * 0.85;
    var ox = cw / 2, oy = ch / 2;

    ctx.clearRect(0, 0, cw, ch);

    // Background
    ctx.fillStyle = 'rgba(10, 15, 25, 0.6)';
    ctx.beginPath(); ctx.arc(ox, oy, cw / 2 - 2, 0, Math.PI * 2); ctx.fill();

    // Room outline
    ctx.strokeStyle = 'rgba(100, 181, 246, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(ox - rs.width / 2 * scale, oy - rs.depth / 2 * scale, rs.width * scale, rs.depth * scale);

    // Objects — use cached dots (no per-frame object iteration)
    if (!_minimapObjDots) _cacheMinimapDots();
    if (_minimapObjDots) {
      ctx.fillStyle = 'rgba(100, 181, 246, 0.4)';
      for (var di = 0; di < _minimapObjDots.length; di++) {
        ctx.beginPath();
        ctx.arc(_minimapObjDots[di].x, _minimapObjDots[di].y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Player position and direction
    var px = ox + camera.position.x * scale;
    var py = oy + camera.position.z * scale;
    var yaw = VRControls.getYaw();

    // Player dot (no shadow blur — saves GPU fill rate)
    ctx.fillStyle = '#4caf50';
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();

    // Direction indicator
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - Math.sin(yaw) * 8, py - Math.cos(yaw) * 8);
    ctx.stroke();

    // Field of view cone
    ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, 20, -yaw - 0.5 + Math.PI / 2, -yaw + 0.5 + Math.PI / 2);
    ctx.closePath();
    ctx.fill();
  }

  // ═══════════════════════════════════════════════════
  //  COMPASS HUD
  // ═══════════════════════════════════════════════════
  var compassHeadingEl = null;

  function updateCompass() {
    if (!compassHeadingEl || !camera) return;
    compassHeadingEl = compassHeadingEl || document.getElementById('compass-heading');
    var yaw = VRControls.getYaw();
    var deg = (((-yaw * 180 / Math.PI) % 360) + 360) % 360;
    var dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    var idx = Math.round(deg / 45) % 8;
    compassHeadingEl.textContent = dirs[idx] + ' ' + Math.round(deg) + '°';
  }

  // ═══════════════════════════════════════════════════
  //  STAMINA BAR
  // ═══════════════════════════════════════════════════
  var staminaBarEl = null, staminaContainerEl = null;

  function updateStamina() {
    staminaBarEl = staminaBarEl || document.getElementById('stamina-bar');
    staminaContainerEl = staminaContainerEl || document.getElementById('stamina-container');
    var pct = VRControls.getStamina() / VRControls.getStaminaMax();
    staminaBarEl.style.width = (pct * 100) + '%';
    staminaBarEl.classList.toggle('low', pct < 0.3);
    staminaContainerEl.classList.toggle('active', pct < 0.95);
  }

  // ═══════════════════════════════════════════════════
  //  DOM REFERENCES
  // ═══════════════════════════════════════════════════
  var canvasContainer = document.getElementById('canvas-container');
  var selScreen       = document.getElementById('role-selection-screen');
  var roleCardsEl     = document.getElementById('role-cards');
  var instrOverlay    = document.getElementById('instructions-overlay');
  var ptrPrompt       = document.getElementById('pointer-lock-prompt');
  var hudEl           = document.getElementById('hud');
  var roleLabelEl     = document.getElementById('role-label');
  var backBtn         = document.getElementById('back-btn');
  var soundBtn        = document.getElementById('sound-toggle');
  var qualityBadge    = document.getElementById('quality-badge');
  var crouchIndEl     = document.getElementById('crouch-indicator');

  // ═══════════════════════════════════════════════════
  //  THREE.JS CORE
  // ═══════════════════════════════════════════════════
  var renderer, scene, camera, clock;
  var animFrameId = null;

  var bloomFX = null;
  var ssaoFX = null;
  var screenManager = null;
  var texGen = null;
  var envMap = null;
  var particles = [];
  var soundReactiveLights = [];

  var cameraLerp = { active: false, from: null, to: null, t: 0, duration: 0.6 };
  var animatedObjects = [];
  var effectsEnabled = true;

  function initThree() {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    renderer.shadowMap.enabled = Quality.shadowsEnabled();
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvasContainer.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    scene  = new THREE.Scene();
    clock  = new THREE.Clock();

    cameraLerp.from = new THREE.Vector3();
    cameraLerp.to = new THREE.Vector3();

    screenManager = new CanvasTextureManager();
    texGen = new ProceduralTextures();

    // Generate procedural environment map for reflections
    envMap = generateEnvMap();

    if (Quality.bloomEnabled()) {
      bloomFX = new BloomPostFX(renderer, scene, camera, {
        threshold: 0.72, intensity: 0.35, blurSize: 1,
        grain: 0.012, vignette: 0.18, chromAb: 0.0008, exposure: 1.3,
        temperature: 0.03, contrast: 1.04, saturation: 1.08
      });
    }

    if (Quality.shadowsEnabled()) {
      ssaoFX = new SSAO(renderer, scene, camera, {
        radius: 0.25, intensity: 0.35, bias: 0.02
      });
      ssaoFX.enabled = !Quality.bloomEnabled();
    }

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (bloomFX) bloomFX.resize(window.innerWidth, window.innerHeight);
      if (ssaoFX) ssaoFX.resize(window.innerWidth, window.innerHeight);
    });
  }

  // ═══════════════════════════════════════════════════
  //  PROCEDURAL ENVIRONMENT MAP
  // ═══════════════════════════════════════════════════
  function generateEnvMap() {
    if (typeof PMREMGenerator === 'undefined') return null;
    try {
      var pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileCubemapShader();

      // Create a simple gradient environment scene
      var envScene = new THREE.Scene();
      var envCam = new THREE.CubeCamera(0.1, 100, new THREE.WebGLRenderTarget(256, 256));

      // Sky gradient dome
      var skyGeo = new THREE.SphereGeometry(50, 16, 16);
      var skyCanvas = document.createElement('canvas');
      skyCanvas.width = 256; skyCanvas.height = 256;
      var skyCtx = skyCanvas.getContext('2d');
      var grad = skyCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#1a2332');   // top: dark blue
      grad.addColorStop(0.4, '#2a3a4a'); // mid: muted blue-gray
      grad.addColorStop(0.7, '#4a5568'); // lower: warm gray
      grad.addColorStop(1, '#6b7280');   // bottom: light gray
      skyCtx.fillStyle = grad;
      skyCtx.fillRect(0, 0, 256, 256);
      var skyTex = new THREE.CanvasTexture(skyCanvas);
      skyTex.mapping = THREE.EquirectangularReflectionMapping;
      envScene.background = skyTex;

      envCam.position.set(0, 1.6, 0);
      envCam.update(renderer, envScene);

      var envMapRT = pmrem.fromScene(envScene, 0.04);
      pmrem.dispose();
      return envMapRT.texture;
    } catch (e) {
      return null;
    }
  }

  // ═══════════════════════════════════════════════════
  //  SCENE BUILDING
  // ═══════════════════════════════════════════════════
  function buildScene(role) {
    clearScene();
    minimapRole = role;
    _minimapObjDots = null; // re-cache dots for new room

    var rs = role.roomSize;
    var hw = rs.width / 2;
    var hd = rs.depth / 2;
    var H  = rs.height;

    scene.background = new THREE.Color(role.fogColor || 0x111111);
    var fogNear = rs.width * 1.2;
    var fogFar  = rs.width * 3.5;
    scene.fog = new THREE.Fog(role.fogColor || 0x111111, fogNear, fogFar);

    // Hemisphere light for realistic sky/ground color bleed
    var hemiLight = new THREE.HemisphereLight(
      role.ceilingColor || 0xffffff,
      role.floorColor || 0x333333,
      (role.ambientIntensity || 0.4) * 2.0
    );
    scene.add(hemiLight);
    scene.add(new THREE.AmbientLight(role.ambientColor || 0xffffff, (role.ambientIntensity || 0.4) * 0.8));

    if (Quality.shadowsEnabled()) {
      var dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(5, H - 0.5, 5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = rs.width * 2;
      dirLight.shadow.camera.left = -hw;
      dirLight.shadow.camera.right = hw;
      dirLight.shadow.camera.top = hd;
      dirLight.shadow.camera.bottom = -hd;
      dirLight.shadow.bias = -0.001;
      dirLight.shadow.radius = 3;
      scene.add(dirLight);
    }

    soundReactiveLights = [];
    role.lights.forEach(function (lc) {
      var l;
      if (lc.type === 'point') {
        l = new THREE.PointLight(lc.color, lc.intensity, rs.width * 2);
        l.position.set(lc.pos.x, lc.pos.y, lc.pos.z);
      } else if (lc.type === 'spot') {
        l = new THREE.SpotLight(lc.color, lc.intensity);
        l.position.set(lc.pos.x, lc.pos.y, lc.pos.z);
        l.angle = Math.PI / 6;
        l.penumbra = 0.5;
        l.decay = 1.5;
        if (lc.target) {
          l.target.position.set(lc.target.x, lc.target.y, lc.target.z);
          scene.add(l.target);
        }
      }
      if (l) {
        l.castShadow = Quality.shadowsEnabled() && (lc.type === 'spot');
        l.shadow.bias = -0.002;
        scene.add(l);
        soundReactiveLights.push({ light: l, baseIntensity: lc.intensity });
      }
    });

    // Floor — procedural texture
    var floorTex = texGen.generate('linoleum', { color: role.floorColor, scale: rs.width * 0.3 });
    var floorNormal = texGen.generateNormal('linoleum', { color: role.floorColor, scale: rs.width * 0.3 }, 1.5);
    var floorRough = texGen.generateRoughness('linoleum', { color: role.floorColor, scale: rs.width * 0.3 }, 0.7);
    var floorMat = new THREE.MeshStandardMaterial({
      color: role.floorColor, roughness: 0.7, metalness: 0.05,
      map: floorTex, normalMap: floorNormal, normalScale: new THREE.Vector2(0.5, 0.5),
      roughnessMap: floorRough, envMap: envMap, envMapIntensity: 0.3
    });
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(rs.width, rs.depth, 32, 32), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = Quality.shadowsEnabled();
    scene.add(floor);

    // Ceiling — subtle texture
    var ceilTex = texGen.generate('concrete', { color: role.ceilingColor, scale: rs.width * 0.2 });
    var ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(rs.width, rs.depth),
      new THREE.MeshStandardMaterial({ color: role.ceilingColor, roughness: 0.9, map: ceilTex, envMap: envMap, envMapIntensity: 0.1 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = H;
    scene.add(ceiling);

    // Walls — procedural texture
    var wallTex = texGen.generate('concrete', { color: role.roomColor, scale: rs.width * 0.25 });
    var wallNormal = texGen.generateNormal('concrete', { color: role.roomColor, scale: rs.width * 0.25 }, 2.0);
    var wallMat = new THREE.MeshStandardMaterial({
      color: role.roomColor, roughness: 0.65, metalness: 0.05, side: THREE.DoubleSide,
      map: wallTex, normalMap: wallNormal, normalScale: new THREE.Vector2(0.6, 0.6),
      envMap: envMap, envMapIntensity: 0.15
    });
    function addWall(w, h, px, py, pz, ry) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat.clone());
      m.position.set(px, py, pz);
      m.rotation.y = ry;
      m.receiveShadow = Quality.shadowsEnabled();
      scene.add(m);
    }
    addWall(rs.width, H, 0, H / 2, -hd, 0);
    addWall(rs.width, H, 0, H / 2, hd, Math.PI);
    addWall(rs.depth, H, -hw, H / 2, 0, Math.PI / 2);
    addWall(rs.depth, H, hw, H / 2, 0, -Math.PI / 2);

    VRControls.setBounds({ minX: -hw, maxX: hw, minZ: -hd, maxZ: hd });

    var interactableMeshes = [];
    animatedObjects = [];

    if (Quality.shadowsEnabled()) addLightShafts(role);

    role.objects.forEach(function (o) {
      var mesh = createMesh(o);
      scene.add(mesh);

      if (o.interactable) {
        mesh.userData.interactable = true;
        mesh.userData.name = o.name;
        mesh.userData.promptText = o.promptText;
        mesh.userData.interactionText = o.interactionText;
        mesh.userData.screenType = o.screenType;
        interactableMeshes.push(mesh);
      }

      if (o.anim) {
        animatedObjects.push({
          mesh: mesh,
          type: o.anim.type,
          speed: o.anim.speed || 1,
          amplitude: o.anim.amplitude || 0.1,
          phase: Math.random() * Math.PI * 2,
          baseY: mesh.position.y,
          baseX: mesh.position.x,
          baseRotY: mesh.rotation.y,
          baseRotX: mesh.rotation.x,
          baseRotZ: mesh.rotation.z,
          baseScaleX: mesh.scale.x,
          baseScaleY: mesh.scale.y,
          baseScaleZ: mesh.scale.z,
          baseEmissive: mesh.material.emissiveIntensity || 0,
          baseEmissiveColor: mesh.material.emissive ? mesh.material.emissive.clone() : null
        });
      }

      if (o.em && (o.ei || 0) > 0.5 && !o.anim) {
        animatedObjects.push({
          mesh: mesh, type: 'flicker',
          speed: 1, amplitude: 0.3,
          phase: Math.random() * Math.PI * 2,
          baseEmissive: o.ei
        });
      }
    });

    VRInteractions.setInteractables(interactableMeshes);

    // Particles
    if (Quality.particlesEnabled()) {
      particles = [];
      particles.push(new ParticleSystem(scene, {
        preset: 'dust', count: 150,
        bounds: { x: rs.width * 0.8, y: rs.height * 0.6, z: rs.depth * 0.8 },
        origin: { x: 0, y: rs.height * 0.3, z: 0 }
      }));
    }

    cameraLerp.from.copy(camera.position);
    cameraLerp.to.set(role.playerStart.x, role.playerStart.y, role.playerStart.z);
    cameraLerp.t = 0;
    cameraLerp.active = true;
  }

  // ── Smart material assignment based on color heuristics + explicit hints ──
  function getMaterialForColor(hex, opts) {
    var r = (hex >> 16) & 255, g = (hex >> 8) & 255, b = hex & 255;
    var lum = (r + g + b) / 3;
    var maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
    var sat = maxC > 0 ? (maxC - minC) / maxC : 0;
    var hue = 0;
    if (maxC !== minC) {
      if (maxC === r) hue = ((g - b) / (maxC - minC)) % 6;
      else if (maxC === g) hue = (b - r) / (maxC - minC) + 2;
      else hue = (r - g) / (maxC - minC) + 4;
      hue = (hue / 6 + 1) % 1;
    }

    // Explicit material type from roles.js
    if (opts && opts.mat) {
      switch (opts.mat) {
        case 'wood':
          return { roughness: 0.7, metalness: 0.02, texType: 'wood', texOpts: { color: hex, scale: 1.5 }, roughTex: 0.65 };
        case 'metalBrushed':
          return { roughness: 0.35, metalness: 0.8, texType: 'metalBrushed', texOpts: { color: hex, scale: 2 }, roughTex: 0.3 };
        case 'metalPolished':
          return { roughness: 0.1, metalness: 0.95, texType: 'metalPolished', texOpts: { color: hex }, roughTex: 0.08 };
        case 'fabric':
          return { roughness: 0.9, metalness: 0.0, texType: 'fabric', texOpts: { color: hex, scale: 2 }, roughTex: 0.95 };
        case 'concrete':
          return { roughness: 0.8, metalness: 0.02, texType: 'concrete', texOpts: { color: hex, scale: 1 }, roughTex: 0.85 };
        case 'tile':
          return { roughness: 0.3, metalness: 0.05, texType: 'tile', texOpts: { color: hex, tileSize: 6 }, roughTex: 0.25 };
        case 'marble':
          return { roughness: 0.15, metalness: 0.02, texType: 'marble', texOpts: { color: hex }, roughTex: 0.1 };
        case 'glass':
          return { roughness: 0.05, metalness: 0.1, texType: null, isGlass: true };
        case 'plastic':
          return { roughness: 0.4, metalness: 0.0, texType: 'noise', texOpts: { color: hex, scale: 3 }, roughTex: 0.45 };
        case 'rubber':
          return { roughness: 0.95, metalness: 0.0, texType: null };
      }
    }

    // Auto-detect based on color heuristics
    // Brown tones → wood
    if (hue < 0.12 && sat > 0.2 && lum > 60 && lum < 200) {
      return { roughness: 0.7, metalness: 0.02, texType: 'wood', texOpts: { color: hex, scale: 1.5 }, roughTex: 0.65 };
    }
    // Very bright white/light gray → paper/ceramic
    if (lum > 220 && sat < 0.1) {
      return { roughness: 0.3, metalness: 0.05, texType: null };
    }
    // Dark gray/black → rubber or dark plastic
    if (lum < 60 && sat < 0.15) {
      return { roughness: 0.85, metalness: 0.02, texType: null };
    }
    // Blue tones → fabric or plastic
    if (hue > 0.55 && hue < 0.7 && sat > 0.3) {
      return { roughness: 0.7, metalness: 0.02, texType: 'fabric', texOpts: { color: hex, scale: 2 }, roughTex: 0.8 };
    }
    // Silver/chrome → metal
    if (sat < 0.1 && lum > 150 && lum < 230) {
      return { roughness: 0.25, metalness: 0.85, texType: 'metalBrushed', texOpts: { color: hex, scale: 2 }, roughTex: 0.2 };
    }
    // High saturation with low lum → colored plastic/metal
    if (sat > 0.5 && lum < 180) {
      return { roughness: 0.4, metalness: 0.1, texType: 'noise', texOpts: { color: hex, scale: 3 }, roughTex: 0.45 };
    }
    // Default
    return { roughness: 0.6, metalness: 0.05, texType: null };
  }

  function createMesh(o) {
    var geom;
    var segs = Quality.getTier() >= 2 ? 24 : Quality.getTier() >= 1 ? 16 : 8;
    switch (o.g) {
      case 'box':    geom = new THREE.BoxGeometry(o.s[0], o.s[1], o.s[2]); break;
      case 'cyl':    geom = new THREE.CylinderGeometry(o.s[0], o.s[1], o.s[2], o.s[3] || segs); break;
      case 'sphere': geom = new THREE.SphereGeometry(o.s[0], o.s[1] || segs, o.s[2] || segs); break;
      default:       geom = new THREE.BoxGeometry(o.s[0], o.s[1], o.s[2]);
    }

    var hex = o.c || 0xcccccc;
    var matInfo = getMaterialForColor(hex, o);

    var matOpts = {
      color: hex,
      roughness: o.rough != null ? o.rough : matInfo.roughness,
      metalness: o.metal != null ? o.metal : matInfo.metalness,
      envMap: envMap,
      envMapIntensity: matInfo.metalness > 0.5 ? 0.6 : 0.2
    };

    if (o.em != null) { matOpts.emissive = o.em; matOpts.emissiveIntensity = o.ei || 0.5; }
    if (o.tr) { matOpts.transparent = true; matOpts.opacity = o.op != null ? o.op : 0.5; }

    // Apply procedural textures — skip for tiny objects (bounding box < 0.3)
    var maxDim = Math.max(o.s[0], o.s[1], o.s[2]);
    var isLargeEnough = maxDim >= 0.3;
    if (matInfo.texType && Quality.getTier() >= 1 && texGen && isLargeEnough) {
      var texOpts = matInfo.texOpts || { color: hex, scale: 1 };
      matOpts.map = texGen.generate(matInfo.texType, texOpts);
      // Normal + roughness maps only on High quality AND large objects
      if (Quality.getTier() >= 2 && maxDim >= 0.5) {
        matOpts.normalMap = texGen.generateNormal(matInfo.texType, texOpts, 2.0);
        matOpts.normalScale = new THREE.Vector2(0.4, 0.4);
        matOpts.roughnessMap = texGen.generateRoughness(matInfo.texType, texOpts, matInfo.roughTex || 0.6);
      }
    }

    // Glass / translucent materials — use MeshPhysicalMaterial for refraction
    if (matInfo.isGlass && o.tr && Quality.getTier() >= 2) {
      matOpts.transparent = true;
      matOpts.opacity = o.op != null ? o.op : 0.35;
      matOpts.roughness = 0.05;
      matOpts.metalness = 0.0;
      matOpts.envMapIntensity = 1.0;
    }

    // Screen textures
    if (o.screenType && Quality.screensEnabled() && screenManager) {
      var tex = screenManager.create(o.screenType, { width: 256, height: 128 });
      matOpts.map = tex;
      matOpts.emissiveMap = tex;
      matOpts.emissive = new THREE.Color(0xffffff);
      matOpts.emissiveIntensity = 0.8;
    }

    var material = matInfo.isGlass && o.tr && Quality.getTier() >= 2 ?
      new THREE.MeshPhysicalMaterial(matOpts) :
      new THREE.MeshStandardMaterial(matOpts);

    var mesh = new THREE.Mesh(geom, material);
    mesh.position.set(o.p[0], o.p[1], o.p[2]);
    mesh.castShadow = Quality.shadowsEnabled() && (o.g === 'box' || o.g === 'cyl');
    mesh.receiveShadow = Quality.shadowsEnabled();

    if (o.rot) {
      if (o.rot.x) mesh.rotation.x = o.rot.x;
      if (o.rot.y) mesh.rotation.y = o.rot.y;
      if (o.rot.z) mesh.rotation.z = o.rot.z;
    }
    if (o.name) { mesh.name = o.name; mesh.userData.name = o.name; }
    return mesh;
  }

  function addLightShafts(role) {
    var rs = role.roomSize;
    var shaftGeo = new THREE.ConeGeometry(0.8, rs.height * 0.8, 6, 1, true);
    var shaftMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.03,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    var shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(0, rs.height * 0.55, -rs.depth / 2 + 2);
    shaft.rotation.z = 0.15;
    scene.add(shaft);

    if (rs.width > 15) {
      var shaft2 = shaft.clone();
      shaft2.position.set(5, rs.height * 0.5, -rs.depth / 2 + 2);
      shaft2.rotation.z = -0.1;
      scene.add(shaft2);
    }
  }

  function clearScene() {
    particles.forEach(function (p) { p.dispose(); });
    particles = [];
    if (screenManager) screenManager.dispose();
    screenManager = new CanvasTextureManager();
    if (texGen) texGen.dispose();
    texGen = new ProceduralTextures();
    animatedObjects = [];
    soundReactiveLights = [];

    while (scene.children.length) {
      var obj = scene.children[0];
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(function (m) {
          if (m.map) m.map.dispose();
          if (m.emissiveMap) m.emissiveMap.dispose();
          m.dispose();
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════
  //  ROLE SELECTION & NAVIGATION
  // ═══════════════════════════════════════════════════
  function populateRoleCards() {
    ROLES.forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'role-card';
      card.style.setProperty('--accent', r.accentColor);
      card.innerHTML =
        '<span class="role-card-icon">' + r.icon + '</span>' +
        '<div class="role-card-title">' + r.title + '</div>' +
        '<div class="role-card-desc">' + r.description + '</div>';
      card.addEventListener('click', function () { selectRole(r.id); });
      roleCardsEl.appendChild(card);
    });

    document.addEventListener('mousemove', function (e) {
      var cards = roleCardsEl.querySelectorAll('.role-card');
      var mx = (e.clientX / window.innerWidth - 0.5) * 2;
      var my = (e.clientY / window.innerHeight - 0.5) * 2;
      cards.forEach(function (c) {
        c.style.transform = 'perspective(600px) rotateY(' + (mx * 4) + 'deg) rotateX(' + (-my * 3) + 'deg)';
      });
    });
    roleCardsEl.addEventListener('mouseleave', function () {
      var cards = roleCardsEl.querySelectorAll('.role-card');
      cards.forEach(function (c) { c.style.transform = ''; });
    });
  }

  function selectRole(id) {
    var role = ROLES.find(function (r) { return r.id === id; });
    if (!role) return;

    sceneTransition(function () {
      selScreen.classList.add('hidden');
      instrOverlay.classList.remove('hidden');
      hudEl.classList.remove('hidden');
      roleLabelEl.textContent = 'Role: ' + role.title + ' ' + role.icon;

      buildScene(role);
      VRTasks.init(role.tasks);
      AchievementSystem.reset();
      ScoreSystem.init();
      InventorySystem.init();
      ProfessorMode.init(role.id);
      QuizSystem.init(role.id);
      NPCSystem.init(role.id);
      DayNightCycle.start();
      ChallengeTimer.start();
      NPCSystem.spawnNPC(scene, role.id);

      VRControls.enable();
      VRInteractions.enable();

      if (!animFrameId) {
        clock.start();
        loop();
      }

      VRSound.beep(440, 0.15, 0.05);
      AchievementSystem.earn('first_role', '🚀 First Steps', 'Entered your first career room');
    });
  }

  function goBack() {
    sceneTransition(function () {
      VRControls.disable();
      VRInteractions.disable();
      VRInteractions.clear();
      clearScene();
      NPCSystem.clear(scene);
      ProfessorMode.hide();
      QuizSystem.hide();
      ChallengeTimer.stop();
      DayNightCycle.stop();
      MiniLabelSystem.clear();

      hudEl.classList.add('hidden');
      ptrPrompt.classList.add('hidden');
      instrOverlay.classList.add('hidden');
      document.getElementById('task-panel').classList.add('hidden');
      document.getElementById('inventory-panel').classList.add('hidden');
      document.getElementById('daynight-indicator').classList.add('hidden');
      document.getElementById('settings-panel').classList.add('hidden');
      document.getElementById('professor-panel').classList.add('hidden');
      document.getElementById('quiz-panel').classList.add('hidden');
      document.getElementById('timer-results').classList.add('hidden');
      document.getElementById('npc-dialogue').classList.add('hidden');
      selScreen.classList.remove('hidden');
      minimapRole = null;
    });
  }

  // ═══════════════════════════════════════════════════
  //  ANIMATION SYSTEM (14 animation types!)
  // ═══════════════════════════════════════════════════
  function updateAnimations(t, dt) {
    for (var i = 0; i < animatedObjects.length; i++) {
      var a = animatedObjects[i];
      if (!a.mesh || !a.mesh.material) continue;

      switch (a.type) {
        case 'spin':
          a.mesh.rotation.y = a.baseRotY + t * a.speed;
          break;

        case 'bob':
          a.mesh.position.y = a.baseY + Math.sin(t * a.speed + a.phase) * a.amplitude;
          break;

        case 'pulse':
          if (a.mesh.material.emissiveIntensity !== undefined) {
            var p = a.baseEmissive + Math.sin(t * a.speed + a.phase) * a.amplitude;
            a.mesh.material.emissiveIntensity = Math.max(0, p);
          }
          break;

        case 'swing':
          a.mesh.rotation.z = Math.sin(t * a.speed + a.phase) * a.amplitude;
          break;

        case 'drip': {
          var dripCycle = (t * a.speed + a.phase) % 2.0;
          if (dripCycle < 1.0) {
            a.mesh.position.y = a.baseY - dripCycle * a.amplitude;
            a.mesh.scale.y = 1 + dripCycle * 0.5;
          } else {
            a.mesh.position.y = a.baseY;
            a.mesh.scale.y = 1;
          }
          break;
        }

        case 'flicker':
          if (a.mesh.material.emissiveIntensity !== undefined) {
            var f = a.baseEmissive * (0.7 + 0.3 * Math.sin(t * 12 + a.phase));
            a.mesh.material.emissiveIntensity = f;
          }
          break;

        // ── NEW ANIMATION TYPES ──

        case 'breathe': {
          // Scale pulse like breathing
          var breathe = 1 + Math.sin(t * a.speed + a.phase) * a.amplitude * 0.1;
          a.mesh.scale.set(
            a.baseScaleX * breathe,
            a.baseScaleY * breathe,
            a.baseScaleZ * breathe
          );
          break;
        }

        case 'wobble': {
          // Combined rotation wobble on X and Z
          a.mesh.rotation.x = a.baseRotX + Math.sin(t * a.speed * 0.7 + a.phase) * a.amplitude * 0.3;
          a.mesh.rotation.z = a.baseRotZ + Math.cos(t * a.speed + a.phase * 1.3) * a.amplitude * 0.3;
          break;
        }

        case 'float': {
          // Gentle levitation with subtle tilt
          a.mesh.position.y = a.baseY + Math.sin(t * a.speed * 0.5 + a.phase) * a.amplitude;
          a.mesh.rotation.y = a.baseRotY + t * a.speed * 0.2;
          a.mesh.rotation.x = Math.sin(t * a.speed * 0.3 + a.phase) * 0.05;
          break;
        }

        case 'shimmer': {
          // Rapid emissive flicker for lights/indicators
          if (a.mesh.material.emissiveIntensity !== undefined) {
            var shimmer = a.baseEmissive + Math.sin(t * a.speed * 15 + a.phase) * a.amplitude;
            shimmer += Math.sin(t * a.speed * 7.3 + a.phase * 2) * a.amplitude * 0.5;
            a.mesh.material.emissiveIntensity = Math.max(0, shimmer);
          }
          break;
        }

        case 'glowPulse': {
          // Smooth emissive color cycling
          if (a.mesh.material.emissive && a.baseEmissiveColor) {
            var gp = (Math.sin(t * a.speed + a.phase) + 1) * 0.5;
            var r = a.baseEmissiveColor.r * (0.5 + gp * 0.5);
            var g = a.baseEmissiveColor.g * (0.5 + gp * 0.5);
            var b = a.baseEmissiveColor.b * (0.5 + gp * 0.5);
            a.mesh.material.emissive.setRGB(r, g, b);
            a.mesh.material.emissiveIntensity = a.baseEmissive * (0.6 + gp * 0.4);
          }
          break;
        }

        case 'drift': {
          // Slow horizontal drift with return
          a.mesh.position.x = a.baseX + Math.sin(t * a.speed * 0.2 + a.phase) * a.amplitude;
          break;
        }

        case 'elastic': {
          // Elastic bounce effect (overshoot then settle)
          var et = (Math.sin(t * a.speed + a.phase) + 1) * 0.5;
          var elastic = et < 0.5 ?
            4 * et * et * et :
            1 - Math.pow(-2 * et + 2, 3) / 2;
          a.mesh.position.y = a.baseY + elastic * a.amplitude;
          break;
        }

        case 'rotate3d': {
          // Rotate on all 3 axes
          a.mesh.rotation.x = a.baseRotX + t * a.speed * 0.3;
          a.mesh.rotation.y = a.baseRotY + t * a.speed;
          a.mesh.rotation.z = a.baseRotZ + t * a.speed * 0.15;
          break;
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════
  //  SOUND-REACTIVE LIGHTING
  // ═══════════════════════════════════════════════════
  var _soundPulseDecay = 0;
  function pulseSoundReactive() { _soundPulseDecay = 1.0; }
  function updateSoundReactive(dt) {
    if (_soundPulseDecay > 0.01) {
      _soundPulseDecay *= 0.92;
      for (var i = 0; i < soundReactiveLights.length; i++) {
        var lr = soundReactiveLights[i];
        lr.light.intensity = lr.baseIntensity + _soundPulseDecay * 0.3;
      }
    }
  }

  // ═══════════════════════════════════════════════════
  //  CAMERA LERP
  // ═══════════════════════════════════════════════════
  function updateCameraLerp(dt) {
    if (!cameraLerp.active) return;
    cameraLerp.t += dt / cameraLerp.duration;
    if (cameraLerp.t >= 1) {
      cameraLerp.t = 1;
      cameraLerp.active = false;
    }
    var ease = 1 - Math.pow(1 - cameraLerp.t, 3);
    camera.position.lerpVectors(cameraLerp.from, cameraLerp.to, ease);
  }

  // ═══════════════════════════════════════════════════
  //  CROUCH INDICATOR
  // ═══════════════════════════════════════════════════
  function updateCrouchIndicator() {
    if (crouchIndEl) {
      crouchIndEl.classList.toggle('hidden', !VRControls.isCrouching());
    }
  }

  // ═══════════════════════════════════════════════════
  //  ANIMATION LOOP
  // ═══════════════════════════════════════════════════
  function loop() {
    animFrameId = requestAnimationFrame(loop);
    var dt = clock.getDelta();
    var t  = clock.getElapsedTime();

    dt = Math.min(dt, 0.1);

    VRControls.update(dt);
    VRInteractions.update(camera);
    updateCameraLerp(dt);
    updateAnimations(t, dt);
    updateSoundReactive(dt);

    if (Quality.particlesEnabled()) {
      for (var i = 0; i < particles.length; i++) {
        particles[i].update(dt);
      }
    }

    if (screenManager) screenManager.update();

    // Subsystem updates
    ChallengeTimer.update();
    DayNightCycle.update(dt);
    NPCSystem.update(dt);
    MiniLabelSystem.update(camera, renderer);

    // HUD updates
    updateCompass();
    updateStamina();
    updateCrouchIndicator();
    drawMinimap();

    // Render
    if (bloomFX && Quality.bloomEnabled() && effectsEnabled) {
      bloomFX.render();
    } else if (ssaoFX && Quality.shadowsEnabled() && effectsEnabled) {
      ssaoFX.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  // ═══════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════
  function init() {
    Quality.detect();
    initThree();
    VRControls.init(camera, canvasContainer);
    VRInteractions.init();
    VRSound.init();
    AchievementSystem.init();
    ScoreSystem.init();
    InventorySystem.init();
    ChallengeTimer.init();
    DayNightCycle.init();
    MiniLabelSystem.init();
    NPCSystem.init(null);
    MobileControls.init();
    initMinimap();
    compassHeadingEl = document.getElementById('compass-heading');
    populateRoleCards();

    // Footstep sounds
    VRControls.setOnFootstep(function (type) {
      VRSound.footstep(type);
    });

    backBtn.addEventListener('click', goBack);
    soundBtn.addEventListener('click', function () {
      var isOn = VRSound.toggle();
      soundBtn.textContent = isOn ? '🔊' : '🔇';
    });

    qualityBadge.addEventListener('click', function () {
      Quality.cycleTier();
      if (Quality.bloomEnabled() && !bloomFX) {
        bloomFX = new BloomPostFX(renderer, scene, camera, {
          threshold: 0.72, intensity: 0.35, blurSize: 1,
          grain: 0.012, vignette: 0.18, chromAb: 0.0008, exposure: 1.3,
          temperature: 0.03, contrast: 1.04, saturation: 1.08
        });
      } else if (bloomFX) {
        bloomFX.enabled = Quality.bloomEnabled();
      }
      if (ssaoFX) ssaoFX.enabled = Quality.shadowsEnabled() && !Quality.bloomEnabled();
      renderer.shadowMap.enabled = Quality.shadowsEnabled();
    });

    // Screenshot button
    var screenshotBtn = document.getElementById('screenshot-btn');
    if (screenshotBtn) {
      screenshotBtn.addEventListener('click', function () {
        ScreenshotSystem.capture(renderer);
      });
    }

    // Settings panel
    var settingsToggle = document.getElementById('settings-toggle');
    var settingsPanel = document.getElementById('settings-panel');
    var settingsClose = document.getElementById('settings-close');
    var sensSlider = document.getElementById('sensitivity-slider');
    var sensValue = document.getElementById('sensitivity-value');
    var fovSlider = document.getElementById('fov-slider');
    var fovValue = document.getElementById('fov-value');

    if (settingsToggle && settingsPanel) {
      settingsToggle.addEventListener('click', function () {
        settingsPanel.classList.toggle('hidden');
      });
    }
    if (settingsClose && settingsPanel) {
      settingsClose.addEventListener('click', function () {
        settingsPanel.classList.add('hidden');
      });
    }
    if (sensSlider) {
      sensSlider.addEventListener('input', function () {
        var val = parseFloat(this.value);
        if (sensValue) sensValue.textContent = val.toFixed(1);
        if (typeof VRControls !== 'undefined' && VRControls.setSensitivity) {
          VRControls.setSensitivity(val * 0.001);
        }
      });
    }
    if (fovSlider) {
      fovSlider.addEventListener('input', function () {
        var val = parseInt(this.value);
        if (fovValue) fovValue.textContent = val + '°';
        if (camera) {
          camera.fov = val;
          camera.updateProjectionMatrix();
        }
      });
    }

    // Quiz panel buttons
    var quizClose = document.getElementById('quiz-close');
    var quizNext = document.getElementById('quiz-next');
    if (quizClose) quizClose.addEventListener('click', function () { QuizSystem.hide(); });
    if (quizNext) quizNext.addEventListener('click', function () { QuizSystem.next(); });

    // Professor panel buttons
    var profClose = document.getElementById('professor-close');
    var profNext = document.getElementById('professor-next');
    if (profClose) profClose.addEventListener('click', function () { ProfessorMode.hide(); });
    if (profNext) profNext.addEventListener('click', function () { ProfessorMode.nextTip(); });

    // Timer results close
    var timerResultsClose = document.getElementById('timer-results-close');
    if (timerResultsClose) {
      timerResultsClose.addEventListener('click', function () {
        document.getElementById('timer-results').classList.add('hidden');
      });
    }

    // NPC dismiss button
    var npcDismiss = document.getElementById('npc-dismiss');
    if (npcDismiss) {
      npcDismiss.addEventListener('click', function () { NPCSystem.dismiss(); });
    }

    // ── Keyboard handlers (F, Q, P, T, G) ──
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Effects toggle (G key)
      if (e.code === 'KeyG' && !e.repeat) {
        effectsEnabled = !effectsEnabled;
        var indEl = document.getElementById('effects-indicator');
        if (indEl) {
          indEl.textContent = 'Effects: ' + (effectsEnabled ? 'ON' : 'OFF');
          indEl.classList.remove('hidden');
          setTimeout(function () { indEl.classList.add('hidden'); }, 2000);
        }
      }

      // Quiz toggle (Q key)
      if (e.code === 'KeyQ' && !e.repeat) {
        QuizSystem.toggle();
      }

      // Professor toggle (P key)
      if (e.code === 'KeyP' && !e.repeat) {
        ProfessorMode.toggle();
      }

      // Timer toggle (T key)
      if (e.code === 'KeyT' && !e.repeat) {
        ChallengeTimer.toggle();
      }

      // Pick up item (F key)
      if (e.code === 'KeyF' && !e.repeat) {
        var target = VRInteractions.getCurrentTarget();
        if (target) {
          var objName = target.userData.name || 'Unknown';
          var added = InventorySystem.addItem(objName, '📦');
          if (added) {
            showNotif('📦 Picked up: ' + objName);
            VRSound.interact();
            ScoreSystem.addPoints(5, 'Item collected');
          } else {
            showNotif('⚠️ Inventory full or already have this item');
          }
        }
      }
    });

    instrOverlay.addEventListener('click', function () {
      VRControls.requestLock();
      pulseSoundReactive();
    });
    ptrPrompt.addEventListener('click', function () {
      VRControls.requestLock();
      pulseSoundReactive();
    });
  }

  // ─── Load Three.js from CDN, then start ─────────
  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = function () { init(); };
  script.onerror = function () {
    document.body.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#ff6b6b;font-family:sans-serif;text-align:center;padding:40px">' +
      '<div><h1>\u26a0\ufe0f Need Internet</h1>' +
      '<p style="margin-top:16px;color:#999">This app needs Three.js from CDN.<br>Connect to internet and refresh.</p></div></div>';
  };
  document.head.appendChild(script);

})();
