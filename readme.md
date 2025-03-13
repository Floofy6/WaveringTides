# Wavering Tides

Wavering Tides is an idle RPG inspired by Old School RuneScape, built with React and TypeScript. Train your skills, battle enemies, collect resources, and upgrade your equipment in this browser-based adventure game.

![Wavering Tides Game](https://placeholder-for-game-screenshot.png)

## Features

### Skills System
- Train various skills including Woodcutting, Fishing, and Mining
- Authentic Old School RuneScape XP system with level cap at 99 (requiring ~13M XP)
- Progress bars reset on level up, matching the OSRS experience
- Skills continue to train while you're away

### Mastery System
- Each skill has its own mastery level that provides additional bonuses
- Unlock special perks at different mastery levels
- Separate XP tracking for main skill levels and mastery levels

### Combat
- Battle against various enemies with different stats
- Strategic combat system with attack, defense, and health mechanics
- Earn loot from defeated enemies to expand your inventory

### Inventory & Equipment
- Collect and manage resources in your inventory
- Equip weapons and armor to improve your combat effectiveness
- Sell unwanted items for gold

### Shop System
- Purchase items and equipment to help with skill training and combat
- Spend gold earned from selling resources and fighting enemies

### Interface
- Modern, responsive UI for comfortable gameplay on any device
- Dark/Light mode toggle for comfortable viewing in any environment
- Real-time progress tracking for all activities

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/WaveringTides.git
cd WaveringTides
```

2. Install dependencies
```
cd frontend
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Game Mechanics

### Skills
Start training a skill by clicking the "Start" button on any skill card. Your character will automatically perform the action, gaining XP over time. As you level up, you'll unlock new items, faster training speeds, and special abilities.

### Combat
Select an enemy to fight from the Combat panel. Your character will automatically attack the enemy based on your equipment and stats. Successful battles will reward you with loot and gold.

### Inventory Management
Items obtained from skills and combat will appear in your inventory. You can sell these items for gold or use them for crafting and equipment upgrades.

### Gold Economy
Earn gold by selling items and defeating enemies. Spend gold at the shop to purchase helpful items and equipment.

## Project Structure

```
WaveringTides/
├── frontend/                  # React frontend application
│   ├── public/                # Static files
│   └── src/                   # Source code
│       ├── components/        # Reusable UI components
│       ├── context/           # React context providers
│       ├── features/          # Feature-specific components
│       │   ├── combat/        # Combat system components
│       │   ├── equipment/     # Equipment system components
│       │   ├── inventory/     # Inventory management components
│       │   ├── shop/          # Shop system components
│       │   └── skills/        # Skills system components
│       ├── hooks/             # Custom React hooks
│       ├── layouts/           # Page layout components
│       ├── services/          # API services
│       ├── types/             # TypeScript type definitions
│       └── utils/             # Utility functions and helpers
└── backend/                   # Backend server (optional)
    └── src/                   # Backend source code
```

## Technical Details

- **Frontend**: React, TypeScript, CSS
- **State Management**: React Context API and Hooks
- **Game Loop**: Custom game tick system for time-based progression
- **Data Persistence**: LocalStorage for saving progress
- **Styling**: CSS variables for theming (dark/light mode)

## Future Plans

- More skills to train (Crafting, Smithing, etc.)
- Quest system with rewards
- Achievements and milestones
- Multiplayer features and player economy
- Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by Old School RuneScape and other idle RPGs
- Created as a learning project for React and game development

---

Enjoy your adventure in Wavering Tides!