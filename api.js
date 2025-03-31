// API configuration
const API_CONFIG = {
    apiKey: 'd164afa7cba94e5e87906ec03643623b', // Add your API key here
    baseUrl: 'https://api.football-data.org/v4',
    competitionId: 2021 // Premier League competition ID
};

// API status element
const apiStatus = document.getElementById('api-status');
const matchesContainer = document.getElementById('matches-container');

// Fetch current matchday fixtures
async function fetchLiveMatches() {
    if (!API_CONFIG.apiKey) {
        updateApiStatus('No API key provided. Please set your API key in the api.js file.', 'error');
        return [];
    }
    
    try {
        updateApiStatus('Fetching matches...', 'info');
        
        const response = await fetch(`${API_CONFIG.baseUrl}/competitions/${API_CONFIG.competitionId}/matches?status=LIVE,SCHEDULED,IN_PLAY`, {
            headers: {
                'X-Auth-Token': API_CONFIG.apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        updateApiStatus(`Found ${data.matches.length} matches`, 'success');
        
        // Clear and populate matches container
        matchesContainer.innerHTML = '';
        
        data.matches.forEach(match => {
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
        
        return data.matches;
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