/**
 * Particles.js — Enhanced Particle System (Masterpiece Edition)
 *
 * THREE.Points-based particles driven by sine offsets (no physics engine).
 * Supports presets: 'dust', 'steam', 'sparks', 'firefly', 'sparkle', 'smoke', 'confetti'.
 * Features: per-particle color variation, size variation, directional movement.
 *
 * Usage:
 *   var ps = new ParticleSystem(scene, {
 *     preset: 'firefly', count: 80,
 *     bounds: {x:10, y:4, z:10}, origin: {x:0, y:2, z:0}
 *   });
 *   ps.update(dt);   // call each frame
 *   ps.dispose();    // cleanup
 *   ps.setVisible(bool);
 */

var ParticleSystem = (function () {

  var PRESETS = {
    dust: {
      color: 0xffffee,
      size: 0.04,
      opacity: 0.35,
      speed: 0.15,
      drift: 0.08,
      fadeIn: 0.02,
      fadeOut: 0.02,
      emissive: 0x000000,
      emissiveIntensity: 0,
      sizeVar: 0.02,
      colorVar: 0.1
    },
    steam: {
      color: 0xffffff,
      size: 0.12,
      opacity: 0.2,
      speed: 0.6,
      drift: 0.2,
      fadeIn: 0.05,
      fadeOut: 0.15,
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
      sizeVar: 0.05,
      colorVar: 0.0
    },
    sparks: {
      color: 0xffaa44,
      size: 0.03,
      opacity: 0.8,
      speed: 1.5,
      drift: 0.4,
      fadeIn: 0.01,
      fadeOut: 0.08,
      emissive: 0xff8800,
      emissiveIntensity: 1.0,
      sizeVar: 0.02,
      colorVar: 0.15
    },
    firefly: {
      color: 0xffff44,
      size: 0.06,
      opacity: 0.9,
      speed: 0.3,
      drift: 0.5,
      fadeIn: 0.1,
      fadeOut: 0.1,
      emissive: 0xffff00,
      emissiveIntensity: 1.5,
      sizeVar: 0.03,
      colorVar: 0.2
    },
    sparkle: {
      color: 0xffffff,
      size: 0.035,
      opacity: 0.9,
      speed: 0.1,
      drift: 0.3,
      fadeIn: 0.01,
      fadeOut: 0.05,
      emissive: 0xffffff,
      emissiveIntensity: 2.0,
      sizeVar: 0.025,
      colorVar: 0.3
    },
    smoke: {
      color: 0x888888,
      size: 0.15,
      opacity: 0.15,
      speed: 0.4,
      drift: 0.15,
      fadeIn: 0.08,
      fadeOut: 0.2,
      emissive: 0x444444,
      emissiveIntensity: 0.2,
      sizeVar: 0.06,
      colorVar: 0.05
    },
    confetti: {
      color: 0xff4444,
      size: 0.05,
      opacity: 0.85,
      speed: 0.8,
      drift: 0.6,
      fadeIn: 0.01,
      fadeOut: 0.1,
      emissive: 0x000000,
      emissiveIntensity: 0,
      sizeVar: 0.02,
      colorVar: 0.5
    }
  };

  // Color palette for confetti
  var CONFETTI_COLORS = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff, 0xff8800, 0x88ff00];

  function ParticleSystem(scene, opts) {
    opts = opts || {};
    var preset = PRESETS[opts.preset] || PRESETS.dust;
    this._scene = scene;
    this._count = opts.count || 150;
    this._bounds = opts.bounds || { x: 8, y: 3, z: 8 };
    this._origin = opts.origin || { x: 0, y: 1.5, z: 0 };
    this._preset = preset;
    this._active = true;

    // Particle data
    this._positions = new Float32Array(this._count * 3);
    this._velocities = new Float32Array(this._count * 3);
    this._lifetimes = new Float32Array(this._count);
    this._maxLifetimes = new Float32Array(this._count);
    this._phases = new Float32Array(this._count);
    this._sizes = new Float32Array(this._count);
    this._colors = new Float32Array(this._count * 3);

    for (var i = 0; i < this._count; i++) {
      this._resetParticle(i);
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this._positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(this._sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(this._colors, 3));

    // Use vertex colors for per-particle color variation
    var material = new THREE.PointsMaterial({
      size: preset.size,
      transparent: true,
      opacity: preset.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      vertexColors: true
    });

    this._points = new THREE.Points(geometry, material);
    scene.add(this._points);
  }

  ParticleSystem.prototype._resetParticle = function (i) {
    var b = this._bounds, o = this._origin;
    var i3 = i * 3;
    var p = this._preset;

    this._positions[i3]     = (Math.random() - 0.5) * b.x + o.x;
    this._positions[i3 + 1] = Math.random() * b.y + o.y;
    this._positions[i3 + 2] = (Math.random() - 0.5) * b.z + o.z;
    this._velocities[i3]     = (Math.random() - 0.5) * p.drift;
    this._velocities[i3 + 1] = p.speed * (0.5 + Math.random() * 0.5);
    this._velocities[i3 + 2] = (Math.random() - 0.5) * p.drift;
    this._lifetimes[i] = Math.random();
    this._maxLifetimes[i] = 2 + Math.random() * 3;
    this._phases[i] = Math.random() * Math.PI * 2;
    this._sizes[i] = p.size + (Math.random() - 0.5) * p.sizeVar * 2;

    // Per-particle color variation
    var baseColor = new THREE.Color(p.color);
    var cv = p.colorVar || 0;
    baseColor.r += (Math.random() - 0.5) * cv;
    baseColor.g += (Math.random() - 0.5) * cv;
    baseColor.b += (Math.random() - 0.5) * cv;

    // Confetti gets random colors from palette
    if (this._points && this._points.material && p === PRESETS.confetti) {
      var cc = new THREE.Color(CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]);
      baseColor = cc;
    }

    this._colors[i3]     = baseColor.r;
    this._colors[i3 + 1] = baseColor.g;
    this._colors[i3 + 2] = baseColor.b;
  };

  ParticleSystem.prototype.update = function (dt) {
    if (!this._active) return;
    var pos = this._positions;
    var vel = this._velocities;
    var life = this._lifetimes;
    var maxLife = this._maxLifetimes;
    var b = this._bounds, o = this._origin;
    var p = this._preset;
    var time = performance.now() * 0.001;

    for (var i = 0; i < this._count; i++) {
      var i3 = i * 3;
      var phase = this._phases[i];
      life[i] += dt / maxLife[i];

      // Sine-driven drift for organic motion
      var sineX = Math.sin(time * 0.7 + phase) * 0.001;
      var sineY = Math.cos(time * 0.5 + phase * 1.3) * 0.0005;
      var sineZ = Math.sin(time * 0.6 + phase * 0.7) * 0.001;

      pos[i3]     += vel[i3] * dt + sineX;
      pos[i3 + 1] += vel[i3 + 1] * dt + sineY;
      pos[i3 + 2] += vel[i3 + 2] * dt + sineZ;

      // Firefly: extra wobble
      if (p === PRESETS.firefly) {
        pos[i3]     += Math.sin(time * 2.0 + phase * 3.0) * 0.003;
        pos[i3 + 1] += Math.cos(time * 1.5 + phase * 2.0) * 0.002;
        pos[i3 + 2] += Math.sin(time * 1.8 + phase * 1.7) * 0.003;
      }

      // Sparkle: twinkle via size modulation
      if (p === PRESETS.sparkle) {
        this._sizes[i] = p.size * (0.5 + 0.5 * Math.abs(Math.sin(time * 3.0 + phase * 5.0)));
      }

      // Confetti: gravity + tumble
      if (p === PRESETS.confetti) {
        vel[i3 + 1] -= 0.3 * dt; // gentle gravity
        pos[i3] += Math.sin(time * 2 + phase) * 0.002; // tumble drift
      }

      // Fade based on lifetime
      if (life[i] < p.fadeIn) {
        // Fade in — reduce alpha by adjusting color brightness
        var fadeInFactor = life[i] / p.fadeIn;
        this._colors[i3]     *= (0.95 + fadeInFactor * 0.05);
        this._colors[i3 + 1] *= (0.95 + fadeInFactor * 0.05);
        this._colors[i3 + 2] *= (0.95 + fadeInFactor * 0.05);
      } else if (life[i] > (1.0 - p.fadeOut)) {
        // Fade out
        var fadeOutFactor = (1.0 - life[i]) / p.fadeOut;
        this._colors[i3]     *= (0.95 + fadeOutFactor * 0.05);
        this._colors[i3 + 1] *= (0.95 + fadeOutFactor * 0.05);
        this._colors[i3 + 2] *= (0.95 + fadeOutFactor * 0.05);
      }

      // Reset when life expires or particle drifts out of bounds
      if (life[i] >= 1.0 ||
          pos[i3] < o.x - b.x / 2 || pos[i3] > o.x + b.x / 2 ||
          pos[i3 + 1] > o.y + b.y || pos[i3 + 1] < o.y - b.y * 0.5 ||
          pos[i3 + 2] < o.z - b.z / 2 || pos[i3 + 2] > o.z + b.z / 2) {
        this._resetParticle(i);
      }
    }

    this._points.geometry.attributes.position.needsUpdate = true;
    this._points.geometry.attributes.size.needsUpdate = true;
    this._points.geometry.attributes.color.needsUpdate = true;
  };

  ParticleSystem.prototype.dispose = function () {
    this._scene.remove(this._points);
    this._points.geometry.dispose();
    this._points.material.dispose();
  };

  ParticleSystem.prototype.setVisible = function (v) { this._points.visible = v; };

  return ParticleSystem;

})();
