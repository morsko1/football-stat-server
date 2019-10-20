const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getDataHandler = (req, res) => {
    const season = req.params.season;
    const country = req.params.country;
    const league = req.params.league;
    const gameId = req.params.gameId;
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
                res.send({success: false, data: null});
                client.close();
                return;
            }

            res.send({success: true, data: competition.gamesFull[gameId]});
            client.close();
        });
    });
};

module.exports = getDataHandler;
