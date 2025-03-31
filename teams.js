// Team data with colors and abbreviations
const teams = [
    { name: 'Arsenal', abbr: 'ARS', color: '#EF0107' },
    { name: 'Aston Villa', abbr: 'AVL', color: '#95BFE5' },
    { name: 'Bournemouth', abbr: 'BOU', color: '#DA291C' },
    { name: 'Brentford', abbr: 'BRE', color: '#E30613' },
    { name: 'Brighton', abbr: 'BHA', color: '#0057B8' },
    { name: 'Chelsea', abbr: 'CHE', color: '#034694' },
    { name: 'Crystal Palace', abbr: 'CRY', color: '#1B458F' },
    { name: 'Everton', abbr: 'EVE', color: '#003399' },
    { name: 'Fulham', abbr: 'FUL', color: '#FFFFFF' },
    { name: 'Ipswich', abbr: 'IPS', color: '#0044AA' },
    { name: 'Leicester', abbr: 'LEI', color: '#003090' },
    { name: 'Liverpool', abbr: 'LIV', color: '#C8102E' },
    { name: 'Man City', abbr: 'MCI', color: '#6CABDD' },
    { name: 'Man United', abbr: 'MUN', color: '#DA291C' },
    { name: 'Newcastle', abbr: 'NEW', color: '#241F20' },
    { name: 'Nott\'m Forest', abbr: 'NFO', color: '#DD0000' },
    { name: 'Southampton', abbr: 'SOU', color: '#D71920' },
    { name: 'Tottenham', abbr: 'TOT', color: '#132257' },
    { name: 'West Ham', abbr: 'WHU', color: '#7A263A' },
    { name: 'Wolves', abbr: 'WOL', color: '#FDB913' }
];

// Function to find team by abbreviation
function findTeamByAbbr(abbr) {
    return teams.find(team => team.abbr === abbr) || 
           { name: abbr, abbr: abbr, color: '#666666' }; // Default fallback
}
