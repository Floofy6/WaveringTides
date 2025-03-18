# Wavering Tides

Wavering Tides is an idle RPG inspired by Old School RuneScape, built with React (frontend) and Node.js with Express and MongoDB (backend). Train your skills, battle enemies, collect resources, and upgrade your equipment in this browser-based adventure game.

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

## Technologies Used

### Frontend
- React
- TypeScript
- CSS
- React Context API for state management

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- TypeScript

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm
- MongoDB installed locally or a MongoDB Atlas account

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/WaveringTides.git
cd WaveringTides
```

2. Install backend dependencies
```powershell
cd backend
npm install
```

3. Configure the backend
   - Create a `.env` file in the backend directory based on the provided `env.example`
   - Update MongoDB connection string and other configuration as needed

4. Install frontend dependencies
```powershell
cd ../frontend
npm install
```

## Running the Application

### Starting the Backend Server

1. Navigate to the backend directory
```powershell
cd backend
```

2. Build the TypeScript files
```powershell
npm run build
```

3. Start the server
```powershell
npm run start
```

The backend server will start at http://localhost:3001

### Starting the Frontend Development Server

1. Navigate to the frontend directory
```powershell
cd frontend
```

2. Start the development server
```powershell
npm start
```

The frontend will start at http://localhost:3000 and should automatically open in your default browser.

> **Note for PowerShell Users**: PowerShell doesn't support the `&&` operator for command chaining like Bash. Run commands sequentially as shown above.

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
├── backend/                   # Backend server
│   ├── src/                   # Source code
│   │   ├── domain/            # Domain models and business logic
│   │   ├── application/       # Application services
│   │   ├── infrastructure/    # Infrastructure layer (DB, external services)
│   │   │   ├── persistence/   # Database related code
│   │   │   │   └── mongo/     # MongoDB schemas and repositories
│   │   └── presentation/      # API controllers and routes
│   └── dist/                  # Compiled JavaScript code
└── ai prompts/                # AI prompt templates for development
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check that your IP is whitelisted if using Atlas

### Model Compilation Errors
- If you encounter "Cannot overwrite model once compiled" errors, ensure models are only defined once across the application

### Port Conflicts
- If ports 3000 or 3001 are already in use, you can modify the port in:
  - Frontend: `package.json` in the start script
  - Backend: `.env` file or directly in the server config

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by Old School RuneScape and other idle RPGs
- Created as a learning project for React, Node.js, and game development

---

Enjoy your adventure in Wavering Tides!