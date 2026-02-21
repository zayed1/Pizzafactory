# Pizza Factory - 3D Browser Game

## Overview
A 3D browser-based idle/management game inspired by Office Fever but themed as a pizza factory. The player controls a chef who picks up dough, bakes it in the oven, sends it to prep employees for toppings, and delivers finished pizzas to customers before their patience runs out.

## Recent Changes
- 2026-02-21: Converted game from Office Fever to Pizza Factory with full pipeline mechanics
- 2026-02-21: Initial project setup

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
  - `Player.tsx` - Player character with WASD controls, carries items
  - `DoughMaker.tsx` - Auto-produces dough (player picks up)
  - `Oven.tsx` - Takes dough, cooks into pizza
  - `PrepStation.tsx` - Employees prepare pizza with toppings
  - `CustomerTable.tsx` - Customer tables with patience timers
  - `GameLoop.tsx` - Spawns customers and updates timers
  - `OfficeFoor.tsx` - Factory floor and walls
  - `OfficeFurniture.tsx` - Decorative furniture
  - `GameHUD.tsx` - UI overlay (money, carrying, upgrades)
  - `StartMenu.tsx` - Start screen
- `client/src/lib/stores/useOfficeGame.tsx` - Game state store

### Game Flow
1. Dough Maker produces dough automatically
2. Player picks up dough (must have empty hands)
3. Player places dough in Oven
4. Oven cooks (timer) → pizza comes out
5. Player picks up pizza from Oven
6. Player delivers to Prep Station employee
7. Employee prepares (longest step) → ready pizza
8. Player picks up ready pizza
9. Player delivers to Customer Table before timer expires
10. Customer pays → money earned

### Key Rules
- Player can only carry ONE type of item at a time
- Stations only accept correct item type
- Customers leave if not served in time (missed)
- Later upgrade allows carrying 2+ items

### Upgrades
- Speed: Player movement speed
- Capacity: Can carry more items (unlocks at $200)
- Oven Speed: Faster cooking
- Dough Speed: Faster dough production
- Prep Employee: Add more prep workers (up to 3)
- New Table: Unlock customer tables (up to 6)

## User Preferences
- Arabic-speaking user
- Interested in mobile game style (Office Fever → Pizza Factory)
- Prefers MVP-first approach
- Detailed game design with progression system
