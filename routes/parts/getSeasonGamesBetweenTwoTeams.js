const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getAllGamesOfTeamHandler = (req, res) => {
    const season = req.params.season;
    const country = req.params.country;
    const league = req.params.league;
    const team1 = req.params.team1.toLowerCase();
    const team2 = req.params.team2.toLowerCase();
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
                return (item.homeTeam.toLowerCase() === team1 && item.awayTeam.toLowerCase() === team2) || (item.homeTeam.toLowerCase() === team2 && item.awayTeam.toLowerCase() === team1);
            });

            res.send({success: true, data: filtered});
            client.close();
        });
    });
};

module.exports = getAllGamesOfTeamHandler;
