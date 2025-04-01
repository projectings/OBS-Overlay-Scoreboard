// LiveScore Premier League Match Scraper
// This script fetches Premier League matches from LiveScore and updates the scoreboard

// Constants for the LiveScore website
const LIVESCORE_CONFIG = {
    url: 'https://www.livescore.com/en/football/england/premier-league/',
    updateInterval: 30000 // Update every 30 seconds
};

// Elements from the existing scoreboard
const apiStatus = document.getElementById('api-status');
const matchesContainer = document.getElementById('matches-container');

// Function to fetch and parse Premier League matches from LiveScore
async function fetchLiveScoreMatches() {
    try {
        updateApiStatus('Fetching matches from LiveScore...', 'info');
        
        // Fetch the LiveScore page
        const response = await fetch('https://corsproxy.io/?' + encodeURIComponent(LIVESCORE_CONFIG.url), {
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`LiveScore request failed with status ${response.status}`);
        }
        
        const html = await response.text();
        
        // Parse the HTML using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract match data from the page
        // Note: These selectors would need to be updated if LiveScore changes their layout
        const matchElements = doc.querySelectorAll('.ui-match');
        const matches = [];
        
        matchElements.forEach(matchElement => {
            try {
                // Extract team names
                const homeTeamElement = matchElement.querySelector('.ui-match__team--home .ui-match__team-name');
                const awayTeamElement = matchElement.querySelector('.ui-match__team--away .ui-match__team-name');
                
                // Extract scores
                const scoreElement = matchElement.querySelector('.ui-match__score');
                const timeElement = matchElement.querySelector('.ui-match__time');
                
                // Only process if we have all required elements
                if (homeTeamElement && awayTeamElement) {
                    const homeTeam = homeTeamElement.textContent.trim();
                    const awayTeam = awayTeamElement.textContent.trim();
                    
                    // Extract score if available (live or finished matches)
                    let homeScore = 0;
                    let awayScore = 0;
                    let status = 'SCHEDULED';
                    let minute = 0;
                    
                    if (scoreElement) {
                        const scoreText = scoreElement.textContent.trim();
                        const scores = scoreText.split('-').map(s => parseInt(s.trim(), 10));
                        if (scores.length === 2 && !isNaN(scores[0]) && !isNaN(scores[1])) {
                            homeScore = scores[0];
                            awayScore = scores[1];
                        }
                    }
                    
                    // Check if the match is live
                    if (timeElement) {
                        const timeText = timeElement.textContent.trim();
                        if (timeText.includes("'")) {
                            // Extract minute from format like "45'"
                            status = 'IN_PLAY';
                            minute = parseInt(timeText.replace("'", ""), 10);
                        } else if (timeText.toLowerCase() === 'ht') {
                            status = 'IN_PLAY';
                            minute = 45;
                        } else if (timeText.toLowerCase() === 'ft') {
                            status = 'FINISHED';
                        }
                    }
                    
                    // Create match object similar to football-data.org API
                    const match = {
                        homeTeam: {
                            name: homeTeam,
                            shortName: getTeamAbbreviation(homeTeam)
                        },
                        awayTeam: {
                            name: awayTeam,
                            shortName: getTeamAbbreviation(awayTeam)
                        },
                        score: {
                            fullTime: {
                                home: homeScore,
                                away: awayScore
                            }
                        },
                        status: status,
                        minute: minute
                    };
                    
                    matches.push(match);
                }
            } catch (err) {
                console.error('Error parsing match element:', err);
            }
        });
        
        updateApiStatus(`Found ${matches.length} matches on LiveScore`, 'success');
        
        // Clear and populate matches container
        populateMatchesContainer(matches);
        
        return matches;
    } catch (error) {
        updateApiStatus(`Error: ${error.message}`, 'error');
        console.error('LiveScore scraping error:', error);
        return [];
    }
}

// Helper function to get team abbreviation from full name
function getTeamAbbreviation(teamName) {
    // Map of Premier League team names to their common abbreviations
    const teamAbbreviations = {
        'Manchester United': 'MUN',
        'Manchester City': 'MCI',
        'Liverpool': 'LIV',
        'Chelsea': 'CHE',
        'Arsenal': 'ARS',
        'Tottenham': 'TOT',
        'Tottenham Hotspur': 'TOT',
        'Leicester': 'LEI',
        'Leicester City': 'LEI',
        'West Ham': 'WHU',
        'West Ham United': 'WHU',
        'Everton': 'EVE',
        'Aston Villa': 'AVL',
        'Newcastle': 'NEW',
        'Newcastle United': 'NEW',
        'Leeds': 'LEE',
        'Leeds United': 'LEE',
        'Brighton': 'BHA',
        'Brighton & Hove Albion': 'BHA',
        'Wolverhampton': 'WOL',
        'Wolverhampton Wanderers': 'WOL',
        'Crystal Palace': 'CRY',
        'Southampton': 'SOU',
        'Burnley': 'BUR',
        'Watford': 'WAT',
        'Norwich': 'NOR',
        'Norwich City': 'NOR',
        'Brentford': 'BRE',
        'Fulham': 'FUL',
        'Bournemouth': 'BOU',
        'Nottingham Forest': 'NFO',
        'Sheffield United': 'SHU',
        'Luton': 'LUT',
        'Luton Town': 'LUT',
        'Ipswich': 'IPS',
        'Ipswich Town': 'IPS'
    };
    
    // Return the abbreviation if found, otherwise take first 3 letters
    return teamAbbreviations[teamName] || teamName.substring(0, 3).toUpperCase();
}

// Function to populate matches container with buttons
function populateMatchesContainer(matches) {
    matchesContainer.innerHTML = '';
    
    matches.forEach(match => {
        const button = document.createElement('button');
        button.className = 'match-button';
        if (match.status === 'IN_PLAY') {
            button.classList.add('live');
        }
        
        const homeTeam = match.homeTeam.shortName || match.homeTeam.name;
        const awayTeam = match.awayTeam.shortName || match.awayTeam.name;
        const statusText = match.status === 'IN_PLAY' ? `🔴 LIVE (${match.minute}')` : match.status;
        
        button.textContent = `${homeTeam} ${match.score.fullTime.home}-${match.score.fullTime.away} ${awayTeam} (${statusText})`;
        button.dataset.match = JSON.stringify(match);
        
        button.addEventListener('click', () => applyMatchData(match));
        
        matchesContainer.appendChild(button);
    });
}

// Set up automatic refreshing
let refreshInterval;

function startAutoRefresh() {
    stopAutoRefresh(); // Clear any existing interval
    refreshInterval = setInterval(fetchLiveScoreMatches, LIVESCORE_CONFIG.updateInterval);
    updateApiStatus(`Auto-refresh enabled (every ${LIVESCORE_CONFIG.updateInterval/1000}s)`, 'info');
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        updateApiStatus('Auto-refresh stopped', 'info');
    }
}

// Add auto-refresh controls
function addRefreshControls() {
    const controlSection = document.createElement('div');
    controlSection.className = 'control-section';
    controlSection.innerHTML = `
        <h3>LiveScore Auto-Refresh</h3>
        <button id="start-refresh">Start Auto-Refresh</button>
        <button id="stop-refresh">Stop Auto-Refresh</button>
    `;
    
    // Add the controls after the API options section
    const apiSection = document.querySelector('.control-section:has(#api-fetch)');
    if (apiSection) {
        apiSection.after(controlSection);
    } else {
        document.querySelector('.controls').appendChild(controlSection);
    }
    
    // Set up event listeners
    document.getElementById('start-refresh').addEventListener('click', startAutoRefresh);
    document.getElementById('stop-refresh').addEventListener('click', stopAutoRefresh);
}

// Initialize the LiveScore scraper
function initLiveScoreScraper() {
    // Replace the existing API fetch button click handler
    const apiFetchButton = document.getElementById('api-fetch');
    if (apiFetchButton) {
        apiFetchButton.textContent = 'Fetch LiveScore Matches';
        apiFetchButton.removeEventListener('click', fetchLiveMatches);
        apiFetchButton.addEventListener('click', fetchLiveScoreMatches);
    }
    
    // Add auto-refresh controls
    addRefreshControls();
    
    // Add keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName !== 'INPUT' && e.key.toLowerCase() === 'f') {
            fetchLiveScoreMatches();
        }
    });
    
    // Initial fetch
    fetchLiveScoreMatches();
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveScoreScraper);
} else {
    initLiveScoreScraper();
}