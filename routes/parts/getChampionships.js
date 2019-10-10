const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getChampionshipsHandler = (req, res) => {
    MongoClient.connect(config.connectionUrl, (err, client) => {
        client.db(config.dbName).collection(config.collectionNameStat).find({}).toArray((err, competitions) => {
            if (err) {
                res.send(err);
                client.close();
            }
            if (!competitions) {
                res.send({success: true, data: []});
                client.close();
                return;
            }

            const list = [];
            competitions.map(competition => {
                list.push({
                    season: competition.season,
                    country: competition.country,
                    league: competition.league,
                    leagueName: competition.leagueName,
                });
            });

            res.send({success: true, data: list});
            client.close();
        });
    });
};

module.exports = getChampionshipsHandler;
