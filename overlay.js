// DOM Elements
const homeTeamElement = document.getElementById('home-team');
const awayTeamElement = document.getElementById('away-team');
const homeColorBar = document.getElementById('home-color-bar');
const awayColorBar = document.getElementById('away-color-bar');
const homeScoreElement = document.getElementById('home-score');
const awayScoreElement = document.getElementById('away-score');
const timerElement = document.getElementById('match-timer');
const editToggleBtn = document.getElementById('edit-toggle');
const homeTeamButtons = document.getElementById('home-team-buttons');
const awayTeamButtons = document.getElementById('away-team-buttons');

// State variables
let homeScore = 0;
let awayScore = 0;
let seconds = 0;
let timerInterval;
let editMode = false;

// Populate team buttons
function populateTeamButtons() {
    homeTeamButtons.innerHTML = '';
    awayTeamButtons.innerHTML = '';
    
    teams.forEach(team => {
        // Create home team button
        const homeButton = document.createElement('div');
        homeButton.className = 'team-button';
        homeButton.textContent = team.abbr;
        homeButton.setAttribute('data-abbr', team.abbr);
        homeButton.setAttribute('data-color', team.color);
        homeButton.addEventListener('click', () => {
            setHomeTeam(team.abbr, team.color);
        });
        homeTeamButtons.appendChild(homeButton);
        
        // Create away team button
        const awayButton = document.createElement('div');
        awayButton.className = 'team-button';
        awayButton.textContent = team.abbr;
        awayButton.setAttribute('data-abbr', team.abbr);
        awayButton.setAttribute('data-color', team.color);
        awayButton.addEventListener('click', () => {
            setAwayTeam(team.abbr, team.color);
        });
        awayTeamButtons.appendChild(awayButton);
    });
}

// Set home team
function setHomeTeam(abbr, color) {
    homeTeamElement.textContent = abbr;
    homeColorBar.style.backgroundColor = color;
    saveCurrentState();
}

// Set away team
function setAwayTeam(abbr, color) {
    awayTeamElement.textContent = abbr;
    awayColorBar.style.backgroundColor = color;
    saveCurrentState();
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    saveCurrentState();
}

// Timer controls
function setupTimerControls() {
    document.getElementById('start-timer').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    });
    
    document.getElementById('stop-timer').addEventListener('click', () => {
        clearInterval(timerInterval);
    });
    
    document.getElementById('reset-timer').addEventListener('click', () => {
        clearInterval(timerInterval);
        seconds = 0;
        updateTimer();
    });
    
    document.getElementById('set-custom-time').addEventListener('click', () => {
        const customTimeInput = document.getElementById('custom-time').value;
        if (!customTimeInput) return;
        
        let minutes = 0;
        let secs = 0;
        
        if (customTimeInput.includes(':')) {
            [minutes, secs] = customTimeInput.split(':').map(Number);
        } else {
            minutes = parseInt(customTimeInput);
            secs = 0;
        }
        
        if (!isNaN(minutes) && !isNaN(secs)) {
            seconds = (minutes * 60) + secs;
            updateTimer();
        }
    });
}

// Score controls
function setupScoreControls() {
    function incrementHomeScore() {
        homeScore++;
        homeScoreElement.textContent = homeScore;
        saveCurrentState();
    }
    
    function decrementHomeScore() {
        if (homeScore > 0) {
            homeScore--;
            homeScoreElement.textContent = homeScore;
            saveCurrentState();
        }
    }
    
    function incrementAwayScore() {
        awayScore++;
        awayScoreElement.textContent = awayScore;
        saveCurrentState();
    }
    
    function decrementAwayScore() {
        if (awayScore > 0) {
            awayScore--;
            awayScoreElement.textContent = awayScore;
            saveCurrentState();
        }
    }
    
    function resetScore() {
        homeScore = 0;
        awayScore = 0;
        homeScoreElement.textContent = homeScore;
        awayScoreElement.textContent = awayScore;
        saveCurrentState();
    }
    
    document.getElementById('home-goal').addEventListener('click', incrementHomeScore);
    document.getElementById('home-goal-minus').addEventListener('click', decrementHomeScore);
    document.getElementById('away-goal').addEventListener('click', incrementAwayScore);
    document.getElementById('away-goal-minus').addEventListener('click', decrementAwayScore);
    document.getElementById('reset-score').addEventListener('click', resetScore);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Only process if not in an input field
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
            switch(e.key.toLowerCase()) {
                case 'h': incrementHomeScore(); break;
                case 'j': decrementHomeScore(); break;
                case 'k': incrementAwayScore(); break;
                case 'l': decrementAwayScore(); break;
                case 'r': resetScore(); break;
                case 's': document.getElementById('start-timer').click(); break;
                case 'p': document.getElementById('stop-timer').click(); break;
                case 't': document.getElementById('reset-timer').click(); break;
                case 'e': toggleEditMode(); break;
            }
        }
    });
}

// Toggle edit mode
function toggleEditMode() {
    editMode = !editMode;
    if (editMode) {
        document.body.classList.add('edit-mode');
        editToggleBtn.textContent = 'Hide Controls';
    } else {
        document.body.classList.remove('edit-mode');
        editToggleBtn.textContent = 'Edit';
    }
    
    // Save to localStorage
    localStorage.setItem('plOverlayEditMode', editMode ? 'true' : 'false');
}

// Make edit button draggable
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get mouse cursor position
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate new position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        
        // Save position
        saveButtonPosition();
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        saveButtonPosition();
    }
    
    function saveButtonPosition() {
        localStorage.setItem('editButtonTop', element.style.top);
        localStorage.setItem('editButtonLeft', element.style.left);
    }
}

// Save current state to localStorage
function saveCurrentState() {
    localStorage.setItem('plOverlayHomeTeam', homeTeamElement.textContent);
    localStorage.setItem('plOverlayAwayTeam', awayTeamElement.textContent);
    localStorage.setItem('plOverlayHomeScore', homeScore.toString());
    localStorage.setItem('plOverlayAwayScore', awayScore.toString());
    localStorage.setItem('plOverlayTimer', timerElement.textContent);
    localStorage.setItem('plOverlayHomeColor', homeColorBar.style.backgroundColor);
    localStorage.setItem('plOverlayAwayColor', awayColorBar.style.backgroundColor);
}

// Load saved state
function loadSavedState() {
    // Edit mode
    if (localStorage.getItem('plOverlayEditMode') === 'true') {
        editMode = true;
        document.body.classList.add('edit-mode');
        editToggleBtn.textContent = 'Hide Controls';
    }
    
    // Button position
    if (localStorage.getItem('editButtonTop') && localStorage.getItem('editButtonLeft')) {
        editToggleBtn.style.top = localStorage.getItem('editButtonTop');
        editToggleBtn.style.left = localStorage.getItem('editButtonLeft');
    } else {
        editToggleBtn.style.top = '10px';
        editToggleBtn.style.left = '10px';
    }
    
    // Team and score data
    if (localStorage.getItem('plOverlayHomeTeam')) {
        homeTeamElement.textContent = localStorage.getItem('plOverlayHomeTeam');
    }
    
    if (localStorage.getItem('plOverlayAwayTeam')) {
        awayTeamElement.textContent = localStorage.getItem('plOverlayAwayTeam');
    }
    
    if (localStorage.getItem('plOverlayHomeScore')) {
        homeScore = parseInt(localStorage.getItem('plOverlayHomeScore'));
        homeScoreElement.textContent = homeScore;
    }
    
    if (localStorage.getItem('plOverlayAwayScore')) {
        awayScore = parseInt(localStorage.getItem('plOverlayAwayScore'));
        awayScoreElement.textContent = awayScore;
    }
    
    if (localStorage.getItem('plOverlayTimer')) {
        timerElement.textContent = localStorage.getItem('plOverlayTimer');
        // Parse timer to set seconds correctly
        const timerParts = localStorage.getItem('plOverlayTimer').split(':');
        seconds = (parseInt(timerParts[0]) * 60) + parseInt(timerParts[1]);
    }
    
    if (localStorage.getItem('plOverlayHomeColor')) {
        homeColorBar.style.backgroundColor = localStorage.getItem('plOverlayHomeColor');
    }
    
    if (localStorage.getItem('plOverlayAwayColor')) {
        awayColorBar.style.backgroundColor = localStorage.getItem('plOverlayAwayColor');
    }
}

// Initialize the application
function initApp() {
    // Set initial teams
    const evertonTeam = findTeamByAbbr('EVE');
    const tottenhamTeam = findTeamByAbbr('TOT');
    
    // Set color bars
    homeColorBar.style.backgroundColor = evertonTeam.color;
    awayColorBar.style.backgroundColor = tottenhamTeam.color;
    
    // Populate team buttons
    populateTeamButtons();
    
    // Setup event handlers
    setupTimerControls();
    setupScoreControls();
    editToggleBtn.addEventListener('click', toggleEditMode);
    
    // Make edit button draggable
    makeDraggable(editToggleBtn);
    
    // Try to load saved state
    loadSavedState();
}

// Start the app when the page loads
window.onload = initApp;
