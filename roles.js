/**
 * roles.js — Role Definitions
 * 
 * Each role contains:
 *  - id, title, icon, description, accentColor
 *  - Room config: roomColor, floorColor, ceilingColor, roomSize
 *  - playerStart: {x, y, z}
 *  - Lighting config
 *  - tasks: array of {id, label, objectName}
 *  - objects: array of geometry definitions with optional interactable data
 *
 * HOW TO ADD A NEW ROLE:
 * 1. Copy any existing role object below.
 * 2. Change id (must be unique), title, icon, description.
 * 3. Define roomSize, floor/wall/ceiling colors.
 * 4. Add at least 3 interactable objects:
 *    - Set interactable:true, name, promptText, interactionText.
 * 5. Add matching entries in the tasks array (objectName must match object name).
 * 6. Add a card in index.html or generate it dynamically (already done via ROLES array).
 */
var ROLES = [

  // ════════════════════════════════════════════
  // DOCTOR
  // ════════════════════════════════════════════
  {
    id: "doctor",
    title: "Doctor",
    icon: "🩺",
    description: "Hospital room: examine patients, diagnose, prescribe treatment",
    accentColor: "#4fc3f7",
    roomColor: 0x808080,
    floorColor: 0x555555,
    ceilingColor: 0x666666,
    fogColor: 0x2a3a50,
    roomSize: { width: 18, height: 4, depth: 16 },
    playerStart: { x: 0, y: 1.6, z: 6 },
    ambientColor: 0xffffff,
    ambientIntensity: 0.5,
    lights: [
      { type: "point", color: 0xffffff, intensity: 0.8, pos: { x: 0, y: 3.5, z: 0 } },
      { type: "point", color: 0xe3f2fd, intensity: 0.4, pos: { x: -6, y: 3, z: -5 } },
      { type: "point", color: 0xfff9c4, intensity: 0.3, pos: { x: 6, y: 3, z: -5 } },
      { type: "point", color: 0xffffff, intensity: 0.3, pos: { x: 0, y: 3.5, z: 5 } }
    ],
    tasks: [
      { id: "t1", label: "Read Patient Chart", objectName: "Patient Chart" },
      { id: "t2", label: "Check Heart Rate Monitor", objectName: "Heart Rate Monitor" },
      { id: "t3", label: "Open Medicine Cabinet", objectName: "Medicine Cabinet" },
      { id: "t4", label: "Use Stethoscope", objectName: "Stethoscope" },
      { id: "t5", label: "Review X-Ray", objectName: "X-Ray Lightbox" },
      { id: "t6", label: "Check Blood Pressure Device", objectName: "Blood Pressure Cuff" },
      { id: "t7", label: "Read Lab Results", objectName: "Lab Results" },
      { id: "t8", label: "Examine Defibrillator", objectName: "Defibrillator" },
      { id: "t9", label: "Check Oxygen Tank", objectName: "Oxygen Tank" },
      { id: "t10", label: "Review Prescription Pad", objectName: "Prescription Pad" }
    ],
    objects: [
      // Hospital Bed — detailed with wheels, rails, headboard, footboard
      { g: "box", s: [3.5, .6, 2], p: [-5, .3, -5], c: 0x90a4ae, em: 0x78909c, ei: 0.15, mat: 'metalBrushed' },
      { g: "box", s: [3.3, .25, 1.8], p: [-5, .72, -5], c: 0xffffff, em: 0xe8eaf6, ei: 0.08, mat: 'fabric' },
      { g: "box", s: [.6, .18, 1.2], p: [-6.4, .92, -5], c: 0xe3f2fd, em: 0xbbdefb, ei: 0.1, mat: 'fabric' },
      // Headboard
      { g: "box", s: [3.4, 1.2, .08], p: [-5, .9, -5.96], c: 0x78909c, em: 0x607d8b, ei: 0.18, mat: 'metalBrushed' },
      // Footboard
      { g: "box", s: [3.4, .7, .08], p: [-5, .65, -4.04], c: 0x78909c, em: 0x607d8b, ei: 0.18, mat: 'metalBrushed' },
      // Side rails (left)
      { g: "box", s: [3.2, .04, .04], p: [-5, 1.05, -4.05], c: 0xb0bec5, em: 0x90a4ae, ei: 0.25 },
      { g: "box", s: [.04, .25, .04], p: [-6.55, .95, -4.05], c: 0xb0bec5, em: 0x90a4ae, ei: 0.25 },
      { g: "box", s: [.04, .25, .04], p: [-3.45, .95, -4.05], c: 0xb0bec5, em: 0x90a4ae, ei: 0.25 },
      // Side rails (right)
      { g: "box", s: [3.2, .04, .04], p: [-5, 1.05, -5.95], c: 0xb0bec5, em: 0x90a4ae, ei: 0.25 },
      { g: "box", s: [.04, .25, .04], p: [-6.55, .95, -5.95], c: 0xb0bec5, em: 0x90a4ae, ei: 0.25 },
      { g: "box", s: [.04, .25, .04], p: [-3.45, .95, -5.95], c: 0xb0bec5, em: 0x90a4ae, ei: 0.25 },
      // Bed wheels (4 caster wheels)
      { g: "cyl", s: [.08, .08, .06, 12], p: [-6.5, .04, -4.1], c: 0x424242, em: 0x333, ei: 0.2 },
      { g: "cyl", s: [.08, .08, .06, 12], p: [-3.5, .04, -4.1], c: 0x424242, em: 0x333, ei: 0.2 },
      { g: "cyl", s: [.08, .08, .06, 12], p: [-6.5, .04, -5.9], c: 0x424242, em: 0x333, ei: 0.2 },
      { g: "cyl", s: [.08, .08, .06, 12], p: [-3.5, .04, -5.9], c: 0x424242, em: 0x333, ei: 0.2 },
      // Blanket
      { g: "box", s: [2.5, .08, 1.6], p: [-4.5, .88, -5], c: 0x81d4fa, em: 0x4fc3f7, ei: 0.12, mat: 'fabric' },
      // Pillow (rounded)
      { g: "cyl", s: [.25, .25, .5, 12], p: [-6.3, .92, -5], c: 0xfafafa, em: 0xf5f5f5, ei: 0.08, mat: 'fabric' },

      // Patient Chart (clipboard with paper glow)
      { g: "box", s: [.45, .6, .03], p: [-3, 1.3, -5.95], c: 0xfff9c4, em: 0xfff176, ei: 0.15, anim: { type: 'pulse', speed: 0.5, amplitude: 0.05 },
        name: "Patient Chart", interactable: true, promptText: "Read Patient Chart",
        interactionText: "<strong>Patient Chart — Room 104</strong><br><br><strong>Patient:</strong> Jane Doe, 34F<br><strong>Admitted:</strong> 02/15/2025<br><strong>Complaint:</strong> Persistent fever 101.3°F, headache, body aches, cough x3 days<br><br><strong>Vitals:</strong><br>• Temp: 101.3°F • BP: 128/82 • HR: 92 bpm • SpO2: 97% • RR: 18<br><br><strong>History:</strong><br>• No known allergies • Non-smoker • Previous: appendectomy (2018)<br><br><strong>Assessment:</strong> Viral upper respiratory infection<br><strong>Plan:</strong> Acetaminophen 500mg q6h, IV fluids, chest X-ray, CBC + CMP, monitor 24h<br><br><strong>Attending:</strong> Dr. Smith, Internal Medicine"
      },

      // Heart Rate Monitor (mounted on pole near bed headboard)
      { g: "cyl", s: [.04, .04, 1.6, 8], p: [-6.5, .8, -5.85], c: 0x607d8b },
      { g: "box", s: [.9, .65, .08], p: [-6.5, 1.7, -5.85], c: 0x1a1a2e,
        name: "Heart Rate Monitor", interactable: true, promptText: "Check Heart Rate Monitor", screenType: 'heartrate', anim: { type: 'pulse', speed: 2, amplitude: 0.15 },
        interactionText: "<strong>Philips IntelliVue MX800</strong><br><br><span style='color:#4caf50'>♥ HR:</span> 92 BPM — Normal sinus rhythm<br><span style='color:#f44336'>BP:</span> 128/82 mmHg — Prehypertensive<br><span style='color:#2196f3'>SpO2:</span> 97% — Normal<br><span style='color:#ff9800'>RR:</span> 18/min — Normal<br><span style='color:#ce93d8'>Temp:</span> 101.3°F — Febrile<br><br><strong>ECG Analysis:</strong><br>• Regular rhythm, rate 92<br>• Normal P waves, PR interval 160ms<br>• QRS 88ms, QT/QTc 380/420ms<br>• No ST changes<br><br><strong>Alarms:</strong> Temperature alert active<br><em style='color:#888'>Continuous monitoring q4h vitals</em>"
      },
      { g: "sphere", s: [.03, 8, 8], p: [-6.1, 1.95, -5.81], c: 0x4caf50, em: 0x4caf50, ei: .8 },
      { g: "sphere", s: [.025, 8, 8], p: [-6.25, 1.95, -5.81], c: 0xf44336, em: 0xf44336, ei: .9 },

      // Medicine Cabinet (metallic steel with subtle glow)
      { g: "box", s: [1.4, 2, .5], p: [6, .1 + 1, -7.6], c: 0xeceff1, em: 0xb0bec5, ei: 0.1, mat: 'metalBrushed',
        name: "Medicine Cabinet", interactable: true, promptText: "Open Medicine Cabinet",
        interactionText: "<strong>Medicine Cabinet — Authorized Only</strong><br><br><strong>Top Shelf — Analgesics/Antipyretics:</strong><br>• Acetaminophen 500mg — fever, pain<br>• Ibuprofen 400mg — inflammation<br>• Morphine sulfate 2mg/mL (LOCKED)<br><br><strong>Middle — Antibiotics:</strong><br>• Amoxicillin 500mg — bacterial infection<br>• Azithromycin 250mg (Z-pack)<br>• Ceftriaxone 1g IV — severe infections<br><br><strong>Bottom — Cardiac/Emergency:</strong><br>• Epinephrine 1mg auto-injector<br>• Nitroglycerin 0.4mg sublingual<br>• Atropine 0.5mg<br>• Adenosine 6mg rapid push<br><br><strong>Refrigerated:</strong><br>• Insulin regular 100U/mL<br>• Heparin 5000U/mL<br><br><em style='color:#f44336'>⚠ Dual verification for controlled substances</em>"
      },
      { g: "box", s: [1.3, .03, .4], p: [6, .6, -7.55], c: 0xcfd8dc, em: 0xb0bec5, ei: 0.1 },
      { g: "box", s: [1.3, .03, .4], p: [6, 1.2, -7.55], c: 0xcfd8dc, em: 0xb0bec5, ei: 0.1 },
      { g: "box", s: [1.3, .03, .4], p: [6, 1.8, -7.55], c: 0xcfd8dc, em: 0xb0bec5, ei: 0.1 },

      // Stethoscope on side table (detailed table + rubber head + tube)
      { g: "box", s: [.7, .7, .7], p: [-3, .35, -4], c: 0x78909c, em: 0x607d8b, ei: 0.25, mat: 'wood' },
      // Table legs (rounded)
      { g: "cyl", s: [.03, .03, .35, 8], p: [-3.28, .17, -3.72], c: 0x607d8b, em: 0x546e7a, ei: 0.25 },
      { g: "cyl", s: [.03, .03, .35, 8], p: [-2.72, .17, -3.72], c: 0x607d8b, em: 0x546e7a, ei: 0.25 },
      { g: "cyl", s: [.03, .03, .35, 8], p: [-3.28, .17, -4.28], c: 0x607d8b, em: 0x546e7a, ei: 0.25 },
      { g: "cyl", s: [.03, .03, .35, 8], p: [-2.72, .17, -4.28], c: 0x607d8b, em: 0x546e7a, ei: 0.25 },
      // Stethoscope chest piece
      { g: "cyl", s: [.14, .14, .03, 16], p: [-3, .73, -4], c: 0x37474f, em: 0x263238, ei: 0.2,
        name: "Stethoscope", interactable: true, promptText: "Pick up Stethoscope",
        interactionText: "<strong>Littmann Cardiology IV</strong><br><br>Premium dual-head stethoscope.<br><br><strong>Examination Findings:</strong><br>• <strong>Heart:</strong> S1/S2 normal, no murmurs, gallops or rubs. Regular rate and rhythm.<br>• <strong>Lungs:</strong> Mild rhonchi bilateral bases. No wheezing or crackles. Good air movement.<br>• <strong>Abdomen:</strong> Normal bowel sounds x4 quadrants.<br><br><strong>Technique Tips:</strong><br>• Diaphragm (flat side) = high-frequency (S1, S2, breath sounds)<br>• Bell (cupped side) = low-frequency (S3, S4, mitral stenosis)<br>• Apply firm pressure for diaphragm, light for bell<br><br><em style='color:#4fc3f7'>Patient heart sounds are consistent with normal findings. Lung sounds suggest mild congestion.</em>"
      },
      { g: "cyl", s: [.015, .015, .5, 8], p: [-3, .75, -3.8], c: 0x1a1a1a, em: 0x111111, ei: 0.1 },

      // X-Ray Lightbox
      { g: "box", s: [1.5, 1.2, .05], p: [2, 2.2, -7.93], c: 0xe3f2fd, em: 0xbbdefb, ei: .3,
        name: "X-Ray Lightbox", interactable: true, promptText: "Review X-Ray",
        interactionText: "<strong>Chest X-Ray — PA View</strong><br><br><strong>Patient:</strong> Jane Doe<br><strong>Date:</strong> 02/15/2025 14:30<br><br><strong>Findings:</strong><br>• Heart size normal (CTR &lt; 0.5)<br>• Bilateral patchy infiltrates, right &gt; left<br>• No pleural effusion<br>• No pneumothorax<br>• Costophrenic angles clear<br>• Trachea midline<br>• No bony abnormalities<br><br><strong>Impression:</strong><br>Bilateral airspace opacities consistent with viral pneumonitis vs. early community-acquired pneumonia. Recommend clinical correlation.<br><br><strong>Radiologist:</strong> Dr. Chen<br><em style='color:#ff9800'>⚠ Follow-up imaging recommended in 48-72h</em>"
      },

      // Blood Pressure Device (on side table surface)
      { g: "box", s: [.3, .2, .2], p: [-3, .81, -3.85], c: 0x1565c0, em: 0x0d47a1, ei: 0.3, anim: { type: 'pulse', speed: 1.5, amplitude: 0.1 },
        name: "Blood Pressure Cuff", interactable: true, promptText: "Check Blood Pressure Device",
        interactionText: "<strong>Omron Digital BP Monitor</strong><br><br><strong>Latest Readings (q4h):</strong><br><br>06:00 — 132/86 mmHg (HR 88)<br>10:00 — 128/82 mmHg (HR 92)<br>14:00 — 125/80 mmHg (HR 90)<br>18:00 — 130/84 mmHg (HR 94)<br><br><strong>Trend Analysis:</strong><br>• Systolic range: 125-132 (borderline high)<br>• Diastolic range: 80-86 (normal to prehypertensive)<br>• MAP: ~97-101 mmHg<br><br><strong>Classification:</strong> Stage 1 Hypertension<br><strong>Action:</strong> Continue monitoring. Consider ACE inhibitor if sustained &gt;140/90<br><br><em style='color:#888'>Patient may have white coat effect. 24h ambulatory monitoring recommended after discharge.</em>"
      },

      // Medical rolling cart (for Lab Results clipboard)
      // Cart wheels
      { g: "cyl", s: [.025, .025, .03, 8], p: [3.78, .04, -4.65], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.025, .025, .03, 8], p: [4.22, .04, -4.65], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.025, .025, .03, 8], p: [3.78, .04, -4.35], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.025, .025, .03, 8], p: [4.22, .04, -4.35], c: 0x424242, em: 0x333, ei: 0.25 },
      // Cart legs (chrome)
      { g: "cyl", s: [.01, .01, .72, 6], p: [3.78, .38, -4.65], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      { g: "cyl", s: [.01, .01, .72, 6], p: [4.22, .38, -4.65], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      { g: "cyl", s: [.01, .01, .72, 6], p: [3.78, .38, -4.35], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      { g: "cyl", s: [.01, .01, .72, 6], p: [4.22, .38, -4.35], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      // Cart lower shelf
      { g: "box", s: [.36, .015, .25], p: [4, .32, -4.5], c: 0x757575, em: 0x616161, ei: 0.08 },
      // Cart top surface
      { g: "box", s: [.45, .02, .32], p: [4, .76, -4.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      // Cart handle
      { g: "cyl", s: [.006, .006, .32, 6], p: [4.24, .88, -4.5], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      // Lab Results on clipboard (paper glow)
      { g: "box", s: [.35, .5, .03], p: [4, 1.04, -4.5], c: 0xffffff, em: 0xf5f5f5, ei: 0.2,
        name: "Lab Results", interactable: true, promptText: "Read Lab Results",
        interactionText: "<strong>Laboratory Results — STAT</strong><br><br><strong>CBC:</strong><br>• WBC: 11,200/µL (H) ↑ — mild leukocytosis<br>• RBC: 4.5 M/µL — normal<br>• Hgb: 13.8 g/dL — normal<br>• Hct: 41% — normal<br>• Plt: 245,000/µL — normal<br>• Neutrophils: 72% (H) ↑<br>• Lymphocytes: 20%<br><br><strong>CMP:</strong><br>• Glucose: 98 mg/dL — normal<br>• BUN: 14 mg/dL — normal<br>• Creatinine: 0.9 mg/dL — normal<br>• Na: 139 mEq/L • K: 4.1 mEq/L<br>• AST: 28 U/L • ALT: 22 U/L<br><br><strong>Other:</strong><br>• CRP: 3.8 mg/dL (H) ↑ — inflammation<br>• Procalcitonin: 0.15 ng/mL — low (viral likely)<br>• COVID-19 PCR: Negative<br>• Influenza A/B: Negative<br><br><em style='color:#81c784'>Results suggest viral etiology. Low procalcitonin argues against bacterial infection.</em>"
      },

      // Defibrillator cart — chrome frame with wheels, shelf, handle
      // Cart wheels (4 caster wheels)
      { g: "cyl", s: [.03, .03, .04, 8], p: [6.72, .04, -.15], c: 0x424242, em: 0x333, ei: 0.25, mat: 'rubber' },
      { g: "cyl", s: [.03, .03, .04, 8], p: [7.28, .04, -.15], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.03, .03, .04, 8], p: [6.72, .04, .15], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.03, .03, .04, 8], p: [7.28, .04, .15], c: 0x424242, em: 0x333, ei: 0.25 },
      // Cart legs (chrome)
      { g: "cyl", s: [.012, .012, .78, 6], p: [6.72, .42, -.15], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      { g: "cyl", s: [.012, .012, .78, 6], p: [7.28, .42, -.15], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      { g: "cyl", s: [.012, .012, .78, 6], p: [6.72, .42, .15], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      { g: "cyl", s: [.012, .012, .78, 6], p: [7.28, .42, .15], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      // Cart lower shelf
      { g: "box", s: [.48, .02, .26], p: [7, .35, 0], c: 0x757575, em: 0x616161, ei: 0.08 },
      // Cart top surface
      { g: "box", s: [.56, .025, .32], p: [7, .82, 0], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      // Cart handle (chrome push bar)
      { g: "cyl", s: [.008, .008, .45, 6], p: [7.3, .95, 0], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      { g: "box", s: [.02, .12, .02], p: [7.3, .88, -.22], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      { g: "box", s: [.02, .12, .02], p: [7.3, .88, .22], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      // Defibrillator (on cart)
      { g: "box", s: [.8, .5, .4], p: [7, 1.08, 0], c: 0xf44336,
        name: "Defibrillator", interactable: true, promptText: "Examine Defibrillator", anim: { type: 'pulse', speed: 1, amplitude: 0.2 },
        interactionText: "<strong>Philips HeartStart MRx</strong><br><br><strong>Status:</strong> ✅ Ready — Last test: 02/14/2025<br><strong>Battery:</strong> 94% — Est. 5h continuous<br><br><strong>Modes Available:</strong><br>• Manual defibrillation (biphasic, 120-200J)<br>• Synchronized cardioversion<br>• AED mode (automated)<br>• External pacing (40-180 ppm)<br><br><strong>Protocol — VFib/Pulseless VT:</strong><br>1. Confirm cardiac arrest, begin CPR<br>2. Apply pads (R clavicle, L apex)<br>3. Charge to 120J biphasic<br>4. Clear patient, deliver shock<br>5. Immediately resume CPR x2 min<br>6. Escalate: 150J → 200J<br><br><strong>Pads Placement:</strong><br>• Anterior-lateral (standard)<br>• Anterior-posterior (alternative)<br><br><em style='color:#f44336'>⚠ For emergency use — trained personnel only</em>"
      },
      { g: "sphere", s: [.025, 8, 8], p: [7.35, 1.36, .15], c: 0x4caf50, em: 0x4caf50, ei: .9 },

      // Oxygen Tank (metallic green cylinder with sheen)
      { g: "cyl", s: [.12, .12, 1, 16], p: [8, .5, -3], c: 0x2e7d32, em: 0x1b5e20, ei: 0.25,
        name: "Oxygen Tank", interactable: true, promptText: "Check Oxygen Tank",
        interactionText: "<strong>Medical Oxygen Cylinder — Size E</strong><br><br><strong>Contents:</strong> Medical-grade O₂ (99.5% purity)<br><strong>Pressure:</strong> 1,800 PSI (full = 2,200 PSI)<br><strong>Volume:</strong> ~680L remaining<br><br><strong>Current Settings:</strong><br>• Flow rate: 2 L/min via nasal cannula<br>• Duration at current rate: ~5.5 hours<br><br><strong>Delivery Devices Available:</strong><br>• Nasal cannula: 1-6 L/min (24-44% FiO₂)<br>• Simple face mask: 6-10 L/min (40-60%)<br>• Non-rebreather: 10-15 L/min (60-90%)<br>• Venturi mask: precise FiO₂ settings<br><br><strong>Patient Order:</strong><br>O₂ 2L/min NC to maintain SpO₂ ≥ 94%<br><br><em style='color:#2e7d32'>Tank status: 82% — replacement not needed yet</em>"
      },
      { g: "cyl", s: [.05, .05, .15, 8], p: [8, 1.05, -3], c: 0x424242, em: 0x616161, ei: 0.3 },

      // Prescription Pad (white paper with subtle glow)
      { g: "box", s: [.4, .02, .5], p: [4, .72, 2], c: 0xffffff, em: 0xfafafa, ei: 0.1,
        name: "Prescription Pad", interactable: true, promptText: "Review Prescription Pad",
        interactionText: "<strong>Prescription — Dr. Smith, MD</strong><br>License #: MD-2847561<br>DEA #: BS1234567<br><br><strong>Patient:</strong> Jane Doe, DOB 03/15/1991<br><strong>Date:</strong> 02/15/2025<br><br><strong>Rx 1:</strong><br>Acetaminophen 500mg<br>Sig: 1 tab PO q6h PRN fever/pain<br>Disp: #30 — Refills: 2<br><br><strong>Rx 2:</strong><br>Benzonatate 100mg (Tessalon Perles)<br>Sig: 1 cap PO TID PRN cough<br>Disp: #21 — Refills: 0<br><br><strong>Rx 3:</strong><br>Guaifenesin 600mg ER<br>Sig: 1 tab PO BID<br>Disp: #14 — Refills: 1<br><br><strong>Instructions:</strong><br>• Push fluids 2-3L/day<br>• Rest, avoid strenuous activity<br>• Return if fever &gt;103°F or worsening SOB<br>• Follow-up in 5-7 days<br><br><em style='color:#888'>Electronically signed by Dr. Smith</em>"
      },
      { g: "box", s: [1.2, .7, .8], p: [4, .35, 2], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },

      // Window — detailed with frame, crossbars, sill
      { g: "box", s: [3.5, 2.2, .05], p: [0, 2.2, -7.95], c: 0xbbdefb, em: 0xbbdefb, ei: .3 },
      // Window frame
      { g: "box", s: [3.7, .08, .1], p: [0, 3.35, -7.93], c: 0x90a4ae, em: 0x78909c, ei: 0.25 },
      { g: "box", s: [3.7, .08, .1], p: [0, 1.05, -7.93], c: 0x90a4ae, em: 0x78909c, ei: 0.25 },
      { g: "box", s: [.08, 2.2, .1], p: [0, 2.2, -7.93], c: 0x90a4ae, em: 0x78909c, ei: 0.25 },
      // Crossbars
      { g: "box", s: [3.5, .04, .06], p: [0, 2.2, -7.94], c: 0x90a4ae, em: 0x78909c, ei: 0.25 },
      { g: "box", s: [.04, 2.2, .06], p: [0, 2.2, -7.94], c: 0x90a4ae, em: 0x78909c, ei: 0.25 },
      // Window sill
      { g: "box", s: [3.9, .06, .15], p: [0, 1.0, -7.9], c: 0x8d6e63, em: 0x6d4c41, ei: 0.1 },

      // IV Stand with bag (metallic pole + translucent bag)
      { g: "cyl", s: [.03, .03, 2.2, 8], p: [-7.5, 1.1, -6], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      { g: "box", s: [.12, .2, .06], p: [-7.5, 2.2, -6], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.25, op: 0.7, tr: true },
      { g: "cyl", s: [.01, .01, .6, 4], p: [-7.5, 1.8, -6], c: 0xe0e0e0, anim: { type: 'drip', speed: 1.5, amplitude: 0.15 } },
      // IV bag drip pulse
      { g: "sphere", s: [.02, 6, 6], p: [-7.5, 1.5, -6], c: 0x90caf9, em: 0x42a5f5, ei: 0.3, anim: { type: 'float', speed: 1.2, amplitude: 0.05 } },

      // Wall clock — detailed with bezel, hands, tick marks
      { g: "cyl", s: [.32, .32, .04, 24], p: [5, 3.2, -7.93], c: 0x9e9e9e, em: 0x757575, ei: 0.2 },
      { g: "cyl", s: [.28, .28, .05, 24], p: [5, 3.2, -7.92], c: 0xfafafa, em: 0xf5f5f5, ei: 0.25 },
      // Hour hand
      { g: "box", s: [.015, .15, .01], p: [5, 3.28, -7.89], c: 0x212121 },
      // Minute hand
      { g: "box", s: [.01, .22, .01], p: [5.04, 3.26, -7.89], c: 0x212121 },
      // Center dot
      { g: "sphere", s: [.015, 8, 8], p: [5, 3.2, -7.88], c: 0xf44336, em: 0xf44336, ei: 0.5 },

      // Sharps container (red warning glow)
      { g: "box", s: [.3, .35, .25], p: [7.5, .175, 3], c: 0xf44336, em: 0xd32f2f, ei: 0.2 },
      // Trash can — detailed with pedal, rim, liner
      { g: "cyl", s: [.2, .22, .5, 16], p: [5, .26, 5], c: 0x757575, em: 0x616161, ei: 0.25 },
      // Rim
      { g: "cyl", s: [.21, .21, .03, 16], p: [5, .52, 5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },
      // Pedal
      { g: "box", s: [.08, .02, .1], p: [5, .02, 4.78], c: 0x616161, em: 0x424242, ei: 0.25 },
      // Visitor chair — detailed with armrests, cushion, chrome legs, base
      { g: "cyl", s: [.04, .04, .28, 8], p: [2, .15, 4], c: 0x424242, em: 0x616161, ei: 0.3, mat: 'metalPolished' },
      { g: "box", s: [.6, .08, .6], p: [2, .36, 4], c: 0x1565c0, em: 0x0d47a1, ei: 0.1, mat: 'metalBrushed' },
      // Cushion (rounded)
      { g: "cyl", s: [.28, .28, .06, 12], p: [2, .44, 4], c: 0x1e88e5, em: 0x1565c0, ei: 0.1, mat: 'fabric' },
      // Backrest
      { g: "box", s: [.6, .55, .06], p: [2, .62, 3.72], c: 0x1565c0, em: 0x0d47a1, ei: 0.1, mat: 'fabric' },
      // Armrests
      { g: "box", s: [.04, .04, .45], p: [1.68, .52, 4.05], c: 0x424242, em: 0x616161, ei: 0.3 },
      { g: "box", s: [.04, .04, .45], p: [2.32, .52, 4.05], c: 0x424242, em: 0x616161, ei: 0.3 },
      // Chrome legs (rounded)
      { g: "cyl", s: [.02, .02, .3, 8], p: [1.75, .18, 3.75], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "cyl", s: [.02, .02, .3, 8], p: [2.25, .18, 3.75], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "cyl", s: [.02, .02, .3, 8], p: [1.75, .18, 4.25], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "cyl", s: [.02, .02, .3, 8], p: [2.25, .18, 4.25], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      // Floor tiles (alternating pattern)
      { g: "box", s: [2, .01, 2], p: [-5, .005, -5], c: 0xaed581, em: 0x8bc34a, ei: 0.08 },
      { g: "box", s: [2, .01, 2], p: [-5, .005, -3], c: 0xb0bec5, em: 0x90a4ae, ei: 0.08 },

      // ── NEW OBJECTS: Doctor Room Details ──

      // Medical gloves box (on side table)
      { g: "box", s: [.2, .1, .15], p: [-3, .75, -4.1], c: 0x1565c0, em: 0x0d47a1, ei: 0.25 },
      { g: "box", s: [.18, .02, .12], p: [-3, .81, -4.1], c: 0x42a5f5, em: 0x2196f3, ei: 0.1 },
      // Glove sticking out
      { g: "sphere", s: [.035, 8, 8], p: [-3, .84, -4.1], c: 0xe3f2fd, em: 0xbbdefb, ei: 0.08 },



      // Wall-mounted TV / patient info screen
      { g: "box", s: [1.8, 1.1, .06], p: [-8.93, 2.5, -2], c: 0x111111, em: 0x0d1117, ei: 0.08, mat: 'plastic', rot: { y: Math.PI / 2 } },
      { g: "box", s: [1.6, .95, .02], p: [-8.9, 2.5, -2], c: 0x1a237e, em: 0x0d47a1, ei: 0.3, screenType: 'crt', anim: { type: 'pulse', speed: 0.5, amplitude: 0.1 }, rot: { y: Math.PI / 2 } },
      // TV mount arm
      { g: "cyl", s: [.02, .02, .2, 8], p: [-8.85, 2.5, -2], c: 0x616161, em: 0x424242, ei: 0.2, rot: { y: Math.PI / 2 } },

      // Water pitcher (on side table, left side)
      { g: "cyl", s: [.05, .07, .13, 12], p: [-3.2, .77, -3.8], c: 0x90caf9, em: 0x42a5f5, ei: 0.25, op: 0.5, tr: true, mat: 'glass' },
      // Pitcher lid
      { g: "cyl", s: [.055, .055, .012, 12], p: [-3.2, .85, -3.8], c: 0x42a5f5, em: 0x2196f3, ei: 0.2 },
      // Cup
      { g: "cyl", s: [.025, .02, .065, 10], p: [-2.85, .76, -3.8], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1 },

      // Call button (on bed rail) — with shimmer effect
      { g: "box", s: [.06, .04, .04], p: [-3.45, 1.08, -4.08], c: 0xfff176, em: 0xffeb3b, ei: 0.5, anim: { type: 'shimmer', speed: 2, amplitude: 0.2 } },

      // Wall poster — anatomical chart
      { g: "box", s: [.8, 1.1, .02], p: [-8.93, 2, 3], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1, rot: { y: Math.PI / 2 } },
      { g: "box", s: [.7, .5, .01], p: [-8.9, 2.3, 3], c: 0xef9a9a, em: 0xef5350, ei: 0.25, rot: { y: Math.PI / 2 } },

      // Wall-mounted hand washing sign
      { g: "box", s: [.4, .3, .02], p: [8.93, 2, -2], c: 0x2196f3, em: 0x1565c0, ei: 0.2, rot: { y: -Math.PI / 2 } },

      // Blood draw tray (on counter)
      { g: "box", s: [.3, .03, .2], p: [4, .73, -2], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },
      // Test tubes in tray
      { g: "cyl", s: [.012, .012, .1, 8], p: [3.92, .8, -2], c: 0xef5350, em: 0xf44336, ei: 0.3, op: 0.6, tr: true },
      { g: "cyl", s: [.012, .012, .1, 8], p: [3.96, .8, -2], c: 0x42a5f5, em: 0x2196f3, ei: 0.3, op: 0.6, tr: true },
      { g: "cyl", s: [.012, .012, .1, 8], p: [4, .8, -2], c: 0x66bb6a, em: 0x4caf50, ei: 0.3, op: 0.6, tr: true },
      { g: "cyl", s: [.012, .012, .1, 8], p: [4.04, .8, -2], c: 0xffca28, em: 0xffc107, ei: 0.3, op: 0.6, tr: true },
      { g: "cyl", s: [.012, .012, .1, 8], p: [4.08, .8, -2], c: 0xce93d8, em: 0xba68c8, ei: 0.3, op: 0.6, tr: true },

      // Wall-mounted whiteboard (small)
      { g: "box", s: [1, .7, .03], p: [8.93, 2.5, 4], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1, rot: { y: -Math.PI / 2 } },
      { g: "box", s: [.8, .02, .04], p: [8.9, 2.12, 4], c: 0x9e9e9e, em: 0x757575, ei: 0.2, rot: { y: -Math.PI / 2 } },

      // Ceiling light (round)
      { g: "cyl", s: [.4, .4, .05, 16], p: [0, 3.95, 0], c: 0xfafafa, em: 0xffffff, ei: 0.2 },
      { g: "cyl", s: [.35, .35, .03, 16], p: [0, 3.93, 0], c: 0xffffff, em: 0xffffff, ei: 0.75 },

      // Second ceiling light
      { g: "cyl", s: [.3, .3, .04, 16], p: [-5, 3.95, -5], c: 0xfafafa, em: 0xffffff, ei: 0.5 },
      { g: "cyl", s: [.25, .25, .03, 16], p: [-5, 3.93, -5], c: 0xffffff, em: 0xffffff, ei: 0.7 }
    ]
  },

  // ════════════════════════════════════════════
  // ENGINEER
  // ════════════════════════════════════════════
  {
    id: "engineer",
    title: "Engineer",
    icon: "⚙️",
    description: "Electronics lab: build circuits, analyze signals, design systems",
    accentColor: "#ffb74d",
    roomColor: 0x3a3a3a,
    floorColor: 0x404040,
    ceilingColor: 0x2a2a2a,
    fogColor: 0x2a3040,
    roomSize: { width: 20, height: 4.5, depth: 18 },
    playerStart: { x: 0, y: 1.6, z: 7 },
    ambientColor: 0xffe0b2,
    ambientIntensity: .35,
    lights: [
      { type: "point", color: 0xfff3e0, intensity: .9, pos: { x: 0, y: 4, z: 0 } },
      { type: "point", color: 0xffcc02, intensity: .5, pos: { x: -7, y: 3, z: -6 } },
      { type: "point", color: 0x80cbc4, intensity: .3, pos: { x: 7, y: 3, z: -6 } },
      { type: "spot", color: 0xffffff, intensity: .6, pos: { x: -5, y: 4.2, z: -7 }, target: { x: -5, y: .8, z: -7 } },
      { type: "point", color: 0xffffff, intensity: .3, pos: { x: 0, y: 4, z: 6 } }
    ],
    tasks: [
      { id: "t1", label: "Examine Circuit Board", objectName: "Circuit Board" },
      { id: "t2", label: "Use Oscilloscope", objectName: "Oscilloscope" },
      { id: "t3", label: "Study Blueprint", objectName: "Blueprint" },
      { id: "t4", label: "Read Multimeter", objectName: "Multimeter" },
      { id: "t5", label: "Check 3D Printer", objectName: "3D Printer" },
      { id: "t6", label: "Inspect Power Supply", objectName: "Power Supply Unit" },
      { id: "t7", label: "Read Datasheet", objectName: "Component Datasheet" },
      { id: "t8", label: "Use Soldering Station", objectName: "Soldering Station" },
      { id: "t9", label: "Check Logic Analyzer", objectName: "Logic Analyzer" },
      { id: "t10", label: "Review Server Rack", objectName: "Server Rack" }
    ],
    objects: [
      // Left workbench — detailed with drawers, legs, surface
      { g: "box", s: [.1, .85, .1], p: [-7.9, .42, -7.4], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [-4.1, .42, -7.4], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [-7.9, .42, -5.6], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [-4.1, .42, -5.6], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [4, .1, 2], p: [-6, .87, -6.5], c: 0x6d4c41, em: 0x5d4037, ei: 0.1, mat: 'wood' },
      // Workbench drawers
      { g: "box", s: [1.2, .2, .02], p: [-7, .6, -5.52], c: 0x5d4037, em: 0x4e342e, ei: 0.08 },
      { g: "box", s: [.08, .02, .02], p: [-7, .6, -5.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3 },
      { g: "box", s: [1.2, .2, .02], p: [-7, .4, -5.52], c: 0x5d4037, em: 0x4e342e, ei: 0.08 },
      { g: "box", s: [.08, .02, .02], p: [-7, .4, -5.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3 },
      { g: "box", s: [1.2, .2, .02], p: [-7, .2, -5.52], c: 0x5d4037, em: 0x4e342e, ei: 0.08 },
      { g: "box", s: [.08, .02, .02], p: [-7, .2, -5.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3 },

      // Circuit Board (green PCB with trace glow)
      { g: "box", s: [.7, .04, .5], p: [-7, .92, -6.8], c: 0x1b5e20, em: 0x2e7d32, ei: 0.3, mat: 'plastic', anim: { type: 'pulse', speed: 1, amplitude: 0.1 },
        name: "Circuit Board", interactable: true, promptText: "Examine Circuit Board",
        interactionText: "<strong>Custom PCB — Sensor Array Shield v3.2</strong><br><br><strong>MCU:</strong> ESP32-S3 (dual-core 240MHz, WiFi+BLE)<br><strong>Memory:</strong> 8MB Flash, 2MB PSRAM<br><br><strong>Sensors Integrated:</strong><br>• BME680 — temp, humidity, pressure, VOC<br>• ICM-42688 — 6-axis IMU<br>• VEML7700 — ambient light<br>• SGP41 — NOx & VOC index<br>• SCD41 — CO₂ (photoacoustic)<br><br><strong>Connectivity:</strong><br>• WiFi 802.11 b/g/n • BLE 5.0<br>• I²C bus (2x) • SPI • UART<br>• USB-C (programming + power)<br><br><strong>Power:</strong><br>• LiPo 3.7V via TP4056 charger<br>• TPS63020 buck-boost (3.3V rail)<br>• Deep sleep: 10µA<br><br><em style='color:#ffb74d'>⚡ Board passed DRC — ready for fabrication</em>"
      },
      { g: "box", s: [.12, .025, .12], p: [-7.1, .97, -6.85], c: 0x111, em: 0x222, ei: 0.25 },
      { g: "box", s: [.08, .025, .08], p: [-6.8, .97, -6.75], c: 0x111, em: 0x222, ei: 0.25 },
      { g: "box", s: [.04, .025, .04], p: [-6.65, .97, -6.9], c: 0xf44336, em: 0xf44336, ei: 0.75 },
      { g: "box", s: [.04, .025, .04], p: [-6.55, .97, -6.9], c: 0x4caf50, em: 0x4caf50, ei: 0.75 },

      // Oscilloscope
      { g: "box", s: [.9, .65, .5], p: [-5.2, 1.25, -6.9], c: 0x1a237e,
        name: "Oscilloscope", interactable: true, promptText: "Use Oscilloscope", screenType: 'oscilloscope', anim: { type: 'pulse', speed: 1, amplitude: 0.1 },
        interactionText: "<strong>Siglent SDS2104X Plus — 4ch, 100MHz</strong><br><br><strong>Active Channels:</strong><br>• Ch1 (Yellow): 3.3V UART TX @ 115200 baud<br>• Ch2 (Cyan): SPI CLK 8MHz<br>• Ch3 (Magenta): SPI MOSI data<br>• Ch4 (Green): I²C SDA (400kHz)<br><br><strong>Measurements:</strong><br>• Ch1 Freq: 115.2kHz ±0.1%<br>• Ch2 Rise time: 4.2ns<br>• Ch3 Duty: 48.5% (data dependent)<br>• Cursor ΔT: 125ns (SPI bit period)<br><br><strong>Trigger:</strong> Ch1 rising edge, 1.6V threshold<br><strong>Timebase:</strong> 10µs/div<br><strong>FFT:</strong> 8MHz fundamental + harmonics at 24, 40MHz<br><br><em style='color:#80cbc4'>Signals clean. SPI timing meets datasheet specs.</em>"
      },
      { g: "box", s: [.6, .4, .01], p: [-5.2, 1.35, -6.64], c: 0x0d1117, em: 0x1a237e, ei: .7 },

      // Right workbench — detailed with drawers
      { g: "box", s: [4, .1, 2], p: [6, .87, -6.5], c: 0x6d4c41, em: 0x5d4037, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [4.1, .42, -7.4], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [7.9, .42, -7.4], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [4.1, .42, -5.6], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [7.9, .42, -5.6], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      // Right workbench drawers
      { g: "box", s: [1.2, .2, .02], p: [7, .6, -5.52], c: 0x5d4037, em: 0x4e342e, ei: 0.08 },
      { g: "box", s: [.08, .02, .02], p: [7, .6, -5.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3 },
      { g: "box", s: [1.2, .2, .02], p: [7, .4, -5.52], c: 0x5d4037, em: 0x4e342e, ei: 0.08 },
      { g: "box", s: [.08, .02, .02], p: [7, .4, -5.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3 },

      // Blueprint (blueprint paper with subtle glow)
      { g: "box", s: [1.4, .02, .9], p: [6, .93, -6.5], c: 0x1565c0, em: 0x0d47a1, ei: 0.25,
        name: "Blueprint", interactable: true, promptText: "Study Blueprint",
        interactionText: "<strong>Smart Home Controller v3.0 — System Architecture</strong><br><br><strong>Core Platform:</strong><br>• Compute: CM4 (4GB RAM, 32GB eMMC)<br>• OS: Custom Yocto Linux<br>• RTOS co-processor: STM32H7 (real-time I/O)<br><br><strong>Connectivity:</strong><br>• Thread 1.3 border router<br>• Matter 1.2 controller<br>• Zigbee 3.0 coordinator<br>• WiFi 6E + BLE 5.3<br>• Ethernet (PoE+ 802.3at)<br><br><strong>Subsystems:</strong><br>• HVAC: Modbus RTU to 8 zones<br>• Lighting: DALI-2, 32 addresses<br>• Security: 4x PoE cameras, 16 door contacts<br>• Energy: CT clamp metering, 48 circuits<br>• Audio: 6-zone amplifier, AirPlay 2<br><br><strong>Power:</strong> PoE+ primary, 12V UPS backup (4h)<br><br><em style='color:#ffb74d'>PCB v3.0 eliminates separate Zigbee module — integrated into main board</em>"
      },

      // Multimeter (yellow housing + screen glow)
      { g: "box", s: [.35, .18, .2], p: [7.5, .99, -6.6], c: 0xf57f17, em: 0xf9a825, ei: 0.2, mat: 'plastic', anim: { type: 'pulse', speed: 1.2, amplitude: 0.08 },
        name: "Multimeter", interactable: true, promptText: "Read Multimeter",
        interactionText: "<strong>Fluke 87V Industrial</strong><br><br><strong>Mode:</strong> DC Voltage<br><strong>Reading:</strong> 3.298V (±0.05%)<br><strong>Range:</strong> Auto (6V)<br><br><strong>Recent Measurements Log:</strong><br>1. USB 5V rail: 4.98V ✅<br>2. 3.3V LDO output: 3.298V ✅<br>3. Battery voltage: 3.82V (78%)<br>4. LED forward voltage: 2.1V (red)<br>5. Sensor resistance: 10.02kΩ ✅<br>6. Motor current: 340mA @ 12V<br><br><strong>Continuity:</strong> Ground plane — PASS<br><strong>Diode Test:</strong> D1 = 0.62V (Si), D2 = 0.31V (Schottky)<br><br><em style='color:#4caf50'>✓ All rails within ±2% of nominal</em>"
      },

      // 3D Printer (dark frame with indicator glow)
      { g: "box", s: [1, 1, 1], p: [8, .5, 2], c: 0x212121, em: 0x1a1a1a, ei: 0.1, mat: 'metalBrushed',
        name: "3D Printer", interactable: true, promptText: "Check 3D Printer", anim: { type: 'spin', speed: 2, amplitude: 0 },
        interactionText: "<strong>Prusa MK4S — FDM Printer</strong><br><br><strong>Current Job:</strong> Sensor enclosure v2.stl<br><strong>Progress:</strong> ████████░░ 78% (Layer 156/200)<br><strong>Time:</strong> 2h 15m / est. 2h 55m<br><br><strong>Settings:</strong><br>• Material: PETG (Prusament Galaxy Black)<br>• Nozzle: 0.4mm, 240°C<br>• Bed: 85°C (textured PEI sheet)<br>• Layer height: 0.2mm<br>• Infill: 20% gyroid<br>• Speed: 80mm/s<br>• Support: none (designed overhang-free)<br><br><strong>Filament:</strong> 47g used / 23g remaining on spool<br><br><strong>Queue:</strong><br>1. ✅ Sensor enclosure lid (done)<br>2. 🔄 Sensor enclosure base (printing)<br>3. ⏳ PCB standoffs x8<br>4. ⏳ Wall mount bracket<br><br><em style='color:#81c784'>Print quality: excellent, no defects detected</em>"
      },
      { g: "box", s: [.7, .02, .7], p: [8, .45, 2], c: 0x424242, em: 0x333, ei: 0.1 },
      { g: "box", s: [.15, .12, .1], p: [8.2, .52, 2], c: 0xff9800, em: 0xff9800, ei: 0.2 },

      // Power Supply (dark box with LED indicators)
      { g: "box", s: [.6, .35, .4], p: [-6, 1.1, -5.8], c: 0x424242, em: 0x333, ei: 0.1,
        name: "Power Supply Unit", interactable: true, promptText: "Inspect Power Supply",
        interactionText: "<strong>Rigol DP832A — Triple Output PSU</strong><br><br><strong>Channel 1:</strong> 30V / 3A max<br>• Set: 5.00V / 1.0A limit<br>• Actual: 4.98V / 0.34A (1.69W)<br>• Status: ✅ CV mode (constant voltage)<br><br><strong>Channel 2:</strong> 30V / 3A max<br>• Set: 3.30V / 0.5A limit<br>• Actual: 3.30V / 0.12A (0.40W)<br>• Status: ✅ CV mode<br><br><strong>Channel 3:</strong> 5V / 3A max<br>• Set: 12.0V / 2.0A limit — OFF<br><br><strong>Total Power:</strong> 2.09W<br><strong>OVP:</strong> Set to 5.5V (Ch1), 3.6V (Ch2)<br><strong>OCP:</strong> Set to 1.5A (Ch1), 0.8A (Ch2)<br><br><em style='color:#ffb74d'>Protections active. Output ripple &lt; 1mVpp.</em>"
      },
      { g: "sphere", s: [.02, 8, 8], p: [-6.25, 1.3, -5.6], c: 0x4caf50, em: 0x4caf50, ei: .6 },

      // Component Datasheet (white paper with glow)
      { g: "box", s: [.5, .01, .7], p: [5, .93, -5.8], c: 0xfafafa, em: 0xf5f5f5, ei: 0.2,
        name: "Component Datasheet", interactable: true, promptText: "Read Datasheet",
        interactionText: "<strong>ESP32-S3-WROOM-1 Datasheet (Excerpt)</strong><br><br><strong>CPU:</strong> Xtensa LX7 dual-core, up to 240MHz<br><strong>Memory:</strong> 512KB SRAM, 384KB ROM<br><strong>Flash:</strong> 4/8/16MB (external)<br><strong>PSRAM:</strong> Optional 2/8MB (OPI)<br><br><strong>Wireless:</strong><br>• WiFi 802.11 b/g/n, 2.4GHz<br>• Bluetooth 5.0 LE, mesh<br>• 150Mbps WiFi, long range mode<br><br><strong>Peripherals:</strong><br>• 45x GPIO (PWM, I²C, SPI, UART, I²S, ADC, DAC, touch)<br>• USB OTG 1.1 (built-in PHY)<br>• LCD interface (8/16-bit parallel)<br>• Camera interface (DVP 8/16-bit)<br>• TWAI (CAN bus compatible)<br><br><strong>Power:</strong><br>• Active: 30-240mA (depends on features)<br>• Deep sleep: 7µA (with RTC)<br>• Operating: -40°C to +85°C<br><br><em style='color:#80cbc4'>Perfect for IoT, AI edge inference, and HMI applications</em>"
      },

      // Soldering Station (dark base with iron glow)
      { g: "box", s: [.5, .3, .3], p: [-5, .87 + .15, -5.8], c: 0x37474f, em: 0x263238, ei: 0.25,
        name: "Soldering Station", interactable: true, promptText: "Use Soldering Station",
        interactionText: "<strong>Hakko FX-951 Soldering Station</strong><br><br><strong>Status:</strong> Standby (350°C set / 28°C actual)<br><strong>Tip:</strong> T15-D24 (chisel, 2.4mm)<br><br><strong>Settings:</strong><br>• Temperature: 350°C (662°F)<br>• Offset calibration: +3°C<br>• Auto-sleep: 10 min → 200°C<br>• Auto-off: 30 min<br><br><strong>Current Project — Sensor Board Assembly:</strong><br>1. ✅ SMD resistors (0402) — 24 placed<br>2. ✅ Capacitors (0603) — 18 placed<br>3. ✅ ESP32-S3 QFN — reflowed<br>4. 🔄 Connector headers — 3/6 soldered<br>5. ⏳ Test points & debug header<br><br><strong>Tips Available:</strong><br>• T15-D24 (chisel) — general SMD<br>• T15-BC2 (bevel) — fine pitch<br>• T15-K (knife) — drag soldering<br><br><em style='color:#ff9800'>⚠ Always use fume extraction when soldering</em>"
      },

      // Logic Analyzer (dark housing with screen glow)
      { g: "box", s: [.6, .12, .35], p: [7, .93, -5.8], c: 0x263238, em: 0x1a237e, ei: 0.2,
        name: "Logic Analyzer", interactable: true, promptText: "Check Logic Analyzer",
        interactionText: "<strong>Saleae Logic Pro 16</strong><br><br><strong>Channels:</strong> 16 digital / 8 analog<br><strong>Sample Rate:</strong> 500 MS/s (digital), 50 MS/s (analog)<br><br><strong>Active Capture — SPI Bus Analysis:</strong><br>• CLK: 8MHz, clean edges<br>• CS: Active low, 32-byte transactions<br>• MOSI: Register writes to BME680<br>• MISO: Sensor data readback<br><br><strong>Decoded Data:</strong><br>• Tx: [0x74, 0x01] → Set forced mode<br>• Rx: [0x1F, 0x82, 0x00, 0xA3...] → Raw ADC<br>• Temperature raw: 0x82A300 → 25.4°C ✅<br>• Humidity raw: 0x6C00 → 42.8% ✅<br><br><strong>Protocol Decoders Active:</strong><br>SPI, I²C, UART, 1-Wire<br><br><em style='color:#80cbc4'>All bus timings within spec. No framing errors.</em>"
      },

      // Server Rack
      { g: "box", s: [1.2, 2.5, .8], p: [-9, 1.25, 4], c: 0x1a1a1a,
        name: "Server Rack", interactable: true, promptText: "Review Server Rack", anim: { type: 'pulse', speed: 3, amplitude: 0.12 },
        interactionText: "<strong>Development Server Rack — 12U</strong><br><br><strong>U1-U2: Network Switch</strong><br>• Ubiquiti USW-24-PoE, 24 ports GbE<br>• PoE budget: 95W / 250W used<br><br><strong>U3-U4: NAS Storage</strong><br>• Synology RS1221+ (8-bay)<br>• 4x 8TB NAS drives, RAID-6<br>• Usable: 16TB, 62% used<br>• Git repos, build artifacts, backups<br><br><strong>U5-U6: Build Server</strong><br>• AMD Ryzen 9 7950X, 128GB ECC<br>• CI/CD: Jenkins + Docker<br>• Current load: 23% CPU, 41% RAM<br>• Active jobs: 3 firmware builds<br><br><strong>U7: UPS</strong><br>• APC SMT1500RM2U, 1440VA<br>• Battery: 98%, est. runtime: 45min<br>• Last transfer: 02/13 (power blip)<br><br><strong>Environment:</strong><br>• Inlet temp: 22°C • Humidity: 45%<br><br><em style='color:#4caf50'>All systems nominal ✓</em>"
      },
      { g: "sphere", s: [.02, 8, 8], p: [-8.4, 2.3, 3.62], c: 0x4caf50, em: 0x4caf50, ei: .8, anim: { type: 'shimmer', speed: 3, amplitude: 0.3 } },
      { g: "sphere", s: [.02, 8, 8], p: [-8.5, 2.1, 3.62], c: 0x2196f3, em: 0x2196f3, ei: .3, anim: { type: 'shimmer', speed: 2.5, amplitude: 0.25 } },
      { g: "sphere", s: [.02, 8, 8], p: [-8.6, 1.9, 3.62], c: 0x4caf50, em: 0x4caf50, ei: .8, anim: { type: 'shimmer', speed: 3.5, amplitude: 0.3 } },

      // Pegboard + tools — detailed with more tools and hooks
      { g: "box", s: [4, 2.5, .05], p: [-6, 2.5, -8.93], c: 0x4e342e, em: 0x3e2723, ei: 0.08 },
      // Pegboard holes pattern
      { g: "box", s: [.05, .6, .05], p: [-7.5, 2.8, -8.88], c: 0xf44336, em: 0xf44336, ei: 0.3 },
      { g: "box", s: [.05, .5, .05], p: [-7.1, 2.7, -8.88], c: 0xff9800, em: 0xff9800, ei: 0.3 },
      { g: "box", s: [.05, .4, .05], p: [-6.7, 2.6, -8.88], c: 0xffc107, em: 0xffc107, ei: 0.3 },
      { g: "box", s: [.05, .55, .05], p: [-6.3, 2.75, -8.88], c: 0x4caf50, em: 0x4caf50, ei: 0.3 },
      { g: "box", s: [.05, .35, .05], p: [-5.9, 2.55, -8.88], c: 0x2196f3, em: 0x2196f3, ei: 0.3 },
      { g: "box", s: [.05, .45, .05], p: [-5.5, 2.65, -8.88], c: 0x9c27b0, em: 0x9c27b0, ei: 0.3 },
      // Screwdrivers (rounded handles)
      { g: "cyl", s: [.02, .02, .3, 8], p: [-5.1, 2.6, -8.88], c: 0xf44336, em: 0xd32f2f, ei: 0.2 },
      { g: "cyl", s: [.02, .02, .25, 8], p: [-4.9, 2.55, -8.88], c: 0x2196f3, em: 0x1565c0, ei: 0.2 },
      // Wrench
      { g: "box", s: [.03, .4, .02], p: [-4.7, 2.6, -8.88], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3 },
      // Pliers
      { g: "box", s: [.03, .35, .02], p: [-4.5, 2.55, -8.88], c: 0x757575, em: 0x616161, ei: 0.25 },

      // Whiteboard — detailed with tray, markers, eraser
      { g: "box", s: [5, 3, .08], p: [2, 2.5, -8.93], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1 },
      // Tray
      { g: "box", s: [2, .05, .12], p: [2, 1, -8.85], c: 0x9e9e9e, em: 0x757575, ei: 0.2 },
      // Markers on tray
      { g: "cyl", s: [.01, .01, .12, 6], p: [1.5, 1.02, -8.85], c: 0xf44336, em: 0xf44336, ei: 0.7 },
      { g: "cyl", s: [.01, .01, .12, 6], p: [1.55, 1.02, -8.85], c: 0x2196f3, em: 0x2196f3, ei: 0.7 },
      { g: "cyl", s: [.01, .01, .12, 6], p: [1.6, 1.02, -8.85], c: 0x4caf50, em: 0x4caf50, ei: 0.7 },
      // Eraser
      { g: "box", s: [.12, .03, .06], p: [1.8, 1.02, -8.85], c: 0x424242, em: 0x333, ei: 0.25 },
      // Chair at left workbench (dark seat + chrome base)
      { g: "cyl", s: [.22, .22, .04, 16], p: [-6, .52, -4.8], c: 0x212121, em: 0x111, ei: 0.1 },
      { g: "cyl", s: [.035, .035, .45, 8], p: [-6, .28, -4.8], c: 0x424242, em: 0x616161, ei: 0.3 },
      // Chair at right workbench
      { g: "cyl", s: [.22, .22, .04, 16], p: [6, .52, -4.8], c: 0x212121, em: 0x111, ei: 0.1 },
      { g: "cyl", s: [.035, .035, .45, 8], p: [6, .28, -4.8], c: 0x424242, em: 0x616161, ei: 0.3 },
      // Ceiling lights — round with glow
      { g: "cyl", s: [.4, .4, .05, 16], p: [0, 4.45, 0], c: 0xfafafa, em: 0xffffff, ei: 0.2 },
      { g: "cyl", s: [.35, .35, .03, 16], p: [0, 4.43, 0], c: 0xffffff, em: 0xffffff, ei: 0.75 },
      // Overhead lamps (pendant style)
      { g: "cyl", s: [.4, .3, .06, 16], p: [-6, 4.2, -7], c: 0x757575, em: 0x616161, ei: 0.25 },
      { g: "cyl", s: [.4, .3, .06, 16], p: [6, 4.2, -7], c: 0x757575, em: 0x616161, ei: 0.25 },
      // Lamp cords
      { g: "cyl", s: [.005, .005, .3, 4], p: [-6, 4.05, -7], c: 0x333 },
      { g: "cyl", s: [.005, .005, .3, 4], p: [6, 4.05, -7], c: 0x333 },

      // ── NEW OBJECTS: Engineer Room Details ──

      // Cable spools (on left workbench surface)
      { g: "cyl", s: [.08, .08, .06, 12], p: [-7.2, .92, -6.2], c: 0xf44336, em: 0xd32f2f, ei: 0.2 },
      { g: "cyl", s: [.08, .08, .06, 12], p: [-6.95, .92, -6.2], c: 0x2196f3, em: 0x1565c0, ei: 0.2 },
      { g: "cyl", s: [.06, .06, .06, 12], p: [-6.7, .92, -6.2], c: 0x4caf50, em: 0x388e3c, ei: 0.2 },

      // Component bins (stacked on left workbench)
      { g: "box", s: [.25, .1, .18], p: [-7.5, .93, -5.8], c: 0x1565c0, em: 0x0d47a1, ei: 0.25 },
      { g: "box", s: [.25, .1, .18], p: [-7.5, 1.03, -5.8], c: 0x2196f3, em: 0x1565c0, ei: 0.25 },
      { g: "box", s: [.25, .1, .18], p: [-7.5, 1.13, -5.8], c: 0x42a5f5, em: 0x2196f3, ei: 0.25 },

      // Coffee mug (on right workbench)
      { g: "cyl", s: [.04, .035, .1, 12], p: [7.2, .97, -6.8], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1 },
      // Mug handle
      { g: "cyl", s: [.015, .015, .06, 8], p: [7.28, .97, -6.8], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1 },
      // Steam from mug — with float animation
      { g: "sphere", s: [.015, 6, 6], p: [7.2, 1.08, -6.8], c: 0xffffff, em: 0xffffff, ei: 0.3, op: 0.3, tr: true, anim: { type: 'float', speed: 2, amplitude: 0.02 } },

      // Desk lamp (articulated, on left workbench — positioned on surface)
      { g: "cyl", s: [.05, .05, .015, 12], p: [-7.5, .88, -6.5], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.012, .012, .22, 8], p: [-7.5, 1.0, -6.5], c: 0x616161, em: 0x424242, ei: 0.2 },
      { g: "cyl", s: [.012, .012, .18, 8], p: [-7.42, 1.12, -6.45], c: 0x616161, em: 0x424242, ei: 0.2 },
      { g: "cyl", s: [.05, .035, .035, 8], p: [-7.35, 1.22, -6.4], c: 0xfdd835, em: 0xfbc02d, ei: 0.2 },

      // Solder spool (on workbench)
      { g: "cyl", s: [.05, .05, .04, 12], p: [-5.5, .92, -6.8], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },

      // Wire stripper
      { g: "box", s: [.2, .04, .03], p: [-5.8, .92, -6.5], c: 0xf44336, em: 0xd32f2f, ei: 0.25 },

      // Breadboard (on right workbench surface)
      { g: "box", s: [.22, .008, .13], p: [5.5, .92, -6.3], c: 0xfafafa, em: 0xf5f5f5, ei: 0.08 },
      // Jumper wires on breadboard
      { g: "cyl", s: [.003, .003, .1, 4], p: [5.45, .93, -6.3], c: 0xf44336, em: 0xf44336, ei: 0.7 },
      { g: "cyl", s: [.003, .003, .08, 4], p: [5.5, .93, -6.3], c: 0x2196f3, em: 0x2196f3, ei: 0.7 },
      { g: "cyl", s: [.003, .003, .07, 4], p: [5.55, .93, -6.3], c: 0x4caf50, em: 0x4caf50, ei: 0.7 },

      // Ceiling light 2
      { g: "cyl", s: [.3, .3, .04, 16], p: [-6, 4.45, -7], c: 0xfafafa, em: 0xffffff, ei: 0.7 },
      { g: "cyl", s: [.25, .25, .03, 16], p: [6, 4.45, -7], c: 0xfafafa, em: 0xffffff, ei: 0.7 }
    ]
  },

  // ════════════════════════════════════════════
  // CHEMIST
  // ════════════════════════════════════════════
  {
    id: "chemist",
    title: "Chemist",
    icon: "🧪",
    description: "Chemistry lab: mix compounds, analyze reactions, follow safety protocols",
    accentColor: "#81c784",
    roomColor: 0x808080,
    floorColor: 0x505050,
    ceilingColor: 0x666666,
    fogColor: 0x2a3a48,
    roomSize: { width: 18, height: 4, depth: 16 },
    playerStart: { x: 0, y: 1.6, z: 6 },
    ambientColor: 0xf5f5f5,
    ambientIntensity: .5,
    lights: [
      { type: "point", color: 0xffffff, intensity: .8, pos: { x: 0, y: 3.5, z: 0 } },
      { type: "point", color: 0xe8f5e9, intensity: .4, pos: { x: -6, y: 3, z: -5 } },
      { type: "point", color: 0xfff3e0, intensity: .3, pos: { x: 6, y: 2.5, z: -5 } },
      { type: "point", color: 0xffffff, intensity: .3, pos: { x: 0, y: 3.5, z: 5 } }
    ],
    tasks: [
      { id: "t1", label: "Examine Blue Beaker", objectName: "Beaker — CuSO₄" },
      { id: "t2", label: "Study Periodic Table", objectName: "Periodic Table" },
      { id: "t3", label: "Read Safety Data Sheet", objectName: "Safety Data Sheet" },
      { id: "t4", label: "Use pH Meter", objectName: "pH Meter" },
      { id: "t5", label: "Check Fume Hood", objectName: "Fume Hood Controls" },
      { id: "t6", label: "Examine Centrifuge", objectName: "Centrifuge" },
      { id: "t7", label: "Use Analytical Balance", objectName: "Analytical Balance" },
      { id: "t8", label: "Read Lab Notebook", objectName: "Lab Notebook" },
      { id: "t9", label: "Check Spectrophotometer", objectName: "Spectrophotometer" },
      { id: "t10", label: "Examine Molecular Model", objectName: "Molecular Model" }
    ],
    objects: [
      // Main lab bench — detailed with epoxy surface + chrome legs + shelf
      { g: "box", s: [6, .1, 2.2], p: [0, .9, -3], c: 0x212121, em: 0x111, ei: 0.1, mat: 'concrete' },
      { g: "box", s: [.1, .85, .1], p: [-2.9, .45, -4], c: 0x424242, em: 0x616161, ei: 0.2 },
      { g: "box", s: [.1, .85, .1], p: [2.9, .45, -4], c: 0x424242, em: 0x616161, ei: 0.2 },
      { g: "box", s: [.1, .85, .1], p: [-2.9, .45, -2], c: 0x424242, em: 0x616161, ei: 0.2 },
      { g: "box", s: [.1, .85, .1], p: [2.9, .45, -2], c: 0x424242, em: 0x616161, ei: 0.2 },
      // Under-bench shelf
      { g: "box", s: [5.8, .03, 1.8], p: [0, .35, -3], c: 0x424242, em: 0x333, ei: 0.08 },
      // Bench edge trim
      { g: "box", s: [6.02, .02, .02], p: [0, .96, -1.9], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [6.02, .02, .02], p: [0, .96, -4.1], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },

      // Beaker CuSO4 (blue translucent glass with glow)
      { g: "cyl", s: [.14, .17, .35, 16], p: [-2, 1.13, -3.2], c: 0x42a5f5, em: 0x2196f3, ei: 0.3, op: .6, tr: true, mat: 'glass',
        name: "Beaker — CuSO₄", interactable: true, promptText: "Examine Blue Beaker",
        interactionText: "<strong>Beaker — 250mL Borosilicate</strong><br><br><strong>Contents:</strong> Copper(II) Sulfate Pentahydrate Solution<br><strong>Formula:</strong> CuSO₄·5H₂O (aq)<br><strong>Concentration:</strong> 0.50 mol/L (molar)<br><strong>Volume:</strong> ~200mL<br><strong>pH:</strong> 4.2 (mildly acidic)<br><br><strong>Physical Properties:</strong><br>• Color: Brilliant blue (d-d transition, Cu²⁺)<br>• Density: 1.08 g/mL<br>• λmax: 810nm (UV-Vis)<br><br><strong>Reactions Possible:</strong><br>1. <code>CuSO₄ + Fe → FeSO₄ + Cu↓</code> (displacement)<br>2. <code>CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄</code> (blue precipitate)<br>3. <code>CuSO₄ + Zn → ZnSO₄ + Cu↓</code> (electrochemistry)<br><br><em style='color:#f44336'>⚠ Irritant — PPE required: goggles + nitrile gloves</em>"
      },
      { g: "cyl", s: [.11, .14, .25, 16], p: [-2, 1.08, -3.2], c: 0x1565c0, op: .5, tr: true },
      // Beaker spout
      { g: "box", s: [.04, .02, .03], p: [-2.14, 1.3, -3.2], c: 0x90caf9, em: 0x42a5f5, ei: 0.25, op: .5, tr: true },
      // Graduation marks
      { g: "box", s: [.005, .01, .14], p: [-2.13, 1.15, -3.2], c: 0xffffff, em: 0xffffff, ei: 0.3 },
      { g: "box", s: [.005, .01, .14], p: [-2.13, 1.05, -3.2], c: 0xffffff, em: 0xffffff, ei: 0.3 },

      // Erlenmeyer Flask (green liquid with glow) — conical shape
      { g: "cyl", s: [.04, .14, .25, 16], p: [-.5, 1.07, -2.5], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: .4, tr: true, mat: 'glass' },
      // Flask body (wider bottom)
      { g: "cyl", s: [.12, .08, .12, 16], p: [-.5, .98, -2.5], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: .3, tr: true },
      // Green liquid inside
      { g: "cyl", s: [.1, .1, .15, 16], p: [-.5, 1.28, -2.5], c: 0xa5d6a7, em: 0x66bb6a, ei: 0.25, op: .5, tr: true },
      // Round bottom flask (red liquid with glow) — spherical body
      { g: "sphere", s: [.12, 16, 16], p: [1, 1.07, -3.5], c: 0xef9a9a, em: 0xef5350, ei: 0.2, op: .5, tr: true, mat: 'glass' },
      // Flask neck
      { g: "cyl", s: [.03, .03, .18, 8], p: [1, 1.25, -3.5], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: .4, tr: true },
      // Flask rim
      { g: "cyl", s: [.04, .04, .015, 12], p: [1, 1.35, -3.5], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.25 },

      // Bunsen burner — detailed with base, barrel, collar, flame
      { g: "cyl", s: [.1, .1, .03, 16], p: [.5, .97, -3.3], c: 0x616161, em: 0x424242, ei: 0.25, mat: 'metalBrushed' },
      // Gas inlet tube
      { g: "cyl", s: [.015, .015, .15, 6], p: [.6, .97, -3.2], c: 0x757575, em: 0x616161, ei: 0.1 },
      // Barrel
      { g: "cyl", s: [.035, .035, .28, 8], p: [.5, 1.14, -3.3], c: 0x757575, em: 0x616161, ei: 0.25 },
      // Collar (air adjustment)
      { g: "cyl", s: [.04, .04, .03, 12], p: [.5, 1.05, -3.3], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      // Outer flame (orange) — with shimmer animation
      { g: "sphere", s: [.045, 8, 8], p: [.5, 1.32, -3.3], c: 0xff6f00, em: 0xff6f00, ei: 1.2, anim: { type: 'shimmer', speed: 8, amplitude: 0.3 } },
      // Inner flame (blue) — with shimmer animation
      { g: "sphere", s: [.03, 8, 8], p: [.5, 1.36, -3.3], c: 0x2196f3, em: 0x2196f3, ei: 1.5, anim: { type: 'shimmer', speed: 10, amplitude: 0.4 } },

      // Periodic Table — detailed with frame + element tiles
      { g: "box", s: [3.5, 2, .03], p: [0, 2.5, -7.95], c: 0xffffff, em: 0xf5f5f5, ei: 0.1,
        name: "Periodic Table", interactable: true, promptText: "Study Periodic Table",
        interactionText: "<strong>Periodic Table of Elements — 2024 IUPAC</strong><br><br><strong>Featured: Element 29 — Copper (Cu)</strong><br>• Atomic mass: 63.546<br>• Group 11, Period 4, d-block<br>• Electron config: [Ar] 3d¹⁰ 4s¹<br>• Electronegativity: 1.90 (Pauling)<br><br><strong>Physical:</strong><br>• MP: 1,085°C • BP: 2,562°C<br>• Density: 8.96 g/cm³<br>• Crystal: FCC<br>• Color: Reddish-orange metallic<br><br><strong>Chemistry:</strong><br>• Oxidation states: +1, +2 (most common)<br>• Cu²⁺ forms blue solutions<br>• Cu⁺ forms colorless/white compounds<br>• Excellent electrical conductor (2nd to Ag)<br><br><strong>Applications:</strong><br>Wiring, plumbing, electronics, antimicrobial surfaces, catalysis, alloys (bronze, brass)<br><br><em style='color:#81c784'>Essential trace element for all aerobic organisms</em>"
      },
      // Element tiles (glowing colored squares)
      { g: "box", s: [.18, .18, .01], p: [-1.4, 3.2, -7.92], c: 0xf44336, em: 0xf44336, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [-1.15, 3.2, -7.92], c: 0x2196f3, em: 0x2196f3, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [-.9, 3.2, -7.92], c: 0x4caf50, em: 0x4caf50, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [-.65, 3.2, -7.92], c: 0xff9800, em: 0xff9800, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [-.4, 3.2, -7.92], c: 0x9c27b0, em: 0x9c27b0, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [-.15, 3.2, -7.92], c: 0xffeb3b, em: 0xffeb3b, ei: 0.5 },
      // More element tiles (row 2)
      { g: "box", s: [.18, .18, .01], p: [0.1, 3.2, -7.92], c: 0x00bcd4, em: 0x00acc1, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [0.35, 3.2, -7.92], c: 0x8bc34a, em: 0x7cb342, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [0.6, 3.2, -7.92], c: 0xff5722, em: 0xf4511e, ei: 0.5 },
      { g: "box", s: [.18, .18, .01], p: [0.85, 3.2, -7.92], c: 0x607d8b, em: 0x546e7a, ei: 0.5 },

      // Safety Data Sheet (yellow paper with glow)
      { g: "box", s: [.55, .75, .02], p: [7, 1.8, -7.95], c: 0xfff9c4, em: 0xfff176, ei: 0.2,
        name: "Safety Data Sheet", interactable: true, promptText: "Read Safety Data Sheet",
        interactionText: "<strong>Safety Data Sheet — Hydrochloric Acid</strong><br>HCl, CAS: 7647-01-0, 37% conc.<br><br><strong>GHS Hazards:</strong><br>🔶 Corrosive (Cat 1A) • 🔶 Acute toxicity (inhalation, Cat 3)<br>• H314: Severe skin burns, eye damage<br>• H331: Toxic if inhaled<br>• H290: Corrosive to metals<br><br><strong>Exposure Limits:</strong><br>• OSHA PEL: 5 ppm (ceiling)<br>• ACGIH TLV: 2 ppm (ceiling)<br>• IDLH: 50 ppm<br><br><strong>First Aid:</strong><br>• Eyes: Flush 20min, remove contacts<br>• Skin: Remove clothing, wash 15min<br>• Inhalation: Fresh air, O₂ if needed<br>• Ingestion: Rinse mouth, NO vomiting<br><br><strong>Spill Response:</strong><br>• Neutralize with NaHCO₃ (sodium bicarbonate)<br>• Absorb with inert material<br>• Ventilate area, wear full PPE<br><br><em style='color:#f44336'>⚠ Use ONLY in certified fume hood</em>"
      },

      // pH Meter (dark housing with screen glow)
      { g: "box", s: [.15, .3, .1], p: [2, 1.1, -3], c: 0x37474f, em: 0x263238, ei: 0.25,
        name: "pH Meter", interactable: true, promptText: "Use pH Meter",
        interactionText: "<strong>Mettler Toledo SevenEasy S20</strong><br><br><strong>Calibration:</strong> ✅ 3-point (pH 4.01, 7.00, 10.01)<br><strong>Last cal:</strong> Today, 09:15<br><strong>Slope:</strong> 98.2% (excellent)<br><br><strong>Recent Measurements:</strong><br><br>1. CuSO₄ solution: <strong>pH 4.18</strong> (acidic) ⬛🟦<br>2. NaOH 0.1M: <strong>pH 12.95</strong> (strong base) 🟪<br>3. Acetic acid 1M: <strong>pH 2.37</strong> (weak acid) 🟥<br>4. Buffer solution: <strong>pH 7.00</strong> (neutral) 🟩<br>5. HCl 0.01M: <strong>pH 2.00</strong> (strong acid) 🟥<br>6. NH₃ 0.1M: <strong>pH 11.12</strong> (weak base) 🟦<br><br><strong>Temperature:</strong> 23.5°C (auto-compensated)<br><br><em style='color:#81c784'>Electrode response time: &lt; 5 seconds. Replace electrode if slope &lt; 90%.</em>"
      },
      { g: "cyl", s: [.015, .015, .2, 8], p: [2, 1.35, -3], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.2 },

      // Fume Hood Controls
      { g: "box", s: [3, 2.5, 1.5], p: [-6, 1.25, -7], c: 0x90a4ae, op: .25, tr: true },
      { g: "box", s: [3.1, .08, 1.6], p: [-6, .02, -7], c: 0x78909c },
      { g: "box", s: [3.1, .08, 1.6], p: [-6, 2.5, -7], c: 0x78909c },
      { g: "box", s: [.25, .15, .15], p: [-4.6, 1, -6.2], c: 0x455a64,
        name: "Fume Hood Controls", interactable: true, promptText: "Check Fume Hood", anim: { type: 'bob', speed: 0.5, amplitude: 0.02 },
        interactionText: "<strong>Labconco Protector XStream — 6ft</strong><br><br><strong>Status:</strong> ✅ OPERATIONAL<br><strong>Sash Position:</strong> 18\" (working height)<br><strong>Face Velocity:</strong> 102 fpm (target: 100 ± 20)<br><br><strong>Monitoring:</strong><br>• Air flow: ADEQUATE ✅<br>• Exhaust fan: Running (1,200 RPM)<br>• Filter status: 68% life remaining<br>• UV lamp: OFF (manual activation)<br>• Gas valve: CLOSED<br>• Water valve: CLOSED<br><br><strong>Currently Inside:</strong><br>• 250mL HCl 37% (amber bottle)<br>• 500mL NaOH 1M<br>• Evaporating dish + watch glass<br>• Waste container (half full)<br><br><strong>Safety Features:</strong><br>• Auto sash closer (if velocity drops)<br>• Audible alarm at &lt; 60 fpm<br>• Emergency gas shutoff<br><br><em style='color:#4caf50'>Fume hood certified — next inspection: 06/2025</em>"
      },

      // Centrifuge (white housing with metallic sheen)
      { g: "cyl", s: [.25, .25, .2, 16], p: [5, 1.05, -3], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.25,
        name: "Centrifuge", interactable: true, promptText: "Examine Centrifuge",
        interactionText: "<strong>Eppendorf 5424R Microcentrifuge</strong><br><br><strong>Status:</strong> Ready (last run complete)<br><strong>Rotor:</strong> FA-45-24-11 (24x 1.5/2.0mL)<br><br><strong>Last Run Parameters:</strong><br>• Speed: 14,000 RPM (21,130 × g)<br>• Time: 10 minutes<br>• Temperature: 4°C<br>• Samples: 12x 1.5mL Eppendorf tubes<br>• Contents: Cell lysate — protein extraction<br><br><strong>Results:</strong><br>• Clear supernatant (protein fraction) ✅<br>• Compact pellet (cell debris) ✅<br>• No tube failures<br><br><strong>Rotor Options:</strong><br>• FA-45-24-11: 24x 1.5mL, max 21,130 × g<br>• FA-45-30-11: 30x 1.5mL, max 20,238 × g<br>• A-2-MTP: 2x microplates, max 3,220 × g<br><br><em style='color:#ff9800'>⚠ Always balance tubes before centrifugation</em>"
      },

      // Analytical Balance (white housing with screen)
      { g: "box", s: [.5, .25, .4], p: [-2, 1.08, -2.2], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1,
        name: "Analytical Balance", interactable: true, promptText: "Use Analytical Balance",
        interactionText: "<strong>Mettler Toledo XPR205 Analytical Balance</strong><br><br><strong>Specifications:</strong><br>• Capacity: 220g<br>• Readability: 0.01mg (10µg)<br>• Repeatability: 0.02mg<br>• Linearity: ±0.1mg<br><br><strong>Current Reading:</strong> 2.4973 g<br><strong>Tare:</strong> Active (weighing paper: 0.4521g subtracted)<br><br><strong>Recent Weighings:</strong><br>1. CuSO₄·5H₂O: <strong>6.2394g</strong> (for 0.1M, 250mL) ✅<br>2. NaCl: <strong>2.9221g</strong> (for 0.5M, 100mL) ✅<br>3. KMnO₄: <strong>0.7901g</strong> (for 0.02M, 250mL) ✅<br>4. Unknown sample: <strong>2.4973g</strong> (current)<br><br><strong>Calibration:</strong><br>• Internal cal: Passed (today 08:00)<br>• External weights: Due next week<br>• Draft shield: Closed ✅<br><br><em style='color:#81c784'>Balance is level and calibrated. Ready for use.</em>"
      },
      { g: "box", s: [.55, .01, .45], p: [-2, .96, -2.2], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1 },

      // Lab Notebook (dark cover with subtle glow)
      { g: "box", s: [.5, .04, .7], p: [2.5, .97, -2], c: 0x1a237e, em: 0x0d47a1, ei: 0.25,
        name: "Lab Notebook", interactable: true, promptText: "Read Lab Notebook",
        interactionText: "<strong>Lab Notebook — Experiment #47</strong><br><br><strong>Title:</strong> Synthesis of Copper Nanoparticles via Chemical Reduction<br><strong>Date:</strong> February 15, 2025<br><strong>Researcher:</strong> A. Martinez<br><br><strong>Objective:</strong><br>Synthesize Cu nanoparticles using CuSO₄ reduced by NaBH₄ in aqueous solution with PVP stabilizer.<br><br><strong>Procedure:</strong><br>1. Prepare 50mL CuSO₄ 0.1M solution<br>2. Add 2g PVP (MW 40,000), stir 30min<br>3. Prepare fresh NaBH₄ 0.2M (ice bath)<br>4. Add NaBH₄ dropwise (2mL/min) with vigorous stirring<br>5. Observe color change: blue → green → dark red/brown<br>6. Stir 2h at RT, then centrifuge 12,000g × 15min<br>7. Wash pellet 3x with ethanol, dry under N₂<br><br><strong>Observations:</strong><br>• Color change at 12min — nucleation onset<br>• Final suspension: deep reddish-brown<br>• Yield: estimated 85%<br><br><strong>Next:</strong> TEM imaging, DLS size measurement, XRD<br><br><em style='color:#ce93d8'>Promising results — particle size appears &lt; 50nm by visual assessment</em>"
      },

      // Spectrophotometer (dark housing with screen)
      { g: "box", s: [.7, .4, .5], p: [6, 1.15, -3], c: 0x37474f, em: 0x263238, ei: 0.1,
        name: "Spectrophotometer", interactable: true, promptText: "Check Spectrophotometer",
        interactionText: "<strong>Shimadzu UV-1900i UV-Vis Spectrophotometer</strong><br><br><strong>Mode:</strong> Photometric (single wavelength)<br><strong>Wavelength:</strong> 810nm<br><strong>Bandwidth:</strong> 1nm<br><br><strong>Current Sample:</strong> CuSO₄ 0.5M<br>• Absorbance: 0.847 A<br>• Transmittance: 14.2%<br><br><strong>Beer-Lambert Analysis:</strong><br><code>A = εlc</code><br>• ε (molar absorptivity) = 13.0 M⁻¹cm⁻¹ at 810nm<br>• l (path length) = 1.00 cm<br>• c (calculated) = 0.847 / 13.0 = 0.0651 M<br>• Dilution factor: 8x → original = 0.521 M ✅<br><br><strong>Calibration Curve (R² = 0.9994):</strong><br>0.1M → 0.130 A<br>0.2M → 0.261 A<br>0.3M → 0.389 A<br>0.5M → 0.652 A<br><br><em style='color:#81c784'>Instrument zeroed with DI water blank. Cuvette: quartz, 1cm.</em>"
      },
      { g: "box", s: [.35, .2, .01], p: [6, 1.4, -2.74], c: 0x0d1117, em: 0x1a237e, ei: .3 },

      // Molecular Model display stand
      { g: "cyl", s: [.1, .12, .02, 12], p: [4, .01, 1], c: 0x424242, em: 0x333, ei: 0.2 },
      { g: "cyl", s: [.01, .01, .82, 6], p: [4, .44, 1], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "cyl", s: [.06, .06, .02, 10], p: [4, .86, 1], c: 0x616161, em: 0x424242, ei: 0.25 },
      // Molecular Model (CPK colored spheres with glow) — with rotate3d animation
      { g: "sphere", s: [.12, 16, 16], p: [4, 1.03, 1], c: 0x212121, em: 0x111, ei: 0.1,
        name: "Molecular Model", interactable: true, promptText: "Examine Molecular Model", anim: { type: 'rotate3d', speed: 0.5, amplitude: 0 },
        interactionText: "<strong>Molecular Model — Caffeine (C₈H₁₀N₄O₂)</strong><br><br><strong>Molecular Weight:</strong> 194.19 g/mol<br><strong>IUPAC:</strong> 1,3,7-Trimethylxanthine<br><br><strong>Structure:</strong><br>• Bicyclic: fused pyrimidinedione + imidazole ring<br>• 3 methyl groups (N1, N3, N7)<br>• 2 carbonyl groups (C2, C6)<br>• Planar aromatic system<br><br><strong>Atoms in model:</strong><br>⚫ Carbon × 8 (black)<br>⚪ Hydrogen × 10 (white)<br>🔵 Nitrogen × 4 (blue)<br>🔴 Oxygen × 2 (red)<br><br><strong>Properties:</strong><br>• MP: 235°C (sublimes)<br>• Soluble in hot water<br>• pKa: 10.4 (very weak acid)<br>• Mechanism: adenosine receptor antagonist<br>• LD50 (oral, rat): 192 mg/kg<br><br><strong>Fun fact:</strong> An average cup of coffee contains 95mg of caffeine, roughly 2.95 × 10²⁰ molecules!<br><br><em style='color:#ce93d8'>This model uses CPK coloring convention</em>"
      },
      { g: "sphere", s: [.06, 12, 12], p: [4.15, 1.10, 1.1], c: 0xf44336, em: 0xf44336, ei: 0.7 },
      { g: "sphere", s: [.06, 12, 12], p: [3.85, 1.10, .9], c: 0x2196f3, em: 0x2196f3, ei: 0.7 },
      { g: "sphere", s: [.04, 8, 8], p: [4.22, 1.17, 1.15], c: 0xfafafa, em: 0xfafafa, ei: 0.3 },
      { g: "sphere", s: [.06, 12, 12], p: [4, 1.17, 1.15], c: 0x212121, em: 0x111, ei: 0.1 },

      // Test tube rack — detailed with wooden frame + glass tubes
      { g: "box", s: [.7, .12, .18], p: [1, .97, -3.5], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      // Rack sides
      { g: "box", s: [.02, .15, .18], p: [.65, 1.03, -3.5], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      { g: "box", s: [.02, .15, .18], p: [1.35, 1.03, -3.5], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      { g: "cyl", s: [.025, .025, .22, 8], p: [.75, 1.12, -3.5], c: 0xef9a9a, op: .7, tr: true },
      { g: "cyl", s: [.025, .025, .22, 8], p: [.87, 1.12, -3.5], c: 0xa5d6a7, op: .7, tr: true },
      { g: "cyl", s: [.025, .025, .22, 8], p: [.99, 1.12, -3.5], c: 0x90caf9, op: .7, tr: true },
      { g: "cyl", s: [.025, .025, .22, 8], p: [1.11, 1.12, -3.5], c: 0xfff59d, op: .7, tr: true },
      { g: "cyl", s: [.025, .025, .22, 8], p: [1.23, 1.12, -3.5], c: 0xce93d8, op: .7, tr: true },

      // Safety shower sign — detailed with triangle + text
      { g: "box", s: [.5, .5, .02], p: [8, 2.8, -7.95], c: 0x4caf50, em: 0x388e3c, ei: 0.2 },
      // Eye wash station — detailed with basin + nozzles
      { g: "box", s: [.45, .35, .3], p: [7.5, 1.2, -7.7], c: 0x4caf50, em: 0x388e3c, ei: 0.25 },
      { g: "cyl", s: [.015, .015, .08, 6], p: [7.42, 1.4, -7.65], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },
      { g: "cyl", s: [.015, .015, .08, 6], p: [7.58, 1.4, -7.65], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },
      // Fire extinguisher — detailed with handle, nozzle, pressure gauge
      { g: "cyl", s: [.08, .08, .4, 12], p: [8.5, .4, 4], c: 0xf44336, em: 0xd32f2f, ei: 0.2 },
      // Handle
      { g: "box", s: [.04, .04, .08], p: [8.5, .62, 4], c: 0x424242, em: 0x333, ei: 0.25 },
      // Nozzle
      { g: "cyl", s: [.01, .01, .06, 6], p: [8.55, .58, 4], c: 0x333, em: 0x222, ei: 0.1 },
      // Pressure gauge (tiny circle)
      { g: "cyl", s: [.015, .015, .005, 8], p: [8.5, .5, 3.92], c: 0xfafafa, em: 0xffffff, ei: 0.3 },
      // Lab stool — detailed with padded seat, chrome base, footrest ring
      { g: "cyl", s: [.22, .22, .05, 16], p: [0, .68, .5], c: 0x37474f, em: 0x263238, ei: 0.1 },
      // Padded seat (rounded)
      { g: "cyl", s: [.2, .2, .04, 12], p: [0, .72, .5], c: 0x455a64, em: 0x37474f, ei: 0.1 },
      // Chrome stem
      { g: "cyl", s: [.025, .025, .55, 8], p: [0, .38, .5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      // Footrest ring
      { g: "cyl", s: [.12, .12, .015, 12], p: [0, .35, .5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },
      // Base (5-star, simplified as cross)
      { g: "box", s: [.35, .015, .02], p: [0, .04, .5], c: 0x616161, em: 0x424242, ei: 0.2 },
      { g: "box", s: [.02, .015, .35], p: [0, .04, .5], c: 0x616161, em: 0x424242, ei: 0.2 },
      // Caster wheels (4)
      { g: "cyl", s: [.025, .025, .02, 8], p: [.15, .02, .65], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.025, .025, .02, 8], p: [-.15, .02, .65], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.025, .025, .02, 8], p: [.15, .02, .35], c: 0x424242, em: 0x333, ei: 0.25 },
      { g: "cyl", s: [.025, .025, .02, 8], p: [-.15, .02, .35], c: 0x424242, em: 0x333, ei: 0.25 },
      // Hazard diamond
      { g: "box", s: [.6, .6, .02], p: [8.95, 2.2, -2], c: 0xffffff, rot: { z: Math.PI / 4 } },
      // Waste bins — detailed with lids and labels
      { g: "cyl", s: [.18, .2, .4, 12], p: [-8, .21, 2], c: 0xf44336, em: 0xd32f2f, ei: 0.25 },
      { g: "cyl", s: [.19, .19, .02, 12], p: [-8, .42, 2], c: 0xd32f2f, em: 0xc62828, ei: 0.2 },
      { g: "cyl", s: [.18, .2, .4, 12], p: [-8, .21, 3], c: 0xffc107, em: 0xffa000, ei: 0.25 },
      { g: "cyl", s: [.19, .19, .02, 12], p: [-8, .42, 3], c: 0xffa000, em: 0xff8f00, ei: 0.2 },

      // ── NEW OBJECTS: Chemist Room Details ──

      // Wash bottle (on bench)
      { g: "cyl", s: [.04, .05, .18, 10], p: [-1.5, 1.04, -3.8], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.5, tr: true },
      // Wash bottle nozzle
      { g: "cyl", s: [.008, .008, .08, 6], p: [-1.5, 1.18, -3.75], c: 0x42a5f5, em: 0x2196f3, ei: 0.2 },

      // Safety goggles (on bench)
      { g: "box", s: [.18, .06, .08], p: [3, .96, -3.5], c: 0x42a5f5, em: 0x2196f3, ei: 0.25, op: 0.4, tr: true },
      { g: "cyl", s: [.04, .04, .02, 8], p: [2.93, .97, -3.5], c: 0x42a5f5, em: 0x2196f3, ei: 0.25, op: 0.4, tr: true },
      { g: "cyl", s: [.04, .04, .02, 8], p: [3.07, .97, -3.5], c: 0x42a5f5, em: 0x2196f3, ei: 0.25, op: 0.4, tr: true },
      // Goggle strap
      { g: "box", s: [.25, .015, .01], p: [3, .97, -3.5], c: 0x333, em: 0x222, ei: 0.1 },

      // Volumetric flask (on shelf)
      { g: "sphere", s: [.08, 12, 12], p: [-7.5, 1.05, -3], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.3, tr: true },
      { g: "cyl", s: [.015, .015, .15, 8], p: [-7.5, 1.18, -3], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.3, tr: true },

      // Drying rack (test tubes inverted)
      { g: "box", s: [.4, .02, .15], p: [3, .97, -2], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "cyl", s: [.012, .012, .08, 8], p: [2.88, 1.02, -2], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.4, tr: true },
      { g: "cyl", s: [.012, .012, .08, 8], p: [2.96, 1.02, -2], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.4, tr: true },
      { g: "cyl", s: [.012, .012, .08, 8], p: [3.04, 1.02, -2], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.4, tr: true },
      { g: "cyl", s: [.012, .012, .08, 8], p: [3.12, 1.02, -2], c: 0xe0e0e0, em: 0xbdbdbd, ei: 0.1, op: 0.4, tr: true },

      // Magnetic stirrer (on bench)
      { g: "box", s: [.2, .06, .2], p: [-1, .96, -2.5], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1 },
      { g: "cyl", s: [.06, .06, .01, 12], p: [-1, 1.0, -2.5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },

      // Ceiling light
      { g: "cyl", s: [.35, .35, .05, 16], p: [0, 3.95, 0], c: 0xfafafa, em: 0xffffff, ei: 0.2 },
      { g: "cyl", s: [.3, .3, .03, 16], p: [0, 3.93, 0], c: 0xffffff, em: 0xffffff, ei: 0.75 }
    ]
  },

  // ════════════════════════════════════════════
  // ARCHITECT
  // ════════════════════════════════════════════
  {
    id: "architect",
    title: "Architect",
    icon: "🏛️",
    description: "Design studio: review models, study plans, explore materials",
    accentColor: "#ab47bc",
    roomColor: 0x808080,
    floorColor: 0x505050,
    ceilingColor: 0x666666,
    fogColor: 0x2e3e50,
    roomSize: { width: 18, height: 4.5, depth: 16 },
    playerStart: { x: 0, y: 1.6, z: 6 },
    ambientColor: 0xfff8e1,
    ambientIntensity: .55,
    lights: [
      { type: "point", color: 0xffffff, intensity: .8, pos: { x: 0, y: 4, z: 0 } },
      { type: "point", color: 0xffe0b2, intensity: .4, pos: { x: -6, y: 3.5, z: -5 } },
      { type: "point", color: 0xe1bee7, intensity: .3, pos: { x: 6, y: 3.5, z: -5 } },
      { type: "spot", color: 0xffffff, intensity: .5, pos: { x: 0, y: 4.2, z: -5 }, target: { x: 0, y: 1, z: -5 } }
    ],
    tasks: [
      { id: "t1", label: "Review Scale Model", objectName: "Scale Model" },
      { id: "t2", label: "Study Floor Plan", objectName: "Floor Plan" },
      { id: "t3", label: "Check Material Samples", objectName: "Material Samples" },
      { id: "t4", label: "Review Building Code", objectName: "Building Code Manual" },
      { id: "t5", label: "Examine Elevation Drawing", objectName: "Elevation Drawing" },
      { id: "t6", label: "Use CAD Workstation", objectName: "CAD Workstation" },
      { id: "t7", label: "Check Site Survey", objectName: "Site Survey Map" },
      { id: "t8", label: "Review Sustainability Report", objectName: "Sustainability Report" }
    ],
    objects: [
      // Central display table (warm wood with subtle glow)
      { g: "box", s: [3, .1, 2], p: [0, .9, -3], c: 0x8d6e63, em: 0x6d4c41, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [-1.4, .42, -3.9], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [1.4, .42, -3.9], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [-1.4, .42, -2.1], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },
      { g: "box", s: [.1, .85, .1], p: [1.4, .42, -2.1], c: 0x5d4037, em: 0x4e342e, ei: 0.1, mat: 'wood' },

      // Scale Model — detailed with base, wings, green roof, glass atrium
      { g: "box", s: [1.2, .04, 1], p: [0, .94, -3], c: 0x8d6e63, em: 0x6d4c41, ei: 0.1 },
      // Main building body
      { g: "box", s: [1, .5, .8], p: [0, 1.2, -3], c: 0xefebe9, em: 0xd7ccc8, ei: 0.25,
        name: "Scale Model", interactable: true, promptText: "Review Scale Model",
        interactionText: "<strong>Scale Model — Greenfield Community Library</strong><br>Scale: 1:100<br><br><strong>Design Concept:</strong><br>Biophilic design with natural light optimization. The building form echoes an open book, with two wings meeting at a central atrium.<br><br><strong>Specifications:</strong><br>• Total area: 4,200 m² (45,200 ft²)<br>• 3 floors + rooftop garden<br>• Central atrium with skylight (12m span)<br>• Green roof: 800 m² sedum + wildflower<br>• Parking: 45 spaces + 20 bike racks<br><br><strong>Materials:</strong><br>• Structure: Cross-laminated timber (CLT)<br>• Facade: Triple-glazed curtain wall + terracotta louvers<br>• Interior: Exposed timber beams, polished concrete floors<br><br><strong>Sustainability:</strong><br>• LEED Platinum target<br>• Net-zero energy (PV array: 180 panels)<br>• Rainwater harvesting: 40,000L cistern<br>• Natural ventilation: 70% of occupied hours<br><br><em style='color:#ab47bc'>Client presentation: March 1, 2025</em>"
      },
      // Glass atrium (translucent blue)
      { g: "box", s: [.3, .7, .05], p: [-.2, 1.3, -3], c: 0x90caf9, em: 0x42a5f5, ei: 0.2, op: .3, tr: true, mat: 'glass' },
      // Green roof
      { g: "box", s: [.15, .15, .8], p: [.35, 1.55, -3], c: 0xa5d6a7, em: 0x66bb6a, ei: 0.2 },
      // Left wing
      { g: "box", s: [.3, .35, .6], p: [-.35, 1.12, -3], c: 0xd7ccc8, em: 0xbcaaa4, ei: 0.1 },
      // Right wing
      { g: "box", s: [.3, .35, .6], p: [.35, 1.12, -3], c: 0xd7ccc8, em: 0xbcaaa4, ei: 0.1 },
      // Entrance canopy
      { g: "box", s: [.2, .02, .15], p: [0, 1.0, -2.55], c: 0x8d6e63, em: 0x6d4c41, ei: 0.25 },

      // Floor Plan on wall (white paper with glow)
      { g: "box", s: [2.5, 1.8, .03], p: [-5, 2.2, -7.95], c: 0xffffff, em: 0xf5f5f5, ei: 0.2,
        name: "Floor Plan", interactable: true, promptText: "Study Floor Plan",
        interactionText: "<strong>Floor Plan — Ground Floor</strong><br><br><strong>Zone A — Public Entry (380 m²):</strong><br>• Reception desk & self-checkout (x4)<br>• Exhibition gallery (rotating)<br>• Café (30 seats, outdoor terrace)<br><br><strong>Zone B — Adult Collection (620 m²):</strong><br>• Open stacks: 25,000 volumes<br>• Reading lounge (40 seats, lake view)<br>• Quiet study carrels (16)<br>• Periodicals area<br><br><strong>Zone C — Children's Wing (450 m²):</strong><br>• Story-time amphitheater (50 seats)<br>• Interactive learning pods (x6)<br>• Maker space (3D printer, laser cutter)<br><br><strong>Zone D — Services (350 m²):</strong><br>• Meeting rooms (4x: 8-person, 1x: 30-person)<br>• Staff offices, workroom, loading dock<br>• Mechanical/electrical rooms<br>• Accessible restrooms (all floors)<br><br><strong>Circulation:</strong> Open staircase + 2 elevators (ADA compliant)<br><br><em style='color:#888'>Total ground floor: 1,800 m² — 62% public space</em>"
      },

      // Material Samples Board (warm tone with glow)
      { g: "box", s: [1.5, 1.2, .1], p: [5, 1.5, -7.85], c: 0xbcaaa4, em: 0x8d6e63, ei: 0.25,
        name: "Material Samples", interactable: true, promptText: "Check Material Samples",
        interactionText: "<strong>Material Sample Board — Project #2025-GL</strong><br><br><strong>1. Cross-Laminated Timber (CLT)</strong><br>• Species: Spruce (sustainably sourced, FSC)<br>• Panel: 5-ply, 175mm thick<br>• Fire rating: 2h (with intumescent coating)<br>• Carbon stored: 0.9 tCO₂/m³<br><br><strong>2. Terracotta Rain Screen</strong><br>• Color: Natural ochre (custom blend)<br>• Size: 300×600mm planks<br>• Ventilated cavity: 50mm<br>• Thermal mass benefit in summer<br><br><strong>3. Triple-Glazed IGU</strong><br>• U-value: 0.5 W/m²K<br>• SHGC: 0.35 (low solar gain)<br>• VLT: 62% (good daylight)<br>• Argon-filled, low-E coated<br><br><strong>4. Polished Concrete Floor</strong><br>• 30% fly ash replacement (low carbon)<br>• Radiant heating embedded<br>• Sealed with water-based silicate<br><br><strong>5. Acoustic Ceiling Panel</strong><br>• Recycled PET felt, NRC 0.85<br>• Custom CNC pattern (leaf motif)<br><br><em style='color:#ab47bc'>All materials meet LEED credit requirements</em>"
      },

      // Building Code Manual (red hardcover with glow, on side table left)
      { g: "box", s: [.4, .06, .55], p: [-6.3, .73, 2], c: 0xc62828, em: 0xb71c1c, ei: 0.2,
        name: "Building Code Manual", interactable: true, promptText: "Review Building Code",
        interactionText: "<strong>International Building Code 2024 (IBC)</strong><br><br><strong>Relevant Sections for Library Project:</strong><br><br><strong>Ch. 3 — Occupancy Classification:</strong><br>• Primary: A-3 (Assembly, library)<br>• Accessory: B (offices), M (café retail)<br>• Occupant load: 1 per 50 ft² (net, stacks)<br>• Calculated: 284 persons ground floor<br><br><strong>Ch. 10 — Means of Egress:</strong><br>• Min 2 exits per floor ✅<br>• Exit width: 0.2\" per occupant<br>• Travel distance: max 250 ft (sprinklered) ✅<br>• Dead-end corridors: max 50 ft ✅<br>• Illuminated exit signs required ✅<br><br><strong>Ch. 11 — Accessibility (ADA/ICC A117.1):</strong><br>• Accessible route to all public areas ✅<br>• Elevator serves all floors ✅<br>• Accessible parking: 3 spaces (2 van) ✅<br>• Assistive listening in meeting rooms ✅<br><br><strong>Ch. 7 — Fire Resistance:</strong><br>• Type III-B construction (CLT + non-combustible)<br>• 2-hour fire walls between occupancies<br>• Full sprinkler system (NFPA 13) ✅<br><br><em style='color:#ff9800'>⚠ Verify local amendments before permit submission</em>"
      },
      { g: "box", s: [1.5, .7, .8], p: [-6, .35, 2], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },

      // Elevation Drawing (white paper on wall with glow)
      { g: "box", s: [2, 1.5, .03], p: [8, 2, -3], c: 0xfafafa, em: 0xf5f5f5, ei: 0.2, rot: { y: -Math.PI / 2 },
        name: "Elevation Drawing", interactable: true, promptText: "Examine Elevation Drawing",
        interactionText: "<strong>South Elevation — Greenfield Library</strong><br><br><strong>Height Breakdown:</strong><br>• Ground floor: 0.00m to +4.50m (generous ceiling for stacks)<br>• 2nd floor: +4.50m to +8.00m<br>• 3rd floor: +8.00m to +11.00m<br>• Parapet/roof: +11.00m to +12.50m<br>• Green roof buildup: 250mm<br><br><strong>Facade Composition (South):</strong><br>• 60% glazing (maximized solar gain in winter)<br>• Automated external louvers (terracotta, motorized)<br>• Louver angle: 0° (winter) to 45° (summer)<br>• Solar shading simulation: 85% direct gain blocked in summer ✅<br><br><strong>Key Features Visible:</strong><br>• Main entrance canopy (CLT cantilever, 4m)<br>• Rooftop PV array (not visible from street level)<br>• Green wall on east staircore<br>• Rainwater downspouts integrated into columns<br><br><em style='color:#ab47bc'>Facade achieves excellent daylighting while meeting energy code</em>"
      },

      // CAD Workstation (dark desk + monitor with glow)
      { g: "box", s: [1.5, .7, 1], p: [6, .35, 3], c: 0x37474f, em: 0x263238, ei: 0.1 },
      { g: "box", s: [1, .7, .05], p: [6, 1.1, 2.55], c: 0x1a1a2e, em: 0x0d1117, ei: 0.1,
        name: "CAD Workstation", interactable: true, promptText: "Use CAD Workstation",
        interactionText: "<strong>BIM Workstation — Revit 2025</strong><br><br><strong>Hardware:</strong><br>• AMD Threadripper PRO 5975WX (32-core)<br>• 256GB ECC DDR5 RAM<br>• NVIDIA RTX A6000 (48GB VRAM)<br>• 2x 4TB NVMe SSD (RAID-0)<br>• 32\" 4K IPS + 27\" portrait<br><br><strong>Current Model:</strong> Greenfield Library v47.rvt<br>• File size: 380MB<br>• Elements: 42,847<br>• Warnings: 12 (all minor)<br>• Last sync: 14:22 today<br><br><strong>Active Views:</strong><br>• 3D section perspective (rendering)<br>• Structural framing plan — Level 2<br>• MEP coordination — mechanical<br><br><strong>Clash Detection (Navisworks):</strong><br>• Structure vs MEP: 3 clashes remaining<br>• Architecture vs Structure: 0 ✅<br>• MEP vs MEP: 1 (duct vs conduit at grid C-4)<br><br><strong>Render Queue:</strong><br>• Client presentation views (8 images)<br>• Estimated time: 2h 15m (V-Ray 6)<br><br><em style='color:#4caf50'>Model is 94% complete for DD submission</em>"
      },
      { g: "box", s: [.4, .3, .05], p: [6.5, 1.05, 2.55], c: 0x0d1117, em: 0x1a237e, ei: .2 },

      // Site Survey Map (light blue paper with glow)
      { g: "box", s: [1.2, .02, .9], p: [0, .71, 2], c: 0xe8eaf6, em: 0xc5cae9, ei: 0.1,
        name: "Site Survey Map", interactable: true, promptText: "Check Site Survey",
        interactionText: "<strong>Topographic Survey — 123 Lakeside Drive</strong><br><br><strong>Site Data:</strong><br>• Area: 8,500 m² (2.1 acres)<br>• Zoning: Institutional (I-1)<br>• Setbacks: Front 25', Side 15', Rear 30'<br>• Max height: 45' (13.7m) ✅<br>• FAR: 0.8 allowed, 0.49 proposed ✅<br><br><strong>Topography:</strong><br>• Elevation range: 142.3m to 145.8m (3.5m fall, N to S)<br>• Slope: 2.5% average (gentle)<br>• No flood zone (Zone X) ✅<br><br><strong>Existing Conditions:</strong><br>• 12 mature trees (8 to be preserved, 4 relocated)<br>• Municipal water & sewer at street<br>• Overhead power — to be buried<br>• Adjacent: residential (N,E), park (S), road (W)<br><br><strong>Geotechnical:</strong><br>• Soil: Sandy clay, bearing 3,000 psf<br>• Water table: 4.2m depth<br>• Foundation: Spread footings adequate<br>• No contamination detected ✅<br><br><em style='color:#81c784'>Site is ideal — minimal grading required</em>"
      },
      { g: "box", s: [1.8, .7, 1.2], p: [0, .35, 2], c: 0x6d4c41, em: 0x5d4037, ei: 0.1 },

      // Sustainability Report (green cover with glow, on side table right)
      { g: "box", s: [.45, .04, .6], p: [-5.65, .76, 2], c: 0x2e7d32, em: 0x1b5e20, ei: 0.2,
        name: "Sustainability Report", interactable: true, promptText: "Review Sustainability Report",
        interactionText: "<strong>Sustainability & Energy Report</strong><br><br><strong>Energy Model Results (eQUEST):</strong><br>• Annual energy use: 85 kBtu/ft²/yr<br>• Baseline (ASHRAE 90.1): 142 kBtu/ft²/yr<br>• Savings: 40% below baseline ✅<br><br><strong>Renewable Energy:</strong><br>• Rooftop PV: 180 panels × 400W = 72kW<br>• Annual generation: 95,000 kWh<br>• Building consumption: 92,000 kWh<br>• <strong>Net-zero achieved</strong> ✅ (103% offset)<br><br><strong>Water:</strong><br>• Low-flow fixtures: 42% reduction<br>• Rainwater harvesting: 40,000L cistern<br>• Irrigation: 100% non-potable<br>• Total water savings: 55%<br><br><strong>Materials:</strong><br>• Recycled content: 28% by cost<br>• Regional materials (500mi): 45% by cost<br>• FSC certified wood: 100%<br>• Embodied carbon: 35% below benchmark<br><br><strong>LEED Scorecard:</strong><br>• Possible: 110 pts • Targeted: 82 pts<br>• <strong>Certification level: PLATINUM (80+)</strong> 🏆<br><br><em style='color:#4caf50'>Carbon payback period: 8.5 years</em>"
      },

      // Drafting tools — detailed set
      // Golden ruler
      { g: "box", s: [.5, .02, .03], p: [.5, .97, -2.5], c: 0xffd54f, em: 0xffc107, ei: 0.3 },
      // Pencil
      { g: "cyl", s: [.008, .008, .25, 6], p: [-.3, .98, -2.5], c: 0x333, em: 0x222, ei: 0.1 },
      // Pencil tip
      { g: "cyl", s: [.008, .002, .03, 6], p: [-.3, .98, -2.62], c: 0xffd54f, em: 0xffc107, ei: 0.2 },
      // Eraser
      { g: "box", s: [.04, .02, .02], p: [-.3, .98, -2.35], c: 0xe91e63, em: 0xc2185b, ei: 0.25 },
      // Protractor (semi-circle)
      { g: "cyl", s: [.08, .08, .005, 12, 0, Math.PI], p: [.8, .97, -2.8], c: 0x90caf9, em: 0x42a5f5, ei: 0.25, op: 0.4, tr: true },
      // Pen holder (cylinder)
      { g: "cyl", s: [.04, .035, .1, 10], p: [.2, .97, -2.2], c: 0x424242, em: 0x333, ei: 0.25 },
      // Pens in holder
      { g: "cyl", s: [.005, .005, .12, 4], p: [.19, 1.03, -2.2], c: 0x2196f3, em: 0x1565c0, ei: 0.3 },
      { g: "cyl", s: [.005, .005, .1, 4], p: [.21, 1.02, -2.2], c: 0xf44336, em: 0xd32f2f, ei: 0.3 },
      { g: "cyl", s: [.005, .005, .11, 4], p: [.2, 1.025, -2.2], c: 0x333, em: 0x222, ei: 0.25 },
      // Bookshelf — detailed with books of various colors and sizes
      { g: "box", s: [1.5, 2.8, .4], p: [-8, 1.4, 0], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      // Shelves
      { g: "box", s: [1.4, .03, .35], p: [-8, .5, 0], c: 0x4e342e, em: 0x3e2723, ei: 0.08 },
      { g: "box", s: [1.4, .03, .35], p: [-8, 1, 0], c: 0x4e342e, em: 0x3e2723, ei: 0.08 },
      { g: "box", s: [1.4, .03, .35], p: [-8, 1.5, 0], c: 0x4e342e, em: 0x3e2723, ei: 0.08 },
      { g: "box", s: [1.4, .03, .35], p: [-8, 2, 0], c: 0x4e342e, em: 0x3e2723, ei: 0.08 },
      // Books row 1 (varied heights and colors)
      { g: "box", s: [.06, .35, .2], p: [-8.5, .68, 0], c: 0xc62828, em: 0xb71c1c, ei: 0.25 },
      { g: "box", s: [.05, .3, .2], p: [-8.4, .65, 0], c: 0x1565c0, em: 0x0d47a1, ei: 0.25 },
      { g: "box", s: [.07, .38, .2], p: [-8.3, .69, 0], c: 0x2e7d32, em: 0x1b5e20, ei: 0.25 },
      { g: "box", s: [.05, .28, .2], p: [-8.2, .64, 0], c: 0xf57f17, em: 0xf9a825, ei: 0.25 },
      { g: "box", s: [.06, .32, .2], p: [-8.1, .66, 0], c: 0x6a1b9a, em: 0x4a148c, ei: 0.25 },
      { g: "box", s: [.05, .34, .2], p: [-8.0, .67, 0], c: 0x00695c, em: 0x004d40, ei: 0.25 },
      { g: "box", s: [.06, .3, .2], p: [-7.9, .65, 0], c: 0xbf360c, em: 0xdd2c00, ei: 0.25 },
      { g: "box", s: [.05, .36, .2], p: [-7.8, .68, 0], c: 0x283593, em: 0x1a237e, ei: 0.25 },
      // Books row 2
      { g: "box", s: [.06, .32, .2], p: [-8.5, 1.16, 0], c: 0x00838f, em: 0x006064, ei: 0.25 },
      { g: "box", s: [.05, .28, .2], p: [-8.4, 1.14, 0], c: 0x827717, em: 0x827717, ei: 0.25 },
      { g: "box", s: [.07, .35, .2], p: [-8.3, 1.18, 0], c: 0x880e4f, em: 0x880e4f, ei: 0.25 },
      { g: "box", s: [.05, .3, .2], p: [-8.2, 1.15, 0], c: 0x33691e, em: 0x1b5e20, ei: 0.25 },
      { g: "box", s: [.06, .34, .2], p: [-8.1, 1.17, 0], c: 0x4e342e, em: 0x3e2723, ei: 0.25 },
      // Large window — detailed with frame, crossbars, sill
      { g: "box", s: [5, 2.5, .05], p: [0, 2.5, -7.95], c: 0xbbdefb, em: 0xbbdefb, ei: .2 },
      // Frame
      { g: "box", s: [5.1, .06, .08], p: [0, 3.8, -7.94], c: 0x8d6e63, em: 0x6d4c41, ei: 0.2 },
      { g: "box", s: [5.1, .06, .08], p: [0, 1.25, -7.94], c: 0x8d6e63, em: 0x6d4c41, ei: 0.2 },
      { g: "box", s: [.06, 2.5, .08], p: [-2.5, 2.5, -7.94], c: 0x8d6e63, em: 0x6d4c41, ei: 0.2 },
      { g: "box", s: [.06, 2.5, .08], p: [2.5, 2.5, -7.94], c: 0x8d6e63, em: 0x6d4c41, ei: 0.2 },
      // Crossbars
      { g: "box", s: [5, .04, .06], p: [0, 2.5, -7.94], c: 0x8d6e63, em: 0x6d4c41, ei: 0.2 },
      { g: "box", s: [.04, 2.5, .06], p: [0, 2.5, -7.94], c: 0x8d6e63, em: 0x6d4c41, ei: 0.2 },
      // Window sill
      { g: "box", s: [5.2, .06, .18], p: [0, 1.2, -7.88], c: 0x6d4c41, em: 0x5d4037, ei: 0.1 },
      // Plants — detailed with pots, soil, foliage, saucers (with wobble animation)
      // Plant 1 (large)
      { g: "cyl", s: [.18, .14, .35, 12], p: [7, .18, 6], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      { g: "cyl", s: [.19, .19, .02, 12], p: [7, .02, 6], c: 0x8d6e63, em: 0x6d4c41, ei: 0.1 },
      { g: "sphere", s: [.28, 10, 10], p: [7, .6, 6], c: 0x4caf50, em: 0x388e3c, ei: 0.25, anim: { type: 'wobble', speed: 0.8, amplitude: 0.1 } },
      // Extra leaves
      { g: "sphere", s: [.12, 8, 8], p: [7.15, .7, 6.1], c: 0x66bb6a, em: 0x4caf50, ei: 0.2, anim: { type: 'wobble', speed: 1.0, amplitude: 0.15 } },
      { g: "sphere", s: [.1, 8, 8], p: [6.85, .72, 5.9], c: 0x81c784, em: 0x66bb6a, ei: 0.2, anim: { type: 'wobble', speed: 1.2, amplitude: 0.12 } },
      // Plant 2 (small)
      { g: "cyl", s: [.12, .1, .25, 10], p: [-7, .13, 6], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      { g: "cyl", s: [.13, .13, .02, 10], p: [-7, .02, 6], c: 0x8d6e63, em: 0x6d4c41, ei: 0.1 },
      { g: "sphere", s: [.22, 10, 10], p: [-7, .48, 6], c: 0x388e3c, em: 0x2e7d32, ei: 0.25, anim: { type: 'wobble', speed: 0.9, amplitude: 0.12 } },
      { g: "sphere", s: [.1, 8, 8], p: [-6.88, .55, 6.08], c: 0x4caf50, em: 0x388e3c, ei: 0.2, anim: { type: 'wobble', speed: 1.1, amplitude: 0.14 } },
    ]
  },

  // ════════════════════════════════════════════
  // PILOT
  // ════════════════════════════════════════════
  {
    id: "pilot",
    title: "Pilot",
    icon: "✈️",
    description: "Cockpit simulator: check instruments, review checklists, plan flights",
    accentColor: "#ef5350",
    roomColor: 0x1e1e1e,
    floorColor: 0x222222,
    ceilingColor: 0x111111,
    fogColor: 0x1a2030,
    roomSize: { width: 12, height: 3.5, depth: 10 },
    playerStart: { x: 0, y: 1.6, z: 3 },
    ambientColor: 0xb0bec5,
    ambientIntensity: .25,
    lights: [
      { type: "point", color: 0xff8a65, intensity: .3, pos: { x: 0, y: 3, z: -3 } },
      { type: "point", color: 0x4fc3f7, intensity: .4, pos: { x: -3, y: 2.5, z: -3 } },
      { type: "point", color: 0x4fc3f7, intensity: .4, pos: { x: 3, y: 2.5, z: -3 } },
      { type: "point", color: 0x81d4fa, intensity: .2, pos: { x: 0, y: 3, z: 2 } }
    ],
    tasks: [
      { id: "t1", label: "Check Primary Flight Display", objectName: "Primary Flight Display" },
      { id: "t2", label: "Review Navigation Display", objectName: "Navigation Display" },
      { id: "t3", label: "Check Engine Instruments", objectName: "Engine Instruments" },
      { id: "t4", label: "Review Pre-Flight Checklist", objectName: "Pre-Flight Checklist" },
      { id: "t5", label: "Check Weather Radar", objectName: "Weather Radar" },
      { id: "t6", label: "Read Flight Plan", objectName: "Flight Plan" },
      { id: "t7", label: "Check Overhead Panel", objectName: "Overhead Panel" },
      { id: "t8", label: "Examine Radio Panel", objectName: "Radio Panel" }
    ],
    objects: [
      // Instrument panel — detailed with bezel, switch rows, indicator lights
      { g: "box", s: [5, 2, .15], p: [0, 1.5, -4.6], c: 0x1a1a1a, em: 0x111, ei: 0.08, mat: 'plastic' },
      // Panel bezel (frame)
      { g: "box", s: [5.1, .04, .18], p: [0, 2.52, -4.58], c: 0x333, em: 0x222, ei: 0.1 },
      { g: "box", s: [5.1, .04, .18], p: [0, .48, -4.58], c: 0x333, em: 0x222, ei: 0.1 },
      // Switch rows (tiny buttons)
      { g: "sphere", s: [.012, 6, 6], p: [-2, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 4, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [-1.8, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 3.5, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [-1.6, 2.3, -4.5], c: 0xf44336, em: 0xf44336, ei: 0.75, anim: { type: 'shimmer', speed: 5, amplitude: 0.3 } },
      { g: "sphere", s: [.012, 6, 6], p: [-1.4, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 4.5, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [-1.2, 2.3, -4.5], c: 0xffeb3b, em: 0xffeb3b, ei: 0.2, anim: { type: 'shimmer', speed: 3, amplitude: 0.25 } },
      { g: "sphere", s: [.012, 6, 6], p: [1.2, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 4, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [1.4, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 3.5, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [1.6, 2.3, -4.5], c: 0x2196f3, em: 0x2196f3, ei: 0.7, anim: { type: 'shimmer', speed: 4.5, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [1.8, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 3, amplitude: 0.2 } },
      { g: "sphere", s: [.012, 6, 6], p: [2, 2.3, -4.5], c: 0x4caf50, em: 0x4caf50, ei: 0.7, anim: { type: 'shimmer', speed: 4, amplitude: 0.2 } },
      // Glareshield
      { g: "box", s: [5, .1, .5], p: [0, 2.55, -4.45], c: 0x212121, em: 0x1a1a1a, ei: 0.08, mat: 'rubber' },
      // Center console — runs from seats to instrument panel
      { g: "box", s: [1, .8, 3.2], p: [0, .4, -2.6], c: 0x263238, em: 0x1a237e, ei: 0.08, mat: 'metalBrushed' },
      // Console screens (near instrument panel end)
      { g: "box", s: [.6, .15, .02], p: [0, .65, -3.8], c: 0x0d1117, em: 0x1a237e, ei: 0.3, screenType: 'crt', anim: { type: 'pulse', speed: 1, amplitude: 0.1 } },
      // Console knobs (mid-console)
      { g: "cyl", s: [.02, .02, .015, 8], p: [-.2, .65, -3.2], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3, mat: 'metalPolished' },
      { g: "cyl", s: [.02, .02, .015, 8], p: [-.1, .65, -3.2], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3, mat: 'metalPolished' },
      { g: "cyl", s: [.02, .02, .015, 8], p: [.1, .65, -3.2], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3, mat: 'metalPolished' },
      { g: "cyl", s: [.02, .02, .015, 8], p: [.2, .65, -3.2], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.3, mat: 'metalPolished' },
      // Cup holders (recessed, mid-console near seats)
      { g: "cyl", s: [.04, .04, .03, 10], p: [-.35, .82, -1.8], c: 0x333, em: 0x222, ei: 0.1 },
      { g: "cyl", s: [.04, .04, .03, 10], p: [.35, .82, -1.8], c: 0x333, em: 0x222, ei: 0.1 },
      // Coffee cup in holder
      { g: "cyl", s: [.025, .02, .05, 10], p: [-.35, .86, -1.8], c: 0xfafafa, em: 0xf5f5f5, ei: 0.1 },
      // Throttle quadrant — on center console near panel
      { g: "box", s: [.8, .15, .6], p: [0, .85, -3.5], c: 0x1a1a1a, em: 0x111, ei: 0.08 },
      // Throttle levers (rounded)
      { g: "cyl", s: [.025, .025, .18, 8], p: [-.15, .97, -3.5], c: 0x424242, em: 0x616161, ei: 0.3 },
      { g: "cyl", s: [.025, .025, .18, 8], p: [.15, .97, -3.5], c: 0x424242, em: 0x616161, ei: 0.3 },
      // Lever knobs (rounded tops)
      { g: "sphere", s: [.02, 8, 8], p: [-.15, 1.08, -3.5], c: 0x616161, em: 0x424242, ei: 0.2 },
      { g: "sphere", s: [.02, 8, 8], p: [.15, 1.08, -3.5], c: 0x616161, em: 0x424242, ei: 0.2 },
      // Speed brake lever
      { g: "cyl", s: [.015, .015, .12, 6], p: [-.3, .93, -3.5], c: 0x424242, em: 0x616161, ei: 0.25 },
      // Flap lever
      { g: "cyl", s: [.015, .015, .12, 6], p: [.3, .93, -3.5], c: 0x424242, em: 0x616161, ei: 0.25 },

      // Primary Flight Display
      { g: "box", s: [.9, .75, .02], p: [-1.5, 1.6, -4.52], c: 0x0a1628, em: 0x1a237e, ei: .9,
        name: "Primary Flight Display", interactable: true, promptText: "Check Primary Flight Display", screenType: 'gauge', anim: { type: 'pulse', speed: 1.5, amplitude: 0.2 },
        interactionText: "<strong>PFD — Primary Flight Display</strong><br><br><strong>Attitude:</strong><br>• Pitch: +2.5° nose up<br>• Bank: Wings level (0°)<br>• Flight Director: ON, CMD mode<br><br><strong>Airspeed (left tape):</strong><br>• IAS: 280 kts<br>• TAS: 452 kts<br>• Mach: 0.78<br>• Trend: Stable<br>• Vref: 138 kts (landing)<br><br><strong>Altitude (right tape):</strong><br>• Baro alt: FL370 (37,000 ft)<br>• Radio alt: N/A (above 2,500 AGL)<br>• VS: +50 fpm (level flight)<br>• QNH: 1013 hPa (STD)<br><br><strong>Heading:</strong> 247° MAG<br><strong>Track:</strong> 245° (2° wind correction)<br><br><strong>FMA (Flight Mode Annunciator):</strong><br>• Speed: MACH 0.78 (active)<br>• Lateral: LNAV (active)<br>• Vertical: VNAV ALT (active)<br>• A/P: CMD A engaged<br>• A/T: ARM<br><br><em style='color:#4fc3f7'>All parameters normal for cruise at FL370</em>"
      },

      // Navigation Display
      { g: "box", s: [.9, .75, .02], p: [1.5, 1.6, -4.52], c: 0x0a1628, em: 0x0d47a1, ei: .7,
        name: "Navigation Display", interactable: true, promptText: "Review Navigation Display", screenType: 'radar', anim: { type: 'pulse', speed: 0.8, amplitude: 0.12 },
        interactionText: "<strong>ND — Navigation Display</strong><br><br><strong>Mode:</strong> MAP, 160nm range<br><strong>Route:</strong> KJFK → EGLL (New York to London)<br><br><strong>Active Leg:</strong><br>• From: WHALE (N51°00' W030°00')<br>• To: GIPER (N51°30' W020°00')<br>• DTG: 287nm<br>• ETE: 38 min<br><br><strong>Route Summary:</strong><br>KJFK → MERIT → WHALE → GIPER → BAKUR → EGLL<br>• Total distance: 3,459nm<br>• Progress: 68% complete<br>• Time enroute: 5h 12m / est. 7h 38m<br><br><strong>Wind:</strong> 285°/78 kts (jetstream component)<br>• Headwind: 45 kts<br>• Crosswind: 63 kts (from right)<br>• Ground speed: 407 kts<br><br><strong>Traffic (TCAS):</strong><br>• 2 targets within 40nm<br>• Nearest: +2,000 ft, 12nm, converging<br>• Advisory: NONE<br><br><em style='color:#81c784'>ETA London Heathrow: 06:42 UTC</em>"
      },

      // Engine Instruments
      { g: "box", s: [1.2, .6, .02], p: [0, 1.2, -4.52], c: 0x0d1117, em: 0x1b5e20, ei: .3,
        name: "Engine Instruments", interactable: true, promptText: "Check Engine Instruments", screenType: 'crt', anim: { type: 'pulse', speed: 2, amplitude: 0.1 },
        interactionText: "<strong>EICAS — Engine Instruments</strong><br><br><strong>Engine 1 (Left):</strong><br>• N1: 89.2% (cruise thrust)<br>• N2: 95.1%<br>• EGT: 612°C (limit: 950°C) ✅<br>• FF: 2,840 kg/h<br>• Oil pressure: 42 PSI ✅<br>• Oil temp: 78°C ✅<br>• Vibration: 0.8 (limit: 4.0) ✅<br><br><strong>Engine 2 (Right):</strong><br>• N1: 89.4%<br>• N2: 95.2%<br>• EGT: 618°C ✅<br>• FF: 2,860 kg/h<br>• Oil pressure: 44 PSI ✅<br>• Oil temp: 76°C ✅<br>• Vibration: 0.7 ✅<br><br><strong>Fuel Status:</strong><br>• Total remaining: 38,400 kg<br>• Total fuel flow: 5,700 kg/h<br>• Endurance: 6h 44m<br>• Required to dest: 3h 10m + reserves<br>• Fuel margin: +8,200 kg ✅<br><br><em style='color:#4caf50'>Both engines operating normally</em>"
      },

      // Clipboard holder arm (mounted on left side of center console)
      { g: "cyl", s: [.008, .008, .35, 6], p: [-.55, .9, -2.5], c: 0x616161, em: 0x424242, ei: 0.2 },
      { g: "box", s: [.3, .015, .38], p: [-.55, .76, -2.5], c: 0x9e9e9e, em: 0x757575, ei: 0.1 },
      // Pre-Flight Checklist (yellow paper with glow, on clipboard holder)
      { g: "box", s: [.35, .5, .02], p: [-.55, 1.0, -2.5], c: 0xfff9c4, em: 0xfff176, ei: 0.2,
        name: "Pre-Flight Checklist", interactable: true, promptText: "Review Pre-Flight Checklist",
        interactionText: "<strong>B737-800 Normal Checklist</strong><br><br><strong>✅ COCKPIT PREPARATION:</strong><br>☑ Oxygen — Tested, 100%<br>☑ Flight instruments — Checked<br>☑ Parking brake — SET<br>☑ Fuel quantity — 18,200 kg each side<br><br><strong>✅ BEFORE START:</strong><br>☑ Doors — Closed<br>☑ Beacon — ON<br>☑ Thrust levers — IDLE<br>☑ FMS/CDU — Programmed & verified<br>☑ Takeoff data — V1:148, VR:152, V2:158<br><br><strong>✅ AFTER START:</strong><br>☑ Generators — ON<br>☑ Probe heat — ON<br>☑ Anti-ice — As required<br>☑ Hydraulics — Normal pressures<br><br><strong>✅ BEFORE TAKEOFF:</strong><br>☑ Flaps — 5 (set for takeoff)<br>☑ Trim — 5.2 units<br>☑ Flight controls — Checked & free<br>☑ Transponder — TA/RA<br>☑ CLEARED FOR TAKEOFF ✈️<br><br><em style='color:#4caf50'>All items completed — aircraft ready for departure</em>"
      },

      // Weather Radar
      { g: "box", s: [.7, .5, .02], p: [0, 2.1, -4.52], c: 0x0d1117, em: 0x1b5e20, ei: .2,
        name: "Weather Radar", interactable: true, promptText: "Check Weather Radar", screenType: 'radar', anim: { type: 'pulse', speed: 1, amplitude: 0.15 },
        interactionText: "<strong>WXR — Collins WXR-2100</strong><br><br><strong>Mode:</strong> WX+TURB, Tilt: -2°<br><strong>Range:</strong> 160nm<br><strong>Gain:</strong> CAL (calibrated)<br><br><strong>Current Weather:</strong><br>🟢 Light returns: 50-80nm ahead (scattered clouds)<br>🟡 Moderate returns: 120nm, 30° left (cell building)<br>🔴 Heavy returns: None on route ✅<br>🟣 Turbulence: Light chop 80nm ahead, FL350-FL390<br><br><strong>Significant Weather:</strong><br>• CB cluster at N49° W025° — 40nm south of route<br>• Tops reported FL450<br>• Movement: NE at 25 kts<br>• No threat to current routing ✅<br><br><strong>SIGMET Active:</strong><br>• SIGMET ECHO 3 — Moderate turbulence<br>• Area: 48N-52N, 020W-030W<br>• FL300-FL400<br>• Valid until 08:00 UTC<br><br><em style='color:#ff9800'>⚠ Monitor cell at W025° — may affect route in 2h if deviation north</em>"
      },

      // Flight Plan (white paper with glow)
      { g: "box", s: [.5, .02, .7], p: [2.2, .87, -1.5], c: 0xfafafa, em: 0xf5f5f5, ei: 0.2,
        name: "Flight Plan", interactable: true, promptText: "Read Flight Plan",
        interactionText: "<strong>Operational Flight Plan</strong><br><br><strong>Flight:</strong> BA178 | <strong>Date:</strong> 15FEB2025<br><strong>Aircraft:</strong> B777-200ER | G-VIIA<br><strong>Route:</strong> KJFK → EGLL<br><br><strong>Departure:</strong> KJFK Rwy 31L, SID: MERIT3<br><strong>Arrival:</strong> EGLL Rwy 27L, STAR: LOGAN1A<br><strong>Alternate:</strong> EGSS (Stansted)<br><br><strong>Route:</strong><br>MERIT DCT WHALE/N0478F370 NAT-A GIPER DCT BAKUR DCT EGLL<br><br><strong>Fuel Summary:</strong><br>• Trip fuel: 42,800 kg<br>• Contingency (5%): 2,140 kg<br>• Alternate: 3,200 kg<br>• Final reserve: 2,860 kg (30min hold)<br>• Taxi: 600 kg<br>• <strong>Block fuel: 51,600 kg</strong><br><br><strong>Times:</strong><br>• Block: 7h 38m<br>• ETD: 23:15 UTC (18:15 local)<br>• ETA: 06:53 UTC (06:53 local)<br><br><strong>Weights:</strong><br>• ZFW: 178,400 kg (max: 181,437)<br>• TOW: 229,400 kg (max: 247,208) ✅<br>• LDW: 186,600 kg (max: 201,841) ✅<br><br><em style='color:#4caf50'>Dispatch release: APPROVED ✅</em>"
      },

      // Overhead Panel
      { g: "box", s: [4, .15, 1.5], p: [0, 3.2, -3.5], c: 0x1a1a1a,
        name: "Overhead Panel", interactable: true, promptText: "Check Overhead Panel",
        interactionText: "<strong>Overhead Panel Systems Status</strong><br><br><strong>ELECTRICAL:</strong><br>• Battery: 28V ✅ | GEN 1: ON | GEN 2: ON<br>• APU GEN: Available (standby)<br>• Bus tie: AUTO<br><br><strong>HYDRAULIC:</strong><br>• System A: 3,000 PSI ✅ | Pump: ON<br>• System B: 3,000 PSI ✅ | Pump: ON<br>• Standby: Armed<br><br><strong>PNEUMATIC/BLEED:</strong><br>• Bleed 1: ON | Bleed 2: ON<br>• Pack 1: AUTO | Pack 2: AUTO<br>• Cabin alt: 6,200 ft (at FL370)<br>• Diff pressure: 7.8 PSI<br><br><strong>FUEL:</strong><br>• L tank: 19,200 kg | R tank: 19,200 kg<br>• Center: 0 kg (burned off)<br>• Crossfeed: CLOSED<br>• Fuel temp: -28°C (limit: -43°C) ✅<br><br><strong>ANTI-ICE:</strong><br>• Wing: OFF (TAT +3°C, no icing)<br>• Engine 1: OFF | Engine 2: OFF<br>• Probe heat: ON<br><br><em style='color:#4caf50'>All overhead systems normal ✓</em>"
      },
      // Overhead switch indicators
      { g: "sphere", s: [.015, 6, 6], p: [-1.2, 3.12, -3.2], c: 0x4caf50, em: 0x4caf50, ei: .9 },
      { g: "sphere", s: [.015, 6, 6], p: [-.9, 3.12, -3.2], c: 0x4caf50, em: 0x4caf50, ei: .9 },
      { g: "sphere", s: [.015, 6, 6], p: [-.6, 3.12, -3.2], c: 0x4caf50, em: 0x4caf50, ei: .9 },
      { g: "sphere", s: [.015, 6, 6], p: [.6, 3.12, -3.2], c: 0x2196f3, em: 0x2196f3, ei: .6 },
      { g: "sphere", s: [.015, 6, 6], p: [.9, 3.12, -3.2], c: 0x4caf50, em: 0x4caf50, ei: .9 },
      { g: "sphere", s: [.015, 6, 6], p: [1.2, 3.12, -3.2], c: 0x4caf50, em: 0x4caf50, ei: .9 },

      // Radio Panel (on center console near instrument panel)
      { g: "box", s: [.8, .35, .15], p: [0, .95, -3.9], c: 0x1a1a1a, em: 0x0d1117, ei: 0.1,
        name: "Radio Panel", interactable: true, promptText: "Examine Radio Panel",
        interactionText: "<strong>Radio Management Panel</strong><br><br><strong>VHF COM 1 (Active/Standby):</strong><br>• Active: 132.950 MHz — Shanwick Oceanic<br>• Standby: 127.650 MHz — Shannon ACC<br><br><strong>VHF COM 2:</strong><br>• Active: 121.500 MHz — Emergency (guard)<br>• Standby: 131.550 MHz — Company ACARS<br><br><strong>HF COM:</strong><br>• Primary: 5.616 MHz — NAT-A frequency<br>• Secondary: 8.906 MHz — backup<br><br><strong>NAV 1:</strong> 110.30 MHz — ILS 27L Heathrow (set for arrival)<br><strong>NAV 2:</strong> 113.60 MHz — LON VOR<br><br><strong>Transponder:</strong><br>• Code: 2174 (assigned)<br>• Mode: TA/RA (TCAS II v7.1)<br>• IDENT: Normal<br><br><strong>ACARS Messages:</strong><br>• 22:45 — PDC clearance received ✅<br>• 23:10 — ATIS EGLL Info 'K' received<br>• 01:30 — Position report WHALE sent ✅<br><br><em style='color:#4fc3f7'>SELCAL: AB-CD — Checked and verified</em>"
      },

      // Front windshield (large curved glass)
      { g: "box", s: [4, 1.8, .03], p: [0, 2.8, -4.8], c: 0x0d47a1, em: 0x0d47a1, ei: .1 },
      // Windshield frame
      { g: "box", s: [4.1, .04, .05], p: [0, 3.72, -4.79], c: 0x333, em: 0x222, ei: 0.1 },
      // Side windows (cockpit view) — with frames
      { g: "box", s: [2, 1.5, .05], p: [-3.5, 2.5, -4.8], c: 0x0d47a1, em: 0x0d47a1, ei: .15, rot: { y: .3 } },
      { g: "box", s: [2, 1.5, .05], p: [3.5, 2.5, -4.8], c: 0x0d47a1, em: 0x0d47a1, ei: .15, rot: { y: -.3 } },
      // Window frames
      { g: "box", s: [.04, 1.5, .06], p: [-2.5, 2.5, -4.78], c: 0x333, em: 0x222, ei: 0.1, rot: { y: .3 } },
      { g: "box", s: [.04, 1.5, .06], p: [-4.5, 2.5, -4.78], c: 0x333, em: 0x222, ei: 0.1, rot: { y: .3 } },
      { g: "box", s: [.04, 1.5, .06], p: [2.5, 2.5, -4.78], c: 0x333, em: 0x222, ei: 0.1, rot: { y: -.3 } },
      { g: "box", s: [.04, 1.5, .06], p: [4.5, 2.5, -4.78], c: 0x333, em: 0x222, ei: 0.1, rot: { y: -.3 } },
      // Yoke left (metallic grip + dark shaft)
      { g: "cyl", s: [.15, .15, .03, 16], p: [-2, 1.1, -3.2], c: 0x424242, em: 0x616161, ei: 0.2 },
      { g: "cyl", s: [.03, .03, .4, 8], p: [-2, .85, -3.2], c: 0x333, em: 0x222, ei: 0.1 },
      // Yoke right
      { g: "cyl", s: [.15, .15, .03, 16], p: [2, 1.1, -3.2], c: 0x424242, em: 0x616161, ei: 0.2 },
      { g: "cyl", s: [.03, .03, .4, 8], p: [2, .85, -3.2], c: 0x333, em: 0x222, ei: 0.1 },
      // Seats — detailed with cushion, headrest, armrests, seatbelt
      // Left seat
      { g: "box", s: [.7, .12, .6], p: [-2, .52, -1], c: 0x1a237e, em: 0x0d47a1, ei: 0.1 },
      { g: "cyl", s: [.3, .3, .08, 12], p: [-2, .6, -1], c: 0x1e88e5, em: 0x1565c0, ei: 0.08 },
      { g: "box", s: [.7, .8, .1], p: [-2, .9, -1.3], c: 0x1a237e, em: 0x0d47a1, ei: 0.1 },
      // Headrest
      { g: "box", s: [.4, .25, .06], p: [-2, 1.4, -1.32], c: 0x1a237e, em: 0x0d47a1, ei: 0.08 },
      // Armrests
      { g: "box", s: [.06, .03, .35], p: [-2.35, .7, -1.1], c: 0x333, em: 0x222, ei: 0.1 },
      { g: "box", s: [.06, .03, .35], p: [-1.65, .7, -1.1], c: 0x333, em: 0x222, ei: 0.1 },
      // Seatbelt (subtle line)
      { g: "box", s: [.03, .6, .01], p: [-1.85, .8, -.95], c: 0x757575, em: 0x616161, ei: 0.25 },
      // Right seat
      { g: "box", s: [.7, .12, .6], p: [2, .52, -1], c: 0x1a237e, em: 0x0d47a1, ei: 0.1 },
      { g: "cyl", s: [.3, .3, .08, 12], p: [2, .6, -1], c: 0x1e88e5, em: 0x1565c0, ei: 0.08 },
      { g: "box", s: [.7, .8, .1], p: [2, .9, -1.3], c: 0x1a237e, em: 0x0d47a1, ei: 0.1 },
      { g: "box", s: [.4, .25, .06], p: [2, 1.4, -1.32], c: 0x1a237e, em: 0x0d47a1, ei: 0.08 },
      { g: "box", s: [.06, .03, .35], p: [1.65, .7, -1.1], c: 0x333, em: 0x222, ei: 0.1 },
      { g: "box", s: [.06, .03, .35], p: [2.35, .7, -1.1], c: 0x333, em: 0x222, ei: 0.1 },
      { g: "box", s: [.03, .6, .01], p: [2.15, .8, -.95], c: 0x757575, em: 0x616161, ei: 0.25 },

      // Headset (hanging on left seat)
      { g: "cyl", s: [.06, .06, .02, 12], p: [-2.4, .9, -1.2], c: 0x212121, em: 0x111, ei: 0.1 },
      { g: "box", s: [.04, .08, .04], p: [-2.4, .82, -1.2], c: 0x212121, em: 0x111, ei: 0.1 },
      { g: "box", s: [.04, .08, .04], p: [-2.4, .98, -1.2], c: 0x212121, em: 0x111, ei: 0.1 },
      // Microphone boom
      { g: "cyl", s: [.005, .005, .1, 4], p: [-2.35, .85, -1.15], c: 0x333, em: 0x222, ei: 0.1 },

      // Flight bag (floor, right side)
      { g: "box", s: [.4, .25, .3], p: [3, .13, -1], c: 0x1a237e, em: 0x0d47a1, ei: 0.1 },
      // Bag handle
      { g: "box", s: [.2, .02, .02], p: [3, .27, -1], c: 0x333, em: 0x222, ei: 0.1 },
      // Zipper line
      { g: "box", s: [.35, .005, .005], p: [3, .26, -.85], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },

      // Rudder pedals (floor, under instrument panel)
      { g: "box", s: [.18, .1, .22], p: [-1.8, .06, -4.3], c: 0x424242, em: 0x616161, ei: 0.2 },
      { g: "box", s: [.18, .1, .22], p: [1.8, .06, -4.3], c: 0x424242, em: 0x616161, ei: 0.2 },
      // Pedal arms (connecting to center)
      { g: "box", s: [.02, .12, .35], p: [-1.8, .12, -4.5], c: 0x616161, em: 0x424242, ei: 0.25 },
      { g: "box", s: [.02, .12, .35], p: [1.8, .12, -4.5], c: 0x616161, em: 0x424242, ei: 0.25 },

      // Pedestal lights
      { g: "sphere", s: [.015, 6, 6], p: [-.35, .88, -1.8], c: 0x4caf50, em: 0x4caf50, ei: 1 },
      { g: "sphere", s: [.015, 6, 6], p: [.35, .88, -1.8], c: 0x4caf50, em: 0x4caf50, ei: 1 },
      // More pedestal indicator lights
      { g: "sphere", s: [.012, 6, 6], p: [-.5, .88, -1.8], c: 0x2196f3, em: 0x2196f3, ei: 0.75 },
      { g: "sphere", s: [.012, 6, 6], p: [.5, .88, -1.8], c: 0xffeb3b, em: 0xffeb3b, ei: 0.7 },

      // Cockpit floor (dark carpet, full width)
      { g: "box", s: [5, .02, 4.5], p: [0, .01, -2.25], c: 0x1a1a1a, em: 0x111, ei: 0.08 },

      // Overhead light (dome)
      { g: "cyl", s: [.15, .15, .03, 12], p: [0, 3.48, -2], c: 0xfafafa, em: 0xffffff, ei: 0.7 },
      { g: "cyl", s: [.12, .12, .02, 12], p: [0, 3.47, -2], c: 0xffffff, em: 0xffffff, ei: 0.2 },
    ]
  },

  // ════════════════════════════════════════════
  // CHEF
  // ════════════════════════════════════════════
  {
    id: "chef",
    title: "Chef",
    icon: "👨‍🍳",
    description: "Professional kitchen: prepare dishes, manage stations, follow recipes",
    accentColor: "#ff7043",
    roomColor: 0x607d60,
    floorColor: 0x808080,
    ceilingColor: 0x707070,
    fogColor: 0x1a2218,
    roomSize: { width: 16, height: 4, depth: 14 },
    playerStart: { x: 0, y: 1.6, z: 5 },
    ambientColor: 0xfff8e1,
    ambientIntensity: .5,
    lights: [
      { type: "point", color: 0xffffff, intensity: .8, pos: { x: 0, y: 3.5, z: 0 } },
      { type: "point", color: 0xffe0b2, intensity: .5, pos: { x: -5, y: 3, z: -4 } },
      { type: "point", color: 0xfff3e0, intensity: .4, pos: { x: 5, y: 3, z: -4 } },
      { type: "point", color: 0xffffff, intensity: .3, pos: { x: 0, y: 3.5, z: 4 } }
    ],
    tasks: [
      { id: "t1", label: "Check Gas Range", objectName: "Gas Range" },
      { id: "t2", label: "Examine Cutting Board", objectName: "Cutting Board" },
      { id: "t3", label: "Use Stand Mixer", objectName: "Stand Mixer" },
      { id: "t4", label: "Check Oven", objectName: "Convection Oven" },
      { id: "t5", label: "Read Recipe Book", objectName: "Recipe Book" },
      { id: "t6", label: "Inspect Walk-in Fridge", objectName: "Walk-in Fridge" },
      { id: "t7", label: "Check Deep Fryer", objectName: "Deep Fryer" },
      { id: "t8", label: "Examine Spice Rack", objectName: "Spice Rack" },
      { id: "t9", label: "Use Sauté Pan", objectName: "Sauté Station" },
      { id: "t10", label: "Check Plating Station", objectName: "Plating Station" }
    ],
    objects: [
      // Stainless steel prep table — center
      { g: "box", s: [5, .08, 1.8], p: [0, .92, -2], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2 },
      { g: "box", s: [.08, .85, .08], p: [-2.4, .45, -2.85], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [.08, .85, .08], p: [2.4, .45, -2.85], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [.08, .85, .08], p: [-2.4, .45, -1.15], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [.08, .85, .08], p: [2.4, .45, -1.15], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },

      // Gas Range (6-burner with grates)
      { g: "box", s: [1.5, .9, 1], p: [-5.5, .45, -5], c: 0x424242, em: 0x333, ei: 0.1,
        name: "Gas Range", interactable: true, promptText: "Check Gas Range", anim: { type: 'pulse', speed: 0.5, amplitude: 0.05 },
        interactionText: "<strong>Viking VGR5366B — 6-Burner Gas Range</strong><br><br><strong>Status:</strong> ✅ Operational<br><strong>Burner Output:</strong> 18,000 BTU each (108,000 total)<br><br><strong>Active Burners:</strong><br>• Front Left: 🔥 HIGH — stock pot (boiling water)<br>• Front Right: 🔥 MED — sauté pan (chicken breast)<br>• Back Left: 🔥 LOW — sauce pot (reduction)<br>• Back Right: OFF<br>• Center: 🔥 MED-HIGH — wok (stir fry prep)<br>• Griddle: 375°F — searing steaks<br><br><strong>Safety:</strong><br>• Flame failure device: ACTIVE ✅<br>• Gas leak detector: Normal<br>• Ventilation hood: 1,200 CFM ON ✅<br><br><strong>Today's Special:</strong> Pan-seared duck breast with cherry gastrique<br><em style='color:#ff7043'>🔥 Kitchen is fully operational — dinner service in 45 minutes</em>"
      },
      // Burner grates (6 small boxes)
      { g: "box", s: [.3, .02, .3], p: [-6, .93, -5.4], c: 0x333, em: 0x222, ei: 0.2 },
      { g: "box", s: [.3, .02, .3], p: [-5.5, .93, -5.4], c: 0x333, em: 0x222, ei: 0.2 },
      { g: "box", s: [.3, .02, .3], p: [-5, .93, -5.4], c: 0x333, em: 0x222, ei: 0.2 },
      { g: "box", s: [.3, .02, .3], p: [-6, .93, -4.6], c: 0x333, em: 0x222, ei: 0.2 },
      { g: "box", s: [.3, .02, .3], p: [-5.5, .93, -4.6], c: 0x333, em: 0x222, ei: 0.2 },
      { g: "box", s: [.3, .02, .3], p: [-5, .93, -4.6], c: 0x333, em: 0x222, ei: 0.2 },
      // Burner flames (animated)
      { g: "sphere", s: [.08, 6, 6], p: [-6, .97, -5.4], c: 0xff6f00, em: 0xff6f00, ei: 1.0, anim: { type: 'shimmer', speed: 8, amplitude: 0.3 } },
      { g: "sphere", s: [.06, 6, 6], p: [-5, .97, -5.4], c: 0xff6f00, em: 0xff6f00, ei: 0.8, anim: { type: 'shimmer', speed: 6, amplitude: 0.25 } },

      // Cutting Board (on prep table)
      { g: "box", s: [.6, .04, .4], p: [-1, .96, -2], c: 0x8d6e63, em: 0x6d4c41, ei: 0.15,
        name: "Cutting Board", interactable: true, promptText: "Examine Cutting Board",
        interactionText: "<strong>Boos Block walnut cutting board — 18\" x 12\"</strong><br><br><strong>Current Prep:</strong><br>• Diced onions (1/4 inch) — 2 cups ✅<br>• Minced garlic — 6 cloves ✅<br>• Julienned carrots — matchstick cut<br>• Chiffonade basil — for garnish<br><br><strong>Knife in use:</strong> Wüsthof 8\" Chef's Knife (56 HRC)<br><br><strong>Food Safety:</strong><br>• Board sanitized: 10 min ago ✅<br>• Color coding: 🟤 BROWN = cooked foods / general<br><br><em style='color:#ff7043'>Keep board oiled with mineral oil weekly. Replace when deeply grooved.</em>"
      },
      // Knife on board
      { g: "box", s: [.02, .01, .35], p: [-.7, .98, -2], c: 0xcfd8dc, em: 0xbdbdbd, ei: 0.4 },
      { g: "box", s: [.04, .03, .12], p: [-.7, .99, -1.75], c: 0x4e342e, em: 0x3e2723, ei: 0.15 },

      // Stand Mixer (KitchenAid)
      { g: "cyl", s: [.2, .18, .3, 16], p: [1.5, 1.05, -2.5], c: 0xc62828, em: 0xb71c1c, ei: 0.2 },
      { g: "sphere", s: [.08, 12, 12], p: [1.5, 1.3, -2.5], c: 0xc62828, em: 0xb71c1c, ei: 0.15,
        name: "Stand Mixer", interactable: true, promptText: "Use Stand Mixer",
        interactionText: "<strong>KitchenAid Professional 600 — 6Qt</strong><br><br><strong>Speed:</strong> 4 (Medium-Low)<br><strong>Attachment:</strong> Flat beater<br><strong>Timer:</strong> 8:32 remaining<br><br><strong>Current Recipe — Brioche Dough:</strong><br>• 500g bread flour ✅<br>• 100g sugar ✅<br>• 10g salt ✅<br>• 7g instant yeast ✅<br>• 5 eggs, room temp ✅<br>• 200g butter, softened 🔄 (adding gradually)<br><br><strong>Mixing stages:</strong><br>1. ✅ Dry ingredients combined<br>2. ✅ Eggs incorporated<br>3. 🔄 Butter being added (4 of 8 pieces)<br>4. ⏳ Final knead — 10 min on speed 2<br><br><strong>Available attachments:</strong> dough hook, whisk, pasta roller, meat grinder<br><em style='color:#ff7043'>⚠ Never exceed speed 2 with heavy dough. Use splash guard for liquids.</em>"
      },

      // Convection Oven
      { g: "box", s: [1.5, 1.2, 1], p: [-5.5, .6, -2], c: 0x424242, em: 0x333, ei: 0.1,
        name: "Convection Oven", interactable: true, promptText: "Check Oven", anim: { type: 'pulse', speed: 0.8, amplitude: 0.08 },
        interactionText: "<strong>Rational iCombi Pro 20-1/1</strong><br><br><strong>Mode:</strong> Combi-steam (auto)<br><strong>Temperature:</strong> 375°F (190°C) — actual: 373°F<br><strong>Humidity:</strong> 30%<br><strong>Timer:</strong> 12:45 remaining<br><br><strong>Current Load:</strong><br>• GN 1/1 Pan 1: Herb-crusted rack of lamb (8 portions)<br>• GN 1/1 Pan 2: Roasted root vegetables<br>• GN 1/1 Pan 3: Dinner rolls (proofing, 85°F)<br><br><strong>Programs Available:</strong><br>• Bake (dry heat, up to 570°F)<br>• Steam (100% humidity, up to 265°F)<br>• Combi (variable humidity 10-90%)<br>• Low temp (122°F-212°F for sous vide style)<br>• Regenerate (reheat without drying)<br><br><strong>Cleaning:</strong> Last auto-clean: 06:00 today ✅<br><em style='color:#ff9800'>⚠ Door gets extremely hot during operation. Use heat-resistant gloves.</em>"
      },
      // Oven handle
      { g: "cyl", s: [.015, .015, .5, 8], p: [-5.5, .6, -1.48], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.3 },
      // Oven window (amber glow)
      { g: "box", s: [.8, .6, .02], p: [-5.5, .7, -1.48], c: 0xffe0b2, em: 0xffcc80, ei: 0.15, op: 0.3, tr: true },

      // Recipe Book (on side table)
      { g: "box", s: [1.2, .6, .8], p: [5, .3, 2], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },
      { g: "box", s: [.5, .06, .6], p: [5, .7, 2], c: 0xc62828, em: 0xb71c1c, ei: 0.2,
        name: "Recipe Book", interactable: true, promptText: "Read Recipe Book",
        interactionText: "<strong>Escoffier — Le Guide Culinaire (Revised Edition)</strong><br><br><strong>Open to: Page 347 — Duck à l'Orange</strong><br><br><strong>Ingredients:</strong><br>• 1 whole duck (5-6 lbs), cavity dried<br>• 6 blood oranges (4 juiced, 2 supremed)<br>• 3 tbsp Grand Marnier<br>• 2 tbsp sugar + 3 tbsp sherry vinegar<br>• 1 cup rich duck stock<br>• Thyme, bay leaf, black pepper<br>• 2 tbsp cold butter (monte au beurre)<br><br><strong>Method:</strong><br>1. Score skin in crosshatch (do NOT pierce meat)<br>2. Season generously, rest 30 min at room temp<br>3. Roast breast-side down at 425°F for 20 min<br>4. Flip, reduce to 350°F for 40 min<br>5. Rest 15 min before carving<br>6. Deglaze pan, build gastrique sauce<br>7. Plate with orange supremes and microgreens<br><br><strong>Chef's Note:</strong> The key is rendering the fat slowly — patience yields crispy skin.<br><em style='color:#ff7043'>📖 One of the 5 Mother Sauces forms the base of the gastrique</em>"
      },

      // Walk-in Fridge (large door)
      { g: "box", s: [2.5, 2.8, .1], p: [7, 1.4, -6.9], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.15,
        name: "Walk-in Fridge", interactable: true, promptText: "Check Walk-in Fridge",
        interactionText: "<strong>True Manufacturing TUR-4F — Walk-in Cooler</strong><br><br><strong>Status:</strong> ✅ Running<br><strong>Temperature:</strong> 36.2°F (2.3°C) — target: 35-38°F<br><strong>Humidity:</strong> 82%<br><strong>Compressor:</strong> Cycle #847 (normal)<br><br><strong>Contents (organized by station):</strong><br>• Proteins: Wagyu striploin, halibut, chicken suprême, lamb rack<br>• Dairy: Heavy cream, butter (Plugrá), crème fraîche, Parmigiano<br>• Produce: Microgreens, heirloom tomatoes, baby spinach, truffles<br>• Sauces: Demi-glace (5L), beurre blanc, romesco<br>• Prepped: Mise en place for tonight's tasting menu (12 covers)<br><br><strong>Rotation Log:</strong><br>• FIFO followed ✅ — date labels on all containers<br>• FIFO violations: 0 this week ✅<br><br><em style='color:#42a5f5'>❄ Door alarm: opens left. Self-closing hinge. Keep closed during service.</em>"
      },
      // Fridge handle
      { g: "cyl", s: [.015, .015, .4, 8], p: [7, 1.4, -6.84], c: 0x616161, em: 0x424242, ei: 0.3 },
      // Fridge indicator light
      { g: "sphere", s: [.02, 8, 8], p: [7, 2.8, -6.84], c: 0x4caf50, em: 0x4caf50, ei: 0.8 },

      // Deep Fryer
      { g: "box", s: [.6, .7, .6], p: [-5.5, .35, 1], c: 0xbdbdbd, em: 0x9e9e9e, ei: 0.2,
        name: "Deep Fryer", interactable: true, promptText: "Check Deep Fryer",
        interactionText: "<strong>Hobart 404D — Double Basket Fryer</strong><br><br><strong>Status:</strong> ✅ Ready<br><strong>Oil Temp:</strong> 375°F (target: 350-380°F)<br><strong>Oil Level:</strong> Full — canola blend, 40L<br><strong>Filtration:</strong> Auto-filtered 2 hours ago ✅<br><br><strong>Active Baskets:</strong><br>• Basket A: French fries (Russet, double-fried) — DONE ✅<br>• Basket B: Tempura shrimp — draining<br><br><strong>Fry Schedule:</strong><br>1. ✅ Fries — 3 min at 325°F, then 3 min at 375°F<br>2. 🔄 Tempura — 2.5 min at 365°F<br>3. ⏳ Calamari — 1.5 min at 375°F<br><br><strong>Safety:</strong><br>• Fire suppression: Ansul R-102 ✅<br>• Auto shutoff on high temp (450°F)<br>• Never fill above MAX line<br><em style='color:#f44336'>⚠ NEVER use water on oil fires. Keep Class K extinguisher accessible.</em>"
      },
      // Fryer baskets
      { g: "box", s: [.25, .01, .35], p: [-5.7, .72, 1], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },
      { g: "box", s: [.25, .01, .35], p: [-5.3, .72, 1], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },

      // Spice Rack (wall-mounted, labeled jars)
      { g: "box", s: [2, .8, .2], p: [0, 2.5, -6.9], c: 0x5d4037, em: 0x4e342e, ei: 0.1,
        name: "Spice Rack", interactable: true, promptText: "Examine Spice Rack",
        interactionText: "<strong>Spice Rack — Organized by Cuisine</strong><br><br><strong>Top Row (Indian/Asian):</strong><br>• Turmeric (bright yellow) • Cumin • Coriander • Garam Masala<br>• Szechuan pepper • Star anise • Five spice • Cardamom<br><br><strong>Middle Row (Mediterranean):</strong><br>• Smoked paprika • Oregano • Thyme • Rosemary<br>• Za'atar • Sumac • Aleppo pepper • Za'atar<br><br><strong>Bottom Row (Baking/Essentials):</strong><br>• Cinnamon (Ceylon) • Nutmeg (whole, for grating)<br>• Vanilla bean • Saffron threads • Fleur de sel<br>• Black pepper (Tellicherry) • White pepper • Pink salt<br><br><strong>Fresh Herbs (refrigerated):</strong><br>Basil, cilantro, chives, tarragon, mint — stored in damp towels<br><br><em style='color:#ff7043'>Rule: If you can't smell it when you open the jar, replace it. Spices lose potency after 6 months.</em>"
      },
      // Spice jars (12 colored dots)
      { g: "cyl", s: [.035, .035, .1, 8], p: [-.8, 2.7, -6.82], c: 0xffa000, em: 0xff8f00, ei: 0.5 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [-.6, 2.7, -6.82], c: 0x795548, em: 0x5d4037, ei: 0.4 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [-.4, 2.7, -6.82], c: 0xc62828, em: 0xb71c1c, ei: 0.5 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [-.2, 2.7, -6.82], c: 0x2e7d32, em: 0x1b5e20, ei: 0.4 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [0, 2.7, -6.82], c: 0x8d6e63, em: 0x6d4c41, ei: 0.4 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [.2, 2.7, -6.82], c: 0xff6f00, em: 0xe65100, ei: 0.5 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [.4, 2.7, -6.82], c: 0x1565c0, em: 0x0d47a1, ei: 0.4 },
      { g: "cyl", s: [.035, .035, .1, 8], p: [.6, 2.7, -6.82], c: 0xf9a825, em: 0xf57f17, ei: 0.5 },

      // Sauté Station (flat top + pan)
      { g: "box", s: [1.2, .05, .8], p: [5.5, .96, -5], c: 0x333, em: 0x222, ei: 0.1 },
      { g: "cyl", s: [.2, .2, .04, 16], p: [5.5, 1.02, -5], c: 0x37474f, em: 0x263238, ei: 0.2,
        name: "Sauté Station", interactable: true, promptText: "Use Sauté Pan",
        interactionText: "<strong>Mauviel M'250c Copper Sauté Pan — 11\"</strong><br><br><strong>Current Contents:</strong><br>• Chicken breast (skin-side down) — searing<br>• Brown butter, fresh thyme, crushed garlic<br>• Pan temperature: 425°F (IR thermometer confirmed)<br><br><strong>Technique:</strong><br>• Sear 4 min (skin side) — DO NOT TOUCH<br>• Flip, baste with foaming butter — 3 min<br>• Rest 5 min before slicing<br><br><strong>Accompaniments (plating):</n>• Fondant potatoes (from oven) ✅<br>• Charred broccolini ✅<br>• Jus made from pan drippings — reducing now<br><br><strong>Pan Care:</strong><br>• Season with flaxseed oil after each service<br>• Never use detergent — hot water + salt scrub<br>• Copper exterior: polish with Bar Keepers Friend<br><em style='color:#ff7043'>🔥 The fond (browned bits) is flavor gold — deglaze with wine</em>"
      },
      // Pan handle
      { g: "cyl", s: [.015, .015, .3, 6], p: [5.5, 1.02, -4.6], c: 0x5d4037, em: 0x4e342e, ei: 0.15 },

      // Plating Station (clean white surface)
      { g: "box", s: [1.5, .05, .8], p: [5.5, .96, -2], c: 0xfafafa, em: 0xf5f5f5, ei: 0.15 },
      { g: "box", s: [.15, .85, .1], p: [4.8, .45, -2.35], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [.15, .85, .1], p: [6.2, .45, -2.35], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [.15, .85, .1], p: [4.8, .45, -1.65], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      { g: "box", s: [.15, .85, .1], p: [6.2, .45, -1.65], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.2 },
      // Plate (white circle on station)
      { g: "cyl", s: [.2, .2, .015, 20], p: [5.5, 1.01, -2], c: 0xffffff, em: 0xf5f5f5, ei: 0.1,
        name: "Plating Station", interactable: true, promptText: "Check Plating Station",
        interactionText: "<strong>Plating Station — 12-Cover Tasting Menu</strong><br><br><strong>Plate Progress:</strong><br>1. ✅ Amuse-bouche: Truffle egg shot glass<br>2. ✅ Appetizer: Hamachi crudo, yuzu, radish<br>3. 🔄 Entrée: Duck à l'Orange — currently plating<br>4. ⏳ Fish: Halibut, beurre blanc, caviar<br>5. ⏳ Main: Wagyu striploin, bone marrow, red wine jus<br>6. ⏳ Pre-dessert: Passion fruit sorbet<br>7. ⏳ Dessert: Dark chocolate fondant, crème anglaise<br><br><strong>Plating Guidelines:</strong><br>• Odd numbers (3s, 5s) — visually dynamic<br>• Height creates drama — stack, lean, prop<br>• Sauce goes DOWN first (pool or swoosh)<br>• Wipe plate rim with damp towel before serving<br>• Use offset tweezers for precision placement<br><br><strong>Order fired: 8:42 PM — Table 4 (VIP)<strong><br><em style='color:#ff7043'>🍽 The plate is the canvas. Every dish should be magazine-worthy.</em>"
      },

      // Chef's counter (front of house view)
      { g: "box", s: [6, .9, .3], p: [0, .45, 4.8], c: 0x5d4037, em: 0x4e342e, ei: 0.1 },

      // Ventilation hood (above range)
      { g: "box", s: [2, .15, 1.2], p: [-5.5, 3.5, -5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.15 },

      // Exhaust fan (animated)
      { g: "cyl", s: [.3, .3, .05, 12], p: [-5.5, 3.8, -5], c: 0x757575, em: 0x616161, ei: 0.2, anim: { type: 'spin', speed: 5, amplitude: 0 } },

      // Wall clock
      { g: "cyl", s: [.25, .25, .03, 20], p: [0, 3.2, -6.9], c: 0x9e9e9e, em: 0x757575, ei: 0.2 },
      { g: "cyl", s: [.22, .22, .04, 20], p: [0, 3.2, -6.89], c: 0xffffff, em: 0xf5f5f5, ei: 0.25 },
      { g: "box", s: [.01, .12, .008], p: [0, 3.27, -6.87], c: 0x212121 },
      { g: "box", s: [.008, .17, .008], p: [0.03, 3.25, -6.87], c: 0x212121 },
      { g: "sphere", s: [.012, 8, 8], p: [0, 3.2, -6.86], c: 0xf44336, em: 0xf44336, ei: 0.5 },

      // Trash can (foot pedal)
      { g: "cyl", s: [.18, .2, .45, 14], p: [6, .24, 5], c: 0x757575, em: 0x616161, ei: 0.25 },
      { g: "cyl", s: [.19, .19, .03, 14], p: [6, .48, 5], c: 0x9e9e9e, em: 0xbdbdbd, ei: 0.25 },

      // Kitchen fire extinguisher
      { g: "cyl", s: [.06, .06, .35, 10], p: [7.85, .7, -2], c: 0xf44336, em: 0xd32f2f, ei: 0.2 },
      { g: "box", s: [.04, .06, .03], p: [7.85, .9, -2], c: 0x424242, em: 0x333, ei: 0.15 },

      // Ceiling lights
      { g: "cyl", s: [.35, .35, .04, 16], p: [0, 3.95, 0], c: 0xfafafa, em: 0xffffff, ei: 0.2 },
      { g: "cyl", s: [.3, .3, .03, 16], p: [0, 3.93, 0], c: 0xffffff, em: 0xffffff, ei: 0.75 },
      { g: "cyl", s: [.3, .3, .04, 16], p: [-4, 3.95, -3], c: 0xfafafa, em: 0xffffff, ei: 0.5 },
      { g: "cyl", s: [.3, .3, .04, 16], p: [4, 3.95, -3], c: 0xfafafa, em: 0xffffff, ei: 0.5 }
    ]
  }
]; // END ROLES
