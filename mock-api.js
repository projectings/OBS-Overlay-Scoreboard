// Mock API implementation for testing without real API
const MOCK_API_DATA = {
    matches: [
        {
            id: 1,
            status: 'IN_PLAY',
            minute: 36,
            homeTeam: { name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS' },
            awayTeam: { name: 'Tottenham Hotspur', shortName: 'Spurs', tla: 'TOT' },
            score: { fullTime: { home: 2, away: 1 } }
        },
        {
            id: 2,
            status: 'SCHEDULED',
            homeTeam: { name: 'Liverpool', shortName: 'Liverpool', tla: 'LIV' },
            awayTeam: { name: 'Everton', shortName: 'Everton', tla: 'EVE' },
            score: { fullTime: { home: 0, away: 0 } }
        },
        {
            id: 3,
            status: 'IN_PLAY',
            minute: 72,
            homeTeam: { name: 'Manchester City', shortName: 'Man City', tla: 'MCI' },
            awayTeam: { name: 'Manchester United', shortName: 'Man Utd', tla: 'MUN' },
            score: { fullTime: { home: 3, away: 0 } }
        },
        {
            id: 4,
            status: 'SCHEDULED',
            homeTeam: { name: 'Chelsea', shortName: 'Chelsea', tla: 'CHE' },
            awayTeam: { name: 'Newcastle United', shortName: 'Newcastle', tla: 'NEW' },
            score: { fullTime: { home: 0, away: 0 } }
        },
        {
            id: 5,
            status: 'IN_PLAY',
            minute: 15,
            homeTeam: { name: 'West Ham United', shortName: 'West Ham', tla: 'WHU' },
            awayTeam: { name: 'Brighton & Hove Albion', shortName: 'Brighton', tla: 'BHA' },
            score: { fullTime: { home: 0, away: 1 } }
        }
    ]
};

// API status element
const apiStatus = document.getElementById('api-status');
const matchesContainer = document.getElementById('matches-container');

// Fetch current matchday fixtures
async function fetchLiveMatches() {
    try {
        updateApiStatus('Fetching mock matches...', 'info');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Randomize the live match minute to simulate time passing
        MOCK_API_DATA.matches.forEach(match => {
            if (match.status === 'IN_PLAY') {
                // Random increment between 1-5 minutes
                match.minute = Math.min(90, (match.minute || 0) + Math.floor(Math.random() * 5) + 1);
                
                // Occasionally add a goal to make it more realistic
                if (Math.random() > 0.7) {
                    const homeScores = Math.random() > 0.5;
                    if (homeScores) {
                        match.score.fullTime.home += 1;
                    } else {
                        match.score.fullTime.away += 1;
                    }
                }
            }
        });
        
        updateApiStatus(`Found ${MOCK_API_DATA.matches.length} matches`, 'success');
        
        // Clear and populate matches container
        matchesContainer.innerHTML = '';
        
        MOCK_API_DATA.matches.forEach(match => {
            const button = document.createElement('button');
            button.className = 'match-button';
            if (match.status === 'IN_PLAY' || match.status === 'LIVE') {
                button.classList.add('live');
            }
            
            const homeTeam = match.homeTeam.shortName || match.homeTeam.name;
            const awayTeam = match.awayTeam.shortName || match.awayTeam.name;
            const status = match.status === 'IN_PLAY' ? '🔴 LIVE' : match.status;
            
            button.textContent = `${homeTeam} vs ${awayTeam} (${status})`;
            button.dataset.match = JSON.stringify(match);
            
            button.addEventListener('click', () => applyMatchData(match));
            
            matchesContainer.appendChild(button);
        });
        
        return MOCK_API_DATA.matches;
    } catch (error) {
        updateApiStatus(`Error: ${error.message}`, 'error');
        return [];
    }
}

// Apply match data to overlay
function applyMatchData(match) {
    try {
        // Get team abbreviations
        const homeTeamAbbr = match.homeTeam.tla || match.homeTeam.shortName || match.homeTeam.name.substring(0, 3).toUpperCase();
        const awayTeamAbbr = match.awayTeam.tla || match.awayTeam.shortName || match.awayTeam.name.substring(0, 3).toUpperCase();
        
        // Set team names
        const homeTeamData = findTeamByAbbr(homeTeamAbbr);
        const awayTeamData = findTeamByAbbr(awayTeamAbbr);
        
        setHomeTeam(homeTeamData.abbr, homeTeamData.color);
        setAwayTeam(awayTeamData.abbr, awayTeamData.color);
        
        // Set score if available
        if (match.score && match.score.fullTime) {
            setScore(
                match.score.fullTime.home || 0,
                match.score.fullTime.away || 0
            );
        }
        
        // Set match time if available
        if (match.minute) {
            setMatchTime(match.minute);
        }
        
        updateApiStatus(`Applied match data: ${homeTeamData.abbr} vs ${awayTeamData.abbr}`, 'success');
    } catch (error) {
        updateApiStatus(`Error applying match data: ${error.message}`, 'error');
    }
}

// Update API status message
function updateApiStatus(message, type = 'info') {
    apiStatus.textContent = message;
    
    // Clear previous classes
    apiStatus.className = 'status-message';
    
    if (type === 'error') {
        apiStatus.classList.add('error');
    } else if (type === 'success') {
        apiStatus.classList.add('success');
    } else {
        apiStatus.classList.add('info');
    }
}

// Set up event listeners
document.getElementById('api-fetch').addEventListener('click', fetchLiveMatches);

// Add keyboard shortcut for API fetch
document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'INPUT' && e.key.toLowerCase() === 'f') {
        fetchLiveMatches();
    }
});

// Helper to set match time
function setMatchTime(minutes) {
    if (!isNaN(minutes)) {
        const mins = Math.floor(minutes);
        const secs = Math.round((minutes - mins) * 60);
        
        // Update timer seconds variable
        seconds = (mins * 60) + secs;
        
        // Update display
        updateTimer();
        
        // Start timer if match is live
        if (document.querySelector('.edit-mode') && minutes > 0) {
            document.getElementById('start-timer').click();
        }
    }
}

// Helper to set score
function setScore(home, away) {
    homeScore = home;
    awayScore = away;
    
    homeScoreElement.textContent = homeScore;
    awayScoreElement.textContent = awayScore;
    
    saveCurrentState();
}