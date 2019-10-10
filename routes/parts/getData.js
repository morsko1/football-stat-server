const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getDataHandler = (req, res) => {
    const season = req.params.season;
    const country = req.params.country;
    const league = req.params.league;
    let type = req.params.type;
    type = type.toLowerCase() === 'gamesfull' ? 'gamesFull' : type.toLowerCase();
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

            res.send({success: true, data: competition[type]});
            client.close();
        });
    });
};

module.exports = getDataHandler;
