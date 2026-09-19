<div align="center">

# 🥽 VR Career Simulator

### An interactive 3D career-exploration experience for students

**Explore a profession. Interact with its world. Learn through play.**

[![Three.js](https://img.shields.io/badge/Three.js-3D%20Web%20Experience-black?style=flat-square&logo=threedotjs)](https://threejs.org/)
![JavaScript](https://img.shields.io/badge/JavaScript-Game%20Logic-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Prototype-orange?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web%20Browser-blue?style=flat-square)

</div>

---

## 🎯 About

**VR Career Simulator** is a browser-based, first-person 3D learning experience that helps students explore careers in a more engaging way than a normal information website.

Instead of only reading about professions, users enter career-themed virtual environments, move around freely, inspect equipment, receive useful information, complete tasks, and test their knowledge through quizzes.

> Built by a single developer with the help of AI, using **Three.js, JavaScript, HTML, and CSS**.

---

## 🌍 Career Worlds

The simulator currently includes five interactive career environments:

| Career | Experience |
|---|---|
| 🩺 **Doctor** | Explore medical equipment and healthcare-related concepts |
| ⚙️ **Engineer** | Discover technical tools, systems, and engineering ideas |
| 🧪 **Chemist** | Interact with laboratory-inspired objects and experiments |
| 📐 **Architect** | Learn about design, planning, structures, and construction |
| ✈️ **Pilot** | Explore cockpit-style instruments, aviation, and navigation |

Each environment is designed to make users curious about what professionals use, do, and learn.

---

## 🎮 How It Works

```text
Choose a career
      ↓
Enter its 3D environment
      ↓
Walk around and discover objects
      ↓
Interact with equipment
      ↓
Read career-related information
      ↓
Complete tasks, quizzes, and challenges
```

The experience combines **career guidance**, **3D exploration**, and **game-inspired learning** in one web application.

---

## ✨ Main Features

### First-Person Exploration

- WASD movement and mouse look
- Pointer Lock controls for a game-like experience
- Sprinting and crouching
- Crosshair and interaction prompts
- Compass, minimap, stamina indicator, and HUD elements

### Interactive Learning

- Raycasting-based object interaction
- Career information panels
- Task and challenge systems
- Quiz system with answer feedback and score tracking
- Achievement notifications
- Inventory-style interface
- Professor Mode for guided explanations and tips

### Visual Effects

- Three.js 3D scenes and rendering
- Animated equipment displays, including ECG, radar, and oscilloscope visuals
- Particle effects such as dust, steam, and sparks
- Procedural and canvas-generated textures
- Soft shadows and animated objects
- Custom bloom post-processing
- Screen-space ambient occlusion (SSAO)
- ACES tone mapping
- Adjustable graphics quality settings based on GPU capability

---

## ⌨️ Controls

| Key | Action |
|---|---|
| `W` `A` `S` `D` | Move |
| `Mouse` | Look around |
| `E` | Interact with an object |
| `F` | Pick up an object |
| `Shift` | Sprint |
| `C` | Crouch |
| `Q` | Open quiz mode |
| `P` | Open Professor Mode |
| `V` | Release the mouse / exit Pointer Lock |

> Look at an interactive object and press **E** when the prompt appears.

---

## 🛠️ Tech Stack

| Technology | Use |
|---|---|
| **Three.js** | 3D scenes, camera, lighting, rendering, and animation |
| **JavaScript** | Game logic, controls, interaction, UI systems, and quizzes |
| **HTML** | Main interface and learning panels |
| **CSS** | HUD, menus, animations, layouts, and styling |
| **Browser APIs** | Pointer Lock, graphics detection, and user interactions |

This project is fully web-based and does not require a game engine such as Unity or Unreal Engine.

---

## 📁 Project Structure

```text
VR-CAREER-SIMULATOR/
│
├── index.html               # Main page and user-interface layout
├── style.css                # Menus, HUD, overlays, and visual styling
├── main.js                  # Scene setup, renderer, animation loop
├── controls.js              # First-person movement and camera controls
├── interactions.js          # Object detection and interaction system
├── roles.js                 # Career environments and role content
├── Particles.js             # Dust, steam, sparks, and visual particles
├── CanvasTextures.js        # Canvas-based textures
├── ProceduralTextures.js    # Procedural texture helpers
├── BloomPostFX.js           # Bloom visual effect
├── SSAO.js                  # Ambient occlusion effect
├── KANBAN.md                # Development roadmap
└── PROJECT_REPORT.txt       # Project documentation
```

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone [https://github.com/vikrantbasak15-lgtm/VR-CAREER-SIMULATOR.git](https://github.com/vikrantbasak15-lgtm/VR-CAREER-SIMULATOR.git)
cd VR-CAREER-SIMULATOR
```

### 2. Start a local server

```bash
npx serve .
```

Then open the local address shown in the terminal, usually:

```text
http://localhost:3000
```

You can also use the **Live Server** extension in Visual Studio Code.

> Do not open `index.html` directly from File Explorer. Run a local server because the project uses JavaScript modules.

---

## 🔮 Future Improvements

This project is an expanding prototype and can be improved further with:

- Realistic and optimised 3D models in GLB, GLTF, or STL format
- More career environments and professional tools
- Career-specific mini-games and practical simulations
- More detailed quizzes with difficulty levels and explanations
- Student progress saving with LocalStorage
- Better collision physics and room navigation
- Spatial audio, ambience, equipment sounds, and footsteps
- Improved lighting, materials, shadows, and performance optimisation
- Mobile controls, gamepad support, and accessibility options
- Teacher dashboards, classroom learning reports, and student profiles

### 🥽 Future WebXR Support

**WebXR is not currently part of the project.** However, it can be added in the future to make the simulator accessible through compatible VR headsets.

Possible WebXR additions include:

- VR headset and head-tracking support
- Hand-controller interactions
- Teleport movement and comfort settings
- VR-friendly menus
- Optimisation for VR performance

---

## 💡 Purpose

VR Career Simulator shows how web development, 3D graphics, education, and game design can work together.

The goal is to make students more curious about careers by giving them a space to **explore, interact, learn, and imagine their future**.

---

<div align="center">

### 🚀 Choose a career. Enter the world. Start exploring.

Made by one developer with AI assistance  
Built entirely with **Three.js**

</div>
