const router = require('express').Router();
const config = require('../config');

const getSeasonsHandler = require('./parts/getSeasons.js');
const getCountriesHandler = require('./parts/getCountries.js');
const getLeaguesHandler = require('./parts/getLeagues.js');
const getChampionshipsHandler = require('./parts/getChampionships.js');
const getDataHandler = require('./parts/getData.js');
const getGameHandler = require('./parts/getGame.js');
const getAllGamesOfTeamHandler = require('./parts/getAllGamesOfTeam.js');
const getSeasonGamesBetweenTwoTeamsHandler = require('./parts/getSeasonGamesBetweenTwoTeams.js');
const getAllGamesBetweenTwoTeamsHandler = require('./parts/getAllGamesBetweenTwoTeams.js');
const getAllGamesOfTwoTeamsHandler = require('./parts/getAllGamesOfTwoTeams.js');

router.get('/api/v1/championships', getChampionshipsHandler);
// router.get('/api/v1/seasons', getSeasonsHandler);
// router.get('/api/v1/seasons/:season/countries', getCountriesHandler);
// router.get('/api/v1/seasons/:season/countries/:country/leagues', getLeaguesHandler);
router.get('/api/v1/seasons/:season/countries/:country/leagues/:league/:type', getDataHandler);
router.get('/api/v1/seasons/:season/countries/:country/leagues/:league/games/:gameId', getGameHandler);
router.get('/api/v1/seasons/:season/countries/:country/leagues/:league/teams/:team/games', getAllGamesOfTeamHandler);
router.get('/api/v1/seasons/:season/countries/:country/leagues/:league/team1/:team1/team2/:team2/games', getSeasonGamesBetweenTwoTeamsHandler);
router.get('/api/v1/team1/:team1/team2/:team2/games', getAllGamesOfTwoTeamsHandler);
// router.get('/api/v1/countries/:country/leagues/:league/team1/:team1/team2/:team2/games', getAllGamesBetweenTwoTeamsHandler);

module.exports = router;
