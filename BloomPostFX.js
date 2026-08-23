/**
 * BloomPostFX.js — Cinematic Bloom Post-Processing (Masterpiece Edition)
 *
 * Self-contained, no EffectComposer dependency.
 * Pipeline: camera render → threshold → Gaussian blur → composite (bloom + film grain + vignette + chromatic aberration).
 *
 * Features:
 *   - Bloom with adjustable threshold/intensity/blur
 *   - Film grain (subtle noise overlay)
 *   - Vignette (darkened edges)
 *   - Chromatic aberration (subtle RGB split at edges)
 *   - Tone mapping exposure boost
 *   - Color grading (temperature, contrast, saturation)
 *
 * Usage:
 *   var bloom = new BloomPostFX(renderer, scene, camera, {
 *     threshold: 0.6, intensity: 0.6, blurSize: 2,
 *     grain: 0.03, vignette: 0.4, chromAb: 0.002, exposure: 1.0,
 *     temperature: 0.05, contrast: 1.1, saturation: 1.15
 *   });
 *   bloom.render();           // replace renderer.render(scene, camera)
 *   bloom.resize(w, h);      // call on window resize
 *   bloom.dispose();          // cleanup
 */

var BloomPostFX = (function () {

  // ─── Threshold shader ───────────────────────────
  var THRESHOLD_FS = [
    'uniform sampler2D tDiffuse;',
    'uniform float uThreshold;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec4 c = texture2D(tDiffuse, vUv);',
    '  float b = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));',
    '  gl_FragColor = (b > uThreshold) ? c : vec4(0.0, 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  // ─── Gaussian blur shader ───────────────────────
  var BLUR_FS = [
    'uniform sampler2D tDiffuse;',
    'uniform vec2 uDir;',
    'uniform vec2 uResolution;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 texel = 1.0 / uResolution;',
    '  vec4 sum = vec4(0.0);',
    '  float weights[5];',
    '  weights[0] = 0.227027;',
    '  weights[1] = 0.1945946;',
    '  weights[2] = 0.1216216;',
    '  weights[3] = 0.054054;',
    '  weights[4] = 0.016216;',
    '  sum += texture2D(tDiffuse, vUv) * weights[0];',
    '  for (int i = 1; i < 5; i++) {',
    '    vec2 off = uDir * texel * float(i) * 2.0;',
    '    sum += texture2D(tDiffuse, vUv + off) * weights[i];',
    '    sum += texture2D(tDiffuse, vUv - off) * weights[i];',
    '  }',
    '  gl_FragColor = vec4(sum.rgb, 1.0);',
    '}'
  ].join('\n');

  // ─── Composite shader (bloom + grain + vignette + chromatic aberration + color grading) ───
  var COMPOSITE_FS = [
    'uniform sampler2D tScene;',
    'uniform sampler2D tBloom;',
    'uniform float uIntensity;',
    'uniform float uGrain;',
    'uniform float uVignette;',
    'uniform float uChromAb;',
    'uniform float uTime;',
    'uniform float uExposure;',
    'uniform float uTemperature;',
    'uniform float uContrast;',
    'uniform float uSaturation;',
    'varying vec2 vUv;',
    '',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
    '}',
    '',
    'vec3 adjustColor(vec3 c) {',
    '  // Temperature shift (warm=+orange, cool=+blue)',
    '  c.r += uTemperature * 0.1;',
    '  c.b -= uTemperature * 0.1;',
    '',
    '  // Contrast (very gentle)',
    '  c = (c - 0.5) * uContrast + 0.5;',
    '',
    '  // Saturation (subtle boost)',
    '  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));',
    '  c = mix(vec3(luma), c, uSaturation);',
    '',
    '  // Keep shadows visible',
    '  c = max(c, vec3(0.04));',
    '',
    '  // Very subtle filmic roll-off (not a full S-curve)',
    '  c = c / (c + vec3(0.8));',
    '  c *= 1.4;',
    '',
    '  return c;',
    '}',
    '',
    'void main() {',
    '  vec2 uv = vUv;',
    '',
    '  // Chromatic aberration',
    '  vec2 dir = uv - 0.5;',
    '  float dist = length(dir);',
    '  float aberrAmount = uChromAb * dist;',
    '  vec2 rOff = dir * aberrAmount;',
    '  float r = texture2D(tScene, uv + rOff).r;',
    '  float g = texture2D(tScene, uv).g;',
    '  float b = texture2D(tScene, uv - rOff).b;',
    '  vec3 scene = vec3(r, g, b);',
    '',
    '  // Add bloom',
    '  vec3 bloom = texture2D(tBloom, uv).rgb;',
    '  vec3 color = scene + bloom * uIntensity;',
    '',
    '  // Exposure',
    '  color *= uExposure;',
    '',
    '  // Film grain',
    '  float grain = hash(uv * 1000.0 + fract(uTime) * 100.0);',
    '  color += (grain - 0.5) * uGrain;',
    '',
    '  // Vignette (gentle edge darkening)',
    '  float vig = 1.0 - dist * uVignette;',
    '  vig = clamp(vig, 0.0, 1.0);',
    '  vig = smoothstep(0.0, 1.0, vig);',
    '  color *= vig;',
    '',
    '  // Color grading',
    '  color = adjustColor(color);',
    '',
    '  gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n');

  // ─── Full-screen quad ───────────────────────────
  var QUAD_VS = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = vec4(position, 1.0);',
    '}'
  ].join('\n');

  function BloomPostFX(renderer, scene, camera, opts) {
    opts = opts || {};
    this._renderer = renderer;
    this._scene    = scene;
    this._camera   = camera;
    this.enabled   = true;
    this.threshold = opts.threshold  || 0.72;
    this.intensity = opts.intensity  || 0.35;
    this.blurSize  = opts.blurSize   || 1;
    this.grain       = opts.grain       != null ? opts.grain : 0.012;
    this.vignette    = opts.vignette    != null ? opts.vignette : 0.18;
    this.chromAb     = opts.chromAb     != null ? opts.chromAb : 0.0008;
    this.exposure    = opts.exposure    || 1.3;
    this.temperature = opts.temperature != null ? opts.temperature : 0.03;
    this.contrast    = opts.contrast    != null ? opts.contrast : 1.04;
    this.saturation  = opts.saturation  != null ? opts.saturation : 1.08;
    this._time     = 0;

    var w = renderer.domElement.width  / (window.devicePixelRatio || 1);
    var h = renderer.domElement.height / (window.devicePixelRatio || 1);
    var rw = Math.floor(w), rh = Math.floor(h);

    var rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
    this._rtA = new THREE.WebGLRenderTarget(rw, rh, rtOpts);  // scene render
    this._rtB = new THREE.WebGLRenderTarget(rw >> 1, rh >> 1, rtOpts); // threshold
    this._rtH = new THREE.WebGLRenderTarget(rw >> 1, rh >> 1, rtOpts); // h-blur
    this._rtV = new THREE.WebGLRenderTarget(rw >> 1, rh >> 1, rtOpts); // v-blur

    this._quadGeo = new THREE.PlaneGeometry(2, 2);

    // Materials
    this._matThreshold = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, uThreshold: { value: this.threshold } },
      vertexShader: QUAD_VS, fragmentShader: THRESHOLD_FS, depthTest: false, depthWrite: false
    });
    this._matBlur = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uDir: { value: new THREE.Vector2(1, 0) },
        uResolution: { value: new THREE.Vector2(rw >> 1, rh >> 1) }
      },
      vertexShader: QUAD_VS, fragmentShader: BLUR_FS, depthTest: false, depthWrite: false
    });
    this._matComposite = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: null },
        tBloom: { value: null },
        uIntensity: { value: this.intensity },
        uGrain: { value: this.grain },
        uVignette: { value: this.vignette },
        uChromAb: { value: this.chromAb },
        uTime: { value: 0 },
        uExposure: { value: this.exposure },
        uTemperature: { value: this.temperature },
        uContrast: { value: this.contrast },
        uSaturation: { value: this.saturation }
      },
      vertexShader: QUAD_VS, fragmentShader: COMPOSITE_FS, depthTest: false, depthWrite: false
    });

    this._scene2 = new THREE.Scene();
    this._camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this._mesh = new THREE.Mesh(this._quadGeo, this._matThreshold);
    this._scene2.add(this._mesh);
  }

  BloomPostFX.prototype.render = function () {
    if (!this.enabled) {
      this._renderer.render(this._scene, this._camera);
      return;
    }

    var r = this._renderer;
    this._time += 0.016;

    // 1. Render scene to RTA
    r.setRenderTarget(this._rtA);
    r.render(this._scene, this._camera);

    // 2. Threshold pass → RTB (half res)
    this._matThreshold.uniforms.uThreshold.value = this.threshold;
    this._matThreshold.uniforms.tDiffuse.value = this._rtA.texture;
    this._mesh.material = this._matThreshold;
    r.setRenderTarget(this._rtB);
    r.render(this._scene2, this._camera2);

    // 3. Horizontal blur pass
    var halfW = this._rtB.width, halfH = this._rtB.height;
    this._matBlur.uniforms.uResolution.value.set(halfW, halfH);

    this._matBlur.uniforms.tDiffuse.value = this._rtB.texture;
    this._matBlur.uniforms.uDir.value.set(1, 0);
    this._mesh.material = this._matBlur;
    r.setRenderTarget(this._rtH);
    r.render(this._scene2, this._camera2);

    // 4. Vertical blur pass (repeat for stronger bloom)
    for (var i = 0; i < this.blurSize; i++) {
      this._matBlur.uniforms.tDiffuse.value = this._rtH.texture;
      this._matBlur.uniforms.uDir.value.set(0, 1);
      r.setRenderTarget(this._rtV);
      r.render(this._scene2, this._camera2);

      this._matBlur.uniforms.tDiffuse.value = this._rtV.texture;
      this._matBlur.uniforms.uDir.value.set(1, 0);
      r.setRenderTarget(this._rtH);
      r.render(this._scene2, this._camera2);
    }

    // 5. Composite: scene + bloom + grain + vignette + chromAb → screen
    this._matComposite.uniforms.tScene.value = this._rtA.texture;
    this._matComposite.uniforms.tBloom.value = this._rtH.texture;
    this._matComposite.uniforms.uIntensity.value = this.intensity;
    this._matComposite.uniforms.uGrain.value = this.grain;
    this._matComposite.uniforms.uVignette.value = this.vignette;
    this._matComposite.uniforms.uChromAb.value = this.chromAb;
    this._matComposite.uniforms.uTime.value = this._time;
    this._matComposite.uniforms.uExposure.value = this.exposure;
    this._matComposite.uniforms.uTemperature.value = this.temperature;
    this._matComposite.uniforms.uContrast.value = this.contrast;
    this._matComposite.uniforms.uSaturation.value = this.saturation;
    this._mesh.material = this._matComposite;
    r.setRenderTarget(null);
    r.render(this._scene2, this._camera2);
  };

  BloomPostFX.prototype.resize = function (w, h) {
    var rw = Math.floor(w), rh = Math.floor(h);
    var rw2 = rw >> 1, rh2 = rh >> 1;
    this._rtA.setSize(rw, rh);
    this._rtB.setSize(rw2, rh2);
    this._rtH.setSize(rw2, rh2);
    this._rtV.setSize(rw2, rh2);
    this._matBlur.uniforms.uResolution.value.set(rw2, rh2);
  };

  BloomPostFX.prototype.dispose = function () {
    this._rtA.dispose(); this._rtB.dispose();
    this._rtH.dispose(); this._rtV.dispose();
    this._quadGeo.dispose();
    this._matThreshold.dispose(); this._matBlur.dispose(); this._matComposite.dispose();
  };

  return BloomPostFX;

})();
