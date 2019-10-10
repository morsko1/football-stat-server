const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getCountriesHandler = (req, res) => {
    const season = req.params.season;
    MongoClient.connect(config.connectionUrl, (err, client) => {
        client.db(config.dbName).collection(config.collectionNameStat).find({season: season}).toArray((err, competitions) => {
            if (err) {
                res.send(err);
                client.close();
            }
            const countries = [];
            competitions.map(competition => {
                if (countries.indexOf(competition.country) === -1) {
                    countries.push(competition.country);
                }
            });

            res.send({success: true, data: countries});
            client.close();
        });
    });
};

module.exports = getCountriesHandler;
