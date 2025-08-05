# WH StockOut Apps 2.0

Modern warehouse management application built with React Native and TypeScript, focusing on the WOInstruction feature for efficient stockout operations.

## Features

- **Modern UI/UX**: Clean and professional design with light/dark mode support
- **TypeScript**: Full TypeScript implementation for better code quality and maintainability
- **Tailwind CSS**: Styled with NativeWind (Tailwind CSS for React Native)
- **WOInstruction Focus**: Streamlined interface focusing only on the core stockout functionality
- **QR Code Scanning**: Kanban QR code scanning for inventory management
- **Data Persistence**: Local storage with AsyncStorage
- **API Integration**: Compatible with existing backend infrastructure
- **Theme Support**: Light and dark mode with Manus.im inspired color palette

## Technology Stack

- **React Native**: 0.80.2
- **TypeScript**: Latest
- **NativeWind**: Tailwind CSS for React Native
- **AsyncStorage**: Local data persistence
- **Axios**: HTTP client for API calls
- **React Navigation**: Navigation management
- **Moment.js**: Date/time handling

## Color Palette

The app uses a modern color palette inspired by Manus.im:

### Light Mode
- Primary: Blue tones (#0ea5e9, #0284c7, #0369a1)
- Background: Light grays (#f0f9ff, #e0f2fe)
- Text: Dark blues (#0c4a6e, #075985)

### Dark Mode
- Primary: Dark grays (#1e293b, #334155, #475569)
- Background: Very dark (#0f172a, #1e293b)
- Text: Light grays (#f1f5f9, #e2e8f0)

### Accent Colors
- Green: #10b981 (Success)
- Red: #ef4444 (Error/Reset)
- Yellow: #f59e0b (Warning)
- Purple: #8b5cf6 (Info)
- Orange: #f97316 (Alert)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MuhamadSyabitHidayattulloh/WH-StockOut-Apps---2.0.git
cd WH-StockOut-Apps---2.0
```

2. Install dependencies:
```bash
npm install
```

3. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

4. Run the application:

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ThemeToggle.tsx
├── context/            # React Context providers
│   └── ThemeContext.tsx
├── screens/            # Screen components
│   ├── LoginScreen.tsx
│   └── WOInstructionScreen.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions and API
    ├── api.ts
    └── GenerateOneWayKanban.ts
```

## Key Features

### 1. Login System
- Secure user authentication
- Persistent login state
- Modern login interface

### 2. WOInstruction Screen
- QR code scanning for Kanban
- Real-time data table
- Duplicate detection
- Data submission to backend
- Reset functionality with password protection

### 3. Theme System
- Light/Dark mode toggle
- Persistent theme preference
- Manus.im inspired color scheme

### 4. Data Management
- Local storage with AsyncStorage
- Real-time data updates
- Backend synchronization

## API Integration

The app is compatible with the existing backend infrastructure:

- **Base URL**: `http://10.122.73.131:8700/wh-stockout`
- **Login Endpoint**: `/api/loginApps/Stockout/confirmLogin`
- **StockOut Endpoint**: `/api/warehouse/stockoutAndroid`

## Development

### Prerequisites
- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Scripts
- `npm start`: Start Metro bundler
- `npm run android`: Run on Android
- `npm run ios`: Run on iOS
- `npm run lint`: Run ESLint
- `npm test`: Run tests

### TypeScript
The project is fully typed with TypeScript. Run type checking with:
```bash
npx tsc --noEmit
```

## Changes from Original App

1. **Removed Features**: Stockout, WInstruction, and Shopping List subpages
2. **Focused UI**: Streamlined interface for WOInstruction only
3. **Modern Design**: Updated with Tailwind CSS and modern UI patterns
4. **TypeScript**: Complete migration from JavaScript to TypeScript
5. **Theme Support**: Added light/dark mode functionality
6. **Improved UX**: Better error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is proprietary software for warehouse management operations.

## Author

**Muhamad Syabit Hidayattulloh**
- GitHub: [@MuhamadSyabitHidayattulloh](https://github.com/MuhamadSyabitHidayattulloh)

---

Built with ❤️ using React Native and TypeScript
