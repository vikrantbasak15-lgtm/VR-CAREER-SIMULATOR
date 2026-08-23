/**
 * CanvasTextures.js — Animated Canvas Textures (Masterpiece Edition)
 *
 * Creates live-updating CanvasTexture objects for monitors, displays, etc.
 * 9 screen types: heartrate, oscilloscope, radar, crt, gauge, equalizer, compass, map, code.
 *
 * Usage:
 *   var screens = new CanvasTextureManager();
 *   var tex = screens.create('equalizer', { width: 256, height: 128 });
 *   screens.update();  // call each frame
 *   screens.dispose();
 */

var CanvasTextureManager = (function () {

  function CanvasTextureManager() {
    this._textures = [];
    this._frameCount = 0;
  }

  CanvasTextureManager.prototype.create = function (type, opts) {
    opts = opts || {};
    var w = opts.width || 256;
    var h = opts.height || 128;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');

    var texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    var entry = { canvas: canvas, ctx: ctx, texture: texture, type: type, w: w, h: h, time: Math.random() * 100 };
    this._textures.push(entry);
    this._draw(entry);
    return texture;
  };

  CanvasTextureManager.prototype.update = function () {
    this._frameCount++;
    if (this._frameCount % 3 !== 0) return;
    for (var i = 0; i < this._textures.length; i++) {
      var e = this._textures[i];
      e.time += 0.1;
      this._draw(e);
      e.texture.needsUpdate = true;
    }
  };

  CanvasTextureManager.prototype._draw = function (e) {
    switch (e.type) {
      case 'heartrate':   this._drawHeartRate(e); break;
      case 'oscilloscope': this._drawOscilloscope(e); break;
      case 'radar':       this._drawRadar(e); break;
      case 'crt':         this._drawCRT(e); break;
      case 'gauge':       this._drawGauge(e); break;
      case 'equalizer':   this._drawEqualizer(e); break;
      case 'compass':     this._drawCompass(e); break;
      case 'map':         this._drawMap(e); break;
      case 'code':        this._drawCode(e); break;
      default:            this._drawCRT(e); break;
    }
  };

  // ─── Heart Rate Monitor (enhanced) ────────────────
  CanvasTextureManager.prototype._drawHeartRate = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    // Background with subtle gradient
    var grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(1, '#0d1f3c');
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);

    // Grid lines
    c.strokeStyle = 'rgba(30, 60, 90, 0.4)';
    c.lineWidth = 0.5;
    for (var y = 0; y < h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    for (var x = 0; x < w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }

    // ECG waveform with glow
    c.strokeStyle = '#4caf50';
    c.lineWidth = 2.5;
    c.shadowColor = '#4caf50';
    c.shadowBlur = 8;
    c.beginPath();
    var ecgPhase = t * 3.0;
    for (var px = 0; px < w; px++) {
      var pp = (px / w * 6.28 + ecgPhase) % 6.28;
      var y = h / 2 + 5;
      // P wave
      if (pp > 0.3 && pp < 0.7) y += Math.sin((pp - 0.3) / 0.4 * Math.PI) * 6;
      // QRS complex
      if (pp > 0.9 && pp < 1.0)  y -= 5;
      if (pp > 1.0 && pp < 1.15) y += 30;
      if (pp > 1.15 && pp < 1.3) y -= 16;
      // T wave
      if (pp > 1.6 && pp < 2.1)  y += Math.sin((pp - 1.6) / 0.5 * Math.PI) * 8;
      if (px === 0) c.moveTo(px, y); else c.lineTo(px, y);
    }
    c.stroke();
    c.shadowBlur = 0;

    // Second trace (fainter, respiration)
    c.strokeStyle = 'rgba(33, 150, 243, 0.4)';
    c.lineWidth = 1;
    c.beginPath();
    for (var px2 = 0; px2 < w; px2++) {
      var respY = h * 0.85 + Math.sin(px2 * 0.02 + t * 0.8) * 8;
      if (px2 === 0) c.moveTo(px2, respY); else c.lineTo(px2, respY);
    }
    c.stroke();

    // Heart icon
    c.fillStyle = '#f44336';
    c.font = 'bold 14px monospace';
    c.shadowColor = '#f44336';
    c.shadowBlur = 4;
    c.fillText('\u2665 92 BPM', 8, 18);

    // SpO2
    c.fillStyle = '#2196f3';
    c.shadowColor = '#2196f3';
    c.fillText('SpO\u2082 97%', w - 80, 18);

    // Time stamp
    c.shadowBlur = 0;
    c.fillStyle = '#556';
    c.font = '9px monospace';
    c.fillText(new Date().toLocaleTimeString(), w - 70, h - 6);
  };

  // ─── Oscilloscope (enhanced) ──────────────────────
  CanvasTextureManager.prototype._drawOscilloscope = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    c.fillStyle = '#0d1117';
    c.fillRect(0, 0, w, h);

    // Grid
    c.strokeStyle = 'rgba(40, 80, 60, 0.3)';
    c.lineWidth = 0.5;
    for (var y = 0; y < h; y += 12.8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    for (var x = 0; x < w; x += 12.8) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }

    // Channel 1 — yellow sine with glow
    c.strokeStyle = '#ffeb3b';
    c.lineWidth = 1.5;
    c.shadowColor = '#ffeb3b';
    c.shadowBlur = 6;
    c.beginPath();
    for (var px = 0; px < w; px++) {
      var y = h * 0.3 + Math.sin(px * 0.05 + t * 2) * 20 + Math.sin(px * 0.02 + t * 0.7) * 5;
      if (px === 0) c.moveTo(px, y); else c.lineTo(px, y);
    }
    c.stroke();

    // Channel 2 — cyan square-ish with overshoot
    c.strokeStyle = '#00e5ff';
    c.shadowColor = '#00e5ff';
    c.beginPath();
    for (var px2 = 0; px2 < w; px2++) {
      var val = Math.sin(px2 * 0.03 + t * 1.5);
      var y2 = h * 0.7 + (val > 0 ? -15 : 15);
      // Add slight ringing
      var ring = Math.sin(px2 * 0.15 + t * 1.5) * 2;
      y2 += (Math.abs(val) < 0.05 ? ring : 0);
      if (px2 === 0) c.moveTo(px2, y2); else c.lineTo(px2, y2);
    }
    c.stroke();
    c.shadowBlur = 0;

    // Labels
    c.fillStyle = '#ffeb3b'; c.font = '10px monospace'; c.fillText('CH1 100mV/div', 5, 12);
    c.fillStyle = '#00e5ff'; c.fillText('CH2 50mV/div', 5, h - 5);
    c.fillStyle = '#666'; c.font = '8px monospace';
    c.fillText('T: 10\u00b5s/div', w - 60, 12);
  };

  // ─── Radar sweep (enhanced) ───────────────────────
  CanvasTextureManager.prototype._drawRadar = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    var cx = w / 2, cy = h / 2, r = Math.min(cx, cy) - 4;

    c.fillStyle = '#0a1a0a';
    c.fillRect(0, 0, w, h);

    // Outer ring glow
    c.strokeStyle = 'rgba(50, 200, 50, 0.15)';
    c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();

    // Rings
    c.strokeStyle = 'rgba(50, 200, 50, 0.25)';
    c.lineWidth = 0.5;
    for (var i = 1; i <= 4; i++) {
      c.beginPath(); c.arc(cx, cy, r * i / 4, 0, Math.PI * 2); c.stroke();
    }

    // Cross hairs
    c.strokeStyle = 'rgba(50, 200, 50, 0.15)';
    c.beginPath(); c.moveTo(cx, cy - r); c.lineTo(cx, cy + r); c.stroke();
    c.beginPath(); c.moveTo(cx - r, cy); c.lineTo(cx + r, cy); c.stroke();

    // Sweep
    var angle = (t * 0.8) % (Math.PI * 2);
    c.strokeStyle = '#4caf50';
    c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(cx, cy);
    c.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    c.stroke();

    // Sweep trail
    c.strokeStyle = 'rgba(76, 175, 80, 0.25)';
    c.lineWidth = 4;
    c.beginPath(); c.arc(cx, cy, r * 0.85, angle - 0.6, angle); c.stroke();

    // Blips
    c.fillStyle = '#4caf50';
    c.shadowColor = '#4caf50';
    c.shadowBlur = 8;
    var blips = [[0.3, -0.4], [-0.5, 0.2], [0.1, 0.6], [-0.2, -0.3], [0.4, 0.1], [-0.1, -0.5]];
    for (var b = 0; b < blips.length; b++) {
      var bx = cx + blips[b][0] * r;
      var by = cy + blips[b][1] * r;
      var blipAngle = Math.atan2(by - cy, bx - cx);
      var angleDiff = ((angle - blipAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      if (angleDiff > -0.6 && angleDiff < 0) {
        var fade = 1.0 + angleDiff / 0.6;
        c.globalAlpha = fade;
        c.beginPath(); c.arc(bx, by, 3, 0, Math.PI * 2); c.fill();
        // Blip echo ring
        c.globalAlpha = fade * 0.3;
        c.beginPath(); c.arc(bx, by, 6, 0, Math.PI * 2); c.stroke();
      }
    }
    c.globalAlpha = 1;
    c.shadowBlur = 0;

    // Range label
    c.fillStyle = '#4caf50'; c.font = '8px monospace';
    c.fillText('160nm', 4, h - 4);
  };

  // ─── CRT scanline screen (enhanced) ───────────────
  CanvasTextureManager.prototype._drawCRT = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;

    // Dark background with slight noise
    c.fillStyle = '#0d1117';
    c.fillRect(0, 0, w, h);

    // Scanline sweep
    var scanY = (t * 30) % h;
    c.fillStyle = 'rgba(100, 200, 255, 0.06)';
    c.fillRect(0, scanY - 2, w, 4);

    // Secondary scan line
    var scanY2 = (t * 15 + h * 0.5) % h;
    c.fillStyle = 'rgba(100, 200, 255, 0.03)';
    c.fillRect(0, scanY2 - 1, w, 2);

    // Text
    c.fillStyle = '#64b5f6';
    c.font = '11px monospace';
    var lines = ['SYS STATUS: NOMINAL', 'CPU: 23%  RAM: 41%', 'NET: 1.2 Gbps  UPT: 47d', 'TEMP: 42\u00b0C  FAN: 1200RPM'];
    for (var i = 0; i < lines.length; i++) {
      var flicker = Math.sin(t * 2 + i) > -0.8 ? 1 : 0.3;
      c.globalAlpha = flicker;
      c.fillText(lines[i], 8, 18 + i * 18);
    }
    c.globalAlpha = 1;

    // Horizontal lines (scanlines)
    c.strokeStyle = 'rgba(100, 200, 255, 0.08)';
    c.lineWidth = 0.5;
    for (var y = 0; y < h; y += 3) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
    }

    // Cursor blink
    if (Math.sin(t * 4) > 0) {
      c.fillStyle = '#64b5f6';
      c.fillRect(8 + lines[lines.length - 1].length * 6.5, 18 + (lines.length - 1) * 18 - 10, 7, 12);
    }
  };

  // ─── Gauge / dial (enhanced) ──────────────────────
  CanvasTextureManager.prototype._drawGauge = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    var cx = w / 2, cy = h / 2 + 10, r = Math.min(cx, cy) - 12;

    c.fillStyle = '#0d1117';
    c.fillRect(0, 0, w, h);

    // Tick marks
    c.strokeStyle = 'rgba(255,255,255,0.15)';
    c.lineWidth = 1;
    for (var i = 0; i <= 10; i++) {
      var angle = Math.PI * 0.8 + (i / 10) * Math.PI * 1.4;
      var inner = i % 5 === 0 ? r - 10 : r - 6;
      c.beginPath();
      c.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      c.lineTo(cx + Math.cos(angle) * (r - 2), cy + Math.sin(angle) * (r - 2));
      c.stroke();
    }

    // Arc background
    c.strokeStyle = 'rgba(255,255,255,0.1)';
    c.lineWidth = 6;
    c.beginPath(); c.arc(cx, cy, r, Math.PI * 0.8, Math.PI * 2.2); c.stroke();

    // Value arc with gradient
    var val = 0.5 + Math.sin(t * 0.5) * 0.3;
    c.strokeStyle = val > 0.7 ? '#ff5252' : val > 0.5 ? '#ffb74d' : '#4caf50';
    c.shadowColor = c.strokeStyle;
    c.shadowBlur = 10;
    c.lineWidth = 6;
    c.beginPath(); c.arc(cx, cy, r, Math.PI * 0.8, Math.PI * 0.8 + val * Math.PI * 1.4); c.stroke();
    c.shadowBlur = 0;

    // Needle
    var needleAngle = Math.PI * 0.8 + val * Math.PI * 1.4;
    c.strokeStyle = '#ff5252';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(cx, cy);
    c.lineTo(cx + Math.cos(needleAngle) * (r - 8), cy + Math.sin(needleAngle) * (r - 8));
    c.stroke();

    // Center cap
    c.fillStyle = '#333';
    c.beginPath(); c.arc(cx, cy, 4, 0, Math.PI * 2); c.fill();

    // Value text
    c.fillStyle = '#fff'; c.font = 'bold 16px monospace'; c.textAlign = 'center';
    c.fillText(Math.round(val * 100) + '%', cx, cy + 4);
    c.font = '8px monospace'; c.fillStyle = '#666';
    c.fillText('HEADING', cx, cy + 18);
    c.textAlign = 'left';
  };

  // ─── Equalizer (NEW) ──────────────────────────────
  CanvasTextureManager.prototype._drawEqualizer = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    c.fillStyle = '#0a0a1a';
    c.fillRect(0, 0, w, h);

    var bars = 16;
    var barW = (w - 16) / bars;
    var barGap = 2;

    for (var i = 0; i < bars; i++) {
      // Simulate audio frequency response
      var freq = Math.sin(t * 2 + i * 0.7) * 0.4 +
                 Math.sin(t * 3.3 + i * 1.1) * 0.3 +
                 Math.sin(t * 1.5 + i * 0.3) * 0.2 +
                 0.5;
      freq = Math.max(0.05, Math.min(1, freq));

      var barH = freq * (h - 20);
      var x = 8 + i * barW;
      var y = h - 10 - barH;

      // Gradient bar
      var grad = c.createLinearGradient(x, y, x, h - 10);
      grad.addColorStop(0, freq > 0.8 ? '#ff5252' : '#4caf50');
      grad.addColorStop(0.5, freq > 0.8 ? '#ff8a65' : '#81c784');
      grad.addColorStop(1, '#1b5e20');
      c.fillStyle = grad;
      c.shadowColor = freq > 0.8 ? '#ff5252' : '#4caf50';
      c.shadowBlur = freq > 0.8 ? 6 : 3;
      c.fillRect(x, y, barW - barGap, barH);

      // Peak dot
      c.fillStyle = '#fff';
      c.fillRect(x, y - 3, barW - barGap, 2);
    }

    c.shadowBlur = 0;
    // Labels
    c.fillStyle = '#4caf50'; c.font = '9px monospace';
    c.fillText('SPECTRUM ANALYZER', 8, 12);
    c.fillStyle = '#555'; c.font = '7px monospace';
    c.fillText('60Hz', 8, h - 2);
    c.fillText('20kHz', w - 35, h - 2);
  };

  // ─── Compass (NEW) ────────────────────────────────
  CanvasTextureManager.prototype._drawCompass = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    var cx = w / 2, cy = h / 2, r = Math.min(cx, cy) - 6;

    c.fillStyle = '#0a0f1a';
    c.fillRect(0, 0, w, h);

    // Outer ring
    c.strokeStyle = 'rgba(100, 181, 246, 0.3)';
    c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();

    // Inner ring
    c.strokeStyle = 'rgba(100, 181, 246, 0.15)';
    c.lineWidth = 1;
    c.beginPath(); c.arc(cx, cy, r * 0.7, 0, Math.PI * 2); c.stroke();

    // Rotating compass rose
    var heading = (t * 15) % 360; // slow rotation

    // Tick marks (every 30 degrees)
    c.strokeStyle = 'rgba(100, 181, 246, 0.4)';
    c.lineWidth = 1;
    for (var i = 0; i < 12; i++) {
      var angle = (i * 30 - heading) * Math.PI / 180;
      var inner = i % 3 === 0 ? r * 0.75 : r * 0.85;
      c.beginPath();
      c.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      c.lineTo(cx + Math.cos(angle) * (r - 2), cy + Math.sin(angle) * (r - 2));
      c.stroke();
    }

    // Cardinal directions
    c.fillStyle = '#64b5f6'; c.font = 'bold 12px monospace'; c.textAlign = 'center';
    var dirs = ['N', 'E', 'S', 'W'];
    for (var d = 0; d < 4; d++) {
      var da = (d * 90 - heading) * Math.PI / 180;
      var dr = r * 0.62;
      c.fillText(dirs[d], cx + Math.cos(da) * dr, cy + Math.sin(da) * dr + 4);
    }

    // Heading pointer (red triangle)
    c.fillStyle = '#f44336';
    c.beginPath();
    c.moveTo(cx, cy - r * 0.5);
    c.lineTo(cx - 5, cy - r * 0.35);
    c.lineTo(cx + 5, cy - r * 0.35);
    c.closePath();
    c.fill();

    // Center dot
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(cx, cy, 3, 0, Math.PI * 2); c.fill();

    // Digital readout
    c.fillStyle = '#64b5f6'; c.font = 'bold 10px monospace';
    c.fillText(Math.round(heading) + '\u00b0', cx, h - 4);
    c.textAlign = 'left';
  };

  // ─── Map (NEW) ────────────────────────────────────
  CanvasTextureManager.prototype._drawMap = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    c.fillStyle = '#0d1b2a';
    c.fillRect(0, 0, w, h);

    // Grid
    c.strokeStyle = 'rgba(50, 100, 150, 0.2)';
    c.lineWidth = 0.5;
    for (var y = 0; y < h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    for (var x = 0; x < w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }

    // Simulated terrain contours
    c.strokeStyle = 'rgba(76, 175, 80, 0.25)';
    c.lineWidth = 0.8;
    for (var ci = 0; ci < 5; ci++) {
      c.beginPath();
      for (var px = 0; px < w; px += 3) {
        var cy = h * 0.3 + ci * 15 + Math.sin(px * 0.03 + ci * 0.5 + t * 0.1) * 10;
        if (px === 0) c.moveTo(px, cy); else c.lineTo(px, cy);
      }
      c.stroke();
    }

    // Route line (animated)
    c.strokeStyle = '#ff9800';
    c.lineWidth = 2;
    c.shadowColor = '#ff9800';
    c.shadowBlur = 4;
    c.setLineDash([4, 4]);
    c.lineDashOffset = -t * 10;
    c.beginPath();
    c.moveTo(w * 0.1, h * 0.7);
    c.quadraticCurveTo(w * 0.3, h * 0.2, w * 0.5, h * 0.5);
    c.quadraticCurveTo(w * 0.7, h * 0.8, w * 0.9, h * 0.3);
    c.stroke();
    c.setLineDash([]);
    c.shadowBlur = 0;

    // Waypoints
    var waypoints = [[0.1, 0.7], [0.3, 0.3], [0.5, 0.5], [0.7, 0.75], [0.9, 0.3]];
    for (var wp = 0; wp < waypoints.length; wp++) {
      var wpx = w * waypoints[wp][0];
      var wpy = h * waypoints[wp][1];
      var pulse = Math.sin(t * 3 + wp) * 0.3 + 0.7;
      c.fillStyle = wp === 0 ? '#4caf50' : wp === waypoints.length - 1 ? '#f44336' : '#ff9800';
      c.globalAlpha = pulse;
      c.beginPath(); c.arc(wpx, wpy, 3, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    }

    // Current position (blinking)
    var posPhase = (t * 2) % 2;
    var posAlpha = posPhase < 1.5 ? 1 : 0.3;
    c.fillStyle = '#4fc3f7';
    c.globalAlpha = posAlpha;
    c.beginPath(); c.arc(w * 0.5, h * 0.5, 4, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;

    // Labels
    c.fillStyle = '#4caf50'; c.font = '8px monospace';
    c.fillText('START', w * 0.1 - 5, h * 0.7 - 8);
    c.fillStyle = '#f44336';
    c.fillText('DEST', w * 0.9 - 5, h * 0.3 - 8);
  };

  // ─── Code (NEW) ───────────────────────────────────
  CanvasTextureManager.prototype._drawCode = function (e) {
    var c = e.ctx, w = e.w, h = e.h, t = e.time;
    c.fillStyle = '#1e1e2e';
    c.fillRect(0, 0, w, h);

    // Line numbers
    c.fillStyle = '#555';
    c.font = '9px monospace';
    var lineCount = Math.floor(h / 12);
    for (var i = 0; i < lineCount; i++) {
      c.fillText(String(i + 1).padStart(3), 4, 10 + i * 12);
    }

    // Code lines with syntax highlighting
    var keywords = ['function', 'var', 'const', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this'];
    var codeLines = [
      'function initScene() {',
      '  const scene = new Scene();',
      '  var camera = new Camera(70);',
      '  const light = new Light(0xffffff);',
      '  scene.add(camera);',
      '  scene.add(light);',
      '  for (var i = 0; i < 100; i++) {',
      '    const obj = new Mesh();',
      '    obj.position.set(i, 0, 0);',
      '    scene.add(obj);',
      '  }',
      '  return scene;',
      '}',
      '',
      'function animate() {',
      '  requestAnimationFrame(animate);',
      '  if (this.running) {',
      '    camera.update();',
      '    renderer.render(scene);',
      '  }',
      '}',
      'initScene();'
    ];

    var scrollOffset = Math.floor(t * 0.5) % codeLines.length;
    c.font = '9px monospace';
    for (var cl = 0; cl < Math.min(lineCount, codeLines.length); cl++) {
      var lineIdx = (cl + scrollOffset) % codeLines.length;
      var line = codeLines[lineIdx];
      var ly = 10 + cl * 12;

      // Syntax highlight
      var words = line.split(' ');
      var lx = 22;
      for (var w2 = 0; w2 < words.length; w2++) {
        var word = words[w2];
        if (keywords.indexOf(word) !== -1) {
          c.fillStyle = '#c792ea'; // keyword
        } else if (word.indexOf('\"') !== -1 || word.indexOf("'") !== -1) {
          c.fillStyle = '#c3e88d'; // string
        } else if (word.indexOf('(') !== -1 || word.indexOf(')') !== -1) {
          c.fillStyle = '#82aaff'; // function
        } else if (!isNaN(word)) {
          c.fillStyle = '#f78c6c'; // number
        } else if (word === '{' || word === '}' || word === ';' || word === '()') {
          c.fillStyle = '#89ddff'; // punctuation
        } else {
          c.fillStyle = '#a6accd'; // default
        }
        c.fillText(word + ' ', lx, ly);
        lx += c.measureText(word + ' ').width;
      }
    }

    // Active line highlight
    var activeLine = Math.floor(t * 2) % lineCount;
    c.fillStyle = 'rgba(100, 181, 246, 0.05)';
    c.fillRect(0, activeLine * 12, w, 12);

    // Cursor blink
    if (Math.sin(t * 5) > 0) {
      c.fillStyle = '#64b5f6';
      c.fillRect(22, activeLine * 12 + 2, 6, 10);
    }
  };

  CanvasTextureManager.prototype.dispose = function () {
    for (var i = 0; i < this._textures.length; i++) {
      this._textures[i].texture.dispose();
    }
    this._textures = [];
  };

  return CanvasTextureManager;

})();
