# Melvor Idle Replica Frontend

This is the frontend application for the Melvor Idle Replica, a web-based idle game inspired by Melvor Idle.

## Features

- **Interactive UI**: Tab-based navigation for different game aspects
- **Skills System**: Train multiple skills to gain resources and experience
- **Combat System**: Battle enemies and earn loot
- **Inventory Management**: Store and manage gathered resources
- **Equipment System**: Equip weapons and armor to improve combat stats
- **Shop Interface**: Buy and sell items using in-game currency
- **Mastery System**: Progress through mastery levels to unlock bonuses for each skill

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/melvor-replica.git
cd melvor-replica/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open your browser to http://localhost:3000

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── CombatPanel.tsx
│   │   ├── Equipment.tsx
│   │   ├── Inventory.tsx
│   │   ├── MasteryPanel.tsx
│   │   ├── Shop.tsx
│   │   └── SkillList.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.css          # Main app styles
│   ├── App.tsx          # Main app component
│   ├── constants.ts     # Game constants
│   ├── index.css        # Global styles
│   └── index.tsx        # Application entry point
└── package.json
```

## Game Mechanics

- **Skills**: Train skills like Woodcutting, Fishing, Mining to gather resources
- **Mastery**: Unlock bonuses for each skill as you progress in mastery levels
- **Combat**: Fight enemies to earn experience and loot
- **Crafting**: Convert raw resources into useful items and equipment
- **Economy**: Buy and sell items with in-game currency

## Technology Stack

- React 18
- TypeScript
- Axios for API requests
- CSS for styling

## Available Scripts

- `npm start`: Runs the development server
- `npm build`: Creates a production build
- `npm test`: Runs the test suite
- `npm lint`: Lints the source code
- `npm format`: Formats code using Prettier

## Contributing

Please read the CONTRIBUTING.md file in the project root for contribution guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Melvor Idle by Malcs (https://melvoridle.com/)
- Built as a learning project for React and TypeScript