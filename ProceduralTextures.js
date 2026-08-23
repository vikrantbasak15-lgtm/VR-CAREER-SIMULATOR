/**
 * ProceduralTextures.js — Canvas-Based Procedural Texture Generator
 *
 * Generates realistic textures at runtime without external files.
 * Each texture type produces diffuse, normal, and roughness maps.
 *
 * Usage:
 *   var tex = new ProceduralTextures();
 *   var woodDiffuse = tex.generate('wood', { color: 0x5d4037, scale: 1.0 });
 *   var woodNormal  = tex.generateNormal('wood', { scale: 1.0 });
 *   var woodRough   = tex.generateRoughness('wood', { scale: 1.0 });
 *
 * Texture types:
 *   wood, concrete, tile, fabric, metalBrushed, metalPolished,
 *   noise, grid, linoleum, brick, marble, glass
 */

var ProceduralTextures = (function () {

  var SIZE = 256; // texture resolution (was 512 — 4x fewer pixels, same visual quality at runtime)

  // ─── Utility ────────────────────────────────────

  function createCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w || SIZE;
    c.height = h || SIZE;
    return c;
  }

  function canvasToTexture(canvas, repeat) {
    var tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (repeat) {
      tex.repeat.set(repeat[0], repeat[1]);
    }
    tex.needsUpdate = true;
    return tex;
  }

  // Simple hash-based noise
  function hash(x, y) {
    var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function noise2D(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y);
    var fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    var a = hash(ix, iy);
    var b = hash(ix + 1, iy);
    var c = hash(ix, iy + 1);
    var d = hash(ix + 1, iy + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  function fbm(x, y, octaves) {
    var val = 0, amp = 0.5, freq = 1;
    for (var i = 0; i < (octaves || 4); i++) {
      val += amp * noise2D(x * freq, y * freq);
      amp *= 0.5;
      freq *= 2.0;
    }
    return val;
  }

  function hexToRGB(hex) {
    return {
      r: (hex >> 16) & 255,
      g: (hex >> 8) & 255,
      b: hex & 255
    };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

  // ─── WOOD GRAIN ─────────────────────────────────

  function generateWood(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0x5d4037);
    var lightColor = hexToRGB(opts.lightColor || 0x8d6e63);
    var darkColor = hexToRGB(opts.darkColor || 0x3e2723);
    var scale = opts.scale || 1.0;
    var grainDensity = opts.grainDensity || 0.15;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Wood grain pattern — sine wave with noise distortion
        var grain = Math.sin((v * 40 + noise2D(u * 3, v * 3) * 4) * Math.PI);
        grain = grain * 0.5 + 0.5; // normalize to 0-1
        grain = Math.pow(grain, 0.8); // sharpen grain lines

        // Add fine grain noise
        var fine = fbm(u * 20, v * 2, 3) * grainDensity;

        // Knots (occasional dark spots)
        var knot = 0;
        var kx = noise2D(u * 0.5, v * 0.5) * 10;
        var ky = noise2D(u * 0.5 + 50, v * 0.5 + 50) * 10;
        var kd = Math.sqrt(Math.pow(u * 10 - kx, 2) + Math.pow(v * 10 - ky, 2));
        if (kd < 0.8) knot = (1 - kd / 0.8) * 0.3;

        // Color blending
        var t = clamp(grain + fine - knot, 0, 1);
        var r = Math.floor(lerp(darkColor.r, lightColor.r, t));
        var g = Math.floor(lerp(darkColor.g, lightColor.g, t));
        var b = Math.floor(lerp(darkColor.b, lightColor.b, t));

        // Slight color variation per pixel
        var nv = (noise2D(u * 50, v * 50) - 0.5) * 12;

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(r + nv, 0, 255);
        d[idx + 1] = clamp(g + nv, 0, 255);
        d[idx + 2] = clamp(b + nv, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── CONCRETE ───────────────────────────────────

  function generateConcrete(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0x808080);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Multi-octave noise for concrete surface
        var n1 = fbm(u * 8, v * 8, 5);
        var n2 = fbm(u * 16 + 100, v * 16 + 100, 3);

        // Aggregate pattern (small pebbles/aggregate)
        var agg = noise2D(u * 30, v * 30) > 0.65 ? 0.08 : 0;

        // Stains and discoloration
        var stain = fbm(u * 2 + 200, v * 2 + 200, 2) * 0.15;

        var val = clamp(baseColor.r / 255 + (n1 - 0.5) * 0.25 + n2 * 0.08 + agg - stain, 0, 1);

        // Slight warm/cool tint variation
        var tint = noise2D(u * 4, v * 4) * 0.05;

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(val * 255 + tint * 100, 0, 255);
        d[idx + 1] = clamp(val * 255 + tint * 50, 0, 255);
        d[idx + 2] = clamp(val * 255, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── TILE (Hospital/Lab) ────────────────────────

  function generateTile(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0xcfd8dc);
    var groutColor = hexToRGB(opts.groutColor || 0x9e9e9e);
    var tileSize = opts.tileSize || 8; // tiles per axis
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;
    var tw = w / tileSize, th = h / tileSize;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Tile grid
        var tx = (x % tw) / tw;
        var ty = (y % th) / th;
        var groutW = 0.03; // grout width as fraction of tile

        var isGrout = tx < groutW || tx > (1 - groutW) || ty < groutW || ty > (1 - groutW);

        var r, g, b;
        if (isGrout) {
          r = groutColor.r; g = groutColor.g; b = groutColor.b;
        } else {
          // Per-tile color variation
          var tileX = Math.floor(x / tw);
          var tileY = Math.floor(y / th);
          var tileVar = hash(tileX, tileY) * 0.12 - 0.06;

          // Surface noise on tile
          var sn = fbm(u * 15, v * 15, 3) * 0.05;

          r = clamp(baseColor.r + (tileVar + sn) * 255, 0, 255);
          g = clamp(baseColor.g + (tileVar + sn) * 255, 0, 255);
          b = clamp(baseColor.b + (tileVar + sn) * 255, 0, 255);

          // Slight bevel highlight at tile edges
          var edgeDist = Math.min(tx - groutW, (1 - groutW) - tx, ty - groutW, (1 - groutW) - ty);
          if (edgeDist < 0.05) {
            var bevel = (1 - edgeDist / 0.05) * 0.06;
            r = clamp(r + bevel * 255, 0, 255);
            g = clamp(g + bevel * 255, 0, 255);
            b = clamp(b + bevel * 255, 0, 255);
          }
        }

        var idx = (y * w + x) * 4;
        d[idx]     = r;
        d[idx + 1] = g;
        d[idx + 2] = b;
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── FABRIC ─────────────────────────────────────

  function generateFabric(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0x1565c0);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Woven fabric pattern (cross-hatch)
        var weaveX = Math.sin(u * 120) * 0.5 + 0.5;
        var weaveY = Math.sin(v * 120) * 0.5 + 0.5;
        var weave = (Math.floor(u * 60) + Math.floor(v * 60)) % 2 === 0 ?
          weaveX * 0.7 + weaveY * 0.3 : weaveY * 0.7 + weaveX * 0.3;

        // Larger fabric folds/variation
        var fold = fbm(u * 3, v * 3, 2) * 0.12;

        // Fine noise for thread texture
        var fine = noise2D(u * 80, v * 80) * 0.06;

        var val = clamp(weave * 0.15 + fold + fine, -0.1, 0.15);

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(baseColor.r + val * 255, 0, 255);
        d[idx + 1] = clamp(baseColor.g + val * 255, 0, 255);
        d[idx + 2] = clamp(baseColor.b + val * 255, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── METAL BRUSHED ──────────────────────────────

  function generateMetalBrushed(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0xbdbdbd);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Brushed lines (horizontal)
        var brush = Math.sin(u * 200 + noise2D(u * 5, v * 5) * 3) * 0.5 + 0.5;
        brush = Math.pow(brush, 3); // sharpen the lines

        // Subtle noise
        var n = noise2D(u * 40, v * 40) * 0.04;

        // Color bands (anodized metal look)
        var band = Math.sin(v * 20) * 0.03;

        var val = clamp(brush * 0.08 + n + band, -0.05, 0.1);

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(baseColor.r + val * 255, 0, 255);
        d[idx + 1] = clamp(baseColor.g + val * 255, 0, 255);
        d[idx + 2] = clamp(baseColor.b + val * 255, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── METAL POLISHED (Chrome) ────────────────────

  function generateMetalPolished(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0xe0e0e0);

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w;
        var v = y / h;

        // Very subtle variation — polished metal is nearly uniform
        var n = noise2D(u * 60, v * 60) * 0.03;
        // Environmental reflection hint (gradient)
        var env = v * 0.04;

        var val = n + env;

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(baseColor.r + val * 255, 0, 255);
        d[idx + 1] = clamp(baseColor.g + val * 255, 0, 255);
        d[idx + 2] = clamp(baseColor.b + val * 255, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── NOISE (Generic Surface) ────────────────────

  function generateNoise(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0x888888);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;
        var n = fbm(u * 10, v * 10, 5) * 0.3 - 0.15;

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(baseColor.r + n * 255, 0, 255);
        d[idx + 1] = clamp(baseColor.g + n * 255, 0, 255);
        d[idx + 2] = clamp(baseColor.b + n * 255, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── LINOLEUM (Hospital Floor) ──────────────────

  function generateLinoleum(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0x80cbc4);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Smooth surface with subtle marbling
        var marble = Math.sin(u * 5 + fbm(u * 3, v * 3, 3) * 4) * 0.5 + 0.5;
        var n = noise2D(u * 20, v * 20) * 0.04;

        var val = clamp((marble - 0.5) * 0.08 + n, -0.05, 0.08);

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(baseColor.r + val * 255, 0, 255);
        d[idx + 1] = clamp(baseColor.g + val * 255, 0, 255);
        d[idx + 2] = clamp(baseColor.b + val * 255, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── BRICK ──────────────────────────────────────

  function generateBrick(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var brickColor = hexToRGB(opts.color || 0x8d6e63);
    var mortarColor = hexToRGB(opts.mortarColor || 0x9e9e9e);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;
    var brickW = w / 4;
    var brickH = h / 8;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Offset every other row
        var row = Math.floor(y / brickH);
        var offsetX = (row % 2) * brickW * 0.5;
        var bx = (x + offsetX) % brickW;
        var mortarW = 3;

        var isMortar = bx < mortarW || (y % brickH) < mortarW;

        var r, g, b;
        if (isMortar) {
          r = mortarColor.r; g = mortarColor.g; b = mortarColor.b;
        } else {
          // Per-brick color variation
          var brickX = Math.floor((x + offsetX) / brickW);
          var bv = hash(brickX, row) * 0.2 - 0.1;
          var sn = noise2D(u * 30, v * 30) * 0.06;

          r = clamp(brickColor.r + (bv + sn) * 255, 0, 255);
          g = clamp(brickColor.g + (bv + sn) * 255, 0, 255);
          b = clamp(brickColor.b + (bv + sn) * 255, 0, 255);
        }

        var idx = (y * w + x) * 4;
        d[idx]     = r;
        d[idx + 1] = g;
        d[idx + 2] = b;
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── MARBLE ─────────────────────────────────────

  function generateMarble(opts) {
    opts = opts || {};
    var canvas = createCanvas();
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var baseColor = hexToRGB(opts.color || 0xfafafa);
    var veinColor = hexToRGB(opts.veinColor || 0xbdbdbd);
    var scale = opts.scale || 1.0;

    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w * scale;
        var v = y / h * scale;

        // Marble veins via distorted sine
        var vein = Math.sin(u * 8 + fbm(u * 4, v * 4, 5) * 6);
        vein = Math.pow(Math.abs(vein), 0.5);
        vein = clamp(1 - vein, 0, 1);

        // Surface variation
        var n = fbm(u * 6, v * 6, 4) * 0.06;

        var t = clamp(vein * 0.15 + n, 0, 1);

        var idx = (y * w + x) * 4;
        d[idx]     = clamp(lerp(baseColor.r, veinColor.r, t) + n * 100, 0, 255);
        d[idx + 1] = clamp(lerp(baseColor.g, veinColor.g, t) + n * 100, 0, 255);
        d[idx + 2] = clamp(lerp(baseColor.b, veinColor.b, t) + n * 100, 0, 255);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── NORMAL MAP GENERATOR ───────────────────────

  function generateNormalFromDiffuse(diffuseCanvas, strength) {
    strength = strength || 2.0;
    var w = diffuseCanvas.width, h = diffuseCanvas.height;
    var canvas = createCanvas(w, h);
    var ctx = canvas.getContext('2d');

    var srcCtx = diffuseCanvas.getContext('2d');
    var srcData = srcCtx.getImageData(0, 0, w, h).data;
    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;

    // Pre-compute luminance array for fast access (avoids repeated RGB math)
    var lum = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) {
      lum[i] = (srcData[i * 4] + srcData[i * 4 + 1] + srcData[i * 4 + 2]) / (255 * 3);
    }

    for (var y = 0; y < h; y++) {
      var yw = y * w;
      for (var x = 0; x < w; x++) {
        var left  = lum[yw + ((x - 1 + w) % w)];
        var right = lum[yw + ((x + 1) % w)];
        var up    = lum[((y - 1 + h) % h) * w + x];
        var down  = lum[((y + 1) % h) * w + x];

        var dx = (left - right) * strength;
        var dy = (up - down) * strength;
        var invLen = 1.0 / Math.sqrt(dx * dx + dy * dy + 1.0);
        dx *= invLen; dy *= invLen;

        var idx = (yw + x) * 4;
        d[idx]     = (dx * 0.5 + 0.5) * 255 | 0;
        d[idx + 1] = (dy * 0.5 + 0.5) * 255 | 0;
        d[idx + 2] = 191; // dz ~0.75 mapped to 255*0.75
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── ROUGHNESS MAP GENERATOR ────────────────────

  function generateRoughnessFromDiffuse(diffuseCanvas, baseRoughness) {
    baseRoughness = baseRoughness || 0.7;
    var w = diffuseCanvas.width, h = diffuseCanvas.height;
    var canvas = createCanvas(w, h);
    var ctx = canvas.getContext('2d');

    var srcCtx = diffuseCanvas.getContext('2d');
    var srcData = srcCtx.getImageData(0, 0, w, h).data;
    var imgData = ctx.createImageData(w, h);
    var d = imgData.data;
    var scale = 0.2 * 255;
    var base255 = baseRoughness * 255;

    for (var i = 0, len = w * h; i < len; i++) {
      var idx = i * 4;
      var lum = (srcData[idx] + srcData[idx + 1] + srcData[idx + 2]) / 765;
      var val = clamp(base255 + (lum - 0.5) * scale, 0, 255) | 0;
      d[idx] = val; d[idx + 1] = val; d[idx + 2] = val; d[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ─── PUBLIC API ─────────────────────────────────

  var generators = {
    wood: generateWood,
    concrete: generateConcrete,
    tile: generateTile,
    fabric: generateFabric,
    metalBrushed: generateMetalBrushed,
    metalPolished: generateMetalPolished,
    noise: generateNoise,
    linoleum: generateLinoleum,
    brick: generateBrick,
    marble: generateMarble
  };

  function ProceduralTextures() {
    this._cache = {};
  }

  ProceduralTextures.prototype.generate = function (type, opts) {
    var key = type + '_' + JSON.stringify(opts || {});
    if (this._cache[key]) return this._cache[key];
    var gen = generators[type];
    if (!gen) { console.warn('Unknown texture type: ' + type); return null; }
    var canvas = gen(opts);
    var tex = canvasToTexture(canvas, opts && opts.repeat);
    this._cache[key] = tex;
    return tex;
  };

  ProceduralTextures.prototype.generateNormal = function (type, opts, strength) {
    var key = 'n_' + type + '_' + JSON.stringify(opts || {}) + '_' + (strength || 2.0);
    if (this._cache[key]) return this._cache[key];
    var diffuse = generators[type] ? generators[type](opts) : null;
    if (!diffuse) return null;
    var normalCanvas = generateNormalFromDiffuse(diffuse, strength || 2.0);
    var tex = canvasToTexture(normalCanvas, opts && opts.repeat);
    this._cache[key] = tex;
    return tex;
  };

  ProceduralTextures.prototype.generateRoughness = function (type, opts, baseRoughness) {
    var key = 'r_' + type + '_' + JSON.stringify(opts || {}) + '_' + (baseRoughness || 0.7);
    if (this._cache[key]) return this._cache[key];
    var diffuse = generators[type] ? generators[type](opts) : null;
    if (!diffuse) return null;
    var roughCanvas = generateRoughnessFromDiffuse(diffuse, baseRoughness || 0.7);
    var tex = canvasToTexture(roughCanvas, opts && opts.repeat);
    this._cache[key] = tex;
    return tex;
  };

  ProceduralTextures.prototype.dispose = function () {
    var keys = Object.keys(this._cache);
    for (var i = 0; i < keys.length; i++) {
      if (this._cache[keys[i]]) this._cache[keys[i]].dispose();
    }
    this._cache = {};
  };

  return ProceduralTextures;

})();
