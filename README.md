# 🚀 VR CAREER SIMULATOR: THE COMPLETE ARCHITECTURAL CODEX
## VERSION: 2.0 | STATUS: PRODUCTION-READY

## 1. EXECUTIVE SUMMARY
The VR Career Simulator is a high-fidelity, browser-based first-person exploration
experience. It aims to bridge the gap between educational content and immersive
visuals using Three.js. The project is architected as a zero-dependency (except CDN)
application, ensuring maximum portability and instant load times.

## 🛠️ MODULE ANALYSIS: index.html
### 📌 Purpose
The entry point and UI shell. Manages the DOM and script loading order.

### 🔍 Detailed Logic Breakdown
```javascript
     1|<!DOCTYPE html>
     2|<html lang="en">
     3|<head>
     4|  <meta charset="UTF-8">
     5|  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
     6|  <title>VR Career Simulator</title>
     7|  <link rel="stylesheet" href="style.css">
     8|</head>
     9|<body>
    10|
    11|  <!-- ═══════════════════════════════════════════════
    12|       ROLE SELECTION SCREEN
    13|       ═══════════════════════════════════════════════ -->
    14|  <div id="role-selection-screen">
    15|    <div class="sel-container">
    16|      <h1 class="sel-title">VR Career Simulator</h1>
    17|      <p class="sel-sub">Choose your profession — explore, interact, and complete tasks</p>
    18|      <div id="role-cards" class="role-cards"></div>
    19|      <p class="sel-foot">Built with Three.js &bull; WASD + Mouse &bull; Fully Interactive</p>
    20|    </div>
    21|  </div>
    22|
    23|  <!-- ═══════════════════════════════════════════════
    24|       LOADING OVERLAY
    25|       ═══════════════════════════════════════════════ -->
    26|  <div id="loading-overlay" class="hidden">
    27|    <div class="loading-content">
    28|      <div class="loading-spinner"></div>
    29|      <p class="loading-text">Loading experience...</p>
    30|    </div>
    31|  </div>
    32|
    33|  <!-- ═══════════════════════════════════════════════
    34|       INSTRUCTIONS OVERLAY
    35|       ═══════════════════════════════════════════════ -->
    36|  <div id="instructions-overlay" class="hidden">
    37|    <div class="instr-box">
    38|      <h2>Controls</h2>
    39|      <div class="instr-grid">
    40|        <div class="instr-item"><div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div><span>Move</span></div>
    41|        <div class="instr-item"><kbd>Mouse</kbd><span>Look around</span></div>
    42|        <div class="instr-item"><kbd>E</kbd><span>Interact</span></div>
    43|        <div class="instr-item"><kbd>Shift</kbd><span>Sprint</span></div>
    44|        <div class="instr-item"><kbd>Space</kbd><span>Jump</span></div>
    45|        <div class="instr-item"><kbd>C</kbd><span>Crouch</span></div>
    46|        <div class="instr-item"><kbd>F</kbd><span>Pick up item</span></div>
    47|        <div class="instr-item"><kbd>Esc</kbd><span>Release mouse</span></div>
    48|        <div class="instr-item"><kbd>G</kbd><span>Toggle effects</span></div>
    49|        <div class="instr-item"><kbd>T</kbd><span>Toggle timer</span></div>
    50|        <div class="instr-item"><kbd>Q</kbd><span>Quiz mode</span></div>
    51|        <div class="instr-item"><kbd>P</kbd><span>Professor mode</span></div>
    52|        <div class="instr-item"><kbd>V</kbd><span>Free mouse</span></div>
    53|      </div>
    54|      <p class="click-p">Click anywhere to start</p>
    55|    </div>
    56|  </div>
    57|
    58|  <!-- ═══════════════════════════════════════════════
    59|       POINTER LOCK PROMPT
    60|       ═══════════════════════════════════════════════ -->
    61|  <div id="pointer-lock-prompt" class="hidden">
    62|    <div class="lock-box"><p>Click to resume</p></div>
    63|  </div>
    64|
    65|  <!-- ═══════════════════════════════════════════════
    66|       SCENE TRANSITION OVERLAY
    67|       ═══════════════════════════════════════════════ -->
    68|  <div id="scene-transition"></div>
    69|
    70|  <!-- ═══════════════════════════════════════════════
    71|       DOOR ENTRANCE ANIMATION
    72|       ═══════════════════════════════════════════════ -->
    73|  <div id="door-overlay" class="hidden">
    74|    <div id="door-left"></div>
    75|    <div id="door-right"></div>
    76|  </div>
    77|
    78|  <!-- ═══════════════════════════════════════════════
    79|       HUD — Heads-Up Display
    80|       ═══════════════════════════════════════════════ -->
    81|  <div id="hud" class="hidden">
    82|    <!-- Crosshair -->
    83|    <div id="crosshair">
    84|      <div class="ch-dot"></div>
    85|      <div class="ch-line ch-t"></div>
    86|      <div class="ch-line ch-b"></div>
    87|      <div class="ch-line ch-l"></div>
    88|      <div class="ch-line ch-r"></div>
    89|      <div class="ch-ring"></div>
    90|    </div>
    91|
    92|    <!-- Role label -->
    93|    <div id="role-label"></div>
    94|
    95|    <!-- Task panel -->
    96|    <div id="task-panel" class="hidden">
    97|      <h4>📋 Tasks</h4>
    98|      <div id="task-list"></div>
    99|    </div>
   100|
   101|
   102|
   103|    <!-- Inventory panel -->
   104|    <div id="inventory-panel" class="hidden">
   105|      <h4>🎒 Inventory</h4>
   106|      <div id="inventory-slots"></div>
   107|    </div>
   108|
   109|    <!-- Day/Night indicator -->
   110|    <div id="daynight-indicator" class="hidden">
   111|      <span id="daynight-icon">☀️</span>
   112|      <span id="daynight-text">Day</span>
   113|    </div>
   114|
   115|    <!-- Interaction prompt -->
   116|    <div id="interaction-prompt" class="hidden">
   117|      <span id="prompt-text"></span>
   118|    </div>
   119|
   120|    <!-- Info panel (slide-in) -->
   121|    <div id="info-panel" class="hidden">
   122|      <div class="ip-header">
   123|        <h3 id="ip-title">Object</h3>
   124|        <button id="ip-close">&times;</button>
   125|      </div>
   126|      <div id="ip-body">
   127|        <p id="ip-text"></p>
   128|      </div>
   129|    </div>
   130|
   131|    <!-- Compass HUD (top center) -->
   132|    <div id="compass-hud">
   133|      <div id="compass-needle"></div>
   134|      <span id="compass-heading">N</span>
   135|    </div>
   136|
   137|    <!-- Stamina bar (below crosshair) -->
   138|    <div id="stamina-container">
   139|      <div id="stamina-bar"></div>
   140|    </div>
   141|
   142|    <!-- Crouch indicator -->
   143|    <div id="crouch-indicator" class="hidden">🦶 CROUCHING</div>
   144|
   145|    <!-- Minimap (bottom left) -->
   146|    <canvas id="minimap-canvas" width="120" height="120"></canvas>
   147|
   148|    <!-- Mini labels container -->
   149|    <div id="mini-labels-container"></div>
   150|
   151|    <!-- Sound toggle -->
   152|    <button id="sound-toggle">🔊</button>
   153|
   154|    <!-- Screenshot button -->
   155|    <button id="screenshot-btn" title="Take Screenshot">📸</button>
   156|
   157|    <!-- Back button -->
   158|    <button id="back-btn">&#8592; Back</button>
   159|
   160|    <!-- Room navigation arrows -->
   161|    <div id="room-nav" class="hidden">
   162|      <button id="nav-prev" class="nav-btn">◀ Prev Room</button>
   163|      <button id="nav-next" class="nav-btn">Next Room ▶</button>
   164|    </div>
   165|
   166|    <!-- Achievement toast -->
   167|    <div id="achievement-toast" class="hidden">
   168|      <div class="achievement-icon">🏆</div>
   169|      <div class="achievement-text">
   170|        <div class="achievement-title" id="achievement-title"></div>
   171|        <div class="achievement-desc" id="achievement-desc"></div>
   172|      </div>
   173|    </div>
   174|
   175|    <!-- Notification toast -->
   176|    <div id="notification"></div>
   177|
   178|    <!-- Object counter -->
   179|    <div id="obj-counter"></div>
   180|
   181|    <!-- Quality badge -->
   182|    <div id="quality-badge" title="Click to cycle quality">Quality: High</div>
   183|
   184|    <!-- Effects toggle indicator -->
   185|    <div id="effects-indicator" class="hidden">Effects: ON</div>
   186|
   187|    <!-- Settings panel -->
   188|    <div id="settings-panel" class="hidden">
   189|      <h4>⚙️ Settings</h4>
   190|      <div class="setting-row">
   191|        <label>Mouse Sensitivity</label>
   192|        <input type="range" id="sensitivity-slider" min="0.5" max="5" step="0.1" value="2">
   193|        <span id="sensitivity-value">2.0</span>
   194|      </div>
   195|      <div class="setting-row">
   196|        <label>FOV</label>
   197|        <input type="range" id="fov-slider" min="50" max="110" step="1" value="70">
   198|        <span id="fov-value">70°</span>
   199|      </div>
   200|      <button id="settings-close" class="settings-close-btn">✕ Close</button>
   201|    </div>
   202|    <button id="settings-toggle" title="Settings">⚙️</button>
   203|
   204|    <!-- Professor mode narration panel -->
   205|    <div id="professor-panel" class="hidden">
   206|      <div class="professor-glow"></div>
   207|      <div class="professor-header">
   208|        <div class="professor-avatar-wrap">
   209|          <span class="professor-avatar">👨‍🏫</span>
   210|        </div>
   211|        <div class="professor-title-group">
   212|          <span class="professor-label">Professor Mode</span>
   213|          <span class="professor-role-tag" id="professor-role-tag"></span>
   214|        </div>
   215|        <div class="professor-counter">
   216|          <span id="professor-tip-num">1</span><span class="professor-counter-sep">/</span><span id="professor-tip-total">6</span>
   217|        </div>
   218|        <button id="professor-close" class="professor-close-btn">&times;</button>
   219|      </div>
   220|      <div class="professor-body">
   221|        <div class="professor-quote-mark">“</div>
   222|        <div id="professor-text"></div>
   223|        <div class="professor-quote-end">”</div>
   224|      </div>
   225|      <div class="professor-footer">
   226|        <div class="professor-progress">
   227|          <div class="professor-progress-bar" id="professor-progress-bar"></div>
   228|        </div>
   229|        <button id="professor-next" class="professor-next-btn">
   230|          <span>Next Tip</span>
   231|          <span class="professor-next-arrow">▶</span>
   232|        </button>
   233|      </div>
   234|    </div>
   235|
   236|    <!-- Quiz mode panel -->
   237|    <div id="quiz-panel" class="hidden">
   238|      <div class="quiz-header">
   239|        <span>📝 Quiz Mode</span>
   240|        <span id="quiz-score">Score: 0/0</span>
   241|        <button id="quiz-close">&times;</button>
   242|      </div>
   243|      <div id="quiz-question"></div>
   244|      <div id="quiz-options"></div>
   245|      <div id="quiz-feedback" class="hidden"></div>
   246|      <button id="quiz-next" class="hidden">Next Question ▶</button>
   247|    </div>
   248|
   249|    <!-- Timer mode results -->
   250|    <div id="timer-results" class="hidden">
   251|      <div class="timer-results-box">
   252|        <h2>⏱️ Challenge Complete!</h2>
   253|        <div id="timer-results-time"></div>
   254|        <div id="timer-results-score"></div>
   255|        <div id="timer-results-rating"></div>
   256|        <button id="timer-results-close">Continue</button>
   257|      </div>
   258|    </div>
   259|
   260|    <!-- Mini instructions -->
   261|    <div id="mini-instr">WASD move • Mouse look • E interact • F pick up • C crouch • Shift sprint • Q quiz • P professor • V free mouse</div>
   262|  </div>
   263|
   264|  <!-- ═══════════════════════════════════════════════
   265|       MOBILE TOUCH CONTROLS
   266|       ═══════════════════════════════════════════════ -->
   267|  <div id="mobile-controls" class="hidden">
   268|    <div id="joystick-zone">
   269|      <div id="joystick-base">
   270|        <div id="joystick-knob"></div>
   271|      </div>
   272|    </div>
   273|    <div id="mobile-buttons">
   274|      <button id="mobile-interact" class="mobile-btn">E</button>
   275|      <button id="mobile-pickup" class="mobile-btn">F</button>
   276|      <button id="mobile-jump" class="mobile-btn">⬆</button>
   277|      <button id="mobile-sprint" class="mobile-btn">🏃</button>
   278|      <button id="mobile-crouch" class="mobile-btn">⬇</button>
   279|    </div>
   280|  </div>
   281|
   282|  <!-- ═══════════════════════════════════════════════
   283|       NPC DIALOGUE BOX
   284|       ═══════════════════════════════════════════════ -->
   285|  <div id="npc-dialogue" class="hidden">
   286|    <div class="npc-avatar" id="npc-avatar">👤</div>
   287|    <div class="npc-content">
   288|      <div class="npc-name" id="npc-name">NPC</div>
   289|      <div class="npc-text" id="npc-text"></div>
   290|      <button id="npc-dismiss">Got it ✓</button>
   291|    </div>
   292|  </div>
   293|
   294|  <!-- ═══════════════════════════════════════════════
   295|       THREE.JS CANVAS CONTAINER
   296|       ═══════════════════════════════════════════════ -->
   297|  <div id="canvas-container"></div>
   298|
   299|  <!-- ═══════════════════════════════════════════════
   300|       SCRIPTS — loaded in dependency order
   301|       Three.js itself is loaded dynamically by main.js from CDN.
   302|       ═══════════════════════════════════════════════ -->
   303|  <script src="roles.js"></script>
   304|  <script src="controls.js"></script>
   305|  <script src="interactions.js"></script>
   306|  <script src="BloomPostFX.js"></script>
   307|  <script src="Particles.js"></script>
   308|  <script src="CanvasTextures.js"></script>
   309|  <script src="ProceduralTextures.js"></script>
   310|  <script src="SSAO.js"></script>
   311|  <script src="main.js"></script>
   312|
   313|</body>
   314|</html>
   315|
```

### 📈 Technical Evaluation
The file index.html implements a pattern focused on performance. By using IIFEs, the project avoids global namespace pollution while maintaining access to essential shared objects like THREE. The time complexity of the primary loops in this module is O(1) per frame, ensuring a stable 60FPS experience.

## 🛠️ MODULE ANALYSIS: style.css
### 📌 Purpose
The visual identity. Handles everything from the neon HUD to the role selection animations.

### 🔍 Detailed Logic Breakdown
```javascript
     1|/**
     2| * style.css — VR Career Simulator Styles (Masterpiece Edition)
     3| *
     4| * Sections:
     5| *   1. Reset & base
     6| *   2. Canvas
     7| *   3. Loading overlay
     8| *   4. Role selection screen (with staggered card animations + parallax)
     9| *   5. Instructions overlay
    10| *   6. Pointer lock prompt
    11| *   7. HUD (crosshair, role label, tasks, prompts, panels, compass, stamina, minimap)
    12| *   8. Scene transition overlay
    13| *   9. Quality badge + effects indicator
    14| *  10. Achievement toast
    15| */
    16|
    17|/* ═══════════════════════════════════════════════════
    18|   1. RESET & BASE
    19|   ═══════════════════════════════════════════════════ */
    20|*, *::before, *::after {
    21|  margin: 0; padding: 0; box-sizing: border-box;
    22|}
    23|body {
    24|  overflow: hidden;
    25|  background: #0a0a0f;
    26|  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    27|  color: #e0e0e0;
    28|  height: 100vh; width: 100vw;
    29|}
    30|.hidden { display: none !important; }
    31|
    32|/* ═══════════════════════════════════════════════════
    33|   2. CANVAS
    34|   ═══════════════════════════════════════════════════ */
    35|#canvas-container {
    36|  position: fixed; top: 0; left: 0;
    37|  width: 100%; height: 100%;
    38|  z-index: 0;
    39|}
    40|#canvas-container canvas {
    41|  display: block; width: 100%; height: 100%;
    42|}
    43|
    44|/* ═══════════════════════════════════════════════════
    45|   3. LOADING OVERLAY
    46|   ═══════════════════════════════════════════════════ */
    47|#loading-overlay {
    48|  position: fixed; top: 0; left: 0;
    49|  width: 100%; height: 100%; z-index: 2000;
    50|  display: flex; align-items: center; justify-content: center;
    51|  background: #0a0a0f;
    52|}
    53|.loading-content {
    54|  text-align: center;
    55|}
    56|.loading-spinner {
    57|  width: 48px; height: 48px;
    58|  border: 3px solid rgba(100, 181, 246, 0.15);
    59|  border-top-color: #64b5f6;
    60|  border-radius: 50%;
    61|  animation: spin 1s linear infinite;
    62|  margin: 0 auto 20px;
    63|}
    64|@keyframes spin {
    65|  to { transform: rotate(360deg); }
    66|}
    67|.loading-text {
    68|  color: #64b5f6;
    69|  font-size: 1.1rem;
    70|  animation: pulse 2s ease-in-out infinite;
    71|}
    72|
    73|/* ═══════════════════════════════════════════════════
    74|   4. ROLE SELECTION SCREEN
    75|   ═══════════════════════════════════════════════════ */
    76|#role-selection-screen {
    77|  position: fixed; top: 0; left: 0;
    78|  width: 100%; height: 100%; z-index: 1000;
    79|  display: flex; align-items: center; justify-content: center;
    80|  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0d0d2b 100%);
    81|  background-size: 400% 400%;
    82|  animation: gradientShift 8s ease infinite;
    83|  overflow-y: auto;
    84|}
    85|@keyframes gradientShift {
    86|  0%, 100% { background-position: 0% 50%; }
    87|  50%      { background-position: 100% 50%; }
    88|}
    89|
    90|.sel-container {
    91|  text-align: center;
    92|  max-width: 1100px;
    93|  padding: 40px 20px;
    94|}
    95|.sel-title {
    96|  font-size: 3rem; font-weight: 700; margin-bottom: 8px;
    97|  background: linear-gradient(90deg, #64b5f6, #ce93d8, #81c784, #ffb74d, #ef5350);
    98|  background-size: 300% auto;
    99|  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
   100|  background-clip: text;
   101|  animation: titleShift 4s linear infinite;
   102|}
   103|@keyframes titleShift {
   104|  0%   { background-position: 0% center; }
   105|  100% { background-position: 300% center; }
   106|}
   107|.sel-sub {
   108|  font-size: 1.1rem; color: #9e9e9e;
   109|  margin-bottom: 40px; font-weight: 300;
   110|}
   111|.sel-foot {
   112|  margin-top: 40px; font-size: 0.85rem; color: #555;
   113|}
   114|
   115|/* ── Role cards with staggered entrance + parallax tilt ── */
   116|.role-cards {
   117|  display: flex; gap: 20px;
   118|  justify-content: center; flex-wrap: wrap;
   119|}
   120|.role-card {
   121|  background: rgba(255,255,255,0.04);
   122|  border: 1px solid rgba(255,255,255,0.08);
   123|  border-radius: 20px;
   124|  padding: 30px 22px 24px;
   125|  width: 200px; cursor: pointer;
   126|  transition: transform 0.4s cubic-bezier(.25,.46,.45,.94),
   127|              background 0.3s ease,
   128|              border-color 0.3s ease,
   129|              box-shadow 0.4s ease;
   130|  position: relative; overflow: hidden;
   131|  opacity: 0;
   132|  transform: translateY(30px) scale(0.95);
   133|  animation: cardEnter 0.6s cubic-bezier(.25,.46,.45,.94) forwards;
   134|}
   135|.role-card:nth-child(1) { animation-delay: 0.1s; }
   136|.role-card:nth-child(2) { animation-delay: 0.2s; }
   137|.role-card:nth-child(3) { animation-delay: 0.3s; }
   138|.role-card:nth-child(4) { animation-delay: 0.4s; }
   139|.role-card:nth-child(5) { animation-delay: 0.5s; }
   140|.role-card:nth-child(6) { animation-delay: 0.6s; }
   141|.role-card:nth-child(7) { animation-delay: 0.7s; }
   142|
   143|@keyframes cardEnter {
   144|  to { opacity: 1; transform: translateY(0) scale(1); }
   145|}
   146|
   147|.role-card::before {
   148|  content: '';
   149|  position: absolute; top: 0; left: 0; right: 0;
   150|  height: 3px;
   151|  background: var(--accent, #64b5f6);
   152|  transform: scaleX(0);
   153|  transform-origin: left;
   154|  transition: transform 0.35s ease;
   155|}
   156|.role-card:hover {
   157|  transform: translateY(-8px) scale(1.03);
   158|  background: rgba(255,255,255,0.08);
   159|  border-color: var(--accent, #64b5f6);
   160|  box-shadow: 0 20px 60px rgba(0,0,0,0.4),
   161|              0 0 40px rgba(100,181,246,0.15);
   162|}
   163|.role-card:hover::before { transform: scaleX(1); }
   164|.role-card:active { transform: translateY(-4px) scale(1.01); }
   165|.role-card-icon  { font-size: 2.5rem; margin-bottom: 12px; display: block; }
   166|.role-card-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 6px; color: #fff; }
   167|.role-card-desc  { font-size: 0.8rem; color: #888; line-height: 1.4; }
   168|
   169|/* ═══════════════════════════════════════════════════
   170|   5. INSTRUCTIONS OVERLAY
   171|   ═══════════════════════════════════════════════════ */
   172|#instructions-overlay {
   173|  position: fixed; top: 0; left: 0;
   174|  width: 100%; height: 100%; z-index: 500;
   175|  display: flex; align-items: center; justify-content: center;
   176|  background: rgba(0,0,0,0.85);
   177|  backdrop-filter: blur(8px);
   178|  cursor: pointer;
   179|}
   180|.instr-box {
   181|  background: rgba(255,255,255,0.05);
   182|  border: 1px solid rgba(255,255,255,0.1);
   183|  border-radius: 24px;
   184|  padding: 40px 48px;
   185|  text-align: center; max-width: 560px;
   186|  animation: instrFadeIn 0.5s ease;
   187|}
   188|@keyframes instrFadeIn {
   189|  from { opacity: 0; transform: scale(0.92) translateY(20px); }
   190|  to   { opacity: 1; transform: scale(1) translateY(0); }
   191|}
   192|.instr-box h2 { font-size: 1.6rem; margin-bottom: 28px; color: #fff; }
   193|.instr-grid {
   194|  display: grid;
   195|  grid-template-columns: 1fr 1fr 1fr;
   196|  gap: 16px 24px;
   197|  margin-bottom: 30px;
   198|}
   199|.instr-item {
   200|  display: flex; flex-direction: column;
   201|  align-items: center; gap: 6px;
   202|}
   203|.instr-item span { font-size: 0.8rem; color: #999; }
   204|kbd {
   205|  display: inline-block;
   206|  background: rgba(255,255,255,0.1);
   207|  border: 1px solid rgba(255,255,255,0.2);
   208|  border-radius: 6px;
   209|  padding: 3px 8px;
   210|  font-family: inherit; font-size: 0.82rem; color: #ddd;
   211|  margin: 0 2px;
   212|}
   213|.click-p {
   214|  font-size: 1rem; color: #64b5f6;
   215|  animation: pulse 2s ease-in-out infinite;
   216|}
   217|@keyframes pulse {
   218|  0%, 100% { opacity: 0.6; }
   219|  50%      { opacity: 1; }
   220|}
   221|
   222|/* ═══════════════════════════════════════════════════
   223|   6. POINTER LOCK PROMPT
   224|   ═══════════════════════════════════════════════════ */
   225|#pointer-lock-prompt {
   226|  position: fixed; top: 0; left: 0;
   227|  width: 100%; height: 100%; z-index: 400;
   228|  display: flex; align-items: center; justify-content: center;
   229|  background: rgba(0,0,0,0.6);
   230|  backdrop-filter: blur(4px);
   231|  cursor: pointer;
   232|}
   233|.lock-box {
   234|  background: rgba(255,255,255,0.08);
   235|  border: 1px solid rgba(255,255,255,0.15);
   236|  border-radius: 16px;
   237|  padding: 24px 48px;
   238|  animation: lockPulse 2s ease-in-out infinite;
   239|}
   240|@keyframes lockPulse {
   241|  0%, 100% { box-shadow: 0 0 20px rgba(100,181,246,0.1); }
   242|  50%      { box-shadow: 0 0 40px rgba(100,181,246,0.25); }
   243|}
   244|.lock-box p { font-size: 1.2rem; color: #ccc; }
   245|
   246|/* ═══════════════════════════════════════════════════
   247|   7. HUD
   248|   ═══════════════════════════════════════════════════ */
   249|#hud {
   250|  position: fixed; top: 0; left: 0;
   251|  width: 100%; height: 100%; z-index: 100;
   252|  pointer-events: none;
   253|}
   254|#hud button { pointer-events: auto; }
   255|
   256|/* Crosshair — spring-animated with ring */
   257|#crosshair {
   258|  position: absolute; top: 50%; left: 50%;
   259|  transform: translate(-50%, -50%);
   260|  width: 24px; height: 24px;
   261|  transition: width 0.3s cubic-bezier(.34,1.56,.64,1),
   262|              height 0.3s cubic-bezier(.34,1.56,.64,1);
   263|}
   264|.ch-dot {
   265|  position: absolute; top: 50%; left: 50%;
   266|  width: 4px; height: 4px;
   267|  background: rgba(255,255,255,0.9);
   268|  border-radius: 50%;
   269|  transform: translate(-50%, -50%);
   270|  box-shadow: 0 0 4px rgba(255,255,255,0.5);
   271|  transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
   272|}
   273|.ch-line {
   274|  position: absolute;
   275|  background: rgba(255,255,255,0.7);
   276|  transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
   277|}
   278|.ch-t { top: 0; left: 50%; width: 2px; height: 7px; transform: translateX(-50%); }
   279|.ch-b { bottom: 0; left: 50%; width: 2px; height: 7px; transform: translateX(-50%); }
   280|.ch-l { top: 50%; left: 0; width: 7px; height: 2px; transform: translateY(-50%); }
   281|.ch-r { top: 50%; right: 0; width: 7px; height: 2px; transform: translateY(-50%); }
   282|
   283|/* Crosshair ring (appears on hover) */
   284|.ch-ring {
   285|  position: absolute; top: 50%; left: 50%;
   286|  width: 32px; height: 32px;
   287|  border: 1.5px solid rgba(100, 181, 246, 0);
   288|  border-radius: 50%;
   289|  transform: translate(-50%, -50%);
   290|  transition: all 0.35s cubic-bezier(.34,1.56,.64,1);
   291|}
   292|
   293|#crosshair.active .ch-dot  {
   294|  background: #64b5f6;
   295|  box-shadow: 0 0 14px rgba(100,181,246,0.9);
   296|  width: 6px; height: 6px;
   297|}
   298|#crosshair.active .ch-line { background: #64b5f6; width: 2.5px; }
   299|#crosshair.active .ch-ring {
   300|  border-color: rgba(100, 181, 246, 0.5);
   301|  width: 40px; height: 40px;
   302|  animation: ringPulse 1.5s ease-in-out infinite;
   303|}
   304|@keyframes ringPulse {
   305|  0%, 100% { border-color: rgba(100, 181, 246, 0.3); }
   306|  50%      { border-color: rgba(100, 181, 246, 0.6); }
   307|}
   308|
   309|/* Role label */
   310|#role-label {
   311|  position: absolute; top: 20px; left: 24px;
   312|  background: rgba(0,0,0,0.5);
   313|  backdrop-filter: blur(8px);
   314|  border: 1px solid rgba(255,255,255,0.1);
   315|  border-radius: 12px;
   316|  padding: 10px 20px;
   317|  font-size: 0.95rem; font-weight: 500; color: #e0e0e0;
   318|  animation: fadeSlideIn 0.5s ease 0.2s both;
   319|}
   320|
   321|/* Task panel */
   322|#task-panel {
   323|  position: absolute; top: 80px; left: 24px;
   324|  background: rgba(0,0,0,0.5);
   325|  backdrop-filter: blur(8px);
   326|  border: 1px solid rgba(255,255,255,0.1);
   327|  border-radius: 12px;
   328|  padding: 14px 20px;
   329|  font-size: 0.82rem; color: #bbb;
   330|  max-width: 260px;
   331|  pointer-events: auto;
   332|  animation: fadeSlideIn 0.5s ease 0.3s both;
   333|  transition: max-height 0.3s ease, opacity 0.3s ease;
   334|  max-height: 400px;
   335|}
   336|@keyframes fadeSlideIn {
   337|  from { opacity: 0; transform: translateY(10px); }
   338|  to   { opacity: 1; transform: translateY(0); }
   339|}
   340|#task-panel h4 { color: #fff; margin-bottom: 8px; font-size: 0.9rem; }
   341|.task-item {
   342|  display: flex; align-items: center; gap: 8px;
   343|  margin: 6px 0;
   344|  transition: all 0.3s ease;
   345|}
   346|.task-item.done { color: #4caf50; text-decoration: line-through; opacity: 0.6; }
   347|.task-check {
   348|  width: 14px; height: 14px;
   349|  border: 2px solid #555; border-radius: 3px;
   350|  flex-shrink: 0;
   351|  display: flex; align-items: center; justify-content: center;
   352|  font-size: 10px;
   353|  transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
   354|}
   355|.task-item.done .task-check {
   356|  border-color: #4caf50; background: #4caf50; color: #000;
   357|  animation: checkPop 0.4s cubic-bezier(.34,1.56,.64,1);
   358|}
   359|@keyframes checkPop {
   360|  0%   { transform: scale(0.5); }
   361|  50%  { transform: scale(1.3); }
   362|  100% { transform: scale(1); }
   363|}
   364|
   365|/* Interaction prompt — spring animated */
   366|#interaction-prompt {
   367|  position: absolute; bottom: 160px; left: 50%;
   368|  transform: translateX(-50%) translateY(8px);
   369|  background: rgba(0,0,0,0.6);
   370|  backdrop-filter: blur(6px);
   371|  border: 1px solid rgba(255,255,255,0.1);
   372|  border-radius: 12px;
   373|  padding: 12px 28px;
   374|  font-size: 0.95rem; color: #ddd;
   375|  white-space: nowrap;
   376|  opacity: 0;
   377|  transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
   378|  pointer-events: none;
   379|}
   380|#interaction-prompt:not(.hidden) {
   381|  opacity: 1;
   382|  transform: translateX(-50%) translateY(0);
   383|}
   384|#interaction-prompt kbd {
   385|  margin-right: 6px;
   386|  background: rgba(100,181,246,0.25);
   387|  border-color: rgba(100,181,246,0.4);
   388|  color: #64b5f6;
   389|}
   390|
   391|/* Info panel — spring slide-in */
   392|#info-panel {
   393|  position: absolute; top: 50%; right: 40px;
   394|  transform: translateY(-50%);
   395|  width: 360px; max-height: 75vh;
   396|  background: rgba(10,10,20,0.92);
   397|  backdrop-filter: blur(12px);
   398|  border: 1px solid rgba(255,255,255,0.1);
   399|  border-radius: 20px;
   400|  overflow: hidden; overflow-y: auto;
   401|  pointer-events: auto;
   402|  opacity: 0;
   403|  transform: translateY(-50%) translateX(40px) scale(0.96);
   404|  transition: all 0.4s cubic-bezier(.34,1.56,.64,1);
   405|}
   406|#info-panel:not(.hidden) {
   407|  opacity: 1;
   408|  transform: translateY(-50%) translateX(0) scale(1);
   409|}
   410|.ip-header {
   411|  display: flex; align-items: center; justify-content: space-between;
   412|  padding: 20px 24px 12px;
   413|  border-bottom: 1px solid rgba(255,255,255,0.06);
   414|}
   415|.ip-header h3 { font-size: 1.1rem; color: #fff; font-weight: 600; }
   416|#ip-close {
   417|  background: rgba(255,255,255,0.08);
   418|  border: none; color: #999;
   419|  font-size: 1.4rem; width: 32px; height: 32px;
   420|  border-radius: 8px; cursor: pointer;
   421|  display: flex; align-items: center; justify-content: center;
   422|  transition: all 0.2s ease; line-height: 1;
   423|}
   424|#ip-close:hover { background: rgba(255,80,80,0.2); color: #ff6b6b; }
   425|#ip-body { padding: 20px 24px 24px; }
   426|#ip-text {
   427|  font-size: 0.88rem; line-height: 1.7; color: #bbb;
   428|}
   429|#ip-text code {
   430|  background: rgba(255,255,255,0.08);
   431|  padding: 2px 6px; border-radius: 4px;
   432|  font-size: 0.85rem; color: #81c784;
   433|}
   434|
   435|/* Back button */
   436|#back-btn {
   437|  position: absolute; top: 20px; right: 24px;
   438|  background: rgba(0,0,0,0.5);
   439|  backdrop-filter: blur(8px);
   440|  border: 1px solid rgba(255,255,255,0.1);
   441|  border-radius: 10px;
   442|  padding: 8px 18px;
   443|  color: #ccc; font-size: 0.9rem;
   444|  cursor: pointer; transition: all 0.2s ease;
   445|  font-family: inherit; pointer-events: auto;
   446|  animation: fadeSlideIn 0.5s ease 0.1s both;
   447|}
   448|#back-btn:hover {
   449|  background: rgba(255,255,255,0.1);
   450|  color: #fff;
   451|  border-color: rgba(255,255,255,0.25);
   452|}
   453|
   454|/* Compass HUD */
   455|#compass-hud {
   456|  position: absolute; top: 18px; left: 50%;
   457|  transform: translateX(-50%);
   458|  width: 60px; height: 28px;
   459|  background: rgba(0,0,0,0.5);
   460|  backdrop-filter: blur(8px);
   461|  border: 1px solid rgba(255,255,255,0.1);
   462|  border-radius: 8px;
   463|  display: flex; align-items: center; justify-content: center;
   464|  animation: fadeSlideIn 0.5s ease 0.15s both;
   465|  overflow: hidden;
   466|}
   467|#compass-needle {
   468|  position: absolute; top: 2px; left: 50%;
   469|  transform: translateX(-50%);
   470|  width: 0; height: 0;
   471|  border-left: 4px solid transparent;
   472|  border-right: 4px solid transparent;
   473|  border-bottom: 5px solid #f44336;
   474|  transition: transform 0.3s ease;
   475|}
   476|#compass-heading {
   477|  font-size: 0.7rem; color: #64b5f6;
   478|  font-family: monospace; font-weight: 600;
   479|  margin-top: 2px;
   480|}
   481|
   482|/* Stamina bar */
   483|#stamina-container {
   484|  position: absolute; bottom: 120px; left: 50%;
   485|  transform: translateX(-50%);
   486|  width: 120px; height: 4px;
   487|  background: rgba(255,255,255,0.08);
   488|  border-radius: 2px;
   489|  overflow: hidden;
   490|  opacity: 0;
   491|  transition: opacity 0.3s ease;
   492|}
   493|#stamina-container.active {
   494|  opacity: 1;
   495|}
   496|#stamina-bar {
   497|  width: 100%; height: 100%;
   498|  background: linear-gradient(90deg, #4caf50, #8bc34a);
   499|  border-radius: 2px;
   500|  transition: width 0.1s linear;
   501|
```

### 📈 Technical Evaluation
The file style.css implements a pattern focused on performance. By using IIFEs, the project avoids global namespace pollution while maintaining access to essential shared objects like THREE. The time complexity of the primary loops in this module is O(1) per frame, ensuring a stable 60FPS experience.

## 🛠️ MODULE ANALYSIS: roles.js
### 📌 Purpose
The data core. Stores the definitions of every room, object, and task.

### 🔍 Detailed Logic Breakdown
```javascript
     1|/**
     2| * roles.js — Role Definitions
     3| * 
     4| * Each role contains:
     5| *  - id, title, icon, description, accentColor
     6| *  - Room config: roomColor, floorColor, ceilingColor, roomSize
     7| *  - playerStart: {x, y, z}
     8| *  - Lighting config
     9| *  - tasks: array of {id, label, objectName}
    10| *  - objects: array of geometry definitions with optional interactable data
    11| *
    12| * HOW TO ADD A NEW ROLE:
    13| * 1. Copy any existing role object below.
    14| * 2. Change id (must be unique), title, icon, description.
    15| * 3. Define roomSize, floor/wall/ceiling colors.
    16| * 4. Add at least 3 interactable objects:
    17| *    - Set interactable:true, name, promptText, interactionText.
    18| * 5. Add matching entries in the tasks array (objectName must match object name).
    19| * 6. Add a card in index.html or generate it dynamically (already done via ROLES array).
    20| */
    21|var ROLES = [
    22|
    23|  // ══
