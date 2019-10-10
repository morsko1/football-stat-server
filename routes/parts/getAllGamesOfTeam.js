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

            res.send({success: true, data: filtered});
            client.close();
        });
    });
};

module.exports = getAllGamesOfTeamHandler;
