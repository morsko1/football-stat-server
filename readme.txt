end points:

=====================================================================
get all available championships
/championships
=====================================================================


=====================================================================
get available seasons list
/seasons
=====================================================================


=====================================================================
get available countries list
/seasons/:season/countries
/seasons/1819/countries
=====================================================================


=====================================================================
get available leagues list
/seasons/:season/countries/:country/leagues
/seasons/1819/country/england/leagues
=====================================================================


=====================================================================
get league teams
/seasons/:season/country/:country/leagues/:league/teams
/seasons/1819/country/england/leagues/e0/teams
=====================================================================


=====================================================================
get league standings
/seasons/:season/country/:country/leagues/:league/standings
/seasons/1819/country/england/leagues/e0/standings
=====================================================================


=====================================================================
get league games
/seasons/:season/country/:country/leagues/:league/games
/seasons/1819/country/england/leagues/e0/games
=====================================================================


=====================================================================
get league games with extended stat
/seasons/:season/country/:country/leagues/:league/games-full
/seasons/1819/country/england/leagues/e0/games-full
=====================================================================


=====================================================================
get all games of team for a season
/seasons/:season/country/:country/leagues/:league/games/:club
/seasons/1819/country/england/leagues/e0/games/Liverpool
=====================================================================


=====================================================================
get all games between two teams for a season
/seasons/:season/country/:country/leagues/:league/games/:team1/:team2
/seasons/1819/country/england/leagues/e0/games/Liverpool/Arsenal
=====================================================================


=====================================================================
get all available games between two teams
/team1/:team1/team2/:team2/games
/team1/liverpool/team2/arsenal/games
=====================================================================
