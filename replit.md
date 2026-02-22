# Pizza Factory - 3D Browser Game

## Overview
A 3D browser-based idle/management game inspired by Office Fever but themed as a pizza factory. The player controls a chef who picks up dough, bakes it in the oven, sends it to prep employees for toppings, and delivers finished pizzas to customers before their patience runs out.

## Recent Changes
- 2026-02-22: Switched IAP system from custom StoreKit/WebKit bridge to RevenueCat (@revenuecat/purchases-capacitor). No more manual IAPPlugin.swift needed. Simplified iOS setup guide.
- 2026-02-22: Landscape orientation - forced landscape on iOS (Capacitor + Xcode config), rotate-device screen for portrait browsers, adjusted camera/HUD/touch controls for landscape layout
- 2026-02-22: Mobile/iOS support - touch controls (virtual joystick), Capacitor iOS setup, in-app purchase system with coin packs, coin shop UI, drop item button
- 2026-02-21: Second round improvements - particle effects (oven smoke/fire, money sparkles), pause menu with stats (ESC), customer variety (colors/moods/expressions), player walking animation, prep speed upgrade, earnings rate display
- 2026-02-21: Major game improvements - sound effects, floating money popups, streak/combo system, level progression, multiple ovens (up to 3), guide arrows, improved HUD
- 2026-02-21: Reorganized layout with 3 zones (Kitchen→Prep→Dining), added AABB collision system
- 2026-02-21: Redesigned visuals to restaurant/kitchen theme with proper 3D models
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
  - `OfficeFoor.tsx` - Restaurant floor (kitchen tiles + dining wood) and walls
  - `OfficeFurniture.tsx` - Restaurant decorations (shelves, menu board, dividers, lights)
  - `collisions.ts` - AABB collision system for all stations and furniture
  - `SoundManager.tsx` - Sound effects for game actions
  - `FloatingText.tsx` - Floating money popup text
  - `GuideArrows.tsx` - Animated workflow guide dots on floor
  - `Particles.tsx` - Particle effects (oven smoke/fire, money sparkles)
  - `PauseMenu.tsx` - Pause screen with game statistics
  - `GameHUD.tsx` - UI overlay (money, carrying, upgrades, streak, level, $/min)
  - `StartMenu.tsx` - Start screen
  - `TouchControls.tsx` - Virtual joystick and mobile buttons (auto-detected)
  - `CoinShop.tsx` - In-app purchase coin shop UI
  - `IAPStore.tsx` - IAP state management and purchase logic
  - `IAPBridge.ts` - RevenueCat purchase bridge (@revenuecat/purchases-capacitor)
- `client/src/lib/stores/useOfficeGame.tsx` - Game state store
- `capacitor.config.ts` - Capacitor iOS configuration
- `IOS_SETUP_GUIDE.md` - Complete iOS build and IAP setup instructions

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
- New Oven: Add more ovens (up to 3)
- Prep Speed: Faster preparation time

### Game Systems
- **Streak/Combo**: Serving customers consecutively gives bonus money (+$5 per streak level). Streak resets on missed customer or timeout (8s)
- **Level Progression**: Every X pizzas served increases game level. Higher levels = faster customer spawns, more patience reduction, higher base pay
- **Sound Effects**: Audio feedback for pickup, delivery, earning money, missed customers
- **Guide Arrows**: Animated dots on floor showing optimal workflow path based on current game state
- **Floating Text**: "+$X" popups when earning money from served customers
- **Particles**: Smoke/steam and fire particles from cooking ovens, money sparkle effects
- **Pause Menu**: ESC key pauses game, shows statistics dashboard (earnings rate, success rate, best streak, factory status)
- **Customer Variety**: Random customer colors and hair colors, mood expressions change based on patience (happy→neutral→worried→angry)
- **Walking Animation**: Player character bobs and sways while moving, smooth rotation interpolation
- **Touch Controls**: Virtual joystick (bottom-left), drop button (bottom-right), pause button (top-center) - auto-detected on touch devices
- **Drop Item**: Press Q (keyboard) or X button (touch) to drop carried items
- **Coin Shop**: Tap money display to open shop with 4 coin packs ($0.99-$19.99)
- **In-App Purchases**: Product IDs configured for Apple App Store (com.pizzafactory.coins100/500/2000/5000)
- **iOS Support**: Capacitor configured for iOS wrapping, WebKit bridge for native IAP

### iOS Product IDs
| Product ID | Coins | Price |
|---|---|---|
| com.pizzafactory.coins100 | $100 | $0.99 |
| com.pizzafactory.coins500 | $500 | $3.99 |
| com.pizzafactory.coins2000 | $2,000 | $9.99 |
| com.pizzafactory.coins5000 | $5,000 | $19.99 |

## User Preferences
- Arabic-speaking user
- Interested in mobile game style (Office Fever → Pizza Factory)
- Prefers MVP-first approach
- Detailed game design with progression system
