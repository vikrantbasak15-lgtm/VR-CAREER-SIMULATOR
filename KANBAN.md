# 🥽 VR Career Simulator - Kanban Board

## 📌 Project Overview
A browser-based first-person "VR-like" simulator built with Three.js. Users explore professional environments (Doctor, Engineer, Chemist, Architect, Pilot) and interact with specialized equipment to learn about different careers.

---

## 🟥 BACKLOG (To Do)
- [ ] **STL Model Integration**: Replace primitive geometries (boxes/cylinders) with actual `.stl` 3D models.
- [ ] **Advanced Audio**: Add spatial 3D audio (ambient room sounds, directional beeps).
- [ ] **Expanded Roles**: Add new professions (e.g., Astronaut, Software Engineer, Chef).
- [ ] **Interactive Mini-games**: Simple puzzles for each role (e.g., "Fix the Circuit" for Engineer).
- [ ] **Save System**: Save progress/completed tasks using LocalStorage.
- [ ] **Dynamic Lighting**: Add flickering lights or day/night cycles via window shaders.
- [ ] **Improved Collision**: Implement a more robust physics/collision system for furniture.

## 🟨 IN PROGRESS (Doing)
- [ ] **Performance Tuning**: Optimize render loop for low-end GPUs.
- [ ] **UI Polish**: Refine the HUD and info panel transitions.

## 🟩 DONE
- [x] **Core Engine**: First-person WASD + Pointer Lock movement.
- [x] **Modular Architecture**: Split into `main.js`, `controls.js`, `interactions.js`, etc.
- [x] **Visuals**: ACES Tone Mapping, PCFSoft Shadows, and custom Bloom Post-processing.
- [x] **Environment**: 5 detailed rooms (Doctor, Engineer, Chemist, Architect, Pilot).
- [x] **Interactions**: Raycasting system with "E" key interaction and info panels.
- [x] **Dynamic Elements**: 
    - Animated canvas textures (ECG, Radar, Oscilloscope).
    - Particle systems (Dust, Steam, Sparks).
    - Object animations (Spin, Bob, Pulse, Drip).
- [x] **Quality System**: Auto-detection of GPU tiers (Low/Med/High).
- [x] **UI/UX**: Animated role selection cards with parallax tilt.
