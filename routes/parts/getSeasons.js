const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getSeasonsHandler = (req, res) => {
    MongoClient.connect(config.connectionUrl, (err, client) => {
        client.db(config.dbName).collection(config.collectionNameStat).find({}).toArray((err, competitions) => {
            if (err) {
                res.send(err);
                client.close();
            }
            const seasons = [];
            competitions.map(competition => {
                if (seasons.indexOf(competition.season) === -1) {
                    seasons.push(competition.season);
                }
            });

            res.send({success: true, data: seasons});
            client.close();
        });
    });
};

module.exports = getSeasonsHandler;
