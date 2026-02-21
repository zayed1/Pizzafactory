# Office Fever - 3D Browser Game

## Overview
A 3D browser-based idle/management game inspired by Office Fever. Built with React Three Fiber and Three.js. The player controls a boss character who collects papers from a printer, delivers them to employees, and collects earnings to upgrade their office.

## Recent Changes
- 2026-02-21: Initial game implementation with core mechanics

## Project Architecture
- **Frontend**: React + TypeScript + Vite
- **3D Engine**: React Three Fiber (@react-three/fiber) + Three.js + Drei
- **State Management**: Zustand (useOfficeGame store)
- **Styling**: Tailwind CSS + inline styles for game UI
- **Server**: Express.js (serves static files)

### Key Files
- `client/src/App.tsx` - Main app with Canvas and game phases
- `client/src/game/` - All game components
  - `OfficeScene.tsx` - Main 3D scene composition
  - `Player.tsx` - Player character with WASD controls
  - `Printer.tsx` - Paper printer station
  - `Desk.tsx` - Employee desks with work progress
  - `OfficeFoor.tsx` - Office floor and walls
  - `OfficeFurniture.tsx` - Decorative furniture
  - `GameHUD.tsx` - UI overlay (money, papers, upgrades)
  - `StartMenu.tsx` - Start screen
- `client/src/lib/stores/useOfficeGame.tsx` - Game state store

### Game Mechanics
- Collect papers from printer (auto-collect on proximity)
- Deliver papers to employee desks (auto-deliver on proximity)
- Employees work on papers and produce cash
- Collect cash from desks (auto-collect on proximity)
- Upgrade: speed, capacity, printer speed, unlock new desks

## User Preferences
- Arabic-speaking user
- Interested in mobile game style (Office Fever)
- Prefers MVP-first approach
