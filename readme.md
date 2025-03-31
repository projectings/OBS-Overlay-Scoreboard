# Premier League Match Overlay

A customizable overlay for displaying live Premier League match scores, with real-time data fetching capabilities from the Football-Data.org API.

## Features

- **Live Match Display**: Shows team names, colors, scores, and match timer
- **Real-time Data**: Fetch live match data from the Football-Data.org API
- **Customizable Teams**: Select from all Premier League teams
- **Score and Timer Controls**: Easily update scores and control match timer
- **Keyboard Shortcuts**: Quick access to common functions
- **Persistent State**: Settings and match state are saved between sessions
- **Edit Mode**: Toggle controls visibility for streaming
- **Draggable Controls**: Position the edit button anywhere on screen

## Installation

1. Clone this repository or download the ZIP file
2. Extract files to your desired location
3. Open `index.html` in your browser

## API Setup

This overlay uses the [Football-Data.org](https://www.football-data.org/) API to fetch live match data. 

1. Register for a free API key at [Football-Data.org](https://www.football-data.org/client/register)
2. Replace the API key in `api.js` or `config.js`:
   ```javascript
   const API_CONFIG = {
       apiKey: 'YOUR_API_KEY_HERE', // Replace with your API key
       baseUrl: 'https://api.football-data.org/v4',
       competitionId: 2021 // Premier League competition ID
   };
   ```

Note: For testing without an API key, you can use the included `mock-api.js` file.

## Usage

### Basic Controls

- **Edit Button**: Click to show/hide control panel
- **Team Selection**: Click team abbreviations to change teams
- **Score Controls**: 
  - Home/Away Goal +/- buttons
  - Reset Score button
- **Timer Controls**:
  - Start/Stop/Reset Timer buttons
  - Set custom time (MM:SS format)
- **API Controls**:
  - Fetch live matches from Football-Data.org
  - Click on match to apply data

### Keyboard Shortcuts

| Key | Function |
|-----|----------|
| H | Home Goal + |
| J | Home Goal - |
| K | Away Goal + |
| L | Away Goal - |
| R | Reset Score |
| S | Start Timer |
| P | Stop Timer |
| T | Reset Timer |
| E | Toggle Controls |
| F | Fetch API Data |

## Files Overview

- `index.html` - Main HTML structure
- `styles.css` - CSS styling for the overlay
- `overlay.js` - Core functionality for the scoreboard
- `teams.js` - Team data (abbreviations, colors)
- `api.js` - Football-Data.org API integration
- `mock-api.js` - Test data for development
- `config.js` - API configuration

## For Streamers

This overlay is designed to work with OBS Studio or similar streaming software:

1. Add a Browser Source to your scene
2. Set the URL to the local path of `index.html`
3. Set width and height to match your stream layout
4. Check "Control audio via OBS" to mute any sounds
5. Use the Toggle Edit button to hide controls during broadcast

## Customization

### Team Colors

You can modify team colors in the `teams.js` file:

```javascript
const teams = [
    { name: 'Arsenal', abbr: 'ARS', color: '#EF0107' },
    // Add or modify teams as needed
];
```

### Styling

Modify `styles.css` to change the appearance of the overlay.

## Troubleshooting

- **API Not Working**: Verify your API key is correct and that you haven't exceeded daily request limits
- **Controls Not Showing**: Press 'E' key to toggle edit mode
- **Timer Issues**: Click Reset Timer before starting a new time

## License

This project is open source and available for personal and commercial use.

## Credits

- Football data provided by [Football-Data.org](https://www.football-data.org/)
- Premier League team data current as of 2024/2025 season

