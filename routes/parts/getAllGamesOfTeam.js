const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getAllGamesOfTeamHandler = (req, res) => {
    const season = req.params.season;
    const country = req.params.country;
    const league = req.params.league;
    const team = req.params.team.toLowerCase();
    MongoClient.connect(config.connectionUrl, (err, client) => {
        client.db(config.dbName).collection(config.collectionNameStat).findOne({
            "$and": [
                {"season" : { "$regex": season, "$options": "i"}},
                {"country" : { "$regex": country, "$options": "i"}},
                {"league" : { "$regex": league, "$options": "i"}}
            ]
        }, (err, competition) => {
            if (err) {
                res.send(err);
                client.close();
            }
            if (!competition) {
                res.send({success: true, data: []});
                client.close();
                return;
            }
            let filtered = competition.gamesFull.filter(item => {
                return item.homeTeam.toLowerCase() === team || item.awayTeam.toLowerCase() === team;
            });

            let summary = competition.standings.find(item => item.name.toLowerCase() === team) || {};
            summary = {
                ...summary,
                halfTimeGoals: 0,
                halfTimeGoalsAllowed: 0,
                shots: 0,
                shotsAllowed: 0,
                shotsOnTarget: 0,
                shotsOnTargetAllowed: 0,
                corners: 0,
                cornersAllowed: 0,
                fouls: 0,
                foulsAllowed: 0,
                yellowCards: 0,
                yellowCardsAllowed: 0,
                redCards: 0,
                redCardsAllowed: 0
            };

            filtered.map(game => {
                if (team === game.homeTeam.toLowerCase()) {
                  summary.halfTimeGoals        += game.halfTimeHomeTeamGoals;
                  summary.halfTimeGoalsAllowed += game.halfTimeAwayTeamGoals;
                  summary.shots                += game.homeTeamShots;
                  summary.shotsAllowed         += game.awayTeamShots;
                  summary.shotsOnTarget        += game.homeTeamShotsOnTarget;
                  summary.shotsOnTargetAllowed += game.awayTeamShotsOnTarget;
                  summary.corners              += game.homeTeamCorners;
                  summary.cornersAllowed       += game.awayTeamCorners;
                  summary.fouls                += game.homeTeamFouls;
                  summary.foulsAllowed         += game.awayTeamFouls;
                  summary.yellowCards          += game.homeTeamYellowCards;
                  summary.yellowCardsAllowed   += game.awayTeamYellowCards;
                  summary.redCards             += game.homeTeamRedCards;
                  summary.redCardsAllowed      += game.awayTeamRedCards;
                } else if (game === game.awayTeam.toLowerCase()) {
                  summary.halfTimeGoals        += game.halfTimeAwayTeamGoals;
                  summary.halfTimeGoalsAllowed += game.halfTimeHomeTeamGoals;
                  summary.shots                += game.awayTeamShots;
                  summary.shotsAllowed         += game.homeTeamShots;
                  summary.shotsOnTarget        += game.awayTeamShotsOnTarget;
                  summary.shotsOnTargetAllowed += game.homeTeamShotsOnTarget;
                  summary.corners              += game.awayTeamCorners;
                  summary.cornersAllowed       += game.homeTeamCorners;
                  summary.fouls                += game.awayTeamFouls;
                  summary.foulsAllowed         += game.homeTeamFouls;
                  summary.yellowCards          += game.awayTeamYellowCards;
                  summary.yellowCardsAllowed   += game.homeTeamYellowCards;
                  summary.redCards             += game.awayTeamRedCards;
                  summary.redCardsAllowed      += game.homeTeamRedCards;
                }
            });

            res.send({success: true, data: {games: filtered, summary: summary}});
            client.close();
        });
    });
};

module.exports = getAllGamesOfTeamHandler;
