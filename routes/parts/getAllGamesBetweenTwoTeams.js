const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const getAllGamesOfTeamHandler = (req, res) => {
    const country = req.params.country;
    const league = req.params.league;
    const team1 = req.params.team1.toLowerCase();
    const team2 = req.params.team2.toLowerCase();
    MongoClient.connect(config.connectionUrl, (err, client) => {
        client.db(config.dbName).collection(config.collectionNameStat).find({
            "$and": [
                {"country" : { "$regex": country, "$options": "i"}},
                {"league" : { "$regex": league, "$options": "i"}}
            ]
        }).toArray((err, competitions) => {
            if (err) {
                res.send(err);
                client.close();
            }
            let games = [];
            competitions.map(competition => {
                let filtered = competition.gamesFull.filter(item => {
                    return (item.homeTeam.toLowerCase() === team1 && item.awayTeam.toLowerCase() === team2) || (item.homeTeam.toLowerCase() === team2 && item.awayTeam.toLowerCase() === team1);
                });
                games = games.concat(filtered);
            });

            res.send({success: true, data: games});
            client.close();
        });
    });
};

module.exports = getAllGamesOfTeamHandler;
