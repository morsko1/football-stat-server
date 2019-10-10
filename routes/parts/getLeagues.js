const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getLeaguesHandler = (req, res) => {
    const season = req.params.season;
    const country = req.params.country;
    MongoClient.connect(config.connectionUrl, (err, client) => {
        client.db(config.dbName).collection(config.collectionNameStat).find({
            "$and": [
                {"season" : { "$regex": season, "$options": "i"}},
                {"country" : { "$regex": country, "$options": "i"}}
            ]
        }).toArray((err, competitions) => {
            if (err) {
                res.send(err);
                client.close();
            }
            if (!competitions) {
                res.send({success: true, data: []});
                client.close();
                return;
            }

            const leagues = [];
            competitions.map(competition => {
                leagues.push({
                    country: competition.country,
                    league: competition.league,
                    leagueName: competition.leagueName,
                });
            });

            res.send({success: true, data: leagues});
            client.close();
        });
    });
};

module.exports = getLeaguesHandler;
